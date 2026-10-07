import { useRef, useEffect, useMemo, useState, useCallback, memo } from 'react';
import type { GameStatus } from '../../hooks/useTypingGame';
import CapsLockWarningModal from '../common/CapsLockWarningModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useIsMobile, useIsLandscapePhone } from '../../hooks/useIsMobile';
import { RotateCcw } from 'lucide-react';

export interface TypingAreaProps {
  targetText: string;
  typedText: string;
  status: GameStatus;
  shakeTrigger: number;
  onInput: (value: string) => void;
  onQuickRestart?: () => void;
  // Compatibility props
  words?: unknown;
  currentWordIndex?: number;
  currentInput?: string;
  typedWords?: string[];
  onKeyStroke?: (key: string, ctrl?: boolean) => void;
}

/** How many visible lines to show at once */
const VISIBLE_LINES = 3;

/**
 * Splits `targetText` into visual word-tokens, each token preserving its
 * original start index in the full text.
 */
function tokenize(text: string) {
  const tokens: { text: string; startIndex: number }[] = [];
  const regex = /\S+|\s+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ text: match[0], startIndex: match.index });
  }
  return tokens;
}

// Cached measure canvas to avoid DOM creation on every line break calculation
let cachedMeasureCtx: CanvasRenderingContext2D | null = null;

/**
 * Given word tokens and a container width, compute which tokens belong to each
 * visual line. Uses a cached canvas context for zero-allocation text measurement.
 */
function computeLines(
  tokens: { text: string; startIndex: number }[],
  containerWidth: number,
  fontSize: number,
  font: string
): { text: string; startIndex: number }[][] {
  if (containerWidth <= 0 || tokens.length === 0) return [];

  if (typeof document !== 'undefined' && !cachedMeasureCtx) {
    const canvas = document.createElement('canvas');
    cachedMeasureCtx = canvas.getContext('2d');
  }
  const ctx = cachedMeasureCtx;
  if (!ctx) return [];
  ctx.font = `${fontSize}px ${font}`;

  const lines: { text: string; startIndex: number }[][] = [];
  let currentLine: { text: string; startIndex: number }[] = [];
  let lineWidth = 0;
  const effectiveWidth = Math.max(containerWidth - 16, 120);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Force line break if token contains newline
    if (token.text.includes('\n')) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = [];
        lineWidth = 0;
      }
      continue;
    }

    const tokenWidth = ctx.measureText(token.text).width;

    // If this token alone exceeds the line AND we already have content, wrap.
    if (lineWidth + tokenWidth > effectiveWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [];
      lineWidth = 0;
    }

    currentLine.push(token);
    lineWidth += tokenWidth;
  }

  if (currentLine.length > 0) lines.push(currentLine);
  return lines;
}

