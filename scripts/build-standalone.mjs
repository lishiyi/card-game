import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const IMPORT_RE = /^\s*import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;/gm;
const EXPORT_DECL_RE = /^export\s+(async\s+function|function|const|let)\s+([A-Za-z0-9_$]+)/gm;
const EXPORT_LIST_RE = /^export\s*\{([\s\S]*?)\}\s*;/gm;

function normalizeRelPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function modVar(relPath) {
  return '__mod_' + normalizeRelPosix(relPath).replace(/[^a-zA-Z0-9]/g, '_');
}

/**
 * Automatically traverses ES module imports starting from `entryRel` (default `src/main.js`)
 * and returns a deterministic post-order topological list of relative POSIX module paths.
 */
export function discoverModuleOrder(entryRel = 'src/main.js', repoRoot = REPO_ROOT) {
  const ordered = [];
  const visiting = new Set();
  const visited = new Set();

  function visit(relPosix, chain = []) {
    if (visited.has(relPosix)) return;
    if (visiting.has(relPosix)) {
      throw new Error(`Circular dependency detected: ${[...chain, relPosix].join(' -> ')}`);
    }

    const fullPath = path.resolve(repoRoot, relPosix);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Module not found: ${relPosix} (imported from ${chain[chain.length - 1] || 'entry'})`);
    }

    visiting.add(relPosix);
    const source = fs.readFileSync(fullPath, 'utf8');

    for (const match of source.matchAll(IMPORT_RE)) {
      const targetSpec = match[2];
      if (!targetSpec.startsWith('.')) {
        throw new Error(`Unsupported external package import "${targetSpec}" in ${relPosix}`);
      }
      let resolved = path.posix.normalize(path.posix.join(path.posix.dirname(relPosix), targetSpec));
      if (!path.posix.extname(resolved)) resolved += '.js';
      visit(resolved, [...chain, relPosix]);
    }

    visiting.delete(relPosix);
    visited.add(relPosix);
    ordered.push(relPosix);
  }

  visit(normalizeRelPosix(entryRel), []);
  return ordered;
}

/**
 * Compiles all ES modules reachable from `src/main.js` + `styles/main.css` + `index.html`
 * into a single self-contained standalone HTML string.
 */
export function buildStandaloneHtml(repoRoot = REPO_ROOT) {
  const modules = discoverModuleOrder('src/main.js', repoRoot);
  const chunks = [];

  for (const rel of modules) {
    const full = path.resolve(repoRoot, rel);
    let code = fs.readFileSync(full, 'utf8');

    code = code.replace(IMPORT_RE, (_, specifiers, targetRel) => {
      let resolved = path.posix.normalize(path.posix.join(path.posix.dirname(rel), targetRel));
      if (!path.posix.extname(resolved)) resolved += '.js';
      const mappedSpecs = specifiers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/\s+as\s+/, ': '))
        .join(', ');
      return `const { ${mappedSpecs} } = ${modVar(resolved)};`;
    });

    const exportedNames = [];
    code = code.replace(EXPORT_DECL_RE, (_, kw, name) => {
      exportedNames.push(name);
      return `${kw} ${name}`;
    });

    code = code.replace(EXPORT_LIST_RE, (_, listBody) => {
      const items = listBody
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const item of items) {
        const asParts = item.split(/\s+as\s+/);
        if (asParts.length === 2) {
          exportedNames.push(`${asParts[1].trim()}: ${asParts[0].trim()}`);
        } else {
          exportedNames.push(item);
        }
      }
      return '';
    });

    if (/^\s*(import|export)\b/m.test(code)) {
      throw new Error(`Unhandled import/export syntax remaining in ${rel}`);
    }

    code = code.replace(/<\/script/gi, '<\\/script');

    chunks.push(
      `// --- Module: ${rel} ---\nconst ${modVar(rel)} = (() => {\n${code}\n  return { ${exportedNames.join(', ')} };\n})();`
    );
  }

  const css = fs.readFileSync(path.resolve(repoRoot, 'styles/main.css'), 'utf8');
  let html = fs.readFileSync(path.resolve(repoRoot, 'index.html'), 'utf8');

  if (!html.includes('<link rel="stylesheet" href="./styles/main.css" />')) {
    throw new Error('Could not find stylesheet link placeholder in index.html');
  }
  if (!html.includes('<script type="module" src="./src/main.js"></script>')) {
    throw new Error('Could not find module script placeholder in index.html');
  }

  // Use function replacers so `$` characters inside CSS or JS are never interpreted as replacement patterns!
  html = html.replace(
    '<link rel="stylesheet" href="./styles/main.css" />',
    () => `<style>\n${css}\n    </style>`
  );
  html = html.replace(
    '<script type="module" src="./src/main.js"></script>',
    () => `<script>\n${chunks.join('\n\n')}\n    </script>`
  );

  return { html, modules };
}

export function writeStandaloneBundle(
  outPath = path.join(REPO_ROOT, 'dist/slay_the_spire_lite.html'),
  repoRoot = REPO_ROOT
) {
  const resolvedOut = path.resolve(outPath);
  const { html, modules } = buildStandaloneHtml(repoRoot);
  fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
  fs.writeFileSync(resolvedOut, html, 'utf8');
  return { outPath: resolvedOut, bytes: Buffer.byteLength(html, 'utf8'), chars: html.length, modules };
}

const isDirectCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectCli) {
  const targetOut = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(REPO_ROOT, 'dist/slay_the_spire_lite.html');
  const res = writeStandaloneBundle(targetOut, REPO_ROOT);
  console.log(
    `Built standalone HTML (${res.modules.length} modules bundled): ${res.outPath} (${res.chars} chars)`
  );
}
