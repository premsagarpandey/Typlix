import { memo } from 'react';
import { Pencil, Quote, Code, RotateCcw } from 'lucide-react';
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
  capitals?: boolean;
  onToggleCapitals?: () => void;
  punctuation?: boolean;
  onTogglePunctuation?: () => void;
  numbers?: boolean;
  onToggleNumbers?: () => void;
  dictionary?: DictionaryType;
  onSelectDictionary?: (dict: DictionaryType) => void;
  onRestoreDefaults?: () => void;
  isDefaultSettings?: boolean;
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
  capitals = false,
  onToggleCapitals,
  punctuation = false,
  onTogglePunctuation,
  numbers = false,
  onToggleNumbers,
  dictionary = 'english-1k',
  onSelectDictionary,
  onRestoreDefaults,
  isDefaultSettings = true,
  isMobile: _isMobile = false,
}: GameStatsProps) {
  const isLesson = mode === 'lesson';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between items-start gap-2 sm:gap-3 py-1 px-0.5 text-xs sm:text-sm select-none w-full">
      {/* ─── LEFT: Level Number + Name OR Timed Mode (with Punctuation & Numbers) OR Quotes OR Custom ─── */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-full overflow-hidden">
        {isLesson ? (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onPrevLevel && (
              <button
                type="button"
                onClick={onPrevLevel}
                disabled={!hasPrevLevel}
                aria-label={`Go to previous lesson (Level ${level - 1})`}
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-700 dark:text-neutral-300 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white shrink-0"
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
                className="px-2 py-0.5 text-xs font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 disabled:opacity-25 disabled:pointer-events-none cursor-pointer text-neutral-700 dark:text-neutral-300 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white shrink-0"
                title="Next Level"
              >
                <span aria-hidden="true">▶</span>
              </button>
            )}
          </div>
        ) : mode === 'timed' ? (
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full shrink-0">
            {/* Group 1: Modifiers (Capitals, Punctuation, Numbers) */}
            <div className="inline-flex items-center border border-neutral-200/90 dark:border-neutral-700/80 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 p-0.5 shrink-0 shadow-2xs backdrop-blur-xs">
              {onToggleCapitals && (
                <button
                  type="button"
                  onClick={onToggleCapitals}
                  aria-pressed={capitals}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                    capitals
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                  }`}
                  title="Toggle capital letters (default: OFF)"
                >
                  <span className="font-bold">Aa</span>
                  <span className="hidden sm:inline">capitals</span>
                </button>
              )}
              <button
                type="button"
                onClick={onTogglePunctuation}
                aria-pressed={punctuation}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                  punctuation
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                }`}
                title="Toggle punctuation (default: OFF)"
              >
                <span className="font-bold">@</span>
                <span className="hidden sm:inline">punctuation</span>
              </button>
              <button
                type="button"
                onClick={onToggleNumbers}
                aria-pressed={numbers}
                className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                  numbers
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                }`}
                title="Toggle numbers (default: OFF)"
              >
                <span className="font-bold">#</span>
                <span className="hidden sm:inline">numbers</span>
              </button>
              {onRestoreDefaults && (
                <button
                  type="button"
                  onClick={onRestoreDefaults}
                  aria-label="Restore default settings"
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 group ${
                    !isDefaultSettings
                      ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                  }`}
                  title="Restore default settings (lowercase, no punctuation, 1k, 30s)"
                >
                  <RotateCcw className="w-3 h-3 transition-transform duration-300 group-hover:-rotate-90 group-active:rotate-180" aria-hidden="true" />
                  <span>default</span>
                  {!isDefaultSettings && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" title="Settings modified from default" />
                  )}
                </button>
              )}
            </div>

            {/* Group 2: Word Bank Dictionary Selector */}
            {onSelectDictionary && (
              <div
                className="inline-flex items-center border border-neutral-200/90 dark:border-neutral-700/80 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 p-0.5 shrink-0 shadow-2xs backdrop-blur-xs"
                role="group"
                aria-label="Word dictionary selection"
              >
                {(['english-1k', 'english-5k', 'english-200'] as const).map((dictId) => {
                  const isSelected = dictionary === dictId;
                  const label = dictId === 'english-1k' ? '1k' : dictId === 'english-5k' ? '5k' : '200';
                  const title =
                    dictId === 'english-1k'
                      ? 'Standard 1,000 words (Default)'
                      : dictId === 'english-5k'
                      ? 'Extended 5,000 words'
                      : 'Core 200 words';
                  return (
                    <button
                      key={dictId}
                      type="button"
                      onClick={() => onSelectDictionary(dictId)}
                      aria-pressed={isSelected}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                      }`}
                      title={`Dictionary: ${title}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Group 3: Timed Durations */}
            <div className="inline-flex items-center border border-neutral-200/90 dark:border-neutral-700/80 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 p-0.5 shrink-0 shadow-2xs backdrop-blur-xs">
              {[15, 30, 60, 120].map((dur) => {
                const isSelected = (selectedDuration || initialTime || 30) === dur;
                return (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => onSelectDuration?.(dur)}
                    aria-label={`${dur} seconds speed test duration`}
                    className={`px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-mono font-medium rounded-md active:scale-95 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-2xs font-bold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                    }`}
                    title={`${dur}s speed test ${dur === 30 ? '(Default)' : ''}`}
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
        ) : mode === 'quotes' ? (
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0 max-w-full">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5 shrink-0 pr-1">
              <Quote className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Quotes</span>
            </span>

            {/* Outside toggles for Capitals and Punctuation in Quotes mode */}
            <div className="inline-flex items-center border border-neutral-200/90 dark:border-neutral-700/80 rounded-lg bg-neutral-100/70 dark:bg-neutral-800/60 p-0.5 shrink-0 shadow-2xs backdrop-blur-xs">
              {onToggleCapitals && (
                <button
                  type="button"
                  onClick={onToggleCapitals}
                  aria-pressed={capitals}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                    capitals
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                  }`}
                  title="Toggle capital letters in quotes (default: OFF)"
                >
                  <span className="font-bold">Aa</span>
                  <span className="hidden sm:inline">capitals</span>
                </button>
              )}
              {onTogglePunctuation && (
                <button
                  type="button"
                  onClick={onTogglePunctuation}
                  aria-pressed={punctuation}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 ${
                    punctuation
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-bold shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                  }`}
                  title="Toggle punctuation in quotes (default: OFF)"
                >
                  <span className="font-bold">@</span>
                  <span className="hidden sm:inline">punctuation</span>
                </button>
              )}
              {onRestoreDefaults && (
                <button
                  type="button"
                  onClick={onRestoreDefaults}
                  aria-label="Restore default quote settings"
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-md active:scale-95 transition-all cursor-pointer flex items-center gap-1 group ${
                    !isDefaultSettings
                      ? 'text-amber-700 dark:text-amber-300 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/40'
                  }`}
                  title="Restore default quote settings (only small letters, no punctuation, all categories)"
                >
                  <RotateCcw className="w-3 h-3 transition-transform duration-300 group-hover:-rotate-90 group-active:rotate-180" aria-hidden="true" />
                  <span>default</span>
                  {!isDefaultSettings && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ml-0.5" title="Settings modified from default" />
                  )}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Code</span>
            </span>
          </div>
        )}
      </div>

      {/* ─── LIVE METRICS: TIME, WPM, ACC, COMBO ─── */}
      <div className="flex items-center gap-2.5 sm:gap-4 md:gap-5 shrink-0 justify-between sm:justify-end w-full sm:w-auto font-mono text-xs sm:text-sm border-t border-neutral-100 dark:border-neutral-800/60 sm:border-t-0 pt-1.5 sm:pt-0 mt-0.5 sm:mt-0">
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
          <span
            className={`font-semibold transition-all duration-150 inline-block font-mono ${
              combo >= 25
                ? 'text-neutral-950 dark:text-white font-extrabold scale-110 drop-shadow-xs'
                : combo >= 10
                ? 'text-neutral-900 dark:text-neutral-100 font-bold scale-105'
                : 'text-neutral-900 dark:text-neutral-100'
            }`}
          >
            {combo}x
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(GameStatsComponent);
