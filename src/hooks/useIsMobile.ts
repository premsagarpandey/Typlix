import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

function checkIsTouch(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
    'ontouchstart' in window ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
}

function checkIsLandscapePhone(): boolean {
  if (typeof window === 'undefined') return false;
  // A landscape phone has width > height, with very small height (<= 550px)
  return window.innerWidth > window.innerHeight && window.innerHeight <= 550;
}

function checkIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  const isTouch = checkIsTouch();
  const isLandscape = checkIsLandscapePhone();
  const isSmallWidth = window.innerWidth < MOBILE_BREAKPOINT;
  const isShortHeight = window.innerHeight <= 550;

  return isSmallWidth || isLandscape || (isTouch && (window.innerWidth < 1200 || isShortHeight)) || isShortHeight;
}

/**
 * Detects if the current device is a mobile/touch device or a phone in landscape.
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
 * Returns true if the device is specifically a phone in landscape orientation.
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

