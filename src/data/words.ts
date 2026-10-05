export const COMMON_WORDS: string[] = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'code', 'type', 'speed', 'flow', 'fast', 'quick', 'focus', 'power', 'skill', 'hand',
  'finger', 'light', 'sound', 'system', 'build', 'create', 'learn', 'logic', 'stream', 'game',
  'future', 'space', 'pixel', 'modern', 'clean', 'matrix', 'engine', 'pulse', 'spark', 'zen',
  'great', 'small', 'large', 'world', 'place', 'water', 'point', 'state', 'mind', 'group',
  'still', 'find', 'right', 'night', 'high', 'life', 'start', 'might', 'story', 'press',
  'both', 'under', 'last', 'never', 'same', 'another', 'while', 'last', 'might', 'next',
  'sound', 'below', 'something', 'thought', 'both', 'few', 'those', 'always', 'show', 'large',
  'often', 'together', 'ask', 'house', 'world', 'school', 'important', 'until', 'form', 'food',
  'keep', 'children', 'feet', 'land', 'side', 'without', 'boy', 'once', 'animal', 'life',
  'enough', 'took', 'four', 'head', 'above', 'kind', 'began', 'almost', 'live', 'page',
  'got', 'earth', 'need', 'far', 'hand', 'high', 'year', 'mother', 'light', 'country',
  'father', 'let', 'night', 'picture', 'being', 'study', 'second', 'soon', 'story', 'since',
  'white', 'ever', 'paper', 'hard', 'near', 'sentence', 'better', 'best', 'across', 'during',
  'today', 'however', 'sure', 'low', 'hours', 'black', 'products', 'happen', 'whole', 'measure',
  'remember', 'early', 'waves', 'listen', 'wind', 'rock', 'space', 'covered', 'fast', 'several',
  'hold', 'himself', 'toward', 'five', 'step', 'morning', 'passed', 'vowel', 'true', 'hundred',
  'against', 'pattern', 'numeral', 'table', 'north', 'slowly', 'money', 'map', 'farm', 'draw',
  'voice', 'seen', 'cold', 'cried', 'plan', 'notice', 'south', 'sing', 'war', 'ground',
  'fall', 'king', 'town', 'unit', 'figure', 'certain', 'field', 'travel', 'wood', 'fire',
  'upon', 'done', 'English', 'road', 'halt', 'ten', 'fly', 'gave', 'box', 'finally',
  'wait', 'correct', 'oh', 'quickly', 'person', 'became', 'shown', 'minutes', 'strong', 'verb',
  'stars', 'front', 'feel', 'fact', 'inches', 'street', 'decided', 'contain', 'course', 'surface',
  'produce', 'building', 'ocean', 'class', 'note', 'nothing', 'rest', 'carefully', 'scientists', 'inside',
  'wheels', 'stay', 'green', 'known', 'island', 'week', 'less', 'machine', 'base', 'ago',
  'stood', 'plane', 'system', 'behind', 'ran', 'round', 'boat', 'game', 'force', 'brought',
  'understand', 'warm', 'common', 'bring', 'explain', 'dry', 'though', 'language', 'shape', 'deep',
  'thousands', 'yes', 'clear', 'equation', 'yet', 'government', 'filled', 'heat', 'full', 'hot',
  'check', 'object', 'am', 'rule', 'among', 'noun', 'power', 'cannot', 'able', 'six',
  'size', 'dark', 'ball', 'material', 'special', 'heavy', 'fine', 'pair', 'circle', 'include',
  'built', 'canary', 'shadow', 'simple', 'energy', 'hunt', 'probable', 'bed', 'brother', 'egg',
  'ride', 'cell', 'believe', 'perhaps', 'pick', 'sudden', 'count', 'square', 'reason', 'length',
  'represent', 'art', 'subject', 'region', 'energy', 'hunt', 'probable', 'brother', 'battery'
];

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
  'could': "couldn't"
};

/**
 * Generates continuous random words for timed typing tests with optional punctuation & numbers
 */
export function generateTimedWords(wordCount: number = 60, options?: TimedWordsOptions): string {
  const { punctuation = false, numbers = false } = options || {};
  const words: string[] = [];
  let lastWord = '';

  let sentenceLength = Math.floor(Math.random() * 5) + 5; // 5 to 9 words per sentence
  let currentSentenceIndex = 0;

  for (let i = 0; i < wordCount; i++) {
    let word = '';

    // If numbers option enabled and randomly every 6-8 words:
    const shouldInsertNumber = numbers && i > 0 && i % (Math.floor(Math.random() * 3) + 6) === 0;

    if (shouldInsertNumber) {
      word = SAMPLE_NUMBERS[Math.floor(Math.random() * SAMPLE_NUMBERS.length)];
    } else {
      let randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
      while (randomWord === lastWord) {
        randomWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
      }

      // If punctuation enabled and contraction exists:
      if (punctuation && Math.random() < 0.15 && CONTRACTIONS[randomWord.toLowerCase()]) {
        word = CONTRACTIONS[randomWord.toLowerCase()];
      } else {
        word = randomWord.toLowerCase();
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
        const endPunct = rand < 0.8 ? '.' : rand < 0.92 ? '?' : '!';
        word = word + endPunct;
        currentSentenceIndex = 0;
        sentenceLength = Math.floor(Math.random() * 5) + 5;
      } else if (currentSentenceIndex > 1 && currentSentenceIndex < sentenceLength - 2 && Math.random() < 0.2) {
        // Mid-sentence comma or quote
        word = word + ',';
        currentSentenceIndex++;
      } else {
        currentSentenceIndex++;
      }
    }

    words.push(word);
    lastWord = word;
  }

  return words.join(' ');
}
