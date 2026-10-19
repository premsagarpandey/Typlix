import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function MobileInstallBanner() {
  const { isInstalled, isBannerDismissed, dismissBanner, installApp } = usePwaInstall();
  const location = useLocation();

  // Never show on desktop/PC (handled by sm:hidden), never if already installed or dismissed, and NEVER on game screen
  const isGameScreen = location.pathname.startsWith('/game');
  if (isInstalled || isBannerDismissed || isGameScreen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        aria-label="Install Typlix App promotion"
        className="fixed bottom-3 left-3 right-3 sm:hidden z-40"
      >
        <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-300/80 dark:border-neutral-750 rounded-2xl p-3 shadow-xl flex items-center justify-between gap-2.5">
          {/* Logo & Info */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-xs flex items-center justify-center font-mono shrink-0 shadow-xs">
              T
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                  Typlix App
                </span>
                <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-neutral-900/10 dark:bg-neutral-100/10 text-neutral-800 dark:text-neutral-200 shrink-0">
                  Free
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate mt-0.5">
                1-tap install · Practice anytime
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={installApp}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 active:scale-95 transition-all shadow-xs cursor-pointer"
              aria-label="Install Typlix application"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={dismissBanner}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
