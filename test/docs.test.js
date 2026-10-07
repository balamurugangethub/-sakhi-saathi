'use strict';
// The README shows some of the architecture diagrams; their sources live in docs/ARCHITECTURE.md. Keep the copies identical.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const read = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const mermaid = md => [...md.matchAll(/```mermaid\n([\s\S]*?)```/g)].map(m => m[1]);

test('docs/ARCHITECTURE.md holds every diagram as Mermaid that GitHub draws', () => {
  const doc = read('docs/ARCHITECTURE.md');
  assert.ok(mermaid(doc).length >= 19);
  assert.ok(!/!\[[^\]]*\]\([^)]*\.png\)/.test(doc), 'diagrams should be Mermaid, not pasted images');
});

test('every diagram in the README is an exact copy of one in docs/ARCHITECTURE.md', () => {
  const sources = new Set(mermaid(read('docs/ARCHITECTURE.md')));
  const shown = mermaid(read('README.md'));
  assert.ok(shown.length >= 5);
  shown.forEach((d, i) => assert.ok(sources.has(d), `README diagram ${i + 1} differs from its source in docs/ARCHITECTURE.md:\n${d.split('\n')[0]}`));
});
