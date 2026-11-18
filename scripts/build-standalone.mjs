import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outPath = path.resolve(process.argv[2] || path.join(REPO_ROOT, 'dist/slay_the_spire_lite.html'));

const MODULES = [
  'src/engine/rng.js',
  'src/engine/math.js',
  'src/engine/meta.js',
  'src/data/relics.js',
  'src/data/cards.js',
  'src/data/enemies.js',
  'src/data/events.js',
  'src/engine/combat.js',
  'src/engine/game.js',
  'src/ui/icons.js',
  'src/ui/app.js',
  'src/main.js',
];

function modVar(relPath) {
  return '__mod_' + relPath.replace(/[^a-zA-Z0-9]/g, '_');
}

const chunks = [];
for (const rel of MODULES) {
  const full = path.resolve(REPO_ROOT, rel);
  let code = fs.readFileSync(full, 'utf8');

  code = code.replace(
    /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;/g,
    (_, specifiers, targetRel) => {
      const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(rel), targetRel));
      const mappedSpecs = specifiers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => s.replace(/\s+as\s+/, ': '))
        .join(', ');
      return `const { ${mappedSpecs} } = ${modVar(resolved)};`;
    }
  );

  const exportedNames = [];
  code = code.replace(
    /^export\s+(async\s+function|function|const|let)\s+([A-Za-z0-9_$]+)/gm,
    (_, kw, name) => {
      exportedNames.push(name);
      return `${kw} ${name}`;
    }
  );

  code = code.replace(/<\/script/gi, '<\\/script');

  chunks.push(
    `const ${modVar(rel)} = (() => {\n${code}\n  return { ${exportedNames.join(', ')} };\n})();`
  );
}

const css = fs.readFileSync(path.resolve(REPO_ROOT, 'styles/main.css'), 'utf8');
let html = fs.readFileSync(path.resolve(REPO_ROOT, 'index.html'), 'utf8');

html = html.replace(
  '<link rel="stylesheet" href="./styles/main.css" />',
  `<style>\n${css}\n    </style>`
);
html = html.replace(
  '<script type="module" src="./src/main.js"></script>',
  `<script>\n${chunks.join('\n\n')}\n    </script>`
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Built standalone HTML: ${outPath} (${html.length} chars)`);
