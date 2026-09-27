export interface CookieConsentPreferences {
  necessary: boolean; // Always true (auth sessions, core security)
  functional: boolean; // Theme, sounds, layout preferences
  analytics: boolean; // Typing stats, speed benchmarks, accuracy metrics
  gpcDetected?: boolean; // Global Privacy Control / Do Not Track detected
  timestamp: string;
  version: string;
}

const STORAGE_KEY = 'typlix_cookie_consent';
const CONSENT_VERSION = '1.1';

/**
 * Detects whether the user's browser has enabled Global Privacy Control (GPC)
 * or Do Not Track (DNT) signals.
 */
export function isGlobalPrivacyControlActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // 1. Check Global Privacy Control standard
    if ('globalPrivacyControl' in navigator && (navigator as { globalPrivacyControl?: boolean }).globalPrivacyControl === true) {
      return true;
    }
    // 2. Check Do Not Track standard
    const navDnt = navigator.doNotTrack;
    if (navDnt === '1' || navDnt === 'yes') {
      return true;
    }
    const winDnt = (window as unknown as { doNotTrack?: string }).doNotTrack;
    if (winDnt === '1' || winDnt === 'yes') {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Returns privacy-first default consent.
 * If GPC or DNT is detected, analytics is strictly disabled by default.
 */
export function getDefaultConsent(): CookieConsentPreferences {
  const gpc = isGlobalPrivacyControlActive();
  return {
    necessary: true,
    functional: true,
    analytics: !gpc, // If GPC is active, analytics is strictly false by default
    gpcDetected: gpc,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export const DEFAULT_CONSENT: CookieConsentPreferences = getDefaultConsent();

export const NECESSARY_ONLY_CONSENT: CookieConsentPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  gpcDetected: isGlobalPrivacyControlActive(),
  timestamp: new Date().toISOString(),
  version: CONSENT_VERSION,
};

export function getCookieConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentPreferences;
    return parsed;
  } catch (err) {
    console.error('Failed to parse cookie consent', err);
    return null;
  }
}

/**
 * Checks whether analytics data collection is permitted based on user consent and GPC.
 */
export function canCollectAnalytics(): boolean {
  if (isGlobalPrivacyControlActive()) {
    const consent = getCookieConsent();
    // Even if GPC is active, only permit if user explicitly chose to override
    return Boolean(consent?.analytics);
  }
  const consent = getCookieConsent();
  return consent ? Boolean(consent.analytics) : false;
}

/**
 * Checks whether functional preference storage is permitted.
 */
export function canStoreFunctionalPreferences(): boolean {
  const consent = getCookieConsent();
  return consent ? Boolean(consent.functional) : true;
}

export function saveCookieConsent(preferences: Partial<CookieConsentPreferences>): CookieConsentPreferences {
  const current = getCookieConsent() || getDefaultConsent();
  const gpc = isGlobalPrivacyControlActive();
  
  const updated: CookieConsentPreferences = {
    ...current,
    ...preferences,
    necessary: true, // Always locked to true
    gpcDetected: gpc,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('typlix-cookie-consent-updated', { detail: updated }));
  } catch (err) {
    console.error('Failed to save cookie consent', err);
  }

  return updated;
}

export function resetCookieConsent(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('typlix-cookie-consent-reset'));
  } catch (err) {
    console.error('Failed to reset cookie consent', err);
  }
}

export function openCookieConsentModal(): void {
  window.dispatchEvent(new CustomEvent('typlix-open-cookie-modal'));
}
