/**
 * Typlix Ultra-Low Latency Haptic Feedback Engine
 * Provides subtle tactile feedback on mobile phones (Android / supported touch devices).
 * Gracefully no-ops on desktop, iOS Safari, or devices without vibration hardware.
 */

let hapticsEnabled = true;
let hapticsInitialized = false;

function initHaptics(): void {
  if (typeof window === 'undefined' || hapticsInitialized) return;
  hapticsInitialized = true;
  try {
    const saved = localStorage.getItem('typlix_haptics_enabled');
    // Default to true on touch devices that support vibration
    hapticsEnabled = saved !== null ? saved === 'true' : true;
  } catch {
    hapticsEnabled = true;
  }
}

/**
 * Checks if the current hardware supports the Vibration API.
 */
export function isVibrationSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/**
 * Checks if haptics are currently enabled.
 */
export function isHapticsEnabled(): boolean {
  if (!hapticsInitialized) initHaptics();
  return hapticsEnabled;
}

/**
 * Updates the user's haptic feedback preference.
 */
export function setHapticsEnabled(enabled: boolean): void {
  hapticsEnabled = enabled;
  try {
    localStorage.setItem('typlix_haptics_enabled', String(enabled));
  } catch {
    // ignore
  }
}

/**
 * Triggers a subtle tactile pulse based on the typing interaction.
 */
export function triggerHaptic(type: 'correct' | 'error' | 'success' | 'tap'): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !navigator.vibrate) return;
  if (!hapticsInitialized) initHaptics();
  if (!hapticsEnabled) return;

  try {
    if (type === 'correct') {
      // Crisp 6ms micro-pulse (feels like a mechanical tactile switch click)
      navigator.vibrate(6);
    } else if (type === 'error') {
      // Distinct double buzz for typo alert
      navigator.vibrate([12, 24, 16]);
    } else if (type === 'success') {
      // Celebratory flutter pattern on test completion
      navigator.vibrate([20, 30, 25, 30, 40]);
    } else if (type === 'tap') {
      // Subtle 4ms touch feedback for buttons
      navigator.vibrate(4);
    }
  } catch {
    // Ignore any device-level vibration errors
  }
}
