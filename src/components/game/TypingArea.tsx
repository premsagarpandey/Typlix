import { useRef, useEffect, useMemo, useState, useCallback, memo } from 'react';
import type { GameStatus, TargetWord } from '../../hooks/useTypingGame';
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
  words?: TargetWord[];
  currentWordIndex?: number;
  currentInput?: string;
  typedWords?: string[];
  onKeyStroke?: (key: string, ctrlKey?: boolean) => void;
  onQuickRestart?: () => void;
}

/** Fallback parser if words are not passed explicitly */
function parseWordsFallback(text: string): TargetWord[] {
  if (!text) return [{ id: 0, text: '' }];
  const parts = text.trim().split(/\s+/).filter(Boolean);
  return parts.map((w, idx) => ({ id: idx, text: w }));
}

function TypingAreaComponent({
  targetText,
  typedText,
  status,
  shakeTrigger,
  onInput,
  words: propWords,
  currentWordIndex: propWordIndex,
  currentInput: propCurrentInput,
  typedWords: propTypedWords,
  onKeyStroke,
  onQuickRestart,
}: TypingAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();
  const isLandscapePhone = useIsLandscapePhone();

  // Words and typing pointers
  const words = useMemo(() => {
    return propWords && propWords.length > 0 ? propWords : parseWordsFallback(targetText);
  }, [propWords, targetText]);

  const activeWordIndex = propWordIndex ?? 0;
  const activeInput = propCurrentInput ?? '';
  const typedWordsList = propTypedWords ?? [];

  // Caps Lock state & warning modal control
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoFixCapsLock, setAutoFixCapsLock] = useLocalStorage<boolean>('typlix_capslock_autofix', true);
  const [isShaking, setIsShaking] = useState(false);
  const [isFocusReleased, setIsFocusReleased] = useState(false);
  const [tabRestartHint, setTabRestartHint] = useState(false);

  // Line scrolling offset
  const [scrollOffsetPx, setScrollOffsetPx] = useState(0);

  // Stable refs for event listeners
  const statusRef = useRef(status);
  const capsLockOnRef = useRef(capsLockOn);
  const autoFixCapsLockRef = useRef(autoFixCapsLock);
  const onKeyStrokeRef = useRef(onKeyStroke);
  const onInputRef = useRef(onInput);
  const onQuickRestartRef = useRef(onQuickRestart);
  const isFocusReleasedRef = useRef(isFocusReleased);
  const tabPressedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabPressedRef = useRef(false);

  useEffect(() => {
    statusRef.current = status;
    capsLockOnRef.current = capsLockOn;
    autoFixCapsLockRef.current = autoFixCapsLock;
    onKeyStrokeRef.current = onKeyStroke;
    onInputRef.current = onInput;
    onQuickRestartRef.current = onQuickRestart;
    isFocusReleasedRef.current = isFocusReleased;
  }, [status, capsLockOn, autoFixCapsLock, onKeyStroke, onInput, onQuickRestart, isFocusReleased]);

  // Hardware-accelerated CSS shake on error
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

  // Smooth line scrolling based on active word DOM offset after layout paint
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      if (activeWordIndex === 0) {
        setScrollOffsetPx(0);
        return;
      }

      const activeEl = wordRefs.current[activeWordIndex];
      const firstEl = wordRefs.current[0];
      if (activeEl && firstEl) {
        const baselineTop = firstEl.offsetTop;
        const currentTop = activeEl.offsetTop;
        const diff = currentTop - baselineTop;
        setScrollOffsetPx(diff > 10 ? diff : 0);
      }
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeWordIndex]);

  // Multi-layered Caps Lock Detection
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

  // Focus keeper
  const focusInput = useCallback(() => {
    if (isFocusReleasedRef.current) return;
    const el = inputRef.current;
    if (!el) return;
    const active = document.activeElement;
    if (active) {
      const tag = active.tagName;
      if (tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (active.closest('[role="dialog"]')) return;
      if (active.closest('nav') || active.closest('aside') || active.closest('footer')) return;
      if (tag === 'BUTTON' || tag === 'A') return;
      if (tag === 'INPUT' && active !== el) return;
    }
    if (document.activeElement !== el) {
      el.focus({ preventScroll: true });
    }
  }, []);

  // Direct Keystroke Engine with Monkeytype word-level handling
  useEffect(() => {
    if (status !== 'idle' && status !== 'playing') return;

    const timer = setTimeout(focusInput, 20);

    const handleWindowKeyDown = (e: KeyboardEvent) => {
      updateCapsLockState(e);

      const currentStatus = statusRef.current;
      if (currentStatus !== 'idle' && currentStatus !== 'playing') return;

      const active = document.activeElement;
      if (active) {
        const tag = active.tagName;
        if (tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (active.closest('[role="dialog"]')) return;
        if (tag === 'INPUT' && active !== inputRef.current) return;
      }

      // ─── TAB / TAB+ENTER QUICK RESTART SHORTCUT ───
      if (e.key === 'Tab') {
        e.preventDefault();
        tabPressedRef.current = true;
        setTabRestartHint(true);
        if (tabPressedTimerRef.current) clearTimeout(tabPressedTimerRef.current);
        tabPressedTimerRef.current = setTimeout(() => {
          tabPressedRef.current = false;
          setTabRestartHint(false);
        }, 1500);
        return;
      }

      if (e.key === 'Enter') {
        if (tabPressedRef.current) {
          e.preventDefault();
          tabPressedRef.current = false;
          setTabRestartHint(false);
          onQuickRestartRef.current?.();
          focusInput();
          return;
        }
      }

      // ─── ESCAPE KEY: MID-TEST QUICK RESTART OR FOCUS RELEASE ───
      if (e.key === 'Escape') {
        e.preventDefault();
        if (currentStatus === 'playing') {
          // Mid-test quick restart on Esc
          onQuickRestartRef.current?.();
          focusInput();
          return;
        } else {
          // In idle mode, Esc releases focus for accessible navigation
          isFocusReleasedRef.current = true;
          setIsFocusReleased(true);
          inputRef.current?.blur();
          return;
        }
      }

      // If focus released, re-engage on typing key
      if (isFocusReleasedRef.current) {
        if (e.key.length === 1 || e.key === 'Enter') {
          isFocusReleasedRef.current = false;
          setIsFocusReleased(false);
          focusInput();
        } else {
          return;
        }
      }

      // System shortcuts (Ctrl+C, etc.) - allow Backspace through
      const isCtrl = e.ctrlKey || e.metaKey || e.altKey;
      if (isCtrl && e.key !== 'Backspace') {
        return;
      }

      // ─── BACKSPACE ───
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (onKeyStrokeRef.current) {
          onKeyStrokeRef.current('Backspace', isCtrl);
        }
        return;
      }

      // ─── SPACE ───
      if (e.key === ' ') {
        e.preventDefault();
        if (onKeyStrokeRef.current) {
          onKeyStrokeRef.current(' ');
        }
        return;
      }

      // ─── ENTER (for newline in code mode) ───
      if (e.key === 'Enter') {
        if (onKeyStrokeRef.current) {
          onKeyStrokeRef.current('Enter');
        }
        return;
      }

      // ─── SINGLE PRINTABLE CHARACTER ───
      if (e.key.length === 1) {
        e.preventDefault();
        isFocusReleasedRef.current = false;
        setIsFocusReleased(false);
        focusInput();

        let charToType = e.key;

        // Auto-fix CapsLock if enabled
        if (capsLockOnRef.current && autoFixCapsLockRef.current) {
          const currentWords = words;
          const currentWord = currentWords[activeWordIndex]?.text || '';
          const expectedChar = currentWord[activeInput.length];
          if (expectedChar && expectedChar.toLowerCase() === charToType.toLowerCase()) {
            charToType = expectedChar;
          }
        }

        if (onKeyStrokeRef.current) {
          onKeyStrokeRef.current(charToType);
        } else {
          onInputRef.current(typedText + charToType);
        }
      }
    };

    const handleWindowKeyUp = (e: KeyboardEvent) => updateCapsLockState(e);
    const handlePointerDown = (e: MouseEvent) => updateCapsLockState(e);

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
      if (!isFocusReleasedRef.current) setTimeout(focusInput, 30);
    };

    const el = inputRef.current;
    el?.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleWindowKeyDown, true);
    window.addEventListener('keyup', handleWindowKeyUp, true);
    window.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      clearTimeout(timer);
      if (tabPressedTimerRef.current) clearTimeout(tabPressedTimerRef.current);
      el?.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleWindowKeyDown, true);
      window.removeEventListener('keyup', handleWindowKeyUp, true);
      window.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [status, words, activeWordIndex, activeInput, typedText, focusInput, updateCapsLockState]);

  // Click container to focus
  const handleContainerClick = useCallback(() => {
    isFocusReleasedRef.current = false;
    setIsFocusReleased(false);
    focusInput();
  }, [focusInput]);

  return (
    <div className="relative w-full">
      {/* Hidden screen-reader instructions */}
      <div id="typing-instructions" className="sr-only">
        Touch typing arena. Space submits words without character cascade penalties. Press Tab + Enter or Escape to restart immediately.
      </div>

      <CapsLockWarningModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        autoFixEnabled={autoFixCapsLock}
        onToggleAutoFix={setAutoFixCapsLock}
      />

      {/* Focus Released Accessibility Banner */}
      {!isMobile && isFocusReleased && (status === 'idle' || status === 'playing') && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100 text-xs flex items-center justify-between shadow-xs animate-fade-in"
        >
          <span className="flex items-center gap-2">
            <span className="font-semibold">Keyboard focus released.</span>
            <span className="text-neutral-500">Press Tab to navigate, or click text to resume typing.</span>
          </span>
          <button
            type="button"
            onClick={handleContainerClick}
            className="px-2 py-0.5 font-semibold rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[11px] cursor-pointer"
          >
            Resume
          </button>
        </div>
      )}

      {/* Tab Quick Restart Notification Pill */}
      {tabRestartHint && (
        <div className="mb-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center justify-center gap-1.5 animate-fade-in">
          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          <span>Press <strong>Enter</strong> to restart test now</span>
        </div>
      )}

      {/* Caps Lock Banner */}
      {capsLockOn && (status === 'idle' || status === 'playing') && (
        <div className="mb-2 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-850 rounded-xl text-neutral-800 dark:text-neutral-200 text-xs font-medium flex items-center justify-between gap-2 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-bold">
              ⇪ CAPS LOCK
            </span>
            <span className="text-xs text-neutral-600 dark:text-neutral-300">
              {autoFixCapsLock ? 'Active — Auto-matching character case.' : 'Active — Uppercase keystrokes may register as errors.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-2 py-0.5 text-[11px] font-semibold rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
          >
            Preferences
          </button>
        </div>
      )}

      {/* Main Typing Viewport */}
      <div
        ref={containerRef}
        role="region"
        aria-label="Touch typing practice area"
        className={`typing-area-container relative ${isLandscapePhone ? 'p-3 sm:p-4 min-h-[110px]' : 'p-4 sm:p-6 min-h-[140px] sm:min-h-[160px]'} rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 font-mono select-none transition-all duration-200 bg-white dark:bg-neutral-900/70 shadow-xs backdrop-blur-xs cursor-text overflow-hidden ${
          isShaking ? 'animate-shake' : ''
        }`}
        style={{
          height: isLandscapePhone ? '110px' : '160px',
        }}
        onClick={handleContainerClick}
      >
        {/* Invisible capturing input for touch / IME devices */}
        <input
          ref={inputRef}
          type="text"
          value={activeInput}
          onChange={(e) => onInput(e.target.value)}
          disabled={status !== 'idle' && status !== 'playing'}
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-label="Typing input field"
          aria-describedby="typing-instructions"
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 p-0 m-0 select-none pointer-events-none"
        />

        {/* Word-Based Visual Track (Monkeytype Style) */}
        <div
          className="typing-words-track flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 gap-y-2 sm:gap-y-3 pointer-events-none select-none text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-wide transition-transform duration-200 ease-out"
          style={{
            transform: `translateY(-${scrollOffsetPx}px)`,
            willChange: 'transform',
          }}
        >
          {words.map((wordObj, wIdx) => {
            const isCurrent = wIdx === activeWordIndex;
            const isPast = wIdx < activeWordIndex;
            const targetWord = wordObj.text;
            const typedWord = isCurrent ? activeInput : (typedWordsList[wIdx] || '');

            return (
              <div
                key={wordObj.id}
                ref={(el) => {
                  wordRefs.current[wIdx] = el;
                }}
                className={`word inline-flex items-baseline relative ${
                  isCurrent ? 'opacity-100' : isPast ? 'opacity-70' : 'opacity-40'
                } transition-opacity duration-150`}
              >
                {/* Target characters of word */}
                {targetWord.split('').map((char, cIdx) => {
                  const typedChar = typedWord[cIdx];
                  const isTyped = typedChar !== undefined;
                  const isCorrect = isTyped && typedChar === char;
                  const isWrong = isTyped && !isCorrect;
                  const isMissed = isPast && !isTyped;
                  const isCaret = isCurrent && cIdx === activeInput.length;

                  return (
                    <span key={cIdx} className="relative inline-block">
                      {/* Vertical Blinking Caret Indicator */}
                      {isCaret && (
                        <span className="absolute -left-[2px] top-1 bottom-1 w-[2.5px] bg-neutral-900 dark:bg-neutral-100 rounded-full animate-pulse z-20 pointer-events-none" />
                      )}

                      <span
                        className={`${
                          isWrong
                            ? 'text-red-500 dark:text-red-400 bg-red-500/15 underline decoration-red-500 font-bold rounded-xs'
                            : isMissed
                            ? 'text-red-400/50 dark:text-red-400/50 underline decoration-dotted'
                            : isCorrect
                            ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                            : isCurrent
                            ? 'text-neutral-600 dark:text-neutral-300'
                            : 'text-neutral-400 dark:text-neutral-600'
                        }`}
                      >
                        {char}
                      </span>
                    </span>
                  );
                })}

                {/* Extra Overflow Characters (Monkeytype style overflow red strikethrough) */}
                {typedWord.length > targetWord.length && (
                  <span className="relative inline-flex">
                    {typedWord.slice(targetWord.length).split('').map((extraChar, eIdx) => (
                      <span
                        key={eIdx}
                        className="text-red-600 dark:text-red-400 font-bold line-through opacity-85 bg-red-500/10 rounded-xs"
                      >
                        {extraChar}
                      </span>
                    ))}
                  </span>
                )}

                {/* Caret when user is typing extra overflow characters at end of word */}
                {isCurrent && activeInput.length >= targetWord.length && (
                  <span className="relative inline-block w-0">
                    <span className="absolute -right-[2px] top-1 bottom-1 w-[2.5px] bg-neutral-900 dark:bg-neutral-100 rounded-full animate-pulse z-20 pointer-events-none" />
                  </span>
                )}

                {/* Newline Break for Code Snippets */}
                {wordObj.hasNewlineAfter && <div className="w-full h-0 basis-full" />}
              </div>
            );
          })}
        </div>

        {/* Top/Bottom Gradient Mask for Smooth Scroll */}
        {scrollOffsetPx > 0 && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-neutral-900/90 to-transparent z-[5]" />
        )}
      </div>

      {/* Quick Restart and Keyboard Shortcut Footer Hint */}
      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 px-1">
        <span className="flex items-center gap-1.5">
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
          <span className="hidden sm:inline">to instant restart</span>
        </span>

        {status === 'playing' && (
          <button
            type="button"
            onClick={() => onQuickRestart?.()}
            className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            title="Restart current test"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restart</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default memo(TypingAreaComponent);
