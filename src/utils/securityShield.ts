/**
 * Typlix Web Hardening & Defense Utilities
 *
 * Safe client-side protections:
 * 1. Console Self-XSS safety advisory warning banner
 * 2. Safe clipboard paste sanitization (stripping Trojan Source Unicode BiDi overrides & null bytes)
 * 3. Tab visibility state notification (pauses active typing sessions when user switches tabs)
 * 4. Prototype Pollution Guard (prevents Object.prototype manipulation)
 *
 * Note on Web Standards & Accessibility:
 * - Anti-Clickjacking is enforced strictly at the network protocol level via Content-Security-Policy
 *   (`frame-ancestors 'none'`) and `X-Frame-Options: DENY` HTTP headers.
 * - Context menu (Right Click) and DevTools keyboard shortcuts (F12, Inspect) are NOT blocked,
 *   preserving browser accessibility, screen reader operation, and user choice.
 */

export function initSecurityShield(): () => void {
  // Only execute in browser environment
  if (typeof window === 'undefined') return () => {};

  const isLocalDev =
    Boolean(import.meta.env?.DEV) ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';

  // 1. Production Console Self-XSS Advisory Warning
  try {
    const originalLog = console.log.bind(console);
    originalLog(
      '%c⛔ STOP! TYPLIX SECURITY NOTICE',
      'color: #ef4444; font-size: 26px; font-weight: 900; -webkit-text-stroke: 1px black; padding: 4px;'
    );
    originalLog(
      '%cThis browser feature is intended for developers.\nNever paste code or run scripts that someone told you to copy here — doing so can compromise your account (Self-XSS attack).',
      'color: #e5e5e5; font-size: 13px; line-height: 1.6; font-weight: 500;'
    );

    // In production, silence excessive debug logs
    if (!isLocalDev) {
      const noop = () => {};
      console.debug = noop;
    }
  } catch {
    // Silently ignore in restricted console environments
  }

  // 2. Prototype Pollution Defense Guard
  try {
    if (typeof Object.defineProperty === 'function') {
      const protoDesc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');
      if (protoDesc && protoDesc.set) {
        Object.defineProperty(Object.prototype, '__proto__', {
          set() {
            // Block prototype pollution silently
            return false;
          },
          configurable: false,
        });
      }
    }
  } catch {}

  // 3. Safe Clipboard Paste Sanitization (Trojan Source Unicode & null byte removal)
  // eslint-disable-next-line no-control-regex
  const CLIPBOARD_CONTROL_REGEX = /[\x00\u202A-\u202E\u2066-\u2069]/;
  // eslint-disable-next-line no-control-regex
  const CLIPBOARD_CLEAN_REGEX = /[\x00\u202A-\u202E\u2066-\u2069]/g;

  const handlePaste = (e: ClipboardEvent) => {
    try {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const pastedText = clipboardData.getData('text/plain');
      // If text contains null bytes or malicious Unicode directional override characters
      if (CLIPBOARD_CONTROL_REGEX.test(pastedText)) {
        e.preventDefault();
        const cleaned = pastedText.replace(CLIPBOARD_CLEAN_REGEX, '');
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | null;
        if (target && 'value' in target && typeof target.selectionStart === 'number') {
          const start = target.selectionStart || 0;
          const end = target.selectionEnd || 0;
          const val = target.value;
          target.value = val.slice(0, start) + cleaned + val.slice(end);
          target.setSelectionRange(start + cleaned.length, start + cleaned.length);
          target.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }
    } catch {
      // Fallback to default browser paste
    }
  };

  // 4. Tab Visibility Protection (notifies game to pause when user switches tabs)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      window.dispatchEvent(new CustomEvent('typlix_tab_blurred'));
    }
  };

  // 5. Register Global Event Listeners
  window.addEventListener('paste', handlePaste, { capture: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 6. Cleanup function
  return () => {
    window.removeEventListener('paste', handlePaste, { capture: true });
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
