import { ENGLISH_200 } from './english200';
import { ENGLISH_1K } from './english1k';
import { ENGLISH_5K } from './english5k';

export type DictionaryType = 'english-200' | 'english-1k' | 'english-5k';

export interface DictionaryMeta {
  id: DictionaryType;
  name: string;
  badge: string;
  wordCount: number;
  description: string;
}

export const DICTIONARIES: Record<DictionaryType, readonly string[]> = {
  'english-200': ENGLISH_200,
  'english-1k': ENGLISH_1K,
  'english-5k': ENGLISH_5K,
};

export const DICTIONARY_LIST: DictionaryMeta[] = [
  {
    id: 'english-200',
    name: 'English 200',
    badge: '200',
    wordCount: 200,
    description: 'Top 200 most common words. Ideal for baseline speed drills.',
  },
  {
    id: 'english-1k',
    name: 'English 1k',
    badge: '1k',
    wordCount: 1000,
    description: 'Standard 1,000 vocabulary words. Balanced diversity and speed.',
  },
  {
    id: 'english-5k',
    name: 'English 5k',
    badge: '5k',
    wordCount: 5000,
    description: 'Expanded 5,000 word dictionary. Maximum variety with no repetition.',
  },
];

export { ENGLISH_200, ENGLISH_1K, ENGLISH_5K };
