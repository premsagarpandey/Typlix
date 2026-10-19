import { useEffect, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { checkIsPhone } from '../hooks/useIsMobile';
import { PwaInstallContext } from './PwaInstallContextCore';
import type { BeforeInstallPromptEvent } from './PwaInstallContextCore';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidStandalone = document.referrer.includes('android-app://');
  return isStandaloneMode || isIosStandalone || isAndroidStandalone;
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

  // Track phone status on resize/orientation change
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

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
    try {
      sessionStorage.setItem('typlix_install_banner_dismissed', 'true');
    } catch {}
  }, []);

  const installApp = useCallback(async (): Promise<boolean> => {
    // Check if on phone device or mobile viewport
    const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768;
    if (!checkIsPhone() && !isMobileViewport) return false;

    // If deferredPrompt is available (Chrome on Android)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
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

    // If prompt is not directly available (e.g., iOS Safari or prompt not fired yet)
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
    }),
    [isPhone, deferredPrompt, isInstalled, isIos, installApp, showGuideModal, isBannerDismissed, dismissBanner]
  );

  return <PwaInstallContext.Provider value={value}>{children}</PwaInstallContext.Provider>;
}
