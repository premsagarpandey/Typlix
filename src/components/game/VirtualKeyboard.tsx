import { memo, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import {
  getKeyboardLayout,
  getFingerInfoForLayout,
  type KeyboardLayoutId,
} from '../../data/keyboardLayouts';

interface VirtualKeyboardProps {
  nextChar: string;
  mistakeKey?: string | null;
  mistakeTrigger?: number;
}

function VirtualKeyboardComponent({
  nextChar,
  mistakeKey = null,
  mistakeTrigger = 0,
}: VirtualKeyboardProps) {
  const [layoutId] = useLocalStorage<KeyboardLayoutId>('keyboardLayout', 'qwerty');
  const layout = useMemo(() => getKeyboardLayout(layoutId), [layoutId]);

  const targetChar = nextChar || '';
  const fingerInfo = useMemo(() => getFingerInfoForLayout(targetChar, layoutId), [targetChar, layoutId]);
  const lowerTarget = targetChar.toLowerCase();

  // Purely reactive mistake state driven directly from useTypingGame source of truth
  const isMistakeActive = Boolean(mistakeKey);
  const activeMistakeKey = mistakeKey || '';
  const lowerMistake = activeMistakeKey.toLowerCase();
  const mistakeVariant = isMistakeActive ? (mistakeTrigger % 2 === 0 ? 'b' : 'a') : null;

  return (
    <div
      role="region"
      aria-label="Visual Keyboard and Finger Placement Guide"
      className="w-full flex flex-col items-center gap-2 select-none pt-1 sm:pt-2 pb-1"
      onMouseDown={(e) => {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== 'BUTTON') e.preventDefault();
      }}
    >
      {/* Top Header: Finger hint + Layout Indicator */}
      <div className="w-full flex items-center justify-between px-2 max-w-3xl md:max-w-4xl mx-auto mb-1">
        {/* Finger recommendation hint */}
        <div
          role="status"
          aria-live="polite"
          className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-mono"
        >
          {targetChar ? (
            <span className="animate-fade-in inline-flex items-center gap-2">
              <span
                className={`px-2.5 py-1 rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold font-mono text-xs sm:text-sm shadow-xs transition-all duration-150 ${
                  isMistakeActive
                    ? 'ring-2 ring-rose-500/70 dark:ring-rose-400/80 shadow-md scale-105'
                    : ''
                }`}
              >
                {targetChar === ' ' ? '␣ Space' : targetChar}
              </span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium text-xs sm:text-sm">
                — {fingerInfo.hand} Hand ({fingerInfo.finger} Finger)
              </span>
            </span>
          ) : (
            <span className="text-neutral-500 dark:text-neutral-400 font-medium text-xs sm:text-sm">Ready to type</span>
          )}
        </div>

        {/* Layout indicator badge */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span
            className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 shadow-2xs"
            title="Keyboard layout can be changed in Settings"
            aria-label={`Active layout: ${layout.name}`}
          >
            {layout.name}
          </span>
        </div>
      </div>

      {/* Keyboard Matrix (Realistic mechanical keycaps, wide and bold) */}
      <div
        aria-hidden="true"
        className="w-full max-w-3xl md:max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2 items-center justify-center p-3 sm:p-4 md:p-5 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/80 dark:bg-neutral-900/60 backdrop-blur-xs shadow-xs"
      >
        {layout.rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-1.5 md:gap-2 justify-center w-full">
            {row.map((item) => {
              const isMatch =
                lowerTarget === item.key.toLowerCase() ||
                (item.shift !== undefined && targetChar === item.shift);

              const isMistake =
                isMistakeActive &&
                Boolean(
                  activeMistakeKey &&
                    (lowerMistake === item.key.toLowerCase() ||
                      (item.shift !== undefined && activeMistakeKey === item.shift))
                );

              const isHomeBump = layout.homeBumps.includes(item.key.toLowerCase());

              return (
                <div
                  key={`${item.key}-${item.shift || ''}`}
                  className={`relative shrink-0 w-8 h-10 sm:w-11 sm:h-12 md:w-12 md:h-13 lg:w-[50px] lg:h-[52px] flex flex-col items-center justify-center rounded-md sm:rounded-lg select-none transition-colors duration-100 ${
                    isMistake
                      ? `bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-600/70 border-b-2 border-b-rose-400 dark:border-b-rose-500 shadow-xs ring-1 ring-rose-400/50 dark:ring-rose-500/40 z-20 ${
                          mistakeVariant === 'a' ? 'vk-key-error-a' : 'vk-key-error-b'
                        }`
                      : isMatch
                        ? `bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-b-2 border-neutral-950 dark:border-neutral-300 z-10 ${
                            isMistakeActive
                              ? `scale-105 shadow-xl ring-2 ring-neutral-900 dark:ring-white ${
                                  mistakeVariant === 'a' ? 'vk-target-guide-a' : 'vk-target-guide-b'
                                }`
                              : 'scale-105 shadow-md ring-2 ring-neutral-400 dark:ring-neutral-200'
                          }`
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 border-b-2 border-b-neutral-300 dark:border-b-neutral-700/80 shadow-2xs hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  {item.shift ? (
                    <div className="flex flex-col items-center justify-center -space-y-0.5">
                      <span
                        className={`font-mono text-[9px] sm:text-[10px] md:text-[11px] leading-none ${
                          isMistake
                            ? 'text-rose-400 dark:text-rose-400'
                            : isMatch
                              ? 'text-neutral-400 dark:text-neutral-500'
                              : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {item.shift}
                      </span>
                      <span className="font-mono text-xs sm:text-sm md:text-base font-bold leading-none">
                        {item.key}
                      </span>
                    </div>
                  ) : (
                    <span className={`uppercase font-mono text-xs sm:text-sm md:text-base font-bold leading-none ${isHomeBump ? 'pb-1' : ''}`}>
                      {item.key}
                    </span>
                  )}
                  {isHomeBump && (
                    <span
                      className={`absolute bottom-1.5 w-3 sm:w-3.5 h-[2px] rounded-full transition-colors ${
                        isMistake
                          ? 'bg-rose-400 dark:bg-rose-500'
                          : isMatch
                            ? 'bg-neutral-500 dark:bg-neutral-400'
                            : 'bg-neutral-400 dark:bg-neutral-500'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Space bar (Proportional mechanical spacebar) */}
        <div className="flex justify-center w-full mt-1">
          <div
            className={`h-10 sm:h-12 md:h-13 w-56 sm:w-72 md:w-96 lg:w-[420px] flex items-center justify-center text-xs sm:text-sm font-semibold font-mono rounded-md sm:rounded-lg select-none transition-colors duration-100 ${
              isMistakeActive && activeMistakeKey === ' '
                ? `bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-600/70 border-b-2 border-b-rose-400 dark:border-b-rose-500 shadow-xs ring-1 ring-rose-400/50 dark:ring-rose-500/40 z-20 ${
                    mistakeVariant === 'a' ? 'vk-key-error-a' : 'vk-key-error-b'
                  }`
                : targetChar === ' '
                  ? `bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-b-2 border-neutral-950 dark:border-neutral-300 z-10 ${
                      isMistakeActive
                        ? `scale-[1.02] shadow-xl ring-2 ring-neutral-900 dark:ring-white ${
                            mistakeVariant === 'a' ? 'vk-space-guide-a' : 'vk-space-guide-b'
                          }`
                        : 'scale-[1.02] shadow-md ring-2 ring-neutral-400 dark:ring-neutral-200'
                    }`
                  : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border border-neutral-200 dark:border-neutral-700 border-b-2 border-b-neutral-300 dark:border-b-neutral-700/80 shadow-2xs'
            }`}
          >
            space
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(VirtualKeyboardComponent);
