import {
  DICTIONARIES,
  DICTIONARY_LIST,
  ENGLISH_1K,
  type DictionaryType,
  type DictionaryMeta,
} from './dictionaries';

export {
  DICTIONARIES,
  DICTIONARY_LIST,
  type DictionaryType,
  type DictionaryMeta,
};

export interface CustomPreset {
  id: string;
  name: string;
  category: 'Quotes' | 'Code' | 'Drills' | 'Literature';
  text: string;
}

export const PRESET_CUSTOM_TEXTS: CustomPreset[] = [
  {
    id: 'quote-1',
    name: 'Perseverance & Mastery',
    category: 'Quotes',
    text: 'Continuous effort, not strength or intelligence, is the key to unlocking our potential. Practice every day with calm focus.'
  },
  {
    id: 'quote-2',
    name: 'Technology & Design',
    category: 'Quotes',
    text: 'Simplicity is the ultimate sophistication. When something is designed with purpose and precision, excellence follows naturally.'
  },
  {
    id: 'code-js',
    name: 'JavaScript / React Snippet',
    category: 'Code',
    text: 'const handleTyping = (event) => { const value = event.target.value; if (value === target) completeSession(); };'
  },
  {
    id: 'code-python',
    name: 'Python Logic Snippet',
    category: 'Code',
    text: 'def calculate_wpm(correct_chars, elapsed_seconds): return round((correct_chars / 5) / (elapsed_seconds / 60))'
  },
  {
    id: 'tongue-twister',
    name: 'Fast Finger Drill',
    category: 'Drills',
    text: 'The quick brown fox jumps over the lazy dog while sleek black keyboards rhythmically click under nimble typing fingers.'
  }
];

export interface TimedWordsOptions {
  punctuation?: boolean;
  numbers?: boolean;
  dictionary?: DictionaryType;
}

const SAMPLE_NUMBERS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '12', '15', '24', '30', '42', '50', '64', '80', '99',
  '100', '128', '256', '365', '500', '1000', '1984', '1999', '2024', '2026', '3.14'
];

const CONTRACTIONS: Record<string, string> = {
  'do': "don't",
  'can': "can't",
  'will': "won't",
  'it': "it's",
  'that': "that's",
  'there': "there's",
  'we': "we're",
  'they': "they're",
  'you': "you're",
  'have': "haven't",
  'would': "wouldn't",
  'could': "couldn't",
  'is': "isn't",
  'are': "aren't",
  'was': "wasn't",
  'were': "weren't",
  'should': "shouldn't",
  'has': "hasn't",
  'had': "hadn't",
  'did': "didn't",
  'does': "doesn't"
};

// Global sliding window to avoid picking recently generated words even across consecutive calls
const recentWordsBuffer: string[] = [];
const MAX_RECENT_BUFFER = 45;

/**
 * Generates continuous random words for timed typing tests from the selected dictionary
 * (English 1k default, English 5k, or English 200) with anti-repetition protection,
 * optional punctuation & numbers.
 */
export function generateTimedWords(wordCount: number = 60, options?: TimedWordsOptions): string {
  const { punctuation = false, numbers = false, dictionary = 'english-1k' } = options || {};
  const wordPool = DICTIONARIES[dictionary] || ENGLISH_1K;
  const poolLength = wordPool.length;

  const words: string[] = [];
  let sentenceLength = Math.floor(Math.random() * 5) + 5; // 5 to 9 words per sentence
  let currentSentenceIndex = 0;

  for (let i = 0; i < wordCount; i++) {
    let word = '';

    // If numbers option enabled and randomly every 7-9 words:
    const shouldInsertNumber = numbers && i > 0 && i % (Math.floor(Math.random() * 3) + 7) === 0;

    if (shouldInsertNumber) {
      word = SAMPLE_NUMBERS[Math.floor(Math.random() * SAMPLE_NUMBERS.length)];
    } else {
      // Pick random word with anti-repetition buffer
      let candidate = '';
      let attempts = 0;
      do {
        candidate = wordPool[Math.floor(Math.random() * poolLength)];
        attempts++;
      } while (
        attempts < 20 &&
        poolLength > MAX_RECENT_BUFFER &&
        (recentWordsBuffer.includes(candidate) || (words.length > 0 && words[words.length - 1].toLowerCase().replace(/[^a-z']/g, '') === candidate))
      );

      // Track candidate in recent buffer
      recentWordsBuffer.push(candidate);
      if (recentWordsBuffer.length > MAX_RECENT_BUFFER) {
        recentWordsBuffer.shift();
      }

      // If punctuation enabled and contraction exists:
      if (punctuation && Math.random() < 0.15 && CONTRACTIONS[candidate.toLowerCase()]) {
        word = CONTRACTIONS[candidate.toLowerCase()];
      } else {
        word = candidate.toLowerCase();
      }
    }

    if (punctuation) {
      // Capitalize first word of a sentence
      if (currentSentenceIndex === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }

      // End of sentence punctuation
      if (currentSentenceIndex === sentenceLength - 1 || i === wordCount - 1) {
        const rand = Math.random();
        const endPunct = rand < 0.78 ? '.' : rand < 0.9 ? '?' : '!';
        word = word + endPunct;
        currentSentenceIndex = 0;
        sentenceLength = Math.floor(Math.random() * 5) + 5;
      } else if (currentSentenceIndex > 1 && currentSentenceIndex < sentenceLength - 2 && Math.random() < 0.2) {
        // Mid-sentence comma
        word = word + ',';
        currentSentenceIndex++;
      } else {
        currentSentenceIndex++;
      }
    }

    words.push(word);
  }

  return words.join(' ');
}
