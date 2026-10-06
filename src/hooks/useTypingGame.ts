import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { calculateWPM, calculateRawWPM, calculateAccuracy, calculateConsistency } from '../utils/calculations';
import { generateLevelText } from '../data/levels';
import type { LevelConfig } from '../data/levels';
import { generateTimedWords, type DictionaryType } from '../data/words';
import { getRandomQuote } from '../data/quotes';
import type { QuoteCategory, Difficulty } from '../data/quotes';
import { getRandomSnippet } from '../data/codeSnippets';
import type { CodeLanguage } from '../data/codeSnippets';
import { secureStorage, type TypingSessionRecord } from '../utils/secureStorage';
import { saveTypingSession, saveLevelProgress } from '../services/cloudProgress';
import { playKeystrokeSound as playSound } from '../utils/soundEngine';
import { sanitizeCustomText } from '../utils/textUtils';

export type GameStatus = 'idle' | 'playing' | 'finished' | 'passed' | 'failed';
export type GameMode = 'lesson' | 'timed' | 'custom' | 'quotes' | 'code';

export interface SessionHistoryPoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TargetWord {
  id: number;
  text: string;
  hasNewlineAfter?: boolean;
}

export interface GameOptions {
  mode?: GameMode;
  customText?: string;
  modeLabel?: string;
  quoteCategory?: QuoteCategory | null;
  quoteDifficulty?: Difficulty | null;
  codeLanguage?: CodeLanguage | null;
  codeDifficulty?: Difficulty | null;
  punctuation?: boolean;
  numbers?: boolean;
  dictionary?: DictionaryType;
}

/**
 * Parses arbitrary text into word tokens, preserving newline breaks for code & literature.
 */
export function parseTargetWords(text: string): TargetWord[] {
  if (!text) return [{ id: 0, text: '' }];
  const lines = text.split('\n');
  const result: TargetWord[] = [];
  let id = 0;

  lines.forEach((line, lineIdx) => {
    const wordsInLine = line.trim().split(/\s+/).filter(Boolean);
    wordsInLine.forEach((w, wIdx) => {
      const isLastInLine = wIdx === wordsInLine.length - 1;
      const hasNewline = isLastInLine && lineIdx < lines.length - 1;
      result.push({
        id: id++,
        text: w,
        hasNewlineAfter: hasNewline,
      });
    });
  });

  return result.length > 0 ? result : [{ id: 0, text: text || 'word' }];
}

