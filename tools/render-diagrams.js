'use strict';
/**
 * Redraws the PNG pictures in docs/diagrams/ from the Mermaid sources in docs/ARCHITECTURE.md.
 *
 *   node tools/render-diagrams.js          -> every diagram
 *   node tools/render-diagrams.js 04 11    -> only diagrams whose file name starts with 04 or 11
 *
 * Each ```mermaid block starts with a "%% file: <name>" line that names its picture (docs/diagrams/<name>.png).
 * Uses mermaid-cli through npx (downloaded on first use, needs internet and a Chrome/Chromium).
 * Set MMDC to a local mmdc binary, and PUPPETEER_CONFIG to a puppeteer JSON config
 * (for example {"executablePath":"/path/to/chromium"}), when the defaults do not work.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const DOC = path.join(__dirname, '..', 'docs', 'ARCHITECTURE.md');
const OUT = path.join(__dirname, '..', 'docs', 'diagrams');

/** [{ name, source }] for every Mermaid block in the doc, in order. */
function diagrams(markdown) {
  return [...markdown.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(m => {
    const name = (/^%% file: ([a-z0-9-]+)\s*$/m.exec(m[1]) || [])[1];
    return { name, source: m[1] };
  });
}

function main() {
  const only = process.argv.slice(2);
  const list = diagrams(fs.readFileSync(DOC, 'utf8')).filter(d => !only.length || only.some(p => d.name && d.name.startsWith(p)));
  const unnamed = list.filter(d => !d.name);
  if (unnamed.length) { console.error(`${unnamed.length} mermaid block(s) have no "%% file: <name>" line`); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'diagrams-'));
  const [cmd, ...pre] = process.env.MMDC ? [process.env.MMDC] : ['npx', '-y', '@mermaid-js/mermaid-cli'];
  const cfg = process.env.PUPPETEER_CONFIG ? ['-p', process.env.PUPPETEER_CONFIG] : [];
  for (const d of list) {
    const src = path.join(tmp, d.name + '.mmd');
    fs.writeFileSync(src, d.source);
    execFileSync(cmd, [...pre, ...cfg, '-i', src, '-o', path.join(OUT, d.name + '.png'), '-s', '2', '-b', 'white', '-q'], { stdio: 'inherit' });
    console.log('drew docs/diagrams/' + d.name + '.png');
  }
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (require.main === module) main();
module.exports = { diagrams };
