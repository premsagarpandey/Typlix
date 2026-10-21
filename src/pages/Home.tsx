import { useState, useEffect, lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Keyboard, Timer, BarChart2, BookOpen, Quote, Code, Pencil, Download, RefreshCw, User, Mail, ArrowRight } from 'lucide-react';
import FingerPlacementTutorial from '../components/common/FingerPlacementTutorial';
import SeoContentSection from '../components/common/SeoContentSection';
import { useUserProgress } from '../hooks/useUserProgress';
import { useIsMobile } from '../hooks/useIsMobile';
import { usePwaInstall } from '../hooks/usePwaInstall';

const FingerPlacementModal = lazy(() => import('../components/common/FingerPlacementModal'));

export default function Home() {
  const navigate = useNavigate();
  const [showPlacementModal, setShowPlacementModal] = useState(false);
  const { level: currentLevel, summary } = useUserProgress();
  const isMobile = useIsMobile();
  const { isInstalled, installApp, hasAppUpdate, isUpdating, updateApp } = usePwaInstall();
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleStartLesson = () => {
    try {
      localStorage.setItem('typlix_game_mode', JSON.stringify('lesson'));
    } catch {}

    // On mobile, skip the finger placement guide (it's for physical keyboards)
    if (isMobile) {
      navigate('/game?mode=lesson');
      return;
    }

    const skipGuide = localStorage.getItem('typlix_skip_finger_guide') === 'true';
    if (skipGuide) {
      navigate('/game?mode=lesson');
    } else {
      setShowPlacementModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pt-8 sm:pt-16 pb-4 sm:pb-6 animate-fade-in px-1 sm:px-0">
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-3 sm:mb-4 leading-tight">
        {isInstalled ? 'Typlix Touch Typing' : 'Typlix Typing: Modern Typing Speed Test & Practice Game'}
      </h1>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-lg mb-6 sm:mb-10 max-w-xl leading-relaxed px-1 sm:px-0">
        {isInstalled
          ? 'Master 10-finger muscle memory with 50 progressive touch typing lessons, developer code syntax, and real-time accuracy benchmarks.'
          : 'Welcome to Typlix Typing — accelerate your typing speed with 50 progressive touch typing lessons, developer code typing, and precision speed tests. Also searched as Typelix Typing — 100% free with real-time WPM metrics.'}
      </p>

      {/* ─── Mobile View (< sm): Differentiated App vs Website Experience ─── */}
      {isInstalled ? (
        /* ─── APP-ONLY MOBILE ACTION CENTER: Large, Ergonomic, Monochromatic Touch Buttons ─── */
        <div className="flex flex-col gap-3.5 w-full max-w-sm mx-auto sm:hidden mb-8 sm:mb-16 px-1">
          {/* Minimalist Monochromatic App Status Pill */}
          <div className="inline-flex items-center justify-between px-3.5 py-1.5 rounded-full bg-neutral-200/60 dark:bg-neutral-800/60 border border-neutral-300/70 dark:border-neutral-700/70 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 shadow-2xs">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
              <span>{isOnline ? 'Offline Ready Engine' : 'Offline Mode Active'}</span>
            </span>
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Lesson {currentLevel}/50
            </span>
          </div>

          {/* Primary Hero Card: Continue Lesson / Start Lesson 1 (Large Tap Target) */}
          <button
            type="button"
            onClick={handleStartLesson}
            aria-label={currentLevel > 1 ? `Continue typing practice at Lesson ${currentLevel}` : 'Start touch typing Lesson 1'}
            className="w-full p-4 sm:p-5 rounded-2xl bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-150 text-white dark:text-neutral-900 shadow-md cursor-pointer flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white/15 dark:bg-neutral-900/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6 shrink-0" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight truncate leading-tight">
                  {currentLevel > 1 ? `Continue Lesson ${currentLevel}` : 'Start Touch Typing — Lesson 1'}
                </p>
                <p className="text-xs opacity-85 mt-1 font-medium truncate">
                  10-Finger Muscle Memory · Finger Guides
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 dark:bg-neutral-900/10 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>
          </button>

          {/* Secondary Hero Card: Timed Speed Test (Large Tap Target) */}
          <Link
            to="/game?mode=timed"
            aria-label="Start Speed Test timed typing session"
            onClick={() => {
              try {
                localStorage.setItem('typlix_game_mode', JSON.stringify('timed'));
              } catch {}
            }}
            className="w-full p-4 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-[0.98] transition-all duration-150 text-neutral-900 dark:text-neutral-100 shadow-2xs cursor-pointer flex items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Timer className="w-5 h-5 text-neutral-900 dark:text-neutral-100 shrink-0" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                  Timed Speed Test
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                  Benchmark live typing speed (WPM) &amp; accuracy
                </p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:translate-x-0.5 group-active:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            </div>
          </Link>

          {/* Secondary Modes Grid: Code, Quotes, Custom (3 Large Thumb-Friendly App Tiles) */}
          <div className="grid grid-cols-3 gap-2.5 w-full">
            <Link
              to="/game?mode=code"
              aria-label="Practice typing code snippets"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('code'));
                } catch {}
              }}
              className="p-3 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/90 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-[0.96] transition-all duration-150 flex flex-col items-center justify-center text-center gap-1.5 shadow-2xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-h-[84px]"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Code className="w-5 h-5 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                Code
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                9 Languages
              </span>
            </Link>

            <Link
              to="/game?mode=quotes"
              aria-label="Practice typing famous quotes"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('quotes'));
                } catch {}
              }}
              className="p-3 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/90 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-[0.96] transition-all duration-150 flex flex-col items-center justify-center text-center gap-1.5 shadow-2xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-h-[84px]"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Quote className="w-5 h-5 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                Quotes
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Wisdom
              </span>
            </Link>

            <Link
              to="/game?mode=custom"
              aria-label="Practice typing custom text or exercises"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('custom'));
                } catch {}
              }}
              className="p-3 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900/90 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-[0.96] transition-all duration-150 flex flex-col items-center justify-center text-center gap-1.5 shadow-2xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-h-[84px]"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Pencil className="w-5 h-5 text-neutral-900 dark:text-neutral-100" aria-hidden="true" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                Custom
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                Your Text
              </span>
            </Link>
          </div>

          {/* In-App Update Button (< sm only) - Shown ONLY inside the installed app when update is ready */}
          {hasAppUpdate && (
            <div
              onClick={updateApp}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateApp();
                }
              }}
              className="w-full mt-1 p-3 px-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100/90 hover:bg-neutral-200/90 dark:bg-neutral-900 dark:hover:bg-neutral-850 active:scale-[0.98] transition-all duration-100 flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              aria-label="New Typlix update ready. Tap to install update."
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src="/logo192.png"
                    alt="Typlix"
                    width="32"
                    height="32"
                    className="w-8 h-8 rounded-lg object-contain shadow-2xs group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 dark:bg-neutral-100 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-900 dark:bg-neutral-100"></span>
                  </span>
                </div>
                <div className="min-w-0 text-left">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                      Update Typlix App
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 border border-neutral-900/15 dark:border-neutral-100/15">
                      New
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    New version ready · Tap to update
                  </p>
                </div>
              </div>
              <div className="shrink-0 pl-1">
                <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs flex items-center gap-1.5 group-hover:opacity-90 transition-opacity">
                  <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
                  <span>{isUpdating ? 'Updating...' : 'Update'}</span>
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── WEBSITE-ONLY MOBILE VIEW (< sm): Clean Symmetrical Monochromatic Layout ─── */
        <div className="flex flex-col gap-2.5 w-full max-w-sm mx-auto sm:hidden mb-8 sm:mb-16 px-1">
          {/* Row 1: The Two Flagship Black CTAs (Equal 50/50 columns) */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={handleStartLesson}
              aria-label={currentLevel > 1 ? `Continue typing practice at Lesson ${currentLevel}` : 'Start touch typing Lesson 1'}
              className="flex items-center justify-center gap-1.5 px-3 py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-100 text-white dark:text-neutral-900 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-w-0"
            >
              <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{currentLevel > 1 ? `Continue Lesson ${currentLevel}` : 'Start Lesson 1'}</span>
            </button>

            <Link
              to="/game?mode=timed"
              aria-label="Start Speed Test timed typing session"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('timed'));
                } catch {}
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-100 text-white dark:text-neutral-900 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-w-0"
            >
              <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Speed Test</span>
            </Link>
          </div>

          {/* Row 2: The Three Secondary White Practice Modes (Equal 33.3% columns) */}
          <div className="grid grid-cols-3 gap-2 w-full">
            <Link
              to="/game?mode=code"
              aria-label="Practice typing code snippets"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('code'));
                } catch {}
              }}
              className="flex items-center justify-center gap-1.5 px-2 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg transition-all duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-w-0"
            >
              <Code className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Code</span>
            </Link>

            <Link
              to="/game?mode=quotes"
              aria-label="Practice typing famous quotes"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('quotes'));
                } catch {}
              }}
              className="flex items-center justify-center gap-1.5 px-2 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg transition-all duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-w-0"
            >
              <Quote className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Quotes</span>
            </Link>

            <Link
              to="/game?mode=custom"
              aria-label="Practice typing custom text or exercises"
              onClick={() => {
                try {
                  localStorage.setItem('typlix_game_mode', JSON.stringify('custom'));
                } catch {}
              }}
              className="flex items-center justify-center gap-1.5 px-2 py-2.5 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-xs font-medium rounded-lg transition-all duration-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white min-w-0"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">Custom</span>
            </Link>
          </div>

          {/* Native Mobile App Banner (< sm only) - For Website Visitors */}
          <div
            onClick={installApp}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                installApp();
              }
            }}
            className="w-full mt-1.5 p-2.5 px-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100/90 hover:bg-neutral-200/90 dark:bg-neutral-900 dark:hover:bg-neutral-850 active:scale-[0.98] transition-all duration-100 flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            aria-label="Add Typlix to Home Screen for fullscreen distraction-free typing"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src="/logo192.png"
                alt="Typlix"
                width="32"
                height="32"
                className="w-8 h-8 rounded-lg object-contain shadow-2xs shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0 text-left">
                <p className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  Install Typlix App
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  Fast typing · Works offline
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-1">
              <span className="px-2.5 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs flex items-center gap-1 group-hover:opacity-90 transition-opacity">
                <Download className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Get App</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop & Laptop View (>= sm): Symmetrical Monochromatic Layout ─── */}
      <div className="hidden sm:flex sm:flex-col sm:items-center sm:justify-center mb-16 mx-auto w-full">
        {/* Desktop Installed PWA Update Banner */}
        {isInstalled && hasAppUpdate && (
          <div
            onClick={updateApp}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateApp();
              }
            }}
            className="w-full max-w-lg mb-4 p-2.5 px-3.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100/90 hover:bg-neutral-200/90 dark:bg-neutral-900 dark:hover:bg-neutral-850 active:scale-[0.98] transition-all duration-100 flex items-center justify-between gap-3 cursor-pointer shadow-2xs group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
            aria-label="New Typlix update ready. Tap to install update."
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="/logo192.png"
                  alt="Typlix"
                  width="28"
                  height="28"
                  className="w-7 h-7 rounded-lg object-contain shadow-2xs group-hover:scale-105 transition-transform"
                />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 dark:bg-neutral-100 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900 dark:bg-neutral-100"></span>
                </span>
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 truncate">
                    Update Typlix App
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-900 dark:text-neutral-100 border border-neutral-900/15 dark:border-neutral-100/15">
                    New Version
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  Tap to update to the latest version with new features &amp; speed fixes
                </p>
              </div>
            </div>
            <div className="shrink-0 pl-1">
              <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-xs flex items-center gap-1.5 group-hover:opacity-90 transition-opacity">
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span>{isUpdating ? 'Updating...' : 'Update App'}</span>
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 max-w-2xl items-center justify-center">
        {/* 1. Lessons Mode */}
        <button
          type="button"
          onClick={handleStartLesson}
          aria-label={currentLevel > 1 ? `Continue typing practice at Lesson ${currentLevel}` : 'Start touch typing Lesson 1'}
          className="inline-flex min-w-[170px] px-5 sm:px-6 py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-lg cursor-pointer items-center justify-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        >
          <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{currentLevel > 1 ? `Continue Lesson ${currentLevel}` : 'Start Lesson 1'}</span>
        </button>

        {/* 2. Code Snippets Mode */}
        <Link
          to="/game?mode=code"
          aria-label="Practice typing code snippets"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('code'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all duration-100 cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        >
          <Code className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Code</span>
        </Link>

        {/* 3. Quotes Mode */}
        <Link
          to="/game?mode=quotes"
          aria-label="Practice typing famous quotes"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('quotes'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all duration-100 cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        >
          <Quote className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Quotes</span>
        </Link>

        {/* 4. Speed Test */}
        <Link
          to="/game?mode=timed"
          aria-label="Start Speed Test timed typing session"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('timed'));
            } catch {}
          }}
          className="inline-flex min-w-[170px] px-5 sm:px-6 py-3 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-lg cursor-pointer items-center justify-center gap-2 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        >
          <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Speed Test</span>
        </Link>

        {/* 5. Custom Text Mode */}
        <Link
          to="/game?mode=custom"
          aria-label="Practice typing custom text or exercises"
          onClick={() => {
            try {
              localStorage.setItem('typlix_game_mode', JSON.stringify('custom'));
            } catch {}
          }}
          className="px-4 sm:px-5 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-100/70 dark:hover:bg-neutral-900/70 active:scale-[0.98] text-neutral-700 dark:text-neutral-300 text-sm font-medium rounded-lg transition-all duration-100 cursor-pointer flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
        >
          <Pencil className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Custom</span>
        </Link>
        </div>
      </div>

      {/* Finger Placement Modal (Loaded on-demand) */}
      {showPlacementModal && (
        <Suspense fallback={null}>
          <FingerPlacementModal
            isOpen={showPlacementModal}
            onClose={() => setShowPlacementModal(false)}
            targetPath="/game?mode=lesson"
            durationSeconds={3}
          />
        </Suspense>
      )}

      {/* ─── Website-Only Content (Strictly for web visitors and search crawlers) ─── */}
      {!isInstalled && (
        <>
          {/* Feature Highlights Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden shadow-2xs">
            <div className="group p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-950 text-left hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors duration-150">
              <Keyboard className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200 ease-out" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Finger Guides</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">Real-time hints for every keypress position.</p>
            </div>

            <div className="group p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-950 text-left hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors duration-150">
              <Timer className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200 ease-out" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Multiple Modes</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">Lessons, speed tests, quotes, code, and custom text.</p>
            </div>

            <div className="group p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-950 text-left hover:bg-neutral-100/60 dark:hover:bg-neutral-900/60 transition-colors duration-150">
              <BarChart2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200 ease-out" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm mb-1">Detailed Analytics</h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">Track your WPM, accuracy, and keystroke progression.</p>
            </div>
          </div>

          {/* Finger Placement Tutorial (desktop web only) */}
          {!isMobile && <FingerPlacementTutorial />}

          {/* SEO & Knowledge Section for Search Engines & AI Overviews (Website only) */}
          <SeoContentSection />
        </>
      )}

      {/* ─── App-Only Content (Streamlined, distraction-free native experience) ─── */}
      {isInstalled && (
        <div className="w-full space-y-4">
          {/* Quick Progress / Telemetry Card */}
          <div className="w-full p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-2xs text-left">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />
                <h2 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Your Typing Telemetry
                </h2>
              </div>
              <Link
                to="/stats"
                className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 transition-colors"
              >
                <span>Full Analytics</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Lesson</span>
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  {currentLevel} <span className="text-[10px] font-normal text-neutral-400">/50</span>
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Best WPM</span>
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  {summary.bestWpm > 0 ? summary.bestWpm : '—'}
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Accuracy</span>
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  {summary.avgAccuracy > 0 ? `${summary.avgAccuracy}%` : '—'}
                </span>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60">
                <span className="block text-[10px] text-neutral-500 uppercase font-semibold">Tests</span>
                <span className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  {summary.totalTests}
                </span>
              </div>
            </div>
          </div>

          {/* Dedicated About Developer Card */}
          <div className="w-full p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-2xs text-left">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="/logo192.png"
                  alt="Prem Sagar Pandey"
                  width="44"
                  height="44"
                  className="w-11 h-11 rounded-xl object-contain shadow-2xs shrink-0 border border-neutral-200/80 dark:border-neutral-800"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                      Prem Sagar Pandey
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      Developer
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                    Full Stack Software Engineer &amp; Creator of Typlix
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                <Link
                  to="/about"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 dark:bg-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] text-white dark:text-neutral-900 text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>About Developer</span>
                </Link>
                <a
                  href="mailto:premsagarpandey.cs@gmail.com"
                  aria-label="Send email to Prem Sagar Pandey"
                  className="p-2 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg transition-colors cursor-pointer"
                  title="Email Developer"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
