/**
 * =============================================================================
 * Typlix Security Check — Manual Secret Scanner
 * =============================================================================
 * Run: npm run security-check
 * 
 * Scans all project source files for hardcoded secrets and API keys.
 * Use this before pushing to GitHub to make absolutely sure nothing leaks.
 * =============================================================================
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

// ── Secret patterns to detect ──
const SECRET_PATTERNS = [
  { name: 'Firebase/Google API Key', pattern: /AIzaSy[0-9A-Za-z_-]{33}/g },
  { name: 'Google OAuth2 Token', pattern: /ya29\.[0-9A-Za-z_-]+/g },
  { name: 'Firebase FCM Server Key', pattern: /AAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}/g },
  { name: 'Private Key', pattern: /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/g },
  { name: 'Stripe Secret Key', pattern: /sk_live_[0-9a-zA-Z]{24,}/g },
  { name: 'GitHub PAT (Classic)', pattern: /ghp_[0-9a-zA-Z]{36}/g },
  { name: 'GitHub PAT (Fine-Grained)', pattern: /github_pat_[0-9a-zA-Z_]{82}/g },
  { name: 'Slack Token', pattern: /xox[bpors]-[0-9]{10,13}-[0-9a-zA-Z-]+/g },
  { name: 'AWS Access Key', pattern: /AKIA[0-9A-Z]{16}/g },
  { name: 'Generic Secret Assignment', pattern: /(?:password|secret|token|api_key)\s*[:=]\s*['"][^'"]{8,}['"]/gi },
];

// ── File extensions to scan ──
const SCAN_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.html', '.css',
  '.md', '.yaml', '.yml', '.toml', '.xml', '.env', '.cfg',
  '.conf', '.ini', '.sh', '.bat', '.ps1', '.cmd',
]);

// ── Directories to skip ──
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '.firebase',
  '.vscode', '.idea', 'coverage', '.cache', '.vite',
]);

// ── Files to skip ──
const SKIP_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  '.env.example', 'check-secrets.js',  // Don't flag ourselves
]);

function walkDir(dir, fileList = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (!SKIP_DIRS.has(entry)) {
          walkDir(fullPath, fileList);
        }
      } else if (stat.isFile()) {
        const ext = extname(entry).toLowerCase();
        if (SCAN_EXTENSIONS.has(ext) && !SKIP_FILES.has(entry)) {
          fileList.push(fullPath);
        }
      }
    } catch {
      // Skip files we can't read
    }
  }
  return fileList;
}

// ── Main ──
const projectRoot = join(import.meta.dirname, '..');
const files = walkDir(projectRoot);
let totalIssues = 0;

console.log('');
console.log('🔍 Typlix Security Check');
console.log('━'.repeat(55));
console.log(`   Scanning ${files.length} files for secret patterns...`);
console.log('');

for (const filePath of files) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const relPath = relative(projectRoot, filePath);

    for (const { name, pattern } of SECRET_PATTERNS) {
      // Reset regex lastIndex since we reuse them
      pattern.lastIndex = 0;
      const matches = content.match(pattern);
      if (matches) {
        for (const match of matches) {
          totalIssues++;
          const lineNum = content.substring(0, content.indexOf(match)).split('\n').length;
          const preview = match.substring(0, 16) + '...';
          console.log(`❌ ${name}`);
          console.log(`   File: ${relPath}:${lineNum}`);
          console.log(`   Match: ${preview}`);
          console.log('');
        }
      }
    }
  } catch {
    // Skip unreadable files
  }
}

console.log('━'.repeat(55));
if (totalIssues > 0) {
  console.log(`🚫 Found ${totalIssues} potential secret(s)!`);
  console.log('   Fix these before pushing to GitHub.');
  console.log('');
  process.exit(1);
} else {
  console.log('✅ No secrets found. Your code is safe to push!');
  console.log('');
  process.exit(0);
}
