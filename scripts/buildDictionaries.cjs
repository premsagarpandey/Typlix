const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Downloading standard dictionaries from Monkeytype repository...');
  
  const [res200, res1k, res5k] = await Promise.all([
    fetch('https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/english.json').then(r => r.json()),
    fetch('https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/english_1k.json').then(r => r.json()),
    fetch('https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/english_5k.json').then(r => r.json()),
  ]);

  const dictDir = path.join(__dirname, '..', 'src', 'data', 'dictionaries');
  if (!fs.existsSync(dictDir)) {
    fs.mkdirSync(dictDir, { recursive: true });
  }

  // 1. English 200
  const content200 = `// Top 200 high-frequency English core words (Monkeytype standard)
export const ENGLISH_200: readonly string[] = ${JSON.stringify(res200.words, null, 2)} as const;
`;
  fs.writeFileSync(path.join(dictDir, 'english200.ts'), content200, 'utf8');
  console.log(`Wrote english200.ts with ${res200.words.length} words`);

  // 2. English 1k
  const content1k = `// Standard 1,000 common English words (Monkeytype standard)
export const ENGLISH_1K: readonly string[] = ${JSON.stringify(res1k.words, null, 2)} as const;
`;
  fs.writeFileSync(path.join(dictDir, 'english1k.ts'), content1k, 'utf8');
  console.log(`Wrote english1k.ts with ${res1k.words.length} words`);

  // 3. English 5k
  const content5k = `// Extended 5,000 standard English vocabulary words (Monkeytype standard)
export const ENGLISH_5K: readonly string[] = ${JSON.stringify(res5k.words, null, 2)} as const;
`;
  fs.writeFileSync(path.join(dictDir, 'english5k.ts'), content5k, 'utf8');
  console.log(`Wrote english5k.ts with ${res5k.words.length} words`);

  // 4. Index
  const contentIndex = `import { ENGLISH_200 } from './english200';
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
`;
  fs.writeFileSync(path.join(dictDir, 'index.ts'), contentIndex, 'utf8');
  console.log('Wrote index.ts');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
