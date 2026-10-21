import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  className?: string;
}

export default function ThemeToggle({ variant = 'button', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
          isDark ? 'bg-neutral-800 border border-neutral-700' : 'bg-neutral-200 border border-neutral-300'
        } ${className}`}
      >
        <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`flex items-center justify-center h-4 w-4 rounded-full bg-white dark:bg-neutral-100 shadow-sm text-neutral-800 transform ${
            isDark ? 'translate-x-[22px]' : 'translate-x-[3px]'
          }`}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 text-neutral-900" strokeWidth={2} />
          ) : (
            <Sun className="w-2.5 h-2.5 text-neutral-800" strokeWidth={2} />
          )}
        </motion.span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode (currently dark)' : 'Switch to dark mode (currently light)'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer 
        bg-white hover:bg-neutral-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 
        border border-neutral-200 dark:border-neutral-800 
        shadow-2xs hover:shadow-xs active:scale-95 
        text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-neutral-100 group-hover:rotate-45 transition-transform duration-200" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 group-hover:-rotate-12 transition-transform duration-200" strokeWidth={2} aria-hidden="true" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
