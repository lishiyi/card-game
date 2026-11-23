import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const IMPORT_RE = /^\s*import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;/gm;
const EXPORT_FROM_RE = /^\s*export\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;/gm;
const EXPORT_ALL_FROM_RE = /^\s*export\s*\*\s*from\s*['"]([^'"]+)['"]\s*;/gm;
const EXPORT_DECL_RE = /^export\s+(async\s+function|function|const|let)\s+([A-Za-z0-9_$]+)/gm;
const EXPORT_LIST_RE = /^export\s*\{([\s\S]*?)\}\s*;/gm;
const LOCAL_STYLESHEET_LINK_RE = /^[ \t]*<link\s+rel="stylesheet"\s+href="(\.\/styles\/[^"]+\.css)"\s*\/?>[ \t]*\r?\n?/gm;

function normalizeRelPosix(relPath) {
  return relPath.split(path.sep).join('/');
}

function modVar(relPath) {
  return '__mod_' + normalizeRelPosix(relPath).replace(/[^a-zA-Z0-9]/g, '_');
}

function resolveImportTarget(fromRelPosix, targetSpec) {
  if (!targetSpec.startsWith('.')) {
    throw new Error(`Unsupported external package import "${targetSpec}" in ${fromRelPosix}`);
  }
  let resolved = path.posix.normalize(path.posix.join(path.posix.dirname(fromRelPosix), targetSpec));
  if (!path.posix.extname(resolved)) resolved += '.js';
  return resolved;
}

/**
 * Discovers all local CSS stylesheets linked by `index.html` in exact declaration order.
 */
