import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, MoreVertical, Smartphone, Check } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function PwaInstallModal() {
  const { showGuideModal, setShowGuideModal, isIos } = usePwaInstall();

  return (
    <AnimatePresence>
      {showGuideModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowGuideModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full sm:max-w-md bg-white dark:bg-neutral-900 border-t sm:border border-neutral-200 dark:border-neutral-800 rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl z-10 text-neutral-900 dark:text-neutral-100 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-extrabold text-sm flex items-center justify-center font-mono shadow-xs">
                T
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
                  Install Typlix App
                </h3>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  {isIos ? 'Follow 3 simple steps on iPhone' : 'Follow 3 simple steps on Android'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Close installation guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Guide Steps */}
          <div className="py-4 space-y-3.5">
            {isIos ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Tap the <Share className="w-3.5 h-3.5 inline text-blue-500" /> Share button
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Located at the bottom bar of Safari browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Select <PlusSquare className="w-3.5 h-3.5 inline text-neutral-800 dark:text-neutral-200" /> Add to Home Screen
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Scroll down in the share menu to find this option.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Tap <span className="font-bold underline">Add</span> on top right
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Typlix app icon will appear instantly on your home screen!
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Tap Chrome menu <MoreVertical className="w-3.5 h-3.5 inline text-neutral-800 dark:text-neutral-200" /> (3 dots)
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      At the top-right corner of Chrome browser.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Tap <Smartphone className="w-3.5 h-3.5 inline text-neutral-800 dark:text-neutral-200" /> "Install app" or "Add to Home screen"
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      Select this option from Chrome's dropdown menu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
                  <div className="w-7 h-7 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                      Tap <span className="font-bold underline">Install</span>
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5">
                      App will be downloaded and placed directly on your phone!
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Action */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Understood, Got It!</span>
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}
