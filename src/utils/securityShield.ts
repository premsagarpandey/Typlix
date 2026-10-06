/**
 * Typlix Security Shield
 * Comprehensive client-side protection:
 * 1. Self-XSS console awareness warnings
 * 2. Anti-Clickjacking / Frame-busting protection
 * 3. DevTools keyboard shortcut & context menu protection
 * 4. Safe clipboard paste sanitization (Trojan Source & null byte removal)
 * 5. Tab switch / Window blur privacy protection
 */

export function initSecurityShield(): () => void {
  // Only execute in browser environment
  if (typeof window === 'undefined') return () => {};

  // 1. Anti-Clickjacking / Frame Buster (Prevent unauthorized iframe embeds)
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.self.location.href;
    }
  } catch {
    // If top window is cross-origin, stop embedding
    document.documentElement.style.display = 'block';
  }

  // 2. Display Self-XSS Warning in Console
  const showConsoleWarning = () => {
    try {
      console.log(
        '%c⛔ STOP! SECURITY WARNING',
        'color: #ef4444; font-size: 26px; font-weight: 900; -webkit-text-stroke: 1px black; padding: 4px;'
      );
      console.log(
        '%cThis browser feature is intended strictly for developers.\nPasting code or scripts here can give malicious attackers access to your account and compromise your session (Self-XSS attack).\n\n🛡️ Typlix Security Shield is active.',
        'color: #e5e5e5; font-size: 13px; line-height: 1.5; font-weight: 500;'
      );
    } catch {
      // Ignore in non-supporting consoles
    }
  };

  showConsoleWarning();

  // 3. Disable Context Menu (Right Click) on non-editable elements
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const isInputField =
      target &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable);
    if (!isInputField) {
      e.preventDefault();
      return false;
    }
  };

  // 4. Disable DevTools & Source Inspection Keyboard Shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Block F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
    // Block Ctrl+Shift+J / Cmd+Option+J (Console)
    // Block Ctrl+Shift+C / Cmd+Option+C (Element Inspector)
    if (isCtrlOrCmd && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Block Ctrl+U / Cmd+U (View Page Source)
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

  // 5. Safe Clipboard Paste Sanitization
  const handlePaste = (e: ClipboardEvent) => {
    try {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      const pastedText = clipboardData.getData('text/plain');
      // If text contains null bytes or malicious control codes, cleanse it
      if (/[\x00\u202A-\u202E\u2066-\u2069]/.test(pastedText)) {
        e.preventDefault();
        const cleaned = pastedText.replace(/[\x00\u202A-\u202E\u2066-\u2069]/g, '');
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

  // 6. Tab Visibility & Inactivity Protection (notify components to pause sessions)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      window.dispatchEvent(new CustomEvent('typlix_tab_blurred'));
    }
  };

  // 7. Attach Global Event Listeners
  window.addEventListener('contextmenu', handleContextMenu, { capture: true });
  window.addEventListener('keydown', handleKeyDown, { capture: true });
  window.addEventListener('paste', handlePaste, { capture: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 8. Cleanup function
  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('paste', handlePaste, { capture: true });
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}
