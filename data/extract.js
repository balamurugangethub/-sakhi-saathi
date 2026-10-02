'use strict';
/**
 * Extract: turns the scheme content that lives inside public/app.js into normalized,
 * warehouse-ready tables (one row per entity, flat columns, stable keys).
 *
 *   node data/extract.js          -> writes data/build/{schemes,helplines,links}.ndjson + registry.json
 *
 * The app stays the single source of truth for what users see; this step reads it
 * exactly as the browser would (jsdom) so the pipeline can never drift from the product.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const BUILD_DIR = path.join(__dirname, 'build');
const LANGS = ['en', 'hi', 'te', 'ta'];

/** Load the real page in jsdom and return a function that evaluates code in its global scope. */
function loadApp() {
  const root = path.join(ROOT, 'public');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<script[^>]*src="app.js"[^>]*><\/script>/, '');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.fetch = () => Promise.reject(new Error('offline'));
  const ctx = dom.getInternalVMContext();
  const ev = code => new vm.Script(code).runInContext(ctx);
  ev(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
  return ev;
}

const text = (v, l) => (v && typeof v === 'object' ? v[l] : v) || null;

/** Classify a service: basic (no eligibility), central scheme, or a state cash scheme. */
function kindOf(s) {
  if (s.stateOnly) return 'state_cash';
  if (s.basic) return 'basic_service';
  return 'central_scheme';
}

/**
 * First rupee amount mentioned in the English facts, in rupees: "Rs 5,000" -> 5000, "Rs 2.5 lakh" -> 250000.
 * It is the first figure in the text, not necessarily the benefit (it can be an income limit), so the
 * column is named first_amount_mentioned_inr and is only a coarse signal for change detection.
 */
function firstAmount(facts) {
  const m = /(?:Rs\.?|₹)\s?([0-9][0-9,]*(?:\.[0-9]+)?)\s*(lakh|crore)?/i.exec(facts || '');
  if (!m) return null;
  const mult = { lakh: 1e5, crore: 1e7 }[(m[2] || '').toLowerCase()] || 1;
  return Math.round(Number(m[1].replace(/,/g, '')) * mult);
}

/**
 * Build the registry from the live app definitions.
 * @returns {{schemes: object[], helplines: object[], links: object[], extracted_from: string}}
 */
function buildRegistry(ev = loadApp()) {
  const raw = JSON.parse(ev(`JSON.stringify(S.map(s=>({
    id:s.id, stateOnly:!!s.stateOnly, basic:!!s.basic, facts:s.f||'',
    name:s.name, questions:(s.qs||[]).length, documents:(s.docs||[]).length,
    calls:(s.calls||[]).map(c=>[typeof c[0]==='string'?{en:c[0]}:c[0], c[1]])
  })))`));
  const links = JSON.parse(ev('JSON.stringify(LINKS)'));
  const cash = JSON.parse(ev('JSON.stringify(Object.fromEntries(Object.entries(CASH).map(([k,v])=>[k,{n:v.n,a:v.a,per:v.per,lo:v.lo,hi:v.hi}])))'));

  const schemes = [], helplines = [], linkRows = [];
  for (const s of raw) {
    const code = s.id.startsWith('cash_') ? s.id.slice(5) : null;
    const c = code ? cash[code] : null;
    schemes.push({
      scheme_id: s.id,
      kind: kindOf({ stateOnly: s.stateOnly, basic: s.basic }),
      state_code: code,
      name_en: text(s.name, 'en') || (c ? `${c.n}: ${c.a}` : s.id),
      name_hi: text(s.name, 'hi'), name_te: text(s.name, 'te'), name_ta: text(s.name, 'ta'),
      amount_label: c ? c.a : null,
      amount_period: c ? (c.per === 'y' ? 'yearly' : 'monthly') : null,
      first_amount_mentioned_inr: firstAmount(s.facts),
      age_min: c ? c.lo : null,
      age_max: c ? c.hi : null,
      question_count: s.questions,
      document_count: s.documents,
      facts_en: s.facts,
      facts_chars: s.facts.length
    });
    s.calls.forEach(([label, number], i) => helplines.push({
      scheme_id: s.id, position: i + 1, label_en: label.en || null, number, is_toll_free: /^1800/.test(number) || number === '1906' || number === '181' || number === '14555'
    }));
    (links[s.id] || []).forEach(([label, url], i) => {
      let host = null; try { host = new URL(url).hostname; } catch { /* kept null, validator reports it */ }
      linkRows.push({ scheme_id: s.id, position: i + 1, label, url, host });
    });
  }
  return { schemes, helplines, links: linkRows, extracted_from: 'public/app.js' };
}

/** Write the registry as JSON plus newline-delimited JSON tables (BigQuery load format). */
function writeBuild(reg, dir = BUILD_DIR) {
  fs.mkdirSync(dir, { recursive: true });
  const nd = rows => rows.map(r => JSON.stringify(r)).join('\n') + '\n';
  fs.writeFileSync(path.join(dir, 'schemes.ndjson'), nd(reg.schemes));
  fs.writeFileSync(path.join(dir, 'helplines.ndjson'), nd(reg.helplines));
  fs.writeFileSync(path.join(dir, 'links.ndjson'), nd(reg.links));
  fs.writeFileSync(path.join(dir, 'registry.json'), JSON.stringify(reg, null, 2));
  return dir;
}

module.exports = { loadApp, buildRegistry, writeBuild, firstAmount, BUILD_DIR, LANGS };

if (require.main === module) {
  const reg = buildRegistry();
  const dir = writeBuild(reg);
  console.log(`extracted ${reg.schemes.length} schemes, ${reg.helplines.length} helplines, ${reg.links.length} links -> ${path.relative(ROOT, dir)}/`);
}