function TypingAreaComponent({
  targetText,
  typedText,
  status,
  shakeTrigger,
  onInput,
  onQuickRestart,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isLandscapePhone = useIsLandscapePhone();

  // Caps Lock state & warning modal control
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoFixCapsLock, setAutoFixCapsLock] = useLocalStorage<boolean>('typlix_capslock_autofix', true);
  const [isShaking, setIsShaking] = useState(false);
  const [isFocusReleased, setIsFocusReleased] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [tabRestartHint, setTabRestartHint] = useState(false);

  // Stable refs for event listeners
  const typedTextRef = useRef(typedText);
  const targetTextRef = useRef(targetText);
  const statusRef = useRef(status);
  const capsLockOnRef = useRef(capsLockOn);
  const autoFixCapsLockRef = useRef(autoFixCapsLock);
  const onInputRef = useRef(onInput);
  const onQuickRestartRef = useRef(onQuickRestart);
  const isFocusReleasedRef = useRef(isFocusReleased);
  const tabPressedRef = useRef(false);
  const tabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    typedTextRef.current = typedText;
    targetTextRef.current = targetText;
    statusRef.current = status;
    capsLockOnRef.current = capsLockOn;
    autoFixCapsLockRef.current = autoFixCapsLock;
    onInputRef.current = onInput;
    onQuickRestartRef.current = onQuickRestart;
    isFocusReleasedRef.current = isFocusReleased;
  }, [typedText, targetText, status, capsLockOn, autoFixCapsLock, onInput, onQuickRestart, isFocusReleased]);

  // Container width & responsive font size for line computation
  const [containerWidth, setContainerWidth] = useState(0);
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth > window.innerHeight && window.innerHeight <= 550) return 20;
      if (window.innerWidth >= 1024) return 30;
      if (window.innerWidth >= 640) return 26;
      if (window.innerWidth >= 400) return 18;
      return 16;
    }
    return 26;
  });

  // Measure container width and responsive font size on mount & resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const style = getComputedStyle(el);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      setContainerWidth(el.clientWidth - paddingLeft - paddingRight);
      const isLandscape = window.innerWidth > window.innerHeight && window.innerHeight <= 550;
      setFontSize(
        isLandscape ? 20
        : window.innerWidth >= 1024 ? 30
        : window.innerWidth >= 640 ? 26
        : window.innerWidth >= 400 ? 18
        : 16
      );
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, []);

  // Hardware-accelerated CSS shake on error (zero Framer Motion JS overhead)
  useEffect(() => {
    if (shakeTrigger > 0) {
      const frameId = requestAnimationFrame(() => setIsShaking(true));
      const timer = setTimeout(() => setIsShaking(false), 240);
      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timer);
      };
    }
  }, [shakeTrigger]);

  // Multi-layered Caps Lock Detection (getModifierState + key case heuristic)
  const updateCapsLockState = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent | MouseEvent | React.MouseEvent) => {
      let detected: boolean | null = null;

      if (typeof e.getModifierState === 'function') {
        detected = e.getModifierState('CapsLock');
      } else if ('key' in e && typeof e.key === 'string' && e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        if (e.key >= 'A' && e.key <= 'Z' && !e.shiftKey) {
          detected = true;
        } else if (e.key >= 'a' && e.key <= 'z' && !e.shiftKey) {
          detected = false;
        }
      }

      if (detected !== null && detected !== capsLockOnRef.current) {
        setCapsLockOn(detected);
        capsLockOnRef.current = detected;
      }
    },
    []
  );

  // Auto-focus input immediately on mount
  useEffect(() => {
    const doInitialFocus = () => {
      if (inputRef.current && !isFocusReleasedRef.current) {
        inputRef.current.focus({ preventScroll: true });
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }
    };
    doInitialFocus();
    const t1 = setTimeout(doInitialFocus, 30);
    const t2 = setTimeout(doInitialFocus, 100);
    const t3 = setTimeout(doInitialFocus, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Direct Keystroke Engine & Auto-Focus Keeper
  useEffect(() => {
    if (status !== 'idle' && status !== 'playing') return;

    const focusInput = () => {
      if (isFocusReleasedRef.current) return;
      const el = inputRef.current;
      if (!el) return;
      // Don't steal focus from open text inputs, modals, navigation
      const active = document.activeElement;
      if (active && active !== el) {
        const activeTag = active.tagName;
        if (activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
        if (active.closest('[role="dialog"]') || active.closest('[role="menu"]')) return;
        if (active.closest('nav') || active.closest('aside') || active.closest('footer')) return;
        if (activeTag === 'INPUT') return;
        // On desktop, don't steal focus if user intentionally navigated to a button via Tab
        if (!isMobile && (activeTag === 'BUTTON' || activeTag === 'A')) return;
      }
      if (document.activeElement !== el) {
        el.focus({ preventScroll: true });
      }
    };

    // Initial focus
    const timer = setTimeout(focusInput, 20);

    // Global keydown: captures typing keys while respecting keyboard accessibility (WCAG 2.1.2)
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      updateCapsLockState(e);

      const currentStatus = statusRef.current;
      if (currentStatus !== 'idle' && currentStatus !== 'playing') return;

      // Don't intercept if focus is in a dialog/modal or textarea/select or another input
      const active = document.activeElement;
      if (active) {
        const activeTag = active.tagName;
        if (activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;
        if (active.closest('[role="dialog"]')) return;
        if (activeTag === 'INPUT' && active !== inputRef.current) return;
      }

      // ─── TAB / TAB+ENTER QUICK RESTART SHORTCUT ───
      if (e.key === 'Tab') {
        tabPressedRef.current = true;
        setTabRestartHint(true);
        if (tabTimerRef.current) clearTimeout(tabTimerRef.current);
        tabTimerRef.current = setTimeout(() => {
          tabPressedRef.current = false;
          setTabRestartHint(false);
        }, 1500);
      }

      if (e.key === 'Enter' && tabPressedRef.current) {
        e.preventDefault();
        tabPressedRef.current = false;
        setTabRestartHint(false);
        onQuickRestartRef.current?.();
        focusInput();
        return;
      }

      // ─── ESCAPE KEY: MID-TEST QUICK RESTART OR FOCUS RELEASE ───
      if (e.key === 'Escape') {
        e.preventDefault();
        if (currentStatus === 'playing') {
          onQuickRestartRef.current?.();
          focusInput();
          return;
        } else {
          isFocusReleasedRef.current = true;
          setIsFocusReleased(true);
          inputRef.current?.blur();
          return;
        }
      }

      // If focus is currently released, allow Tab or arrow keys to navigate controls freely
      if (isFocusReleasedRef.current) {
        if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
          return;
        }
        // If user presses any typing key or Enter, re-engage typing focus
        if (e.key.length === 1 || e.key === 'Enter') {
          isFocusReleasedRef.current = false;
          setIsFocusReleased(false);
          focusInput();
        }
      }

      // Allow Tab key to naturally navigate out to the next interactive element (No Keyboard Trap)
      if (e.key === 'Tab') {
        isFocusReleasedRef.current = true;
        setIsFocusReleased(true);
        return;
      }

      // Check if AltGr is being used to type special characters (AltGr sets ctrlKey and altKey, or AltGraph)
      const isAltGrChar =
        e.key.length === 1 &&
        (Boolean(e.getModifierState && e.getModifierState('AltGraph')) || (e.ctrlKey && e.altKey));

      // System shortcuts (Ctrl, Alt, Meta) - preserve AltGr characters
      if (!isAltGrChar && (e.ctrlKey || e.metaKey || e.altKey)) {
        if (e.ctrlKey && e.key === 'Backspace') {
          e.preventDefault();
          const currentTyped = typedTextRef.current;
          const trimmed = currentTyped.trimEnd();
          const lastSpace = trimmed.lastIndexOf(' ');
          const nextVal = lastSpace >= 0 ? trimmed.slice(0, lastSpace + 1) : '';
          onInputRef.current(nextVal);
          if (inputRef.current) {
            inputRef.current.value = nextVal;
          }
        }
        return;
      }

      // Handle Backspace directly
      if (e.key === 'Backspace') {
        e.preventDefault();
        const currentTyped = typedTextRef.current;
        if (currentTyped.length > 0) {
          const nextVal = currentTyped.slice(0, -1);
          onInputRef.current(nextVal);
          if (inputRef.current) {
            inputRef.current.value = nextVal;
          }
        }
        return;
      }

      // Printable single character keystroke (letters, numbers, space, punctuation)
      if (e.key.length === 1) {
        e.preventDefault(); // Prevents Space from scrolling the page
        isFocusReleasedRef.current = false;
        setIsFocusReleased(false);
        focusInput();

        let charToType = e.key;
        const currentTyped = typedTextRef.current;
        const currentTarget = targetTextRef.current;

        // Smart Auto-Fix: If Caps Lock is ON and auto-fix enabled, match expected target letter case
        if (capsLockOnRef.current && autoFixCapsLockRef.current && currentTyped.length < currentTarget.length) {
          const expectedChar = currentTarget[currentTyped.length];
          if (expectedChar && expectedChar.toLowerCase() === charToType.toLowerCase()) {
            charToType = expectedChar;
          }
        }

        const nextVal = currentTyped + charToType;
        onInputRef.current(nextVal);
        if (inputRef.current) {
          inputRef.current.value = nextVal;
        }
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => {
      updateCapsLockState(e);
    };

    const handlePointerDown = (e: MouseEvent) => {
      updateCapsLockState(e);
    };

    // Re-focus helper that respects keyboard navigation
    const handleBlur = () => {
      setTimeout(() => {
        const active = document.activeElement;
        if (
          isFocusReleasedRef.current ||
          !active ||
          active.tagName === 'BUTTON' ||
          active.tagName === 'A' ||
          active.tagName === 'SELECT' ||
          active.tagName === 'TEXTAREA' ||
          active.closest('nav') ||
          active.closest('aside') ||
          active.closest('[role="dialog"]')
        ) {
          return;
        }
        focusInput();
      }, 30);
    };

    const handleWindowFocus = () => {
      if (!isFocusReleasedRef.current) {
        setTimeout(focusInput, 30);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && !isFocusReleasedRef.current) {
        setTimeout(focusInput, 50);
      }
    };

    const el = inputRef.current;
    el?.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleWindowKeyDown, true);
    window.addEventListener('keyup', handleWindowKeyUp, true);
    window.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearTimeout(timer);
      if (tabTimerRef.current) clearTimeout(tabTimerRef.current);
      el?.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleWindowKeyDown, true);
      window.removeEventListener('keyup', handleWindowKeyUp, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [status, updateCapsLockState]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCapsLockState(e);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    updateCapsLockState(e);
  };

  // Fallback Input Handler for IME / on-screen keyboards
  const handleInputChange = (rawVal: string) => {
    let finalVal = rawVal;

    // Smart Auto-Fix: If Caps Lock is ON and auto-fix is enabled:
    if (capsLockOn && autoFixCapsLock && rawVal.length > typedText.length) {
      const idx = rawVal.length - 1;
      const targetChar = targetText[idx];
      const typedChar = rawVal[idx];

      if (targetChar && typedChar && targetChar.toLowerCase() === typedChar.toLowerCase()) {
        finalVal = rawVal.slice(0, idx) + targetChar;
      }
    }

    onInputRef.current(finalVal);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleCopy = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Tokenize text
  const tokens = useMemo(() => tokenize(targetText), [targetText]);

  // Font family matching the monospace font set in CSS
  const fontFamily = "'JetBrains Mono', 'Fira Code', monospace";

  // Break tokens into visual lines
  const lines = useMemo(
    () => computeLines(tokens, containerWidth, fontSize, fontFamily),
    [tokens, containerWidth, fontSize, fontFamily]
  );

  // Determine which line the caret is on
  const activeLineIndex = useMemo(() => {
    const caretPos = typedText.length;
    for (let i = 0; i < lines.length; i++) {
      const lineTokens = lines[i];
      const lastToken = lineTokens[lineTokens.length - 1];
      const lineEnd = lastToken.startIndex + lastToken.text.length;
      if (caretPos < lineEnd) return i;
    }
    return Math.max(0, lines.length - 1);
  }, [lines, typedText.length]);

  // The "scroll offset" line – the first visible line index.
  const scrollLineIndex = useMemo(() => {
    if (activeLineIndex <= 0) return 0;
    return activeLineIndex;
  }, [activeLineIndex]);

  // Line height in px – we use this for the scroll transform
  const lineHeightPx = Math.round(fontSize * 1.85);

  // Focus handler
  const handleContainerClick = useCallback(() => {
    isFocusReleasedRef.current = false;
    setIsFocusReleased(false);
    inputRef.current?.focus();
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  // Mobile: Handle touch to focus input and bring up OS keyboard synchronously
  const handleContainerTouchEnd = useCallback((_e: React.TouchEvent) => {
    if (!isMobile) return;
    isFocusReleasedRef.current = false;
    setIsFocusReleased(false);
    // Direct synchronous focus ensures iOS Safari and Android Chrome reliably open the on-screen keyboard
    inputRef.current?.focus();
    if (inputRef.current) {
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isMobile]);

  return (
    <div className="relative w-full">
      {/* Hidden screen-reader instructions for touch typing */}
      <div id="typing-instructions" className="sr-only">
        Touch typing exercise. Type the characters shown on screen. Highlighted characters indicate correct progress, strikethrough indicates typos. Press Escape to release keyboard focus and navigate other page controls.
      </div>

      {/* ─── Caps Lock Warning Preferences Modal (only on explicit user request) ─── */}
      <CapsLockWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        autoFixEnabled={autoFixCapsLock}
        onToggleAutoFix={setAutoFixCapsLock}
      />

      {/* ─── Focus Released Accessibility Notice (desktop only) ─── */}
      {!isMobile && isFocusReleased && (status === 'idle' || status === 'playing') && (
        <div
          role="status"
          aria-live="polite"
          className="mb-3 px-3.5 sm:px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 text-xs flex items-center justify-between shadow-xs animate-fade-in"
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold">Keyboard focus released.</span>
            <span className="text-neutral-600 dark:text-neutral-400">
              Press Tab to navigate controls, or click the text area to resume typing.
            </span>
          </span>
          <button
            type="button"
            onClick={handleContainerClick}
            className="px-2.5 py-1 font-semibold rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-[11px] cursor-pointer transition-colors"
          >
            Resume Typing
          </button>
        </div>
      )}

      {/* ─── Mobile: Tap to Start Typing Prompt ─── */}
      {isMobile && !isInputFocused && status === 'idle' && typedText.length === 0 && !isLandscapePhone && (
        <div className="mb-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-center animate-fade-in">
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
            👆 Tap the text below to start typing
          </span>
        </div>
      )}

      {/* ─── Non-intrusive Caps Lock Warning Banner ─── */}
      {capsLockOn && (status === 'idle' || status === 'playing') && (
        <div className="mb-3 px-3.5 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-100/90 dark:bg-neutral-850/90 rounded-xl text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
              ⇪ CAPS LOCK
            </span>
            <span className="truncate text-xs text-neutral-600 dark:text-neutral-300">
              {autoFixCapsLock
                ? 'Active — Auto-matching character case to preserve lesson progress.'
                : 'Active — Uppercase keystrokes may register as errors.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer border border-neutral-300 dark:border-neutral-700 shadow-2xs"
          >
            Preferences
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        role="region"
        aria-label="Touch typing practice area"
        className={`typing-area-container relative ${isLandscapePhone ? 'p-3 sm:p-4' : 'p-5 sm:p-7'} rounded-2xl border border-neutral-200/90 dark:border-neutral-800 font-mono select-none transition-all duration-200 bg-white dark:bg-neutral-900/60 shadow-xs backdrop-blur-xs cursor-text ${
          isShaking ? 'animate-shake' : ''
        } ${isMobile && !isInputFocused && status === 'idle' && typedText.length === 0 ? 'mobile-tap-cue' : ''}`}
        style={{
          height: `${lineHeightPx * VISIBLE_LINES + (isLandscapePhone ? 32 : fontSize >= 28 ? 52 : 44)}px`,
          overflow: 'hidden',
          fontSize: `${fontSize}px`,
        }}
        onMouseDown={(e) => {
          if (e.target !== inputRef.current) {
            e.preventDefault();
            isFocusReleasedRef.current = false;
            setIsFocusReleased(false);
            inputRef.current?.focus();
            if (inputRef.current) {
              const len = inputRef.current.value.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }
        }}
        onClick={handleContainerClick}
        onTouchEnd={handleContainerTouchEnd}
      >
        {/* Transparent input overlay for capturing keystrokes */}
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={typedText}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsInputFocused(true);
            isFocusReleasedRef.current = false;
            setIsFocusReleased(false);
          }}
          onBlur={() => {
            setIsInputFocused(false);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onClick={(e) => {
            const el = e.currentTarget;
            el.setSelectionRange(el.value.length, el.value.length);
          }}
          onSelect={(e) => {
            const el = e.currentTarget;
            el.setSelectionRange(el.value.length, el.value.length);
          }}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onCopy={handleCopy}
          onCut={(e) => e.preventDefault()}
          disabled={status !== 'idle' && status !== 'playing'}
          inputMode="text"
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Typing input field"
          aria-describedby="typing-instructions"
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 p-0 m-0 select-none"
          style={{
            // On mobile, use 16px font-size to prevent iOS zoom on focus
            fontSize: isMobile ? '16px' : undefined,
            // Ensure the input is interactive on mobile
            touchAction: 'manipulation',
          }}
        />

        {/* Scrolling lines container */}
        <div
          className="typing-lines-track pointer-events-none select-none"
          style={{
            transform: `translateY(-${scrollLineIndex * lineHeightPx}px)`,
            transition: 'transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
          }}
        >
          {lines.map((lineTokens, lineIdx) => {
            const distFromActive = lineIdx - activeLineIndex;

            // Virtualize distant lines to minimize DOM tree size and garbage collection
            const isOutOfWindow = distFromActive < -1 || distFromActive > VISIBLE_LINES + 1;

            return (
              <div
                key={lineIdx}
                className="typing-line flex flex-nowrap items-baseline whitespace-pre overflow-visible"
                style={{
                  height: `${lineHeightPx}px`,
                  lineHeight: `${lineHeightPx}px`,
                  opacity:
                    distFromActive < 0
                      ? 0 // already typed lines – hidden
                      : distFromActive === 0
                      ? 1
                      : distFromActive === 1
                      ? 0.5
                      : 0.25,
                  transition: 'opacity 0.28s ease',
                  filter: distFromActive < 0 ? 'blur(2px)' : 'none',
                }}
              >
                {isOutOfWindow ? (
                  <div style={{ height: `${lineHeightPx}px` }} />
                ) : (
                  lineTokens.map(({ text: wordText, startIndex }) => {
                    const isCurrentWord =
                      typedText.length >= startIndex && typedText.length < startIndex + wordText.length;

                    return (
                      <span key={startIndex} className="inline-flex whitespace-pre">
                        {wordText.split('').map((char, i) => {
                          const index = startIndex + i;
                          const isTyped = index < typedText.length;
                          const isCorrect = isTyped && typedText[index] === char;
                          const isError = isTyped && !isCorrect;
                          const isCurrent = index === typedText.length;
                          const isSpace = char === ' ';

                          // Space indicator handling: show space symbol indicator like before
                          let displayChar = char;
                          if (isSpace) {
                            if (isError) {
                              displayChar = '_';
                            } else if (isCurrent) {
                              displayChar = '_';
                            } else if (!isTyped) {
                              displayChar = '_';
                            } else {
                              displayChar = '\u00A0';
                            }
                          }

                          return (
                            <span key={index} className="relative inline-block">
                              <span
                                className={`${
                                  isError
                                    ? isSpace
                                      ? 'bg-red-500/25 border-b-2 border-red-500 text-red-500 dark:text-red-400 font-bold px-0.5 rounded-xs'
                                      : 'text-red-500 dark:text-red-400 bg-red-500/15 line-through rounded-xs font-bold px-0.5'
                                    : isCorrect
                                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                                    : isCurrent
                                    ? isSpace
                                      ? 'inline-block animate-target-char font-extrabold text-neutral-950 dark:text-white bg-neutral-200/90 dark:bg-neutral-700/80 rounded-xs px-1 border-b-2 border-neutral-900 dark:border-neutral-100'
                                      : 'inline-block animate-target-char font-extrabold text-neutral-950 dark:text-white bg-neutral-200/90 dark:bg-neutral-700/80 rounded-xs px-0.5'
                                    : isSpace && !isTyped
                                    ? 'opacity-35 font-semibold text-neutral-400 dark:text-neutral-500'
                                    : isCurrentWord
                                    ? 'text-neutral-900 dark:text-neutral-100 font-semibold'
                                    : distFromActive === 0
                                    ? 'text-neutral-600 dark:text-neutral-400 font-normal'
                                    : distFromActive === 1
                                    ? 'text-neutral-400 dark:text-neutral-500 font-normal'
                                    : 'text-neutral-300 dark:text-neutral-600 font-normal'
                                }`}
                              >
                                {displayChar}
                              </span>
                            </span>
                          );
                        })}
                      </span>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>

        {/* Top fade mask for scrolled-out lines */}
        <div
          className="pointer-events-none absolute top-0 left-0 right-0 z-[5]"
          style={{
            height: '20px',
            background:
              'linear-gradient(to bottom, var(--typing-area-bg, rgba(255,255,255,1)), transparent)',
            opacity: scrollLineIndex > 0 ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />
      </div>

      {/* Tab Quick Restart Notification Pill */}
      {tabRestartHint && (
        <div className="mt-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in">
          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          <span>Press <strong>Enter</strong> to restart test now</span>
        </div>
      )}

      {/* Quick Restart and Keyboard Shortcut Footer Hint */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 px-1">
        <span className="hidden sm:flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-[10px]">
            Tab
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-[10px]">
            Enter
          </kbd>
          <span>or</span>
          <kbd className="px-1.5 py-0.5 font-mono bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded text-[10px]">
            Esc
          </kbd>
          <span>to instant restart</span>
        </span>

        {/* Mobile Status / Hint */}
        <span className="sm:hidden text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
          {status === 'playing' ? 'Session active · type the text' : 'Tap area to begin typing'}
        </span>

        {/* Touch-Friendly Restart Button (available anytime on mobile, or when playing on desktop) */}
        {(status === 'playing' || isMobile) && (
          <button
            type="button"
            onClick={() => onQuickRestartRef.current?.()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer border border-neutral-200 dark:border-neutral-700 shadow-2xs text-xs font-semibold"
            title="Restart current test"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(TypingAreaComponent);

