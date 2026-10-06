/**
 * Typlix Storage Utility
 * Type-safe, resilient, tamper-guarded localStorage helper for session records and user preferences.
 */

export interface TypingSessionRecord {
  id: string;
  level: number;
  wpm: number;
  accuracy: number;
  maxCombo: number;
  date: string;
  modeLabel: string;
  durationSeconds?: number;
  passed?: boolean;
  mode?: string;
}

/**
 * Validates and clamps a typing session record against score tampering and out-of-bounds metrics.
 */
export function sanitizeSessionRecord(record: unknown): TypingSessionRecord | null {
  if (!record || typeof record !== 'object') return null;

  const r = record as Partial<TypingSessionRecord>;
  if (typeof r.id !== 'string' || !r.id) return null;

  const level = typeof r.level === 'number' ? Math.max(1, Math.min(50, Math.round(r.level))) : 1;
  const wpm = typeof r.wpm === 'number' ? Math.max(0, Math.min(350, Math.round(r.wpm))) : 0;
  const accuracy = typeof r.accuracy === 'number' ? Math.max(0, Math.min(100, Math.round(r.accuracy))) : 100;
  const maxCombo = typeof r.maxCombo === 'number' ? Math.max(0, Math.min(3000, Math.round(r.maxCombo))) : 0;
  const modeLabel = typeof r.modeLabel === 'string' ? r.modeLabel.slice(0, 50) : 'Practice';
  const durationSeconds = typeof r.durationSeconds === 'number' ? Math.max(1, Math.min(3600, Math.round(r.durationSeconds))) : undefined;
  const passed = typeof r.passed === 'boolean' ? r.passed : undefined;
  const mode = typeof r.mode === 'string' ? r.mode.slice(0, 30) : undefined;

  let date = typeof r.date === 'string' ? r.date : new Date().toISOString();
  if (isNaN(Date.parse(date))) {
    date = new Date().toISOString();
  }

  return {
    id: r.id.slice(0, 64),
    level,
    wpm,
    accuracy,
    maxCombo,
    date,
    modeLabel,
    durationSeconds,
    passed,
    mode,
  };
}

export const secureStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const parsed = JSON.parse(raw);
      // Seamlessly handle any previous { data, sig } envelopes if present
      let data = parsed;
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'sig' in parsed) {
        data = parsed.data;
      }

      // Security validation for typlix_stats array
      if (key === 'typlix_stats' && Array.isArray(data)) {
        const sanitizedList = data
          .map(sanitizeSessionRecord)
          .filter((s): s is TypingSessionRecord => s !== null);
        return sanitizedList as unknown as T;
      }

      // Security validation for typingGameLevel
      if (key === 'typingGameLevel' && typeof data === 'number') {
        const bounded = Math.max(1, Math.min(50, Math.round(data)));
        return bounded as unknown as T;
      }

      return data as T;
    } catch {
      return defaultValue;
    }
  },

  setItem: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    try {
      let valueToStore: unknown = value;

      // Validate before saving
      if (key === 'typlix_stats' && Array.isArray(value)) {
        valueToStore = value
          .map(sanitizeSessionRecord)
          .filter((s): s is TypingSessionRecord => s !== null);
      } else if (key === 'typingGameLevel' && typeof value === 'number') {
        valueToStore = Math.max(1, Math.min(50, Math.round(value)));
      }

      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(`Failed to save to localStorage for key: "${key}"`, e);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove key: "${key}"`, e);
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
  },
};
