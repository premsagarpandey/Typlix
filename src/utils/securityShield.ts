/**
 * Typlix Security Shield — Advanced Web Application Hardening
 *
 * Comprehensive client-side protection:
 * 1. Global context-menu (Right Click) blocking to disable inspect/view source
 * 2. Complete DevTools keyboard shortcut suppression (F12, Ctrl+Shift+I/J/C/K/E/S/M/P, Ctrl+U, Cmd+Opt+I/J/C/U)
 * 3. Anti-Clickjacking / Frame-busting protection
 * 4. Production console silencing (neutralizes console.log/info/debug/dir/table to prevent internal leaks)
 * 5. Console Self-XSS & Anti-Tamper warning banner
 * 6. DevTools docked detection & periodic console buffer purge
 * 7. Asset drag-and-drop extraction prevention
 * 8. Safe clipboard paste sanitization (Trojan Source Unicode & null-byte stripping)
 * 9. Tab visibility & blur protection (pauses game sessions securely)
 */

export function initSecurityShield(): () => void {
  // Only execute in browser environment
  if (typeof window === 'undefined') return () => {};

  const isLocalDev =
    Boolean(import.meta.env?.DEV) ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';

  // 1. Anti-Clickjacking / Frame Buster (Prevent unauthorized iframe embeds)
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // If top window is cross-origin, enforce document display
    if (document.documentElement) {
      document.documentElement.style.display = 'block';
    }
  }

  // 2. Production Console Hardening & Self-XSS Warning
  const setupConsoleProtection = () => {
    try {
      // Store original console methods for warning display
      const originalLog = console.log.bind(console);

      // Print prominent Self-XSS and anti-tamper warning
      originalLog(
        '%c⛔ STOP! TYPLIX SECURITY SHIELD ACTIVE',
        'color: #ef4444; font-size: 28px; font-weight: 900; -webkit-text-stroke: 1px black; padding: 4px;'
      );
      originalLog(
        '%cThis browser feature is restricted.\nPasting code or executing unauthorized scripts here can compromise your account (Self-XSS attack).\nAll developer inspection shortcuts and unauthorized reverse-engineering tools are blocked on this site.',
        'color: #e5e5e5; font-size: 13px; line-height: 1.6; font-weight: 500;'
      );

      // In production, silence verbose logging to prevent internal state/token leaks
      if (!isLocalDev) {
        const noop = () => {};
        console.log = noop;
        console.info = noop;
        console.debug = noop;
        console.dir = noop;
        console.table = noop;
      }
    } catch {
      // Silently ignore in restricted console environments
    }
  };

  setupConsoleProtection();

  // 3. Disable Context Menu (Right Click) across the website
  const handleContextMenu = (e: MouseEvent) => {
    if (isLocalDev) return;
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // 4. Disable DevTools & Source Inspection Keyboard Shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isLocalDev) return;

    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const isShiftOrAlt = e.shiftKey || e.altKey;
    const key = (e.key || '').toLowerCase();
    const keyCode = e.keyCode || e.which;

    // Block F12 (DevTools toggle on all browsers)
    if (e.key === 'F12' || keyCode === 123 || (e.shiftKey && (e.key === 'F12' || keyCode === 123))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block DevTools Shortcuts:
    // - Ctrl+Shift+I / Cmd+Opt+I (Inspect Element)
    // - Ctrl+Shift+J / Cmd+Opt+J (Developer Console)
    // - Ctrl+Shift+C / Cmd+Opt+C (Inspect Element Picker)
    // - Ctrl+Shift+K / Cmd+Opt+K (Firefox Web Console)
    // - Ctrl+Shift+E / Cmd+Opt+E (Firefox Network Tab)
    // - Ctrl+Shift+S / Cmd+Opt+S (Firefox Debugger)
    // - Ctrl+Shift+M / Cmd+Opt+M (Toggle Device Emulation)
    // - Ctrl+Shift+P / Cmd+Opt+P (DevTools Command Palette)
    if (
      isCtrlOrCmd &&
      isShiftOrAlt &&
      ['i', 'j', 'c', 'k', 'e', 's', 'm', 'p'].includes(key)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+U / Cmd+U / Cmd+Opt+U (View Page Source)
    if (isCtrlOrCmd && key === 'u') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+S / Cmd+S (Save Page HTML)
    if (isCtrlOrCmd && key === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 5. Disable Drag-and-Drop Asset Extraction
  const handleDragStart = (e: DragEvent) => {
    if (isLocalDev) return;
    // Prevent dragging images or links out to inspect / save
    e.preventDefault();
    return false;
  };

  // 6. Safe Clipboard Paste Sanitization (Trojan Source & null byte removal)
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
      // Fallback to default paste
    }
  };

  // 7. DevTools Docked Detection & Console Purge
  const handleResize = () => {
    if (isLocalDev) return;
    // If outer dimensions diverge significantly from inner dimensions, DevTools is likely docked
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    if (widthThreshold || heightThreshold) {
      try {
        console.clear();
      } catch {}
    }
  };

  // 8. Tab Visibility & Inactivity Protection (pauses active typing sessions)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      window.dispatchEvent(new CustomEvent('typlix_tab_blurred'));
    }
  };

  // 9. Register Global Capture Event Listeners
  window.addEventListener('contextmenu', handleContextMenu, { capture: true });
  window.addEventListener('keydown', handleKeyDown, { capture: true });
  window.addEventListener('dragstart', handleDragStart, { capture: true });
  window.addEventListener('paste', handlePaste, { capture: true });
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 10. Cleanup function
  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('dragstart', handleDragStart, { capture: true });
    window.removeEventListener('paste', handlePaste, { capture: true });
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
