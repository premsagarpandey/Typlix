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

/**
 * Deterministic fast hashing helper for client-side tamper detection
 */
function createIntegritySignature(key: string, serializedData: string): string {
  let hash = 0x811c9dc5;
  const combined = `typlix_sec_v2:${key}:${serializedData}`;
  for (let i = 0; i < combined.length; i++) {
    hash ^= combined.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(36);
}

const SENSITIVE_STORAGE_KEYS = new Set(['typlix_current_uid', 'typingGameLevel', 'typlix_stats']);

export const secureStorage = {
  getItem: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const parsed = JSON.parse(raw);
      let data = parsed;

      // Anti-Tamper Check: If sensitive key was stored in envelope format, verify signature
      if (parsed && typeof parsed === 'object' && 'data' in parsed && 'sig' in parsed) {
        const expectedSig = createIntegritySignature(key, JSON.stringify(parsed.data));
        if (parsed.sig !== expectedSig) {
          console.warn(`[Typlix Security Guard] Tampering detected in key "${key}". Discarding forged data.`);
          localStorage.removeItem(key);
          return defaultValue;
        }
        data = parsed.data;
      }

      // Security validation for typlix_stats array
      if (key === 'typlix_stats') {
        if (!Array.isArray(data)) return defaultValue;
        const sanitizedList = data
          .map(sanitizeSessionRecord)
          .filter((s): s is TypingSessionRecord => s !== null);
        return sanitizedList as unknown as T;
      }

      // Security validation for typingGameLevel
      if (key === 'typingGameLevel') {
        if (typeof data !== 'number' || isNaN(data)) return defaultValue;
        const bounded = Math.max(1, Math.min(50, Math.round(data)));
        return bounded as unknown as T;
      }

      // Security validation for typlix_current_uid
      if (key === 'typlix_current_uid') {
        if (typeof data !== 'string' || data.length > 128) return defaultValue;
        return data as unknown as T;
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
      } else if (key === 'typlix_current_uid' && typeof value === 'string') {
        valueToStore = value.slice(0, 128);
      }

      // Wrap sensitive credentials and game progress with tamper-detection integrity signature
      if (SENSITIVE_STORAGE_KEYS.has(key)) {
        const serializedData = JSON.stringify(valueToStore);
        const sig = createIntegritySignature(key, serializedData);
        localStorage.setItem(key, JSON.stringify({ data: valueToStore, sig }));
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
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

/**
 * Typlix Persistent Brute-Force & Credential Stuffing Defense Guard
 * Enforces exponential cooldown across page refreshes and browser tabs.
 */
const LOCKOUT_KEY = 'typlix_auth_lockout_ledger';

interface LockoutLedger {
  attempts: number[];
  lockoutUntil: number;
}

export const authDefense = {
  /**
   * Returns remaining lockout seconds (0 if not locked out).
   */
  getRemainingLockoutSeconds(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem(LOCKOUT_KEY) || sessionStorage.getItem(LOCKOUT_KEY);
      if (!raw) return 0;
      const ledger: LockoutLedger = JSON.parse(raw);
      const remaining = Math.max(0, Math.ceil((ledger.lockoutUntil - Date.now()) / 1000));
      return remaining;
    } catch {
      return 0;
    }
  },

  /**
   * Records a failed login attempt and calculates progressive cooldown.
   * - 3 fails: 15s cooldown
   * - 5 fails: 60s cooldown
   * - 7 fails: 300s (5m) cooldown
   * - 10+ fails: 1800s (30m) lockout
   */
  recordFailedAttempt(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const now = Date.now();
      const raw = localStorage.getItem(LOCKOUT_KEY) || sessionStorage.getItem(LOCKOUT_KEY);
      let ledger: LockoutLedger = { attempts: [], lockoutUntil: 0 };
      if (raw) {
        try {
          ledger = JSON.parse(raw);
        } catch {}
      }

      // Keep attempts within the last 15 minutes (900000 ms)
      const validAttempts = [...(ledger.attempts || []).filter((t) => now - t < 900000), now];
      let lockoutSeconds = 0;

      if (validAttempts.length >= 10) {
        lockoutSeconds = 1800; // 30 mins
      } else if (validAttempts.length >= 7) {
        lockoutSeconds = 300; // 5 mins
      } else if (validAttempts.length >= 5) {
        lockoutSeconds = 60; // 1 min
      } else if (validAttempts.length >= 3) {
        lockoutSeconds = 15; // 15 secs
      }

      const lockoutUntil = lockoutSeconds > 0 ? now + lockoutSeconds * 1000 : 0;
      const updated: LockoutLedger = { attempts: validAttempts, lockoutUntil };
      const serialized = JSON.stringify(updated);
      localStorage.setItem(LOCKOUT_KEY, serialized);
      sessionStorage.setItem(LOCKOUT_KEY, serialized);

      return lockoutSeconds;
    } catch {
      return 0;
    }
  },

  /**
   * Resets failed attempts after successful sign-in
   */
  resetAttempts(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(LOCKOUT_KEY);
      sessionStorage.removeItem(LOCKOUT_KEY);
    } catch {}
  },
};

