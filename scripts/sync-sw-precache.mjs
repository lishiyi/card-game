import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { computeExpectedPrecacheUrls } from './build-standalone.mjs';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRECACHE_BLOCK_RE = /const PRECACHE_URLS = \[[\s\S]*?\];/;

export function formatPrecacheBlock(urls) {
  const lines = urls.map((u) => `  '${u}',`);
  return `const PRECACHE_URLS = [\n${lines.join('\n')}\n];`;
}

export function extractSwPrecacheUrls(swText) {
  const match = swText.match(PRECACHE_BLOCK_RE);
  if (!match) return [];
  return [...match[0].matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
}

export function syncSwPrecache(repoRoot = REPO_ROOT, { checkOnly = false } = {}) {
  const swPath = path.resolve(repoRoot, 'sw.js');
  const swText = fs.readFileSync(swPath, 'utf8');
  if (!PRECACHE_BLOCK_RE.test(swText)) {
    throw new Error('Could not locate PRECACHE_URLS block in sw.js');
  }
  const expected = computeExpectedPrecacheUrls(repoRoot);
  const current = extractSwPrecacheUrls(swText);
  const inSync =
    current.length === expected.length && expected.every((url, idx) => current[idx] === url);

  if (!checkOnly && !inSync) {
    const nextText = swText.replace(PRECACHE_BLOCK_RE, () => formatPrecacheBlock(expected));
    fs.writeFileSync(swPath, nextText, 'utf8');
  }
  return { inSync, expected, current };
}

const isDirectCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectCli) {
  const checkOnly = process.argv.includes('--check');
  const res = syncSwPrecache(REPO_ROOT, { checkOnly });
  if (checkOnly && !res.inSync) {
    console.error('sw.js PRECACHE_URLS is out of sync! Run `npm run sync:sw`.');
    process.exit(1);
  }
  console.log(
    checkOnly
      ? `sw.js PRECACHE_URLS verified (${res.expected.length} assets).`
      : `Synced sw.js PRECACHE_URLS (${res.expected.length} assets).`
  );
}
