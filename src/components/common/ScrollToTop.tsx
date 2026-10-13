import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  // 1. Immediately reset scroll synchronously before paint (prevents visual jump)
  useLayoutEffect(() => {
    // Disable browser automatic scroll restoration to avoid middle/bottom restore
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const mainEl = document.getElementById('main-content');
      if (mainEl) {
        mainEl.scrollTop = 0;
      }
    }
  }, [pathname, search, hash]);

  // 2. Secondary micro-delays to guarantee top position even after Suspense lazy chunks load
  useEffect(() => {
    if (!hash) {
      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const mainEl = document.getElementById('main-content');
        if (mainEl) {
          mainEl.scrollTop = 0;
        }
      };

      resetScroll();
      const rId = requestAnimationFrame(resetScroll);
      const t1 = setTimeout(resetScroll, 20);
      const t2 = setTimeout(resetScroll, 80);
      const t3 = setTimeout(resetScroll, 200);

      return () => {
        cancelAnimationFrame(rId);
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [pathname, search, hash]);

  return null;
}
