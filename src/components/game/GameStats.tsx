import { memo } from 'react';
import { Pencil, Quote, Code } from 'lucide-react';
import type { GameMode } from '../../hooks/useTypingGame';
import type { DictionaryType } from '../../data/words';

interface GameStatsProps {
  timeRemaining: number;
  wpm: number;
  accuracy: number;
  combo: number;
  mode?: GameMode;
  level?: number;
  levelTitle?: string;
  targetWpm?: number;
  targetAccuracy?: number;
  initialTime?: number;
  onPrevLevel?: () => void;
  onNextLevel?: () => void;
  hasPrevLevel?: boolean;
  hasNextLevel?: boolean;
  selectedDuration?: number;
  onSelectDuration?: (dur: number) => void;
  onOpenCustomModal?: () => void;
  punctuation?: boolean;
  onTogglePunctuation?: () => void;
  numbers?: boolean;
  onToggleNumbers?: () => void;
  dictionary?: DictionaryType;
  onSelectDictionary?: (dict: DictionaryType) => void;
  isMobile?: boolean;
}

function GameStatsComponent({
  timeRemaining,
  wpm,
  accuracy,
  combo,
  mode = 'lesson',
  level = 1,
  levelTitle,
  targetWpm,
  targetAccuracy,
  initialTime,
  onPrevLevel,
  onNextLevel,
  hasPrevLevel = false,
  hasNextLevel = false,
  selectedDuration,
  onSelectDuration,
  onOpenCustomModal,
  punctuation = false,
  onTogglePunctuation,
  numbers = false,
  onToggleNumbers,
  dictionary = 'english-1k',
  onSelectDictionary,
  isMobile = false,
}: GameStatsProps) {
  const isLesson = mode === 'lesson';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-1.5 sm:gap-3 py-1 px-0.5 text-xs sm:text-sm select-none w-full">
      {/* ─── LEFT: Level Number + Name OR Timed Mode (with Punctuation & Numbers) OR Custom ─── */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
        {isLesson ? (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onPrevLevel && (
              <button
                type="button"
                onClick={onPrevLevel}
                disabled={!hasPrevLevel}
                aria-label={`Go to previous lesson (Level ${level - 1})`}
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white shrink-0"
                title="Previous Level"
              >
                <span aria-hidden="true">◀</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 shrink-0">
                Lvl {level}
              </span>
              {levelTitle && (
                <>
                  <span className="text-neutral-300 dark:text-neutral-700" aria-hidden="true">·</span>
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[120px] sm:max-w-[200px] md:max-w-[300px]">
                    {levelTitle}
                  </span>
                </>
              )}
            </div>

            {onNextLevel && (
              <button
                type="button"
                onClick={onNextLevel}
                disabled={!hasNextLevel}
                aria-label={`Go to next lesson (Level ${level + 1})`}
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white shrink-0"
                title="Next Level"
              >
                <span aria-hidden="true">▶</span>
              </button>
            )}
          </div>
        ) : mode === 'timed' ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Punctuation & Numbers Toggles (Monkeytype style) - hidden on mobile outside, accessible in Controls */}
            {!isMobile && (
              <div className="hidden md:inline-flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-100/60 dark:bg-neutral-800/60 p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={onTogglePunctuation}
                  aria-pressed={punctuation}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                    punctuation
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                  title="Toggle punctuation in speed test"
                >
                  @ punctuation
                </button>
                <button
                  type="button"
                  onClick={onToggleNumbers}
                  aria-pressed={numbers}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                    numbers
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  }`}
                  title="Toggle numbers in speed test"
                >
                  # numbers
                </button>
              </div>
            )}

            {/* Word Bank Dictionary Selector - hidden on mobile outside, accessible in Controls */}
            {!isMobile && onSelectDictionary && (
              <div className="hidden md:inline-flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-100/60 dark:bg-neutral-800/60 p-0.5 shrink-0" role="group" aria-label="Word dictionary selection">
                {(['english-1k', 'english-5k', 'english-200'] as const).map((dictId) => {
                  const isSelected = dictionary === dictId;
                  const label = dictId === 'english-1k' ? '1k' : dictId === 'english-5k' ? '5k' : '200';
                  const title = dictId === 'english-1k' ? 'Standard 1,000 words' : dictId === 'english-5k' ? 'Extended 5,000 words' : 'Core 200 words';
                  return (
                    <button
                      key={dictId}
                      type="button"
                      onClick={() => onSelectDictionary(dictId)}
                      aria-pressed={isSelected}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}
                      title={`Dictionary: ${title}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Timed Durations */}
            <div className="inline-flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-100/60 dark:bg-neutral-800/60 p-0.5 shrink-0">
              {[15, 30, 60, 120].map((dur) => {
                const isSelected = (selectedDuration || initialTime || 30) === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => onSelectDuration?.(dur)}
                    aria-label={`${dur} seconds speed test duration`}
                    className={`px-2.5 py-0.5 text-xs font-mono font-medium rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-2xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/50'
                    }`}
                    title={`${dur}s speed test`}
                  >
                    {dur}s
                  </button>
                );
              })}
            </div>
          </div>
        ) : mode === 'custom' ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 shrink-0">
              <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Custom</span>
            </span>
            {onOpenCustomModal && (
              <button
                type="button"
                onClick={onOpenCustomModal}
                aria-label="Enter or edit custom practice text"
                className="px-2.5 py-0.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                title="Enter or edit custom practice text"
              >
                <Pencil className="w-3 h-3 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                <span className="whitespace-nowrap">Enter Custom Text</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              {mode === 'quotes' ? (
                <>
                  <Quote className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Quotes</span>
                </>
              ) : (
                <>
                  <Code className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Code</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* ─── LIVE METRICS: TIME, WPM, ACC, COMBO ─── */}
      <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0 justify-start sm:ml-auto font-mono text-xs sm:text-sm">
        {/* Time */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            Time
          </span>
          <span
            className={`font-semibold ${
              timeRemaining <= 5 && timeRemaining > 0
                ? 'underline underline-offset-2 font-bold text-red-600 dark:text-red-400 animate-pulse'
                : 'text-neutral-900 dark:text-neutral-100'
            }`}
          >
            {timeRemaining > 0 ? `${timeRemaining}s` : '∞'}
          </span>
        </div>

        {/* Live Smooth WPM */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            WPM
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {wpm}
            {isLesson && targetWpm ? (
              <span className="text-[10px] sm:text-xs font-normal text-neutral-500 ml-0.5">
                /{targetWpm}
              </span>
            ) : null}
          </span>
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            Acc
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {accuracy}%
            {isLesson && targetAccuracy ? (
              <span className="text-[10px] sm:text-xs font-normal text-neutral-500 ml-0.5">
                /{targetAccuracy}%
              </span>
            ) : null}
          </span>
        </div>

        {/* Combo */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <span className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-wider font-semibold">
            Combo
          </span>
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {combo}x
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(GameStatsComponent);
