import { useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { checkIsPhone } from '../hooks/useIsMobile';
import { PwaInstallContext } from './PwaInstallContextCore';
import type { BeforeInstallPromptEvent } from './PwaInstallContextCore';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('is-standalone-app')) {
    return true;
  }
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const isMinimalUi = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  const isWindowControlsOverlay = window.matchMedia('(display-mode: window-controls-overlay)').matches;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidReferrer = typeof document !== 'undefined' && document.referrer.includes('android-app://');
  const isAppUrlParam = window.location.search.includes('source=pwa') || window.location.search.includes('mode=app');
  let inAppSession = false;
  try {
    inAppSession = sessionStorage.getItem('typlix_in_standalone_app') === 'true';
  } catch {}

  const isRealApp =
    isStandaloneMode ||
    isMinimalUi ||
    isFullscreen ||
    isWindowControlsOverlay ||
    isIosStandalone ||
    isAndroidReferrer ||
    isAppUrlParam;

  if (isRealApp) {
    try {
      sessionStorage.setItem('typlix_in_standalone_app', 'true');
      document.documentElement.classList.add('is-standalone-app');
    } catch {}
    return true;
  }

  if (inAppSession) {
    try {
      document.documentElement.classList.add('is-standalone-app');
    } catch {}
    return true;
  }

  // Running in regular browser
  try {
    localStorage.removeItem('typlix_is_installed_app');
  } catch {}
  return false;
}

function checkIsIosDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
}

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandalone());
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [isPhone, setIsPhone] = useState<boolean>(() => checkIsPhone());
  const [isIos] = useState<boolean>(() => checkIsIosDevice());
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('typlix_install_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  const [hasAppUpdate, setHasAppUpdate] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Track phone status and standalone state on resize/orientation change
  useEffect(() => {
    const handleCheck = () => {
      setIsPhone(checkIsPhone());
      setIsInstalled(checkIsStandalone());
    };
    window.addEventListener('resize', handleCheck);
    window.addEventListener('orientationchange', handleCheck);
    return () => {
      window.removeEventListener('resize', handleCheck);
      window.removeEventListener('orientationchange', handleCheck);
    };
  }, []);

  // Listen for Chrome/Android beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      try {
        localStorage.setItem('typlix_is_installed_app', 'true');
      } catch {}
      setDeferredPrompt(null);
      setShowGuideModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Proactive check: asks Service Worker & fetches /version.json
  const checkForAppUpdate = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.onLine) return;

    // 1. Proactively query ServiceWorker registration
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          await reg.update().catch(() => {});
          if (reg.waiting) {
            setWaitingWorker(reg.waiting);
            if (checkIsStandalone()) {
              setHasAppUpdate(true);
            }
          }
        }
      } catch {}
    }

    // 2. Fetch /version.json with cache-busting timestamp
    try {
      const res = await fetch(`/version.json?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.buildTime === 'number') {
          const currentBuild = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : 0;
          if (data.buildTime > currentBuild) {
            console.log('[Typlix Update Engine] Update available:', data.version, data.buildTime, 'Current:', currentBuild);
            if (checkIsStandalone()) {
              setHasAppUpdate(true);
            }
          }
        }
      }
    } catch {}
  }, []);

  // Lifecycle listeners for update checking (startup, network online, app focus/resume, and 30s interval)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check on startup asynchronously
    const timer = setTimeout(() => {
      void checkForAppUpdate();
    }, 150);

    // Check when user turns on internet / reconnects
    const handleOnline = () => {
      void checkForAppUpdate();
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);

    // Check when app resumes from background
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void checkForAppUpdate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic check every 30 seconds while online
    const interval = setInterval(() => {
      void checkForAppUpdate();
    }, 30000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkForAppUpdate]);

  // Listen to ServiceWorker lifecycle for new workers
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    let cleanup: (() => void) | undefined;

    navigator.serviceWorker.ready
      .then((reg) => {
        if (reg.waiting) {
          setWaitingWorker(reg.waiting);
          if (checkIsStandalone()) {
            setHasAppUpdate(true);
          }
        }

        const handleUpdateFound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              if (checkIsStandalone()) {
                setHasAppUpdate(true);
              }
            }
          });
        };

        reg.addEventListener('updatefound', handleUpdateFound);

        cleanup = () => {
          reg.removeEventListener('updatefound', handleUpdateFound);
        };
      })
      .catch(() => {});

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const updateApp = useCallback(async () => {
    setIsUpdating(true);
    try {
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      } else if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((k) => caches.delete(k)));
      }

      setTimeout(() => {
        window.location.href = window.location.origin + window.location.pathname + '?updated=' + Date.now();
      }, 150);
    } catch {
      window.location.reload();
    }
  }, [waitingWorker]);

  const dismissUpdatePrompt = useCallback(() => {
    setHasAppUpdate(false);
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    try {
      sessionStorage.setItem('typlix_install_banner_dismissed', 'true');
    } catch {}
  }, []);

  const installApp = useCallback(async (): Promise<boolean> => {
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!checkIsPhone() && !isMobileViewport) return false;

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          try {
            localStorage.setItem('typlix_is_installed_app', 'true');
          } catch {}
          setDeferredPrompt(null);
          return true;
        }
        return false;
      } catch (err) {
        console.warn('PWA install prompt error:', err);
        setShowGuideModal(true);
        return false;
      }
    }

    setShowGuideModal(true);
    return false;
  }, [deferredPrompt]);

  const value = useMemo(
    () => ({
      isPhone,
      isInstallable: Boolean(deferredPrompt) || (isPhone && !isInstalled),
      isInstalled,
      isIos,
      canPromptDirectly: Boolean(deferredPrompt),
      installApp,
      showGuideModal,
      setShowGuideModal,
      isBannerDismissed,
      dismissBanner,
      hasAppUpdate,
      isUpdating,
      updateApp,
      dismissUpdatePrompt,
    }),
    [
      isPhone,
      deferredPrompt,
      isInstalled,
      isIos,
      installApp,
      showGuideModal,
      isBannerDismissed,
      dismissBanner,
      hasAppUpdate,
      isUpdating,
      updateApp,
      dismissUpdatePrompt,
    ]
  );

  return <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>;
}
