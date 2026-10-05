export function calculateWPM(correctChars: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds <= 0) return 0;
  // Standard word length is 5 characters
  const words = correctChars / 5;
  const minutes = timeElapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateRawWPM(totalCharsTyped: number, timeElapsedSeconds: number): number {
  if (timeElapsedSeconds <= 0) return 0;
  const words = totalCharsTyped / 5;
  const minutes = timeElapsedSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correctChars: number, totalCharsTyped: number): number {
  if (totalCharsTyped <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((correctChars / totalCharsTyped) * 100)));
}

export function calculateConsistency(history: { wpm: number }[]): number {
  if (!history || history.length < 2) return 100;
  const wpms = history.map((h) => h.wpm);
  const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
  if (mean <= 0) return 100;
  const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = (stdDev / mean) * 100;
  return Math.min(100, Math.max(0, Math.round(100 - coefficientOfVariation)));
}
