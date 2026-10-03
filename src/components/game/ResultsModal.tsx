import { createPortal } from 'react-dom';
import { Check, X, ArrowRight } from 'lucide-react';
import type { LevelConfig } from '../../data/levels';
import type { GameStatus, GameMode } from '../../hooks/useTypingGame';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  status: GameStatus;
  mode?: GameMode;
  levelConfig?: LevelConfig;
  modeLabel?: string;
  onNextLevel?: () => void;
  onRetry: () => void;
  onOpenCustomModal?: () => void;
}

export default function ResultsModal({
  wpm,
  accuracy,
  maxCombo,
  status,
  mode = 'lesson',
  levelConfig,
  modeLabel,
  onNextLevel,
  onRetry,
  onOpenCustomModal,
}: ResultsModalProps) {
  const isLesson = mode === 'lesson';
  const isPassed = status === 'passed';

  const getTitle = () => {
    if (isLesson) {
      return isPassed
        ? `Level ${levelConfig?.level || 1} Cleared`
        : 'Keep Practicing';
    }
    if (mode === 'timed') return 'Test Complete';
    if (mode === 'quotes') return 'Quote Complete';
    if (mode === 'code') return 'Snippet Complete';
    return 'Practice Complete';
  };

  const getSubtitle = () => {
    if (isLesson) {
      return isPassed
        ? 'You met the target requirements for this level.'
        : 'Focus on accuracy first, speed will follow.';
    }
    if (mode === 'timed') {
      return `Results for your ${modeLabel || 'timed'} session.`;
    }
    if (mode === 'quotes') return 'Great job! Ready for the next quote?';
    if (mode === 'code') return 'Nice! Practice more code to improve symbol speed.';
    return 'You finished typing the custom text.';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="w-full max-w-sm mx-auto p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center shadow-2xl transition-colors">
        <h2 id="results-modal-title" className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          {getTitle()}
        </h2>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5">{getSubtitle()}</p>

        <div className="space-y-2 mb-5 text-sm">
          <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-neutral-600 dark:text-neutral-400">Speed</span>
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
              {wpm} wpm
              {isLesson && levelConfig && (
                <span className="text-xs text-neutral-600 dark:text-neutral-400 ml-1">
                  / {levelConfig.targetWpm}
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-800">
            <span className="text-neutral-600 dark:text-neutral-400">Accuracy</span>
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
              {accuracy}%
              {isLesson && levelConfig && (
                <span className="text-xs text-neutral-600 dark:text-neutral-400 ml-1">
                  / {levelConfig.targetAccuracy}%
                </span>
              )}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-neutral-600 dark:text-neutral-400">Best Combo</span>
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100">
              {maxCombo}x
            </span>
          </div>
        </div>

        {/* Level Requirement Notice */}
        {isLesson && levelConfig && (
          <div className="mb-4">
            {isPassed ? (
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 shrink-0 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
                <span>
                  <span className="font-semibold">Level {levelConfig.level} Cleared!</span>{' '}
                  {levelConfig.level < 50
                    ? `Level ${levelConfig.level + 1} is now unlocked.`
                    : 'Congratulations! You have completed all 50 levels!'}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-dashed border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                <X className="w-4 h-4 shrink-0 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
                <span>
                  <span className="font-semibold">Requirements Not Met.</span> Target:{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">{levelConfig.targetWpm} WPM</span> &{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">{levelConfig.targetAccuracy}% Accuracy</span>.
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRetry}
            aria-label={isLesson && !isPassed ? 'Try this level again (Shortcut: R)' : 'Retry typing session (Shortcut: R)'}
            className={`${
              isLesson && !isPassed ? 'w-full' : 'flex-1'
            } py-2.5 px-4 ${
              isLesson && !isPassed
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90'
                : 'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            } font-medium rounded-lg text-sm cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white`}
          >
            {isLesson && !isPassed ? 'Try Again' : 'Retry'}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded" aria-hidden="true">
              R
            </kbd>
          </button>

          {isLesson && isPassed && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              aria-label={levelConfig && levelConfig.level >= 50 ? 'All 50 levels completed' : `Proceed to next level ${levelConfig ? levelConfig.level + 1 : ''} (Shortcut: Enter)`}
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium rounded-lg text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              {levelConfig && levelConfig.level >= 50 ? (
                <span className="flex items-center gap-1.5">
                  All Done <Check className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Next Level <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              )}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 dark:bg-neutral-300 text-white dark:text-neutral-900 rounded" aria-hidden="true">
                ↵
              </kbd>
            </button>
          )}

          {!isLesson && mode === 'custom' && onOpenCustomModal && (
            <button
              type="button"
              onClick={onOpenCustomModal}
              aria-label="Open custom text editor"
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-lg text-sm cursor-pointer hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              Edit Text
            </button>
          )}

          {!isLesson && mode !== 'custom' && (
            <button
              type="button"
              onClick={onRetry}
              aria-label={
                mode === 'quotes'
                  ? 'Proceed to next quote (Shortcut: Enter)'
                  : mode === 'code'
                  ? 'Proceed to next code snippet (Shortcut: Enter)'
                  : 'Proceed to next test (Shortcut: Enter)'
              }
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-lg text-sm cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              {mode === 'quotes' ? 'Next Quote' : mode === 'code' ? 'Next Snippet' : 'Next'}
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded" aria-hidden="true">
                ↵
              </kbd>
            </button>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400">
          {isLesson && !isPassed ? (
            <span>Press <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-[10px]">R</kbd> to retry</span>
          ) : (
            <span>Press <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded text-[10px]">R</kbd> to continue</span>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
