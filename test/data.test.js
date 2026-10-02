'use strict';
// Tests for the data layer: extraction, validation rules, freshness logic and link checking.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { buildRegistry, writeBuild, firstAmount } = require('../data/extract');
const { validate, checkLinks, SOURCES_FILE } = require('../data/validate');

const TODAY = '2026-10-02';
let reg, sources;
test.before(() => {
  reg = buildRegistry();
  sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf8'));
});
const clone = o => JSON.parse(JSON.stringify(o));

test('extraction produces one row per service with the expected columns', () => {
  assert.ok(reg.schemes.length >= 17);
  assert.equal(new Set(reg.schemes.map(s => s.scheme_id)).size, reg.schemes.length);
  for (const s of reg.schemes) {
    for (const col of ['scheme_id', 'kind', 'name_en', 'name_hi', 'name_te', 'name_ta', 'facts_en', 'question_count', 'document_count'])
      assert.ok(col in s, `${s.scheme_id} lacks ${col}`);
    assert.ok(['basic_service', 'central_scheme', 'state_cash'].includes(s.kind));
  }
  assert.ok(reg.helplines.length >= reg.schemes.length);
  assert.ok(reg.links.length >= reg.schemes.length);
});

test('state cash schemes carry state, amount and period', () => {
  const wb = reg.schemes.find(s => s.scheme_id === 'cash_WB');
  assert.equal(wb.kind, 'state_cash');
  assert.equal(wb.state_code, 'WB');
  assert.equal(wb.amount_label, '₹3,000');
  assert.equal(wb.amount_period, 'monthly');
  assert.equal(reg.schemes.find(s => s.scheme_id === 'cash_OD').amount_period, 'yearly');
});

test('amount parsing understands lakh and crore and ignores missing amounts', () => {
  assert.equal(firstAmount('Rs 5,000 in 3 instalments'), 5000);
  assert.equal(firstAmount('cover of Rs 2.5 lakh'), 250000);
  assert.equal(firstAmount('₹1 crore fund'), 10000000);
  assert.equal(firstAmount('no money mentioned'), null);
});

test('NDJSON export writes parseable tables', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sakhi-build-'));
  writeBuild(reg, dir);
  for (const f of ['schemes', 'helplines', 'links']) {
    const lines = fs.readFileSync(path.join(dir, f + '.ndjson'), 'utf8').trim().split('\n');
    assert.equal(lines.length, reg[f].length);
    lines.forEach(l => JSON.parse(l));
  }
  fs.rmSync(dir, { recursive: true, force: true });
});

test('the real data has no validation errors', () => {
  const res = validate(reg, sources, { today: TODAY });
  assert.deepEqual(res.errors, []);
});

test('validator catches a malformed helpline', () => {
  const r = clone(reg); r.helplines[0].number = '12-34';
  assert.ok(validate(r, sources, { today: TODAY }).errors.some(e => /malformed helpline/.test(e)));
});

test('validator rejects links that are not https or not on the allow-list', () => {
  let r = clone(reg); r.links[0].url = 'http://cx.indianoil.in'; r.links[0].host = 'cx.indianoil.in';
  assert.ok(validate(r, sources, { today: TODAY }).errors.some(e => /not https/.test(e)));
  r = clone(reg); r.links[0].url = 'https://evil.example.com'; r.links[0].host = 'evil.example.com';
  assert.ok(validate(r, sources, { today: TODAY }).errors.some(e => /allow-list/.test(e)));
});

test('validator requires a sources entry for every scheme and no orphans', () => {
  let s = clone(sources); s.schemes = s.schemes.filter(x => x.scheme_id !== 'lpg');
  assert.ok(validate(reg, s, { today: TODAY }).errors.some(e => /lpg: no entry/.test(e)));
  s = clone(sources); s.schemes.push({ scheme_id: 'ghost', official_source_url: 'https://pmjdy.gov.in', last_verified: null, review_every_days: 30 });
  assert.ok(validate(reg, s, { today: TODAY }).errors.some(e => /ghost is not a scheme/.test(e)));
});

test('freshness: fresh, stale, unverified, future and missing evidence are told apart', () => {
  const s = clone(sources);
  const set = (id, patch) => Object.assign(s.schemes.find(x => x.scheme_id === id), patch);
  set('lpg', { last_verified: '2026-09-20', evidence_url: 'https://example.org/x', review_every_days: 60 });   // 12 days old
  set('ujjwala', { last_verified: '2026-01-01', evidence_url: 'https://example.org/x', review_every_days: 60 }); // 274 days old
  set('pmmvy', { last_verified: '2027-01-01', evidence_url: 'https://example.org/x' });                         // future
  set('skill', { last_verified: '2026-09-30', evidence_url: null });                                           // no evidence
  const res = validate(reg, s, { today: TODAY });
  const st = id => res.rows.find(r => r.scheme_id === id).status;
  assert.equal(st('lpg'), 'fresh');
  assert.equal(st('ujjwala'), 'stale');
  assert.equal(st('balance'), 'unverified');
  assert.equal(st('pmmvy'), 'invalid');
  assert.ok(res.errors.some(e => /pmmvy: last_verified is in the future/.test(e)));
  assert.ok(res.errors.some(e => /skill: verified but no evidence_url/.test(e)));
  assert.ok(res.stale.some(e => /ujjwala/.test(e)));
  assert.ok(res.summary.stale >= 1 && res.summary.unverified >= 1 && res.summary.fresh >= 1);
});

test('pending changes are surfaced as warnings', () => {
  const res = validate(reg, sources, { today: TODAY });
  assert.ok(res.warnings.some(w => /urimai: pending change/.test(w)));
  assert.ok(res.summary.pending_changes >= 1);
});

test('link checker reports ok, falls back to GET on 405 and records failures', async () => {
  const mini = { links: [
    { scheme_id: 'a', url: 'https://a.gov.in' }, { scheme_id: 'b', url: 'https://b.gov.in' },
    { scheme_id: 'c', url: 'https://c.gov.in' }, { scheme_id: 'd', url: 'https://d.gov.in' }] };
  const fake = async (url, { method }) => {
    if (url.includes('a.gov')) return { ok: true, status: 200 };
    if (url.includes('b.gov')) return method === 'HEAD' ? { ok: false, status: 405 } : { ok: true, status: 200 };
    if (url.includes('c.gov')) return { ok: false, status: 404 };
    throw new Error('ECONNRESET');
  };
  const out = await checkLinks(mini, { fetchImpl: fake });
  assert.deepEqual(out.map(o => o.ok), [true, true, false, false]);
  assert.equal(out[2].status, 404);
  assert.match(out[3].error, /ECONNRESET/);
});
