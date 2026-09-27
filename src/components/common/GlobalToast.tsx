import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import type { ToastEventDetail } from '../../utils/toast';

export default function GlobalToast() {
  const [toasts, setToasts] = useState<ToastEventDetail[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastEventDetail>;
      if (!customEvent.detail) return;

      const newToast = customEvent.detail;
      setToasts((prev) => {
        // Keep at most 3 active toasts
        const filtered = prev.slice(-2);
        return [...filtered, newToast];
      });

      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
        }, newToast.duration);
      }
    };

    window.addEventListener('typlix-app-toast', handleToastEvent);
    return () => {
      window.removeEventListener('typlix-app-toast', handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      aria-live="assertive"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2.5 max-w-md w-[92vw] pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pointer-events-auto flex items-start gap-3 w-full p-4 rounded-xl shadow-2xl border backdrop-blur-xl bg-neutral-900/95 text-neutral-100 border-neutral-700 shadow-black/50"
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${
                  isError
                    ? 'bg-neutral-800 border-neutral-500 text-white'
                    : isSuccess
                    ? 'bg-white border-white text-neutral-950'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 text-white" />
                ) : isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
                ) : (
                  <Info className="w-4 h-4 text-neutral-300" />
                )}
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold tracking-wide uppercase text-white">
                    {toast.title || (isError ? 'Notice / Alert' : 'Notification')}
                  </span>
                </div>
                <p className="text-xs text-neutral-200 leading-relaxed font-sans font-medium">
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-neutral-400 hover:text-white rounded-md transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
