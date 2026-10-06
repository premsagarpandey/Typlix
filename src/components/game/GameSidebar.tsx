import { memo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Timer,
  Quote,
  Code,
  Pencil,
  RotateCcw,
  LayoutGrid,
  Keyboard,
  Target,
  Lightbulb,
  Lock,
  ChevronLeft,
} from 'lucide-react';
import type { GameMode } from '../../hooks/useTypingGame';
import { getLevelConfig } from '../../data/levels';
import { QUOTE_CATEGORIES } from '../../data/quotes';
import type { QuoteCategory, Difficulty } from '../../data/quotes';
import { CODE_LANGUAGES } from '../../data/codeSnippets';
import type { CodeLanguage } from '../../data/codeSnippets';
import { DICTIONARY_LIST, type DictionaryType } from '../../data/words';

const LEVEL_OPTIONS = Array.from({ length: 50 }, (_, i) => {
  const lvl = i + 1;
  const conf = getLevelConfig(lvl);
  return {
    level: lvl,
    title: conf.title,
    category: conf.category,
  };
});

const TIMED_DURATIONS = [15, 30, 60, 120];
const DIFFICULTIES: (Difficulty | null)[] = [null, 'easy', 'medium', 'hard'];


interface GameSidebarProps {
  mode: GameMode;
  setIsSidebarOpen: (open: boolean) => void;
  currentLevel: number;
  maxUnlockedLevel?: number;
  levelConfig: ReturnType<typeof getLevelConfig>;
  handleSelectLevel: (lvl: number) => void;
  handlePrevLevel: () => void;
  handleNextLevel: () => void;
  handleRetry: () => void;
  showVirtualKeyboard: boolean;
  setShowVirtualKeyboard: (show: boolean) => void;
  timedDuration: number;
  handleSelectTimedDuration: (dur: number) => void;
  dictionary?: DictionaryType;
  handleDictionaryChange?: (dict: DictionaryType) => void;
  quoteCategory: QuoteCategory | null;
  handleQuoteCategoryChange: (cat: QuoteCategory | null) => void;
  quoteDifficulty: Difficulty | null;
  handleQuoteDifficultyChange: (diff: Difficulty | null) => void;
  codeLanguage: CodeLanguage | null;
  handleCodeLanguageChange: (lang: CodeLanguage | null) => void;
  codeDifficulty: Difficulty | null;
  handleCodeDifficultyChange: (diff: Difficulty | null) => void;
  currentSnippetInfo: { language?: string; title?: string; description?: string };
  customText: string;
  customTimeLimit: number;
  setIsCustomModalOpen: (open: boolean) => void;
}