export function useTypingGame(
  initialTime: number = 40,
  levelConfig?: LevelConfig,
  options?: GameOptions
) {
  const currentMode = options?.mode || 'lesson';
  const customText = options?.customText || '';
  const modeLabel = options?.modeLabel;
  const quoteCategory = options?.quoteCategory;
  const quoteDifficulty = options?.quoteDifficulty;
  const codeLanguage = options?.codeLanguage;
  const codeDifficulty = options?.codeDifficulty;
  const punctuation = options?.punctuation ?? false;
  const numbers = options?.numbers ?? false;
  const dictionary = options?.dictionary ?? 'english-1k';

  const actualInitialTime = useMemo(() => {
    if (currentMode === 'lesson') {
      return levelConfig ? levelConfig.timeLimit : initialTime;
    }
    return initialTime;
  }, [currentMode, levelConfig, initialTime]);

  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeRemaining, setTimeRemaining] = useState(actualInitialTime);

  // Generate initial target text
  const [targetText, setTargetText] = useState(() => {
    if (currentMode === 'lesson') {
      return levelConfig ? generateLevelText(levelConfig, 25) : '';
    } else if (currentMode === 'custom') {
      return sanitizeCustomText(customText) || 'Type something here...';
    } else if (currentMode === 'quotes') {
      return getRandomQuote(quoteCategory, quoteDifficulty).text;
    } else if (currentMode === 'code') {
      return getRandomSnippet(codeLanguage, codeDifficulty).code;
    } else {
      return generateTimedWords(60, { punctuation, numbers, dictionary });
    }
  });

  // Word-based typing state
  const words = useMemo(() => parseTargetWords(targetText), [targetText]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [typedWords, setTypedWords] = useState<string[]>([]);

  // Telemetry & metrics
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveRawWpm, setLiveRawWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [consistency, setConsistency] = useState(100);
  const [history, setHistory] = useState<SessionHistoryPoint[]>([]);

  // Refs for zero-stale callback operations & high-precision timers
  const startTimeRef = useRef<number | null>(null);
  const statusRef = useRef<GameStatus>(status);
  const wordsRef = useRef<TargetWord[]>(words);
  const currentWordIndexRef = useRef(currentWordIndex);
  const currentInputRef = useRef(currentInput);
  const typedWordsRef = useRef<string[]>(typedWords);
  const correctCharsRef = useRef(0);
  const totalCharsTypedRef = useRef(0);
  const maxComboRef = useRef(0);
  const currentSecondErrorsRef = useRef(0);
  const sessionHistoryRef = useRef<SessionHistoryPoint[]>([]);
  const lastRecordedSecondRef = useRef(0);
  const modeRef = useRef(currentMode);
  const modeLabelRef = useRef(modeLabel);
  const levelConfigRef = useRef(levelConfig);
  const actualInitialTimeRef = useRef(actualInitialTime);

  useEffect(() => {
    statusRef.current = status;
    wordsRef.current = words;
    currentWordIndexRef.current = currentWordIndex;
    currentInputRef.current = currentInput;
    typedWordsRef.current = typedWords;
    modeRef.current = currentMode;
    modeLabelRef.current = modeLabel;
    levelConfigRef.current = levelConfig;
    actualInitialTimeRef.current = actualInitialTime;
  }, [status, words, currentWordIndex, currentInput, typedWords, currentMode, modeLabel, levelConfig, actualInitialTime]);

  // Unified session completion logic
  const completeSession = useCallback(
    (spentSeconds: number, correctCount: number, totalTypedCount: number) => {
      const mode = modeRef.current;
      const currentConfig = levelConfigRef.current;
      const finalWpm = calculateWPM(correctCount, spentSeconds);
      const finalRawWpm = calculateRawWPM(totalTypedCount, spentSeconds);
      const finalAcc = calculateAccuracy(correctCount, totalTypedCount);

      // Finalize history with last point if needed
      const finalHistory = [...sessionHistoryRef.current];
      const finalSec = Math.max(1, Math.round(spentSeconds));
      if (finalHistory.length === 0 || finalHistory[finalHistory.length - 1].second !== finalSec) {
        finalHistory.push({
          second: finalSec,
          wpm: finalWpm,
          rawWpm: finalRawWpm,
          errors: currentSecondErrorsRef.current,
        });
      }
      const finalConsistency = calculateConsistency(finalHistory);
      setConsistency(finalConsistency);
      setHistory(finalHistory);
      setLiveWpm(finalWpm);
      setLiveRawWpm(finalRawWpm);
      setLiveAccuracy(finalAcc);

      let newStatus: GameStatus = 'finished';
      if (mode === 'lesson' && currentConfig) {
        if (finalWpm >= currentConfig.targetWpm && finalAcc >= currentConfig.targetAccuracy) {
          newStatus = 'passed';
        } else {
          newStatus = 'failed';
        }
      } else {
        newStatus = 'finished';
      }

      setStatus(newStatus);
      statusRef.current = newStatus;

      // Save session record
      if (totalTypedCount > 0) {
        try {
          const label =
            modeLabelRef.current ||
            (mode === 'lesson'
              ? `Level ${currentConfig?.level || 1}`
              : mode === 'timed'
              ? `Timed (${actualInitialTimeRef.current}s)`
              : 'Custom Text');

          const record: TypingSessionRecord = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            level: mode === 'lesson' ? (currentConfig ? currentConfig.level : 1) : 0,
            wpm: finalWpm,
            accuracy: finalAcc,
            maxCombo: maxComboRef.current,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            passed: newStatus === 'passed' || newStatus === 'finished',
            mode,
            modeLabel: label,
            durationSeconds: Math.round(spentSeconds),
          };

          saveTypingSession(record).catch(() => {});

          if (mode === 'lesson' && newStatus === 'passed' && currentConfig) {
            const nextUnlocked = Math.min(50, currentConfig.level + 1);
            const currentSaved = secureStorage.getItem<number>('typingGameLevel', 1);
            if (nextUnlocked > currentSaved) {
              saveLevelProgress(nextUnlocked).catch(() => {});
            }
          }
        } catch {
          // ignore
        }
      }
    },
    []
  );

  // 1-Second Countdown Timer for Timed and Lesson Tests
  useEffect(() => {
    if (status !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            const totalElapsed = startTimeRef.current
              ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
              : actualInitialTimeRef.current;
            completeSession(totalElapsed, correctCharsRef.current, totalCharsTypedRef.current);
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, completeSession]);

  // High-Resolution Smooth Telemetry & Continuous Speed Calculation (every 100ms)
  useEffect(() => {
    if (status !== 'playing') return;

    const telemetryInterval = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSeconds = (performance.now() - startTimeRef.current) / 1000;
      if (elapsedSeconds < 0.2) return;

      const currentCorrect = correctCharsRef.current;
      const currentTotal = totalCharsTypedRef.current;
      const currentNetWpm = calculateWPM(currentCorrect, elapsedSeconds);
      const currentRawWpm = calculateRawWPM(currentTotal, elapsedSeconds);
      const currentAcc = calculateAccuracy(currentCorrect, currentTotal);

      setLiveWpm(currentNetWpm);
      setLiveRawWpm(currentRawWpm);
      setLiveAccuracy(currentAcc);

      // Record integer-second telemetry point for results performance curve
      const currentSec = Math.floor(elapsedSeconds);
      if (currentSec > 0 && currentSec !== lastRecordedSecondRef.current) {
        lastRecordedSecondRef.current = currentSec;
        const newPoint: SessionHistoryPoint = {
          second: currentSec,
          wpm: currentNetWpm,
          rawWpm: currentRawWpm,
          errors: currentSecondErrorsRef.current,
        };
        sessionHistoryRef.current.push(newPoint);
        setHistory([...sessionHistoryRef.current]);
        currentSecondErrorsRef.current = 0;
      }
    }, 100);

    return () => clearInterval(telemetryInterval);
  }, [status]);

  // Word-Based Keystroke Engine (Monkeytype style)
  const handleKeyStroke = useCallback(
    (key: string, ctrlKey = false) => {
      const currentStatus = statusRef.current;
      if (currentStatus === 'finished' || currentStatus === 'passed' || currentStatus === 'failed') return;

      // Start test immediately on first typing keystroke
      if (currentStatus === 'idle') {
        if (key.length === 1 && key !== ' ') {
          setStatus('playing');
          statusRef.current = 'playing';
          startTimeRef.current = performance.now();
          lastRecordedSecondRef.current = 0;
          sessionHistoryRef.current = [];
          currentSecondErrorsRef.current = 0;
        } else {
          return;
        }
      }

      const currentWords = wordsRef.current;
      const wordIdx = currentWordIndexRef.current;
      const targetWordObj = currentWords[wordIdx];
      if (!targetWordObj) return;

      const targetWord = targetWordObj.text;
      const input = currentInputRef.current;

      // 1. SPACE (or ENTER on newline break in code/quotes) - Commit active word
      if (key === ' ' || (key === 'Enter' && targetWordObj.hasNewlineAfter)) {
        if (input.length === 0) {
          // Prevent accidental skipping of empty words
          return;
        }

        // Space counts as 1 keystroke
        totalCharsTypedRef.current += 1;

        // If the entire word matched target word perfectly:
        const isWordPerfect = input === targetWord;
        if (isWordPerfect) {
          correctCharsRef.current += 1; // Award 1 correct char for the space
          playSound('correct');
        } else {
          playSound('error');
          currentSecondErrorsRef.current += 1;
        }

        const nextTypedWords = [...typedWordsRef.current];
        nextTypedWords[wordIdx] = input;
        typedWordsRef.current = nextTypedWords;
        setTypedWords(nextTypedWords);

        const nextWordIdx = wordIdx + 1;
        currentWordIndexRef.current = nextWordIdx;
        setCurrentWordIndex(nextWordIdx);

        currentInputRef.current = '';
        setCurrentInput('');

        // Timed mode: Dynamically append 30 words when approaching end of queue
        if (modeRef.current === 'timed' && nextWordIdx >= currentWords.length - 12) {
          const newText = generateTimedWords(30, { punctuation, numbers, dictionary });
          setTargetText((prev) => prev + ' ' + newText);
        }

        // Finish if completed all words in non-timed modes
        if (modeRef.current !== 'timed' && nextWordIdx >= currentWords.length) {
          const totalElapsed = startTimeRef.current
            ? Math.max(1, (performance.now() - startTimeRef.current) / 1000)
            : actualInitialTimeRef.current;
          completeSession(totalElapsed, correctCharsRef.current, totalCharsTypedRef.current);
        }
        return;
      }

      // 2. BACKSPACE (Word-isolated backspacing)
      if (key === 'Backspace') {
        if (ctrlKey) {
          // Ctrl+Backspace: Wipe current word or return to previous word
          if (input.length > 0) {
            currentInputRef.current = '';
            setCurrentInput('');
          } else if (wordIdx > 0) {
            const prevWordIdx = wordIdx - 1;
            currentWordIndexRef.current = prevWordIdx;
            setCurrentWordIndex(prevWordIdx);
            currentInputRef.current = '';
            setCurrentInput('');
            const nextTyped = [...typedWordsRef.current];
            nextTyped[prevWordIdx] = '';
            typedWordsRef.current = nextTyped;
            setTypedWords(nextTyped);
          }
          return;
        }

        // Single Backspace:
        if (input.length > 0) {
          const nextInput = input.slice(0, -1);
          currentInputRef.current = nextInput;
          setCurrentInput(nextInput);
        } else if (wordIdx > 0) {
          // Step back into previous word to allow correcting previous typos
          const prevWordIdx = wordIdx - 1;
          const prevWordTyped = typedWordsRef.current[prevWordIdx] || '';
          currentWordIndexRef.current = prevWordIdx;
          setCurrentWordIndex(prevWordIdx);
          currentInputRef.current = prevWordTyped;
          setCurrentInput(prevWordTyped);
        }
        return;
      }

      // 3. REGULAR PRINTABLE CHARACTER (Letters, numbers, punctuation)
      if (key.length === 1) {
        const nextInput = input + key;
        currentInputRef.current = nextInput;
        setCurrentInput(nextInput);

        totalCharsTypedRef.current += 1;

        const charIdx = input.length;
        const expectedChar = targetWord[charIdx];

        if (expectedChar !== undefined && key === expectedChar) {
          correctCharsRef.current += 1;
          playSound('correct');
          setCombo((prev) => {
            const newCombo = prev + 1;
            if (newCombo > maxComboRef.current) {
              maxComboRef.current = newCombo;
              setMaxCombo(newCombo);
            }
            return newCombo;
          });
        } else {
          // Either wrong character OR overflow extra character beyond target length
          playSound('error');
          setShakeTrigger((prev) => prev + 1);
          setCombo(0);
          currentSecondErrorsRef.current += 1;
        }

        // Update live metrics immediately on keystroke
        if (startTimeRef.current) {
          const elapsed = Math.max(0.1, (performance.now() - startTimeRef.current) / 1000);
          setLiveWpm(calculateWPM(correctCharsRef.current, elapsed));
          setLiveRawWpm(calculateRawWPM(totalCharsTypedRef.current, elapsed));
          setLiveAccuracy(calculateAccuracy(correctCharsRef.current, totalCharsTypedRef.current));
        }
      }
    },
    [completeSession, punctuation, numbers, dictionary]
  );

  // Fallback for Mobile / Virtual IME Input
  const handleInput = useCallback(
    (value: string) => {
      const currentWords = wordsRef.current;
      const wordIdx = currentWordIndexRef.current;
      const targetWordObj = currentWords[wordIdx];
      if (!targetWordObj) return;

      // Check if space was typed
      if (value.endsWith(' ')) {
        const wordValue = value.slice(0, -1);
        currentInputRef.current = wordValue;
        handleKeyStroke(' ');
        return;
      }

      const prevLen = currentInputRef.current.length;
      if (value.length > prevLen) {
        const added = value.slice(prevLen);
        for (const char of added) {
          handleKeyStroke(char);
        }
      } else if (value.length < prevLen) {
        const diff = prevLen - value.length;
        for (let i = 0; i < diff; i++) {
          handleKeyStroke('Backspace');
        }
      }
    },
    [handleKeyStroke]
  );

  // Instant Reset / Quick Restart (Tab + Enter or Esc)
  const resetGame = useCallback(
    (newConfig?: LevelConfig, newCustomText?: string) => {
      const mode = modeRef.current;
      const config = newConfig || levelConfigRef.current;
      setStatus('idle');
      statusRef.current = 'idle';
      startTimeRef.current = null;
      lastRecordedSecondRef.current = 0;
      sessionHistoryRef.current = [];
      currentSecondErrorsRef.current = 0;
      setHistory([]);

      const nextTime = mode === 'lesson' && config ? config.timeLimit : actualInitialTimeRef.current;
      setTimeRemaining(nextTime);

      setCurrentWordIndex(0);
      currentWordIndexRef.current = 0;
      setCurrentInput('');
      currentInputRef.current = '';
      setTypedWords([]);
      typedWordsRef.current = [];

      setCombo(0);
      setMaxCombo(0);
      maxComboRef.current = 0;
      correctCharsRef.current = 0;
      totalCharsTypedRef.current = 0;
      setLiveWpm(0);
      setLiveRawWpm(0);
      setLiveAccuracy(100);
      setConsistency(100);

      let newTarget = '';
      if (mode === 'lesson') {
        if (config) newTarget = generateLevelText(config, 25);
      } else if (mode === 'custom') {
        const textToUse = newCustomText !== undefined ? newCustomText : customText;
        newTarget = sanitizeCustomText(textToUse) || 'Type something here...';
      } else if (mode === 'quotes') {
        newTarget = getRandomQuote(quoteCategory, quoteDifficulty).text;
      } else if (mode === 'code') {
        newTarget = getRandomSnippet(codeLanguage, codeDifficulty).code;
      } else {
        newTarget = generateTimedWords(60, { punctuation, numbers, dictionary });
      }
      setTargetText(newTarget);
    },
    [customText, quoteCategory, quoteDifficulty, codeLanguage, codeDifficulty, punctuation, numbers, dictionary]
  );

  // Synthesized typedText for backward compatibility
  const typedText = useMemo(() => {
    const prev = typedWords.join(' ');
    if (prev.length === 0) return currentInput;
    return currentInput ? `${prev} ${currentInput}` : `${prev} `;
  }, [typedWords, currentInput]);

  return {
    status,
    timeRemaining,
    targetText,
    typedText,
    words,
    currentWordIndex,
    currentInput,
    typedWords,
    wpm: liveWpm,
    rawWpm: liveRawWpm,
    accuracy: liveAccuracy,
    combo,
    maxCombo,
    consistency,
    history,
    shakeTrigger,
    handleKeyStroke,
    handleInput,
    resetGame,
    setTargetText,
  };
}
