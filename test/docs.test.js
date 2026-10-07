'use strict';
// The architecture pictures must stay in step with their Mermaid sources and with the pages that show them.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { diagrams } = require('../tools/render-diagrams');

const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

test('every Mermaid diagram names a picture that exists and is shown above its source', () => {
  const doc = read('docs/ARCHITECTURE.md');
  const list = diagrams(doc);
  assert.ok(list.length >= 19);
  const names = list.map(d => d.name);
  assert.deepStrictEqual(names.filter(n => !n), [], 'a mermaid block has no "%% file: <name>" line');
  assert.strictEqual(new Set(names).size, names.length, 'two diagrams share a file name');
  for (const n of names) {
    assert.ok(fs.existsSync(path.join(ROOT, 'docs', 'diagrams', n + '.png')), `docs/diagrams/${n}.png is missing: run node tools/render-diagrams.js`);
    assert.ok(doc.includes(`](diagrams/${n}.png)`), `docs/ARCHITECTURE.md does not show ${n}.png`);
  }
  const pngs = fs.readdirSync(path.join(ROOT, 'docs', 'diagrams')).filter(f => f.endsWith('.png'));
  assert.deepStrictEqual(pngs.filter(f => !names.includes(f.replace(/\.png$/, ''))), [], 'a picture has no Mermaid source');
});

test('the README shows architecture pictures that exist', () => {
  const imgs = [...read('README.md').matchAll(/!\[[^\]]*\]\((docs\/diagrams\/[^)]+)\)/g)].map(m => m[1]);
  assert.ok(imgs.length >= 5);
  for (const f of imgs) assert.ok(fs.existsSync(path.join(ROOT, f)), f + ' is missing');
});