function GameSidebarComponent({
  mode,
  setIsSidebarOpen,
  currentLevel,
  maxUnlockedLevel = 1,
  levelConfig,
  handleSelectLevel,
  handlePrevLevel,
  handleNextLevel,
  handleRetry,
  showVirtualKeyboard,
  setShowVirtualKeyboard,
  timedDuration,
  handleSelectTimedDuration,
  dictionary = 'english-1k',
  handleDictionaryChange,
  quoteCategory,
  handleQuoteCategoryChange,
  quoteDifficulty,
  handleQuoteDifficultyChange,
  codeLanguage,
  handleCodeLanguageChange,
  codeDifficulty,
  handleCodeDifficultyChange,
  currentSnippetInfo,
  customText,
  customTimeLimit,
  setIsCustomModalOpen,
}: GameSidebarProps) {
  return (
        <aside className="w-full md:w-72 lg:w-80 xl:w-84 shrink-0 flex flex-col justify-between bg-white dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-4.5 shadow-xs overflow-y-auto animate-fade-in">
          {/* ─── Mode: Lesson ─── */}
          {mode === 'lesson' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                {/* Header Badges & Hide Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Lesson</span>
                    </span>
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider">
                      {levelConfig.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Hide lesson sidebar panel"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {/* Level Title */}
                <div>
                  <span className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Current Lesson
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-snug">
                    Level {currentLevel}: {levelConfig.title}
                  </h2>
                </div>

                {/* Target Goals Card */}
                <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl space-y-1.5">
                  <div className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                    Target Goals
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                      <span>Target Speed</span>
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {levelConfig.targetWpm} WPM
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                      <span>Min Accuracy</span>
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {levelConfig.targetAccuracy}%
                    </span>
                  </div>
                </div>

                {/* Lesson Instructions */}
                <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" aria-hidden="true" />
                    <span>Instruction</span>
                  </span>
                  {levelConfig.instruction}
                </div>
              </div>

              {/* Navigation & Action Controls */}
              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                {/* Level Dropdown with Locked Levels */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="sidebar-lesson-select" className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block cursor-pointer">
                      Select Level
                    </label>
                    <span className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400">
                      Unlocked: {maxUnlockedLevel}/50
                    </span>
                  </div>
                  <select
                    id="sidebar-lesson-select"
                    aria-label="Select typing lesson level"
                    value={currentLevel}
                    onChange={(e) => handleSelectLevel(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/90 text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                  >
                    {LEVEL_OPTIONS.map((item) => {
                      const isLocked = item.level > maxUnlockedLevel;
                      return (
                        <option
                          key={item.level}
                          value={item.level}
                          disabled={isLocked}
                          className={isLocked ? 'text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900' : 'bg-white dark:bg-neutral-900'}
                        >
                          {isLocked ? `🔒 Level ${item.level} (Locked)` : `${item.level}. ${item.title}`}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Prev / Next Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handlePrevLevel}
                    disabled={currentLevel <= 1}
                    aria-label={`Go to previous lesson (Level ${currentLevel - 1})`}
                    className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-700 dark:text-neutral-300 text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    title={currentLevel > 1 ? 'Go to previous level' : 'First level'}
                  >
                    <span aria-hidden="true">◀</span> Prev
                  </button>
                  <button
                    onClick={handleNextLevel}
                    disabled={currentLevel >= maxUnlockedLevel}
                    aria-label={`Go to next lesson (Level ${currentLevel + 1})`}
                    className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-neutral-700 dark:text-neutral-300 text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    title={currentLevel >= maxUnlockedLevel ? 'Clear this level first to unlock the next level' : 'Go to next level'}
                  >
                    Next <span aria-hidden="true">▶</span>
                  </button>
                </div>

                {/* Lock notice when on the highest unlocked level */}
                {currentLevel >= maxUnlockedLevel && currentLevel < 50 && (
                  <div className="text-[11px] text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-2.5 py-1 rounded-md text-center font-medium flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>Clear Level {currentLevel} to unlock Level {currentLevel + 1}</span>
                  </div>
                )}

                {/* Restart & Switch Modes */}
                <div className="flex gap-2">
                  <button
                    onClick={handleRetry}
                    aria-label="Restart current lesson test"
                    className="flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                  <Link
                    to="/"
                    aria-label="Back to home screen to switch typing modes"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    title="Back to Home to switch modes"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Modes</span>
                  </Link>
                </div>

                {/* Keyboard Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  aria-label={showVirtualKeyboard ? 'Hide virtual on-screen keyboard' : 'Show virtual on-screen keyboard'}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  title="Toggle on-screen virtual keyboard"
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Timed ─── */}
          {mode === 'timed' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    <Timer className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Timed</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Hide timed sidebar panel"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                    title="Hide this panel"
                  >
                    <span className="text-[11px]">Hide</span>
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Speed Test — {timedDuration}s
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Type as fast as you can before time runs out. Maintain high rhythm and accuracy.
                  </p>
                </div>

                {/* Duration Options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                    Select Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Speed test duration selection">
                    {TIMED_DURATIONS.map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        role="radio"
                        aria-checked={timedDuration === dur}
                        aria-label={`${dur} seconds speed test duration`}
                        onClick={() => handleSelectTimedDuration(dur)}
                        className={`py-2 px-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          timedDuration === dur
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-xs'
                            : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Word Bank Dictionary Options */}
                {handleDictionaryChange && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                      Word Bank Dictionary
                    </label>
                    <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Word bank dictionary selection">
                      {DICTIONARY_LIST.map((dict) => {
                        const isChecked = dictionary === dict.id;
                        return (
                          <button
                            key={dict.id}
                            type="button"
                            role="radio"
                            aria-checked={isChecked}
                            aria-label={`${dict.name} (${dict.wordCount} words)`}
                            onClick={() => handleDictionaryChange(dict.id)}
                            className={`py-1.5 px-1 text-xs rounded-lg border transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                              isChecked
                                ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 shadow-xs font-semibold'
                                : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            <span className="font-mono font-bold text-xs">{dict.badge}</span>
                            <span className="text-[10px] opacity-75">{dict.wordCount}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                      {DICTIONARY_LIST.find((d) => d.id === dictionary)?.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={handleRetry}
                  aria-label="Restart speed test session"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center flex items-center justify-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Restart Test</span>
                </button>
                <Link
                  to="/"
                  aria-label="Back to home screen to switch typing modes"
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <LayoutGrid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>Modes</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  aria-label={showVirtualKeyboard ? 'Hide virtual on-screen keyboard' : 'Show virtual on-screen keyboard'}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Quotes ─── */}
          {mode === 'quotes' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      <Quote className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Quotes</span>
                    </span>
                    {quoteCategory && (
                      <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium uppercase tracking-wider">
                        {quoteCategory}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Hide sidebar panel"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <span className="text-[11px]">Hide</span>
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Famous Quotes
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Type inspiring passages from great thinkers, authors, and movies.
                  </p>
                </div>

                {/* Category Filter */}
                <div className="space-y-1">
                  <span id="quote-category-label" className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                    Category
                  </span>
                  <div role="group" aria-labelledby="quote-category-label" className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      aria-pressed={quoteCategory === null}
                      aria-label="Show quotes from all categories"
                      onClick={() => handleQuoteCategoryChange(null)}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                        quoteCategory === null
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      All
                    </button>
                    {QUOTE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={quoteCategory === cat}
                        aria-label={`Filter quotes by category: ${cat}`}
                        onClick={() => handleQuoteCategoryChange(cat)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          quoteCategory === cat
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-1">
                  <span id="quote-difficulty-label" className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                    Difficulty
                  </span>
                  <div role="group" aria-labelledby="quote-difficulty-label" className="flex flex-wrap gap-1">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff || 'all'}
                        type="button"
                        aria-pressed={quoteDifficulty === diff}
                        aria-label={`Filter quotes by difficulty: ${diff || 'all'}`}
                        onClick={() => handleQuoteDifficultyChange(diff)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          quoteDifficulty === diff
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {diff || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleRetry}
                  aria-label="Load next quote"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  Next Quote
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    aria-label="Restart current quote"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                  <Link
                    to="/"
                    aria-label="Back to home screen to switch typing modes"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Modes</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  aria-label={showVirtualKeyboard ? 'Hide virtual on-screen keyboard' : 'Show virtual on-screen keyboard'}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Code ─── */}
          {mode === 'code' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                      <Code className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Code</span>
                    </span>
                    {currentSnippetInfo.language && (
                      <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                        {currentSnippetInfo.language}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Hide sidebar panel"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <span className="text-[11px]">Hide</span>
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {currentSnippetInfo.title || 'Code Snippets'}
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    {currentSnippetInfo.description || 'Practice typing real-world code with special characters.'}
                  </p>
                </div>

                {/* Language Filter */}
                <div className="space-y-1">
                  <span id="code-language-label" className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                    Language
                  </span>
                  <div role="group" aria-labelledby="code-language-label" className="flex flex-wrap gap-1">
                    <button
                      type="button"
                      aria-pressed={codeLanguage === null}
                      aria-label="Show code snippets for all languages"
                      onClick={() => handleCodeLanguageChange(null)}
                      className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                        codeLanguage === null
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      All
                    </button>
                    {CODE_LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        aria-pressed={codeLanguage === lang}
                        aria-label={`Filter code snippets by language: ${lang}`}
                        onClick={() => handleCodeLanguageChange(lang)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          codeLanguage === lang
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-1">
                  <span id="code-difficulty-label" className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider block">
                    Difficulty
                  </span>
                  <div role="group" aria-labelledby="code-difficulty-label" className="flex flex-wrap gap-1">
                    {DIFFICULTIES.map((diff) => (
                      <button
                        key={diff || 'all'}
                        type="button"
                        aria-pressed={codeDifficulty === diff}
                        aria-label={`Filter code snippets by difficulty: ${diff || 'all'}`}
                        onClick={() => handleCodeDifficultyChange(diff)}
                        className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                          codeDifficulty === diff
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {diff || 'All'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleRetry}
                  aria-label="Load next code snippet"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  Next Snippet
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    aria-label="Restart current code snippet"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                  <Link
                    to="/"
                    aria-label="Back to home screen to switch typing modes"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Modes</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  aria-label={showVirtualKeyboard ? 'Hide virtual on-screen keyboard' : 'Show virtual on-screen keyboard'}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ─── Mode: Custom ─── */}
          {mode === 'custom' && (
            <div className="flex flex-col h-full justify-between gap-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Custom</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-label="Hide sidebar panel"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <span className="text-[11px]">Hide</span>
                    <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                    Custom Text
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                    Practice with custom passages, quotes, or exercises.
                  </p>
                </div>

                <div className="p-3 bg-neutral-100/70 dark:bg-neutral-800/50 border border-neutral-200/80 dark:border-neutral-700/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Words</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customText.trim().split(/\s+/).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Characters</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customText.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">Time Limit</span>
                    <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">
                      {customTimeLimit > 0 ? `${customTimeLimit}s` : 'No limit'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2.5 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(true)}
                  aria-label="Open custom text editor"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:opacity-90 cursor-pointer transition-all text-center shadow-xs flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Edit Text</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleRetry}
                    aria-label="Restart custom text session"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Restart</span>
                  </button>
                  <Link
                    to="/"
                    aria-label="Back to home screen to switch typing modes"
                    className="py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Modes</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                  aria-label={showVirtualKeyboard ? 'Hide virtual on-screen keyboard' : 'Show virtual on-screen keyboard'}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors text-center flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                >
                  <Keyboard className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}</span>
                </button>
              </div>
            </div>
          )}
        </aside>
  );
}

export default memo(GameSidebarComponent);
