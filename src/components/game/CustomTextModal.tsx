import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck } from 'lucide-react';
import { PRESET_CUSTOM_TEXTS, type CustomPreset } from '../../data/words';
import { sanitizeCustomText } from '../../utils/textUtils';

interface CustomTextModalProps {
  isOpen: boolean;
  initialText: string;
  initialTimeLimit: number;
  onClose: () => void;
  onApply: (text: string, timeLimit: number) => void;
}

export default function CustomTextModal({
  isOpen,
  initialText,
  initialTimeLimit,
  onClose,
  onApply,
}: CustomTextModalProps) {
  const [text, setText] = useState(initialText || '');
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit || 60);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key & trap focus inside dialog (WCAG 2.4.3)
  useEffect(() => {
    if (!isOpen) return;

    const textarea = document.getElementById('custom-text-area');
    const timer = setTimeout(() => textarea?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSelectPreset = (preset: CustomPreset) => {
    setText(preset.text);
  };

  const handleStart = () => {
    const clean = sanitizeCustomText(text);
    if (!clean) return;
    onApply(clean, timeLimit);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-text-title"
        className="w-full max-w-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 sm:p-6 space-y-4 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <h3 id="custom-text-title" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            Custom Text
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close custom text dialog"
            className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 cursor-pointer p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" role="group" aria-label="Preset text selections">
            {PRESET_CUSTOM_TEXTS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                aria-label={`Select preset: ${preset.name} (${preset.category})`}
                className="p-2 text-left border border-neutral-200 dark:border-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
              >
                <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-neutral-600 dark:text-neutral-400 capitalize">
                  {preset.category}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="custom-text-area" className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
              Your Text <span className="text-[11px] font-normal text-neutral-500">(Ctrl+Enter to start)</span>
            </label>
            <span id="custom-text-stats" className="text-[10px] text-neutral-600 dark:text-neutral-400 font-mono" aria-live="polite">
              {wordCount} words · {charCount} characters
            </span>
          </div>
          <textarea
            id="custom-text-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleStart();
              }
            }}
            aria-describedby="custom-text-stats"
            placeholder="Paste or type your custom text here..."
            rows={5}
            className="w-full p-3 text-sm font-mono bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 dark:focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 resize-none"
          />
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Stored 100% locally in your browser. Custom text is never uploaded to any server.</span>
          </div>
        </div>

        {/* Time Limit */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
            Time Limit
          </label>
          <div className="flex gap-2" role="radiogroup" aria-label="Time limit selection">
            {[
              { label: 'None', val: 0, desc: 'No time limit' },
              { label: '30s', val: 30, desc: '30 seconds limit' },
              { label: '60s', val: 60, desc: '60 seconds limit' },
              { label: '120s', val: 120, desc: '120 seconds limit' },
            ].map(({ label, val, desc }) => (
              <button
                key={val}
                type="button"
                role="radio"
                aria-checked={timeLimit === val}
                aria-label={desc}
                onClick={() => setTimeLimit(val)}
                className={`flex-1 py-1.5 text-xs font-mono rounded-md border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white ${
                  timeLimit === val
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel and close custom text dialog"
            className="px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStart}
            disabled={!text.trim()}
            aria-label="Start custom text typing session"
            className="px-5 py-2 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-md disabled:opacity-30 disabled:pointer-events-none hover:opacity-90 transition-opacity cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white shadow-xs"
          >
            Start
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
