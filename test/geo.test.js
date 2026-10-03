'use strict';
// Tests for "find my state": the boundary file built by data/geo.js and the on-phone lookup stateAt() in app.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { loadApp } = require('../data/extract');
const { build, simplify } = require('../data/geo');

const GEO_FILE = path.join(__dirname, '..', 'public', 'states.geo.json');
let ev, geo;
test.before(() => {
  ev = loadApp();
  geo = JSON.parse(fs.readFileSync(GEO_FILE, 'utf8'));
  ev(`globalThis.__geo = ${JSON.stringify(geo)};`);
});
const at = (lat, lon) => ev(`stateAt(${lat}, ${lon}, __geo)`);

test('boundary file covers exactly the 36 states/UTs the app knows, with provenance, and stays small', () => {
  const appCodes = Array.from(ev('STATES.map(r=>r[0])')).sort();
  assert.deepEqual(Object.keys(geo.states).sort(), appCodes);
  for (const [code, rings] of Object.entries(geo.states)) {
    assert.ok(rings.length >= 1, code);
    for (const r of rings) assert.ok(r.length >= 6 && r.length % 2 === 0 && r.every(Number.isInteger), code);
  }
  assert.match(geo.source, /natural-earth-vector\/v\d/);   // pinned release, not a moving branch
  assert.match(geo.license, /Public domain/);
  assert.ok(Array.isArray(geo.fixes) && geo.fixes.length >= 1);   // every correction to the source is written down
  assert.equal(geo.scale, 1000);
  assert.ok(fs.statSync(GEO_FILE).size < 150 * 1024, 'states.geo.json grew past 150 KB');
});

test('a town in every state/UT is found in the right state', () => {
  const towns = {
    AN: [11.62, 92.73, 'Port Blair'], AP: [16.51, 80.65, 'Vijayawada'], AR: [27.08, 93.61, 'Itanagar'], AS: [26.14, 91.74, 'Guwahati'],
    BR: [25.59, 85.14, 'Patna'], CH: [30.74, 76.79, 'Chandigarh'], CG: [21.25, 81.63, 'Raipur'], DN: [20.27, 73.01, 'Silvassa'],
    DL: [28.61, 77.21, 'New Delhi'], GA: [15.49, 73.83, 'Panaji'], GJ: [23.02, 72.57, 'Ahmedabad'], HR: [29.07, 76.09, 'Rohtak'],
    HP: [31.10, 77.17, 'Shimla'], JK: [32.73, 74.86, 'Jammu'], JH: [23.34, 85.31, 'Ranchi'], KA: [12.97, 77.59, 'Bengaluru'],
    KL: [8.52, 76.94, 'Thiruvananthapuram'], LA: [34.16, 77.58, 'Leh'], LD: [10.57, 72.64, 'Kavaratti'], MP: [23.26, 77.41, 'Bhopal'],
    MH: [19.08, 72.88, 'Mumbai'], MN: [24.82, 93.94, 'Imphal'], ML: [25.58, 91.89, 'Shillong'], MZ: [23.73, 92.72, 'Aizawl'],
    NL: [25.67, 94.11, 'Kohima'], OD: [20.30, 85.82, 'Bhubaneswar'], PY: [11.93, 79.83, 'Puducherry'], PB: [31.63, 74.87, 'Amritsar'],
    RJ: [26.91, 75.79, 'Jaipur'], SK: [27.33, 88.61, 'Gangtok'], TN: [13.08, 80.27, 'Chennai'], TG: [17.39, 78.49, 'Hyderabad'],
    TR: [23.83, 91.28, 'Agartala'], UP: [26.85, 80.95, 'Lucknow'], UK: [30.32, 78.03, 'Dehradun'], WB: [22.57, 88.36, 'Kolkata']
  };
  for (const [code, [lat, lon, name]] of Object.entries(towns)) assert.equal(at(lat, lon), code, name);
});

test('tricky places: enclaves, cities next to a border, tips and islands', () => {
  const cases = [
    [16.73, 82.21, 'PY', 'Yanam (inside Andhra)'], [10.92, 79.84, 'PY', 'Karaikal'],
    [12.04, 75.36, 'KL', 'Taliparamba (where the source wrongly draws Mahe)'], [12.10, 75.25, 'KL', 'Payyanur side'],
    [30.70, 76.72, 'PB', 'Mohali'], [30.69, 76.86, 'HR', 'Panchkula'], [28.46, 77.03, 'HR', 'Gurugram'], [28.57, 77.32, 'UP', 'Noida'],
    [20.41, 72.83, 'DN', 'Daman'], [20.71, 70.98, 'DN', 'Diu'], [8.08, 77.55, 'TN', 'Kanyakumari'], [9.29, 79.31, 'TN', 'Rameswaram'],
    [17.69, 83.22, 'AP', 'Visakhapatnam beach'], [9.93, 76.26, 'KL', 'Kochi']
  ];
  for (const [lat, lon, code, name] of cases) assert.equal(at(lat, lon), code, name);
});

test('places outside India, the open sea and bad input give no state', () => {
  assert.equal(at(27.72, 85.32), null);   // Kathmandu
  assert.equal(at(23.81, 90.41), null);   // Dhaka
  assert.equal(at(6.93, 79.85), null);    // Colombo
  assert.equal(at(15, 65), null);         // Arabian Sea
  assert.equal(at(NaN, 77), null);
  assert.equal(ev('stateAt(13, 80, null)'), null);
});

test('geo build: keeps only India, renames codes to the app\'s, rounds to integers and simplifies straight lines', () => {
  const sq = [[80, 13], [80.5, 13], [81, 13], [81, 14], [80, 14], [80, 13]];
  const out = build({ features: [
    { properties: { adm0_a3: 'IND', iso_3166_2: 'IN-UT' }, geometry: { type: 'Polygon', coordinates: [sq] } },
    { properties: { adm0_a3: 'IND', iso_3166_2: 'IN-TN' }, geometry: { type: 'MultiPolygon', coordinates: [[sq], [sq]] } },
    { properties: { adm0_a3: 'NPL', iso_3166_2: 'NP-P3' }, geometry: { type: 'Polygon', coordinates: [sq] } }
  ] });
  assert.deepEqual(Object.keys(out.states).sort(), ['TN', 'UK']);
  assert.equal(out.states.TN.length, 2);
  assert.deepEqual(out.states.UK[0], [80000, 13000, 81000, 13000, 81000, 14000, 80000, 14000, 80000, 13000]); // middle point dropped
  // a ring inside a FIXES box is dropped (the misplaced Mahe outline), other rings of that state stay
  const mahe = [[75.3, 12], [75.35, 12], [75.35, 12.05], [75.3, 12], [75.3, 12]];
  const py = build({ features: [{ properties: { adm0_a3: 'IND', iso_3166_2: 'IN-PY' }, geometry: { type: 'MultiPolygon', coordinates: [[mahe], [sq]] } }] });
  assert.equal(py.states.PY.length, 1);
  assert.deepEqual(simplify([[0, 0], [1, 0.001], [2, 0]], 0.01), [[0, 0], [2, 0]]);
  assert.deepEqual(simplify([[0, 0], [1, 1], [2, 0]], 0.01), [[0, 0], [1, 1], [2, 0]]);
});
