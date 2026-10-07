import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Checks if the user agent belongs to a mobile phone.
 */
export function isMobilePhoneUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
  return /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|webOS|Windows Phone/i.test(ua);
}

/**
 * Checks if the device is running a desktop/laptop OS (Windows, Mac, Linux desktop, ChromeOS).
 */
export function isDesktopOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // iPads on modern iPadOS report "Macintosh" with navigator.maxTouchPoints > 1.
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isIPad = isMac && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;
  if (isIPad) return false;

  return /Windows NT|Macintosh|Mac OS X|X11; Linux x86_64|CrOS/i.test(ua) && !/Mobile|iPhone|iPod/i.test(ua);
}

/**
 * Detects if the current device is specifically a smartphone / mobile phone.
 * PC or Laptop (even with a touchscreen, resized browser window, or short viewport) is NEVER a phone.
 */
export function checkIsPhone(): boolean {
  if (typeof window === 'undefined') return false;

  // 1. If User Agent identifies as a mobile phone, it is a phone
  if (isMobilePhoneUserAgent()) {
    return true;
  }

  // 2. If it's a desktop operating system (Windows laptop/PC, Mac, Linux desktop), it is NOT a phone
  if (isDesktopOS()) {
    return false;
  }

  // 3. For mobile emulators or devices without standard desktop UA:
  // Must be touch-primary (no mouse/pointer hover) and small phone screen
  const hasTouch = (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) || 'ontouchstart' in window;
  const isTouchPrimary = window.matchMedia?.('(pointer: coarse) and (hover: none)')?.matches ?? hasTouch;
  const isSmallPhoneWidth = window.innerWidth < MOBILE_BREAKPOINT;
  const isLandscapePhone = window.innerWidth <= 950 && window.innerHeight <= 450 && window.innerWidth > window.innerHeight;

  return isTouchPrimary && (isSmallPhoneWidth || isLandscapePhone);
}

/**
 * Detects if the device is a mobile phone (alias for checkIsPhone for backwards compatibility).
 */
export function checkIsMobile(): boolean {
  return checkIsPhone();
}

/**
 * Returns true if the device is specifically a phone in landscape orientation.
 */
export function checkIsLandscapePhone(): boolean {
  if (typeof window === 'undefined') return false;
  if (isDesktopOS()) return false;
  return checkIsPhone() && window.innerWidth > window.innerHeight && window.innerHeight <= 480;
}

/**
 * Hook to detect if current device is a mobile phone.
 * Returns false on PC and Laptops (even with touch screens).
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(checkIsMobile);

  useEffect(() => {
    const handleCheck = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleCheck);
    window.addEventListener('orientationchange', handleCheck);
    return () => {
      window.removeEventListener('resize', handleCheck);
      window.removeEventListener('orientationchange', handleCheck);
    };
  }, []);

  return isMobile;
}

/**
 * Hook to detect if device is specifically a smartphone.
 */
export const useIsPhone = useIsMobile;

/**
 * Hook to detect if device is specifically a phone in landscape orientation.
 */
export function useIsLandscapePhone(): boolean {
  const [isLandscape, setIsLandscape] = useState(checkIsLandscapePhone);

  useEffect(() => {
    const handleCheck = () => setIsLandscape(checkIsLandscapePhone());
    window.addEventListener('resize', handleCheck);
    window.addEventListener('orientationchange', handleCheck);
    return () => {
      window.removeEventListener('resize', handleCheck);
      window.removeEventListener('orientationchange', handleCheck);
    };
  }, []);

  return isLandscape;
}
