'use strict';
/**
 * Geo build: turns public-domain state boundaries into a small file the phone can use to find
 * her state from GPS, without sending the location anywhere.
 *
 *   node data/geo.js [boundaries.geojson]   -> writes public/states.geo.json
 *
 * Source: Natural Earth 1:10m admin-1 states and provinces, pinned to release v5.1.2 (public domain).
 * Without an argument the file is downloaded from the pinned release (about 40 MB, only needed when rebuilding).
 *
 * Pipeline: filter India -> map ISO 3166-2 codes to the app's state codes -> drop known source errors (FIXES) -> simplify each ring
 * (Douglas-Peucker) -> round to 0.001 degree (about 110 m) and store as integers -> check coverage.
 * Output shape: { source, license, version, scale, states: { TN: [ring, ring, ...] } }, where a ring is a
 * flat [lon, lat, lon, lat, ...] list of integers (degrees x scale). Holes are just more rings: the
 * lookup uses the even-odd rule, so a point inside a hole counts as outside.
 */
const fs = require('fs');
const path = require('path');

const VERSION = 'v5.1.2';
const SOURCE_URL = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${VERSION}/geojson/ne_10m_admin_1_states_provinces.geojson`;
const OUT = path.join(__dirname, '..', 'public', 'states.geo.json');
const SCALE = 1000;        // 0.001 degree, about 110 m: far finer than a state border needs
const TOLERANCE = 0.01;    // simplification in degrees (about 1 km); the source itself is a 1:10m map
// Natural Earth ISO 3166-2 suffix -> the app's state code, where they differ
const RENAME = { UT: 'UK', OR: 'OD', CT: 'CG', DH: 'DN' };
// Known errors in the source, removed on purpose. Each entry drops the rings of `code` whose bounding box lies inside `box`
// ([west, south, east, north] in degrees). A dropped area falls back to the nearest state in the lookup.
const FIXES = [
  { code: 'PY', box: [75.0, 11.5, 75.6, 12.3],
    why: 'Natural Earth v5.1.2 draws Mahe (Puducherry) about 30 km north of the real town (11.70 N, 75.54 E), over Taliparamba in Kerala. ' +
         'Without this fix women around Taliparamba would be offered Puducherry; with it they get Kerala. Mahe itself then shows as Kerala, ' +
         'and she can say No and pick Puducherry from the list.' }
];
const inBox = (ring, [w, s, e, n]) => ring.every(([x, y]) => x >= w && x <= e && y >= s && y <= n);

/** Perpendicular distance from p to segment a-b (in degrees; fine for simplification). */
function segDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = dx * dx + dy * dy;
  let t = len ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len : 0;
  t = Math.max(0, Math.min(1, t));
  const x = a[0] + t * dx - p[0], y = a[1] + t * dy - p[1];
  return Math.sqrt(x * x + y * y);
}

/** Douglas-Peucker: keep only the points that change the shape by more than `tol`. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts.slice();
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let max = 0, idx = -1;
    for (let i = s + 1; i < e; i++) { const d = segDist(pts[i], pts[s], pts[e]); if (d > max) { max = d; idx = i; } }
    if (max > tol) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}

/** One ring -> flat integer list. Tiny islands that simplify away keep their original points. */
function encodeRing(ring) {
  let pts = simplify(ring, TOLERANCE);
  if (pts.length < 4) pts = ring;
  const flat = [];
  for (const [lon, lat] of pts) {
    const x = Math.round(lon * SCALE), y = Math.round(lat * SCALE);
    if (flat.length && flat[flat.length - 2] === x && flat[flat.length - 1] === y) continue;
    flat.push(x, y);
  }
  return flat;
}

/** GeoJSON FeatureCollection -> the compact { states } object. */
function build(geojson) {
  const states = {};
  for (const f of geojson.features) {
    const p = f.properties;
    if (p.adm0_a3 !== 'IND') continue;
    const iso = String(p.iso_3166_2 || '').replace(/^IN-/, '');
    const code = RENAME[iso] || iso;
    const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    const rings = states[code] || (states[code] = []);
    const fixes = FIXES.filter(x => x.code === code);
    for (const poly of polys) for (const ring of poly) {
      if (fixes.some(x => inBox(ring, x.box))) continue;
      const r = encodeRing(ring); if (r.length >= 6) rings.push(r);
    }
  }
  return {
    source: SOURCE_URL,
    license: 'Public domain (Natural Earth, https://www.naturalearthdata.com/about/terms-of-use/)',
    version: VERSION,
    scale: SCALE,
    note: 'Built by data/geo.js. Used only on the phone to turn GPS into a state; the location is never sent or stored.',
    fixes: FIXES.map(x => x.why),
    states
  };
}

async function main() {
  const arg = process.argv[2];
  let raw;
  if (arg) raw = fs.readFileSync(arg, 'utf8');
  else {
    console.log('Downloading', SOURCE_URL);
    const r = await fetch(SOURCE_URL);
    if (!r.ok) throw new Error('download failed: HTTP ' + r.status);
    raw = await r.text();
  }
  const out = build(JSON.parse(raw));
  const codes = Object.keys(out.states).sort();
  const points = codes.reduce((n, c) => n + out.states[c].reduce((m, r) => m + r.length / 2, 0), 0);
  const json = JSON.stringify(out);
  fs.writeFileSync(OUT, json + '\n');
  console.log(`${codes.length} states/UTs, ${points} points, ${(json.length / 1024).toFixed(0)} KB -> ${path.relative(process.cwd(), OUT)}`);
  console.log(codes.join(' '));
}

if (require.main === module) main().catch(e => { console.error(e.message); process.exit(1); });
module.exports = { build, simplify, encodeRing, RENAME, FIXES, SCALE };
