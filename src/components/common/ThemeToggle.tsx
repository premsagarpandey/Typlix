import { motion } from 'framer-motion';
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
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
          isDark ? 'bg-neutral-600' : 'bg-neutral-300'
        } ${className}`}
      >
        <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`flex items-center justify-center h-3.5 w-3.5 rounded-full bg-white dark:bg-neutral-900 shadow-sm transform ${
            isDark ? 'translate-x-[18px]' : 'translate-x-[3px]'
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-1.5 rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -30, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.15 }}
      >
        {isDark ? (
          <Sun className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Moon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
        )}
      </motion.div>
    </button>
  );
}
