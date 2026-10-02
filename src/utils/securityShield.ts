/**
 * Typlix Security Shield
 * Comprehensive client-side protection against DevTools inspection,
 * keyboard shortcut tampering, Self-XSS attacks, and unauthorized DOM manipulation.
 */

export function initSecurityShield(): () => void {
  // Only execute in browser environment
  if (typeof window === 'undefined') return () => {};

  // 1. Display Self-XSS Warning in Console
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

  // 2. Disable Context Menu (Right Click)
  const handleContextMenu = (e: MouseEvent) => {
    // Allow right click only on editable input fields if needed, block everywhere else
    const target = e.target as HTMLElement | null;
    const isInputField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
    if (!isInputField) {
      e.preventDefault();
      return false;
    }
  };

  // 3. Disable DevTools Keyboard Shortcuts
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

  // 4. Attach Global Event Listeners
  window.addEventListener('contextmenu', handleContextMenu, { capture: true });
  window.addEventListener('keydown', handleKeyDown, { capture: true });

  // 5. Cleanup function
  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
  };
}
