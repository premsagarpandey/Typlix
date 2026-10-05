import { createPortal } from 'react-dom';
import { Check, X, ArrowRight, Activity, Zap, Target, Gauge } from 'lucide-react';
import type { LevelConfig } from '../../data/levels';
import type { GameStatus, GameMode, SessionHistoryPoint } from '../../hooks/useTypingGame';
import SessionPerformanceGraph from '../stats/SessionPerformanceGraph';

interface ResultsModalProps {
  wpm: number;
  accuracy: number;
  maxCombo: number;
  status: GameStatus;
  mode?: GameMode;
  levelConfig?: LevelConfig;
  modeLabel?: string;
  rawWpm?: number;
  consistency?: number;
  history?: SessionHistoryPoint[];
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
  rawWpm = wpm,
  consistency = 100,
  history = [],
  onNextLevel,
  onRetry,
  onOpenCustomModal,
}: ResultsModalProps) {
  const isLesson = mode === 'lesson';
  const isPassed = status === 'passed';

  const getTitle = () => {
    if (isLesson) {
      return isPassed ? `Level ${levelConfig?.level || 1} Cleared` : 'Keep Practicing';
    }
    if (mode === 'timed') return 'Speed Test Complete';
    if (mode === 'quotes') return 'Quote Completed';
    if (mode === 'code') return 'Snippet Completed';
    return 'Practice Completed';
  };

  const getSubtitle = () => {
    if (isLesson) {
      return isPassed
        ? 'You met the target requirements for this level.'
        : 'Focus on accuracy first, speed will follow.';
    }
    if (mode === 'timed') {
      return `Results for your ${modeLabel || 'timed'} test session.`;
    }
    if (mode === 'quotes') return 'Great rhythm! Ready for the next quote?';
    if (mode === 'code') return 'Nice! Smooth typing improves syntax muscle memory.';
    return 'You finished typing the custom exercise.';
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="results-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="w-full max-w-lg mx-auto p-5 sm:p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-center shadow-2xl transition-colors max-h-[90vh] overflow-y-auto">
        <h2 id="results-modal-title" className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          {getTitle()}
        </h2>

        <p className="text-xs text-neutral-500 mb-4">{getSubtitle()}</p>

        {/* ─── Hero Key Metrics Grid (Monkeytype Style) ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {/* Net WPM */}
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Net WPM</span>
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
              {wpm}
            </div>
            {isLesson && levelConfig && (
              <span className="text-[10px] text-neutral-400">target: {levelConfig.targetWpm}</span>
            )}
          </div>

          {/* Accuracy */}
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Target className="w-3 h-3 text-purple-500" />
              <span>Accuracy</span>
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
              {accuracy}%
            </div>
            {isLesson && levelConfig && (
              <span className="text-[10px] text-neutral-400">target: {levelConfig.targetAccuracy}%</span>
            )}
          </div>

          {/* Raw WPM */}
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-sky-500" />
              <span>Raw WPM</span>
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
              {rawWpm}
            </div>
            <span className="text-[10px] text-neutral-400">burst speed</span>
          </div>

          {/* Consistency */}
          <div className="p-3 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Activity className="w-3 h-3 text-amber-500" />
              <span>Consistency</span>
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 font-mono mt-0.5">
              {consistency}%
            </div>
            <span className="text-[10px] text-neutral-400">{maxCombo}x combo</span>
          </div>
        </div>

        {/* ─── Session Performance Graph (Live Test Timeline) ─── */}
        {history.length > 0 && (
          <SessionPerformanceGraph history={history} />
        )}

        {/* Level Requirement Notice */}
        {isLesson && levelConfig && (
          <div className="my-3">
            {isPassed ? (
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 shrink-0 text-emerald-500" aria-hidden="true" />
                <span>
                  <span className="font-semibold">Level {levelConfig.level} Cleared!</span>{' '}
                  {levelConfig.level < 50
                    ? `Level ${levelConfig.level + 1} is now unlocked.`
                    : 'Congratulations! You have mastered all 50 curriculum levels!'}
                </span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-850 border border-dashed border-neutral-400 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 text-xs text-center font-medium flex items-center justify-center gap-1.5">
                <X className="w-4 h-4 shrink-0 text-red-500" aria-hidden="true" />
                <span>
                  <span className="font-semibold">Requirements Not Met.</span> Target:{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">{levelConfig.targetWpm} WPM</span> &{' '}
                  <span className="font-bold text-neutral-900 dark:text-white">{levelConfig.targetAccuracy}% Accuracy</span>.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={onRetry}
            aria-label="Retry typing session (Shortcut: R)"
            className={`${
              isLesson && !isPassed ? 'w-full' : 'flex-1'
            } py-2.5 px-4 ${
              isLesson && !isPassed
                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90'
                : 'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
            } font-medium rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2 transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white`}
          >
            <span>{isLesson && !isPassed ? 'Try Again' : 'Retry'}</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded">
              R
            </kbd>
          </button>

          {isLesson && isPassed && onNextLevel && (
            <button
              type="button"
              onClick={onNextLevel}
              aria-label="Proceed to next level (Shortcut: Enter)"
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 font-medium rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            >
              <span className="flex items-center gap-1.5">
                Next Level <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-800 dark:bg-neutral-300 text-white dark:text-neutral-900 rounded">
                ↵
              </kbd>
            </button>
          )}

          {!isLesson && mode === 'custom' && onOpenCustomModal && (
            <button
              type="button"
              onClick={onOpenCustomModal}
              aria-label="Open custom text editor"
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-xl text-sm cursor-pointer hover:opacity-90 transition-opacity"
            >
              Edit Text
            </button>
          )}

          {!isLesson && mode !== 'custom' && (
            <button
              type="button"
              onClick={onRetry}
              aria-label="Proceed to next test (Shortcut: Enter)"
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <span>{mode === 'quotes' ? 'Next Quote' : mode === 'code' ? 'Next Snippet' : 'Next Test'}</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/20 dark:bg-neutral-900/20 rounded">
                ↵
              </kbd>
            </button>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-400">
          <span>Press <kbd className="px-1 py-0.5 font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-[10px]">R</kbd> to continue</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
