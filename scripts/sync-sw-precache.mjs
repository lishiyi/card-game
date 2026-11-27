import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  computeExpectedLazyPrecacheUrls,
  computeExpectedPrecacheUrls,
} from './build-standalone.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRECACHE_BLOCK_RE = /const PRECACHE_URLS = \[[\s\S]*?\];/;
const LAZY_PRECACHE_BLOCK_RE = /const LAZY_PRECACHE_URLS = \[[\s\S]*?\];/;

export function formatPrecacheBlock(urls, varName = 'PRECACHE_URLS') {
  const lines = urls.map((u) => `  '${u}',`);
  return `const ${varName} = [\n${lines.join('\n')}\n];`;
}

export function extractSwPrecacheUrls(swText) {
  const match = swText.match(PRECACHE_BLOCK_RE);
  if (!match) return [];
  return [...match[0].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

export function extractSwLazyPrecacheUrls(swText) {
  const match = swText.match(LAZY_PRECACHE_BLOCK_RE);
  if (!match) return [];
  return [...match[0].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

export function syncSwPrecache(repoRoot = REPO_ROOT, { checkOnly = false } = {}) {
  const swPath = path.resolve(repoRoot, 'sw.js');
  const swText = fs.readFileSync(swPath, 'utf8');
  if (!PRECACHE_BLOCK_RE.test(swText)) {
    throw new Error('Could not locate PRECACHE_URLS block in sw.js');
  }
  if (!LAZY_PRECACHE_BLOCK_RE.test(swText)) {
    throw new Error('Could not locate LAZY_PRECACHE_URLS block in sw.js');
  }
  const expected = computeExpectedPrecacheUrls(repoRoot);
  const current = extractSwPrecacheUrls(swText);
  const expectedLazy = computeExpectedLazyPrecacheUrls(repoRoot);
  const currentLazy = extractSwLazyPrecacheUrls(swText);
  const coreInSync =
    current.length === expected.length && expected.every((url, idx) => current[idx] === url);
  const lazyInSync =
    currentLazy.length === expectedLazy.length &&
    expectedLazy.every((url, idx) => currentLazy[idx] === url);
  const inSync = coreInSync && lazyInSync;

  if (!checkOnly && !inSync) {
    let nextText = swText.replace(PRECACHE_BLOCK_RE, () =>
      formatPrecacheBlock(expected, 'PRECACHE_URLS')
    );
    nextText = nextText.replace(LAZY_PRECACHE_BLOCK_RE, () =>
      formatPrecacheBlock(expectedLazy, 'LAZY_PRECACHE_URLS')
    );
    fs.writeFileSync(swPath, nextText, 'utf8');
  }
  return { inSync, expected, current, expectedLazy, currentLazy };
}

const isDirectCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectCli) {
  const checkOnly = process.argv.includes('--check');
  const res = syncSwPrecache(REPO_ROOT, { checkOnly });
  if (checkOnly && !res.inSync) {
    console.error('sw.js PRECACHE_URLS / LAZY_PRECACHE_URLS is out of sync! Run `npm run sync:sw`.');
    process.exit(1);
  }
  console.log(
    checkOnly
      ? `sw.js precache lists verified (${res.expected.length} core + ${res.expectedLazy.length} lazy assets).`
      : `Synced sw.js precache lists (${res.expected.length} core + ${res.expectedLazy.length} lazy assets).`
  );
}