export function discoverStylesheets(repoRoot = REPO_ROOT) {
  const html = fs.readFileSync(path.resolve(repoRoot, 'index.html'), 'utf8');
  const sheets = [];
  for (const match of html.matchAll(LOCAL_STYLESHEET_LINK_RE)) {
    const rel = match[1].replace(/^\.\//, '');
    if (!sheets.includes(rel)) {
      sheets.push(rel);
    }
  }
  return sheets;
}

/**
 * Automatically traverses ES module imports and re-exports starting from `entryRel`
 * (default `src/main.js`) and returns a deterministic post-order topological list
 * of relative POSIX module paths.
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

    const targets = [];
    for (const match of source.matchAll(IMPORT_RE)) targets.push(match[2]);
    for (const match of source.matchAll(EXPORT_FROM_RE)) targets.push(match[2]);
    for (const match of source.matchAll(EXPORT_ALL_FROM_RE)) targets.push(match[1]);

    for (const targetSpec of targets) {
      const resolved = resolveImportTarget(relPosix, targetSpec);
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
 * Computes the complete deterministic list of PWA precache URLs required by `sw.js`,
 * combining static shell/icon assets, all CSS files linked in `index.html`, and every
 * ES module reachable from `src/main.js`.
 */
export function computeExpectedPrecacheUrls(repoRoot = REPO_ROOT) {
  const staticUrls = [
    './',
    './index.html',
    './manifest.webmanifest',
    './icons/icon.svg',
    './icons/icon-192.png',
    './icons/icon-512.png',
  ];
  const cssUrls = discoverStylesheets(repoRoot).map((rel) => `./${rel}`);
  const jsUrls = [...discoverModuleOrder('src/main.js', repoRoot)]
    .sort((a, b) => {
      if (a === 'src/main.js') return -1;
      if (b === 'src/main.js') return 1;
      return a.localeCompare(b);
    })
    .map((rel) => `./${rel}`);
  return [...staticUrls, ...cssUrls, ...jsUrls];
}

/**
 * Compiles all ES modules reachable from `src/main.js` + all local CSS stylesheets linked
 * in `index.html` into a single self-contained standalone HTML string.
 */
export function buildStandaloneHtml(repoRoot = REPO_ROOT) {
  const modules = discoverModuleOrder('src/main.js', repoRoot);
  const stylesheets = discoverStylesheets(repoRoot);
  if (stylesheets.length === 0) {
    throw new Error('Could not find any local ./styles/*.css stylesheet links in index.html');
  }
  const chunks = [];

  for (const rel of modules) {
    const full = path.resolve(repoRoot, rel);
    let code = fs.readFileSync(full, 'utf8');

    const exportedNames = [];

    code = code.replace(IMPORT_RE, (_, specifiers, targetRel) => {
      const resolved = resolveImportTarget(rel, targetRel);
      const mappedSpecs = specifiers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/\s+as\s+/, ': '))
        .join(', ');
      return `const { ${mappedSpecs} } = ${modVar(resolved)};`;
    });

    code = code.replace(EXPORT_ALL_FROM_RE, (_, targetRel) => {
      const resolved = resolveImportTarget(rel, targetRel);
      exportedNames.push(`...${modVar(resolved)}`);
      return '';
    });

    code = code.replace(EXPORT_FROM_RE, (_, specifiers, targetRel) => {
      const resolved = resolveImportTarget(rel, targetRel);
      const items = specifiers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const item of items) {
        const asParts = item.split(/\s+as\s+/);
        if (asParts.length === 2) {
          exportedNames.push(`${asParts[1].trim()}: ${modVar(resolved)}.${asParts[0].trim()}`);
        } else {
          exportedNames.push(`${item}: ${modVar(resolved)}.${item}`);
        }
      }
      return '';
    });

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

  const css = stylesheets
    .map((rel) => {
      const fullCss = path.resolve(repoRoot, rel);
      const content = fs.readFileSync(fullCss, 'utf8');
      return `/* === Stylesheet: ${rel} === */\n${content}`;
    })
    .join('\n\n');
  let html = fs.readFileSync(path.resolve(repoRoot, 'index.html'), 'utf8');

  if (!html.includes('<script type="module" src="./src/main.js"></script>')) {
    throw new Error('Could not find module script placeholder in index.html');
  }

  // Strip external PWA asset links so standalone HTML remains 100% self-contained
  html = html.replace(/^\s*<link rel="(manifest|apple-touch-icon)"[^>]*>\r?\n/gm, '');

  // Replace the first stylesheet link with the combined <style> block and strip subsequent links.
  // Use function replacers so `$` characters inside CSS or JS are never interpreted as replacement patterns!
  let injectedCss = false;
  html = html.replace(LOCAL_STYLESHEET_LINK_RE, () => {
    if (!injectedCss) {
      injectedCss = true;
      return `    <style>\n${css}\n    </style>\n`;
    }
    return '';
  });
  if (!injectedCss) {
    throw new Error('Failed to inject combined CSS into standalone HTML');
  }
  html = html.replace(
    '<script type="module" src="./src/main.js"></script>',
    () => `<script>\n${chunks.join('\n\n')}\n    </script>`
  );

  return { html, modules, stylesheets };
}

export function writeStandaloneBundle(
  outPath = path.join(REPO_ROOT, 'dist/slay_the_spire_lite.html'),
  repoRoot = REPO_ROOT
) {
  const resolvedOut = path.resolve(outPath);
  const { html, modules, stylesheets } = buildStandaloneHtml(repoRoot);
  fs.mkdirSync(path.dirname(resolvedOut), { recursive: true });
  fs.writeFileSync(resolvedOut, html, 'utf8');
  return {
    outPath: resolvedOut,
    bytes: Buffer.byteLength(html, 'utf8'),
    chars: html.length,
    modules,
    stylesheets,
  };
}

const isDirectCli =
  process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;

if (isDirectCli) {
  const targetOut = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.join(REPO_ROOT, 'dist/slay_the_spire_lite.html');
  const res = writeStandaloneBundle(targetOut, REPO_ROOT);
  console.log(
    `Built standalone HTML (${res.modules.length} modules, ${res.stylesheets.length} stylesheets bundled): ${res.outPath} (${res.chars} chars)`
  );
}
