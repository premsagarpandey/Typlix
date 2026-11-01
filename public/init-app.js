/**
 * Typlix Instant Boot Initialization Script
 * Runs synchronously in <head> to prevent FOUC (Flash of Unstyled Content) and theme flash.
 * Statically served from 'self' to permit strict Content-Security-Policy without 'unsafe-inline'.
 */

// 1. Instant Standalone App Detection
(function() {
  try {
    var isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      (window.navigator && window.navigator.standalone === true) ||
      (document.referrer && document.referrer.indexOf('android-app://') !== -1) ||
      window.location.search.indexOf('source=pwa') !== -1 ||
      window.location.search.indexOf('mode=app') !== -1 ||
      sessionStorage.getItem('typlix_in_standalone_app') === 'true';
    if (isStandalone) {
      document.documentElement.classList.add('is-standalone-app');
      sessionStorage.setItem('typlix_in_standalone_app', 'true');
    }
  } catch {}
})();

// 2. Instant Theme Initialization
(function() {
  try {
    var t = localStorage.getItem('typlix_theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  } catch {}
})();
