import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Detects if the current device is a mobile/touch device.
 * Uses a combination of screen width and touch capability for accurate detection.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth < MOBILE_BREAKPOINT ||
      ('ontouchstart' in window && window.innerWidth < 1024)
    );
  });

  useEffect(() => {
    const check = () => {
      setIsMobile(
        window.innerWidth < MOBILE_BREAKPOINT ||
        ('ontouchstart' in window && window.innerWidth < 1024)
      );
    };

    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
}

/**
 * Returns true only if the device has a narrow viewport (phone-sized),
 * regardless of touch capability.
 */
export function useIsSmallScreen(): boolean {
  const [isSmall, setIsSmall] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  });

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isSmall;
}
