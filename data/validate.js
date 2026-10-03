'use strict';
/**
 * Validate: data-quality checks for the scheme registry, plus a freshness report.
 *
 *   node data/validate.js                 report; exit 1 only on ERRORS
 *   node data/validate.js --strict        also fail when verified data is STALE
 *   node data/validate.js --check-links   also request every official URL (needs internet; failures are warnings)
 *   node data/validate.js --json          machine-readable output
 *
 * Severity:
 *   error   the data is wrong or incomplete (bad phone, link not on the allow-list, missing source entry ...)
 *   stale   a verification is older than review_every_days            (error with --strict)
 *   warning never verified, or a known upcoming change is pending
 */
const fs = require('fs');
const path = require('path');
const { buildRegistry } = require('./extract');

const SOURCES_FILE = path.join(__dirname, 'sources.json');
const DAY = 86400000;

/** Hosts that may be linked from the app: government portals and the gas companies' own booking sites. */
const ALLOWED_HOST = /(^|\.)(gov\.in|nic\.in|indianoil\.in|ebharatgas\.com|myhpgas\.in|npci\.org\.in)$/i;
const PHONE = /^(\*99#|[0-9]{3,12})$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const daysBetween = (a, b) => Math.floor((Date.parse(b) - Date.parse(a)) / DAY);

/**
 * @param {{schemes:object[],helplines:object[],links:object[]}} reg  output of buildRegistry()
 * @param {{schemes:object[]}} sources                                  contents of data/sources.json
 * @param {{today?:string}} [opts]
 * @returns {{errors:string[], stale:string[], warnings:string[], rows:object[], summary:object}}
 */
function validate(reg, sources, { today = new Date().toISOString().slice(0, 10) } = {}) {
  const errors = [], stale = [], warnings = [];
  const ids = new Set();
  const srcById = new Map();

  for (const s of sources.schemes || []) {
    if (srcById.has(s.scheme_id)) errors.push(`sources: duplicate entry for ${s.scheme_id}`);
    srcById.set(s.scheme_id, s);
  }

  for (const s of reg.schemes) {
    if (ids.has(s.scheme_id)) errors.push(`${s.scheme_id}: duplicate scheme_id`);
    ids.add(s.scheme_id);
    for (const l of ['en', 'hi', 'te', 'ta']) if (!s['name_' + l]) errors.push(`${s.scheme_id}: missing name_${l}`);
    if (!s.facts_en || s.facts_en.length < 40) errors.push(`${s.scheme_id}: facts_en missing or too short`);
    if (s.kind === 'state_cash' && (!s.amount_label || !s.state_code)) errors.push(`${s.scheme_id}: state cash scheme needs amount_label and state_code`);
    if (!reg.helplines.some(h => h.scheme_id === s.scheme_id)) errors.push(`${s.scheme_id}: no helpline`);
    if (!reg.links.some(k => k.scheme_id === s.scheme_id)) errors.push(`${s.scheme_id}: no official website link`);
  }

  for (const h of reg.helplines) {
    if (!PHONE.test(h.number)) errors.push(`${h.scheme_id}: malformed helpline "${h.number}"`);
  }
  const seenPos = new Set();
  for (const k of reg.links) {
    const key = k.scheme_id + '#' + k.position;
    if (seenPos.has(key)) errors.push(`${key}: duplicate link position`);
    seenPos.add(key);
    if (!/^https:\/\//.test(k.url)) errors.push(`${k.scheme_id}: link is not https (${k.url})`);
    else if (!k.host || !ALLOWED_HOST.test(k.host)) errors.push(`${k.scheme_id}: host ${k.host} is not on the allow-list`);
  }

  const rows = [];
  for (const s of reg.schemes) {
    const src = srcById.get(s.scheme_id);
    if (!src) { errors.push(`${s.scheme_id}: no entry in data/sources.json`); continue; }
    if (!/^https:\/\//.test(src.official_source_url || '')) errors.push(`${s.scheme_id}: official_source_url must be https`);
    else if (!ALLOWED_HOST.test(new URL(src.official_source_url).hostname)) errors.push(`${s.scheme_id}: source host not on the allow-list`);
    if (!(src.review_every_days > 0)) errors.push(`${s.scheme_id}: review_every_days must be a positive number`);

    let status, age = null;
    if (src.last_verified == null) {
      status = 'unverified';
      warnings.push(`${s.scheme_id}: never verified`);
    } else if (!ISO_DATE.test(src.last_verified) || Number.isNaN(Date.parse(src.last_verified))) {
      status = 'invalid';
      errors.push(`${s.scheme_id}: last_verified "${src.last_verified}" is not YYYY-MM-DD`);
    } else if (src.last_verified > today) {
      status = 'invalid';
      errors.push(`${s.scheme_id}: last_verified is in the future`);
    } else {
      age = daysBetween(src.last_verified, today);
      if (!src.evidence_url) errors.push(`${s.scheme_id}: verified but no evidence_url recorded`);
      if (age > src.review_every_days) { status = 'stale'; stale.push(`${s.scheme_id}: verified ${age} days ago (review every ${src.review_every_days})`); }
      else status = 'fresh';
    }
    if (src.pending_change) warnings.push(`${s.scheme_id}: pending change - ${src.pending_change}`);
    rows.push({
      scheme_id: s.scheme_id, kind: s.kind, status, last_verified: src.last_verified ?? null, age_days: age,
      review_every_days: src.review_every_days, pending_change: !!src.pending_change
    });
  }
  for (const id of srcById.keys()) if (!ids.has(id)) errors.push(`sources: ${id} is not a scheme in the app`);

  const count = st => rows.filter(r => r.status === st).length;
  return {
    errors, stale, warnings, rows,
    summary: { schemes: reg.schemes.length, fresh: count('fresh'), stale: count('stale'), unverified: count('unverified'),
      pending_changes: rows.filter(r => r.pending_change).length, errors: errors.length }
  };
}

/** Request every official URL. Government sites often block bots, so failures are reported, not fatal. */
async function checkLinks(reg, { timeoutMs = 10000, fetchImpl = globalThis.fetch } = {}) {
  const out = [];
  for (const k of reg.links) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeoutMs);
    try {
      let r = await fetchImpl(k.url, { method: 'HEAD', redirect: 'follow', signal: ctl.signal });
      if (r.status === 405 || r.status === 403) r = await fetchImpl(k.url, { method: 'GET', redirect: 'follow', signal: ctl.signal });
      out.push({ scheme_id: k.scheme_id, url: k.url, ok: r.ok, status: r.status });
    } catch (e) {
      out.push({ scheme_id: k.scheme_id, url: k.url, ok: false, status: 0, error: e.name === 'AbortError' ? 'timeout' : e.message });
    } finally { clearTimeout(t); }
  }
  return out;
}

function printReport(res, linkResults) {
  const pad = (v, n) => String(v).padEnd(n);
  console.log(pad('SCHEME', 13) + pad('KIND', 16) + pad('STATUS', 12) + pad('VERIFIED', 12) + 'AGE  PENDING');
  for (const r of res.rows) console.log(pad(r.scheme_id, 13) + pad(r.kind, 16) + pad(r.status, 12) + pad(r.last_verified || '-', 12) + pad(r.age_days ?? '-', 5) + (r.pending_change ? 'yes' : ''));
  const s = res.summary;
  console.log(`\n${s.schemes} schemes: ${s.fresh} fresh, ${s.stale} stale, ${s.unverified} unverified, ${s.pending_changes} with a pending change, ${s.errors} errors`);
  if (res.errors.length) console.log('\nERRORS\n' + res.errors.map(e => '  - ' + e).join('\n'));
  if (res.stale.length) console.log('\nSTALE\n' + res.stale.map(e => '  - ' + e).join('\n'));
  if (linkResults) {
    const bad = linkResults.filter(l => !l.ok);
    console.log(`\nLINKS: ${linkResults.length - bad.length}/${linkResults.length} reachable`);
    bad.forEach(l => console.log(`  - ${l.scheme_id} ${l.url} -> ${l.status || l.error}`));
  }
}

module.exports = { validate, checkLinks, ALLOWED_HOST, PHONE, SOURCES_FILE };

if (require.main === module) {
  const args = new Set(process.argv.slice(2));
  const reg = buildRegistry();
  const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, 'utf8'));
  const res = validate(reg, sources);
  (async () => {
    const links = args.has('--check-links') ? await checkLinks(reg) : null;
    if (args.has('--json')) console.log(JSON.stringify({ ...res, links }, null, 2)); else printReport(res, links);
    const fail = res.errors.length > 0 || (args.has('--strict') && res.stale.length > 0);
    process.exit(fail ? 1 : 0);
  })();
}
