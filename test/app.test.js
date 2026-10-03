'use strict';
// Loads the real page in jsdom and checks content completeness, eligibility rules, routing and accessibility basics.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const { JSDOM } = require('jsdom');

let win, ctx;
// run code in the page's own global scope so top-level const/let (S, U, PU ...) are visible
const ev = code => new vm.Script(code).runInContext(ctx);
const tick = () => new Promise(r => setTimeout(r, 0));
const settle = async () => { for (let i = 0; i < 8; i++) await tick(); };
/** A stand-in for the browser's speech recognition: sr.say(text) is her answer, sr.silence() is nothing heard. */
function fakeRecognition() {
  const made = [];
  class FakeSR { constructor() { made.push(this); } start() {} abort() { this.aborted = true; } }
  win.SpeechRecognition = FakeSR;
  const last = () => made[made.length - 1];
  return {
    count: () => made.length,
    say(text) { const res = [{ transcript: text }]; res.isFinal = true; last().onresult({ resultIndex: 0, results: [res] }); },
    silence() { const r = last(); r.onerror({ error: 'no-speech' }); r.onend(); },
    restore() { delete win.SpeechRecognition; }
  };
}
const EMOJI = /[\u{1F300}-\u{1FAFF}✅❌⬅ℹ▶❓✏]/u;

test.before(() => {
  const root = path.join(__dirname, '..', 'public');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<script[^>]*src="app.js"[^>]*><\/script>/, '');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
  win = dom.window; ctx = dom.getInternalVMContext();
  win.fetch = () => Promise.reject(new Error('offline'));
  ev(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
});

test('all core languages are complete for every scheme', () => {
  const missing = ev(`(()=>{ const m=[]; for(const l of ['hi','ta','te','en']){ for(const s of S){
    for(const k of ['name','d','where','info']) if(!s[k][l]) m.push(s.id+'.'+k+'.'+l);
    s.qs.forEach((q,i)=>{ if(!q[l]) m.push(s.id+'.q'+i+'.'+l); });
    s.docs.forEach((d,i)=>{ if(!d[1][l]) m.push(s.id+'.doc'+i+'.'+l); });
    s.calls.forEach((c,i)=>{ if(typeof c[0]!=='string' && !c[0][l]) m.push(s.id+'.call'+i+'.'+l); });
    if(!s.calls.length) m.push(s.id+'.nocalls'); if(!s.f) m.push(s.id+'.nofacts'); }
    for(const k of Object.keys(U.en)) if(U[l][k]===undefined) m.push('U.'+k+'.'+l);
    for(const k of Object.keys(PU.en)) if(PU[l][k]===undefined) m.push('PU.'+k+'.'+l);
    PQ.forEach(q=>{ if(!q.q[l]) m.push('PQ.'+q.k+'.'+l); q.o.forEach(o=>{ if(o[1] && !o[1][l]) m.push('PQ.'+q.k+'.'+o[0]+'.'+l); }); }); }
    STATES.forEach(r=>{ for(let i=1;i<=4;i++) if(!r[i]) m.push('state.'+r[0]+i); });
    return m; })()`);
  assert.deepEqual(Array.from(missing), []);
});

test('there are 36 states/UTs, 12+ services, and phone numbers look valid', () => {
  assert.equal(ev('STATES.length'), 36);
  assert.ok(ev('S.length') >= 12);
  const bad = ev(`S.flatMap(s=>s.calls.filter(c=>!/^(\\*99#|[0-9]{3,12})$/.test(c[1])).map(c=>s.id+':'+c[1]))`);
  assert.deepEqual(Array.from(bad), []);
});

test('keyword routing sends spoken requests to the right service', async () => {
  ev(`setLang('en'); home();`);
  const cases = { 'book gas': 'lpg', 'bank balance': 'balance', 'open bank account': 'jandhan', 'widow pension': 'widow',
    'scholarship for my daughter': 'scholarship', 'ladki bahin': 'cash_MH', 'free treatment': 'ayushman', 'गैस सिलेंडर': 'lpg', 'इलाज': 'ayushman', 'கேஸ் சிலிண்டர்': 'lpg', 'బ్యాంకు ఖాతా': 'jandhan',
    // Roman-script spellings that a speech engine or a typist may produce
    'mere ko gharbhavati ke liye paisa chahiye': 'pmmvy', 'garbhwati mahila yojana': 'pmmvy', 'pregnancy ku panam': 'pmmvy',
    'annapurna bhandar': 'cash_WB', 'lakshmir bhandar': 'cash_WB' };
  for (const [q, id] of Object.entries(cases)) {
    ev(`home()`); await ev(`route(${JSON.stringify(q)})`);
    assert.equal(ev('cur && cur.id'), id, q);
  }
});

test('eligibility rules filter schemes by profile', () => {
  const ids = p => Array.from(ev(`S.filter(s=>!s.basic && fit(s,${JSON.stringify(p)})).map(s=>s.id)`));
  assert.ok(ids({ state: 'TN', age: 'a40', marital: 'widow', poor: 'yes' }).includes('widow'));
  assert.ok(ids({ state: 'TN' }).includes('urimai'));
  assert.ok(!ids({ state: 'MH' }).includes('urimai'));
  assert.ok(ids({ state: 'MH', age: 'a21' }).includes('cash_MH'));
  assert.ok(!ids({ state: 'KA', age: 'a21' }).includes('cash_MH'));
  assert.ok(!ids({ age: 'u18' }).includes('pmmvy'));
  assert.ok(!ids({ marital: 'married' }).includes('widow'));
  assert.ok(!ids({ daughter: 'no' }).includes('sukanya'));
  assert.ok(!ids({ poor: 'no' }).includes('ayushman'));
  assert.ok(!ids({ area: 'urban' }).includes('shg'));
});

test('every service flow reaches a result screen in every language, with no emoji left', async () => {
  for (const l of ['hi', 'ta', 'te', 'en']) {
    ev(`setLang('${l}'); home();`); await tick();
    assert.ok(!EMOJI.test(win.document.getElementById('app').textContent), 'emoji on home ' + l);
    const n = ev('S.length');
    for (let i = 0; i < n; i++) {
      ev(`open(S[${i}].id)`); await tick();
      const q = ev(`S[${i}].qs.length`);
      for (let k = 0; k < q; k++) { win.document.querySelector(ev(`(S[${i}].qNo||[]).includes(${k})`) ? '#n' : '#y').click(); await tick(); }
      assert.ok(win.document.querySelector('#ask'), `result missing ${i} ${l}`);
      assert.ok(!EMOJI.test(win.document.getElementById('app').textContent), `emoji in result ${i} ${l}`);
    }
  }
});

test('a "no" answer leads to a kind, non-dead-end screen with a way home', async () => {
  ev(`setLang('en'); open('pmmvy')`); await tick();
  win.document.querySelector('#n').click(); await tick();
  assert.ok(win.document.querySelector('#home'));
  assert.ok(win.document.querySelectorAll('a.call').length >= 1);
});

test('profile wizard saves only on the device and can be deleted', async () => {
  ev(`localStorage.clear(); profile=null; setLang('en'); home();`); await tick();
  win.document.querySelector('#pmk').click(); await tick();
  win.document.querySelector('#go').click(); await tick();
  win.document.querySelector('.st[data-c="MH"]').click(); await tick();
  win.document.querySelector('#nx').click(); await tick();
  for (const v of ['a21', 'married', 'OBC', 'no', 'yes', 'rural', 'no', 'no', 'yes']) { win.document.querySelector(`[data-v="${v}"]`).click(); await tick(); }
  const saved = JSON.parse(win.localStorage.getItem('profile'));
  assert.equal(saved.state, 'MH');
  assert.deepEqual(Object.keys(saved).filter(k => /name|phone|aadhaar|mobile/i.test(k)), []);
  win.document.querySelector('#ok').click(); await tick();
  win.document.querySelector('#pdel').click(); await tick();
  assert.equal(win.localStorage.getItem('profile'), '');
});

test('find my state: location is asked only after a tap, stays on the phone, and she confirms with Yes / No', async () => {
  const d = win.document, geoJson = fs.readFileSync(path.join(__dirname, '..', 'public', 'states.geo.json'), 'utf8');
  const asked = [], fetched = [], realFetch = win.fetch;
  let answer = ok => ok({ coords: { latitude: 13.08, longitude: 80.27, accuracy: 1500 } });   // Chennai
  Object.defineProperty(win.navigator, 'geolocation', { configurable: true,
    value: { getCurrentPosition: (ok, no, opt) => { asked.push(opt); answer(ok, no); } } });
  win.fetch = (u, o) => { fetched.push([String(u), o && o.body]); return /states\.geo\.json$/.test(String(u))
    ? Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(geoJson)) }) : Promise.reject(new Error('offline')); };
  const settle = async () => { for (let i = 0; i < 5; i++) await tick(); };
  try {
    ev(`localStorage.clear(); profile=null; setLang('ta'); profFlow(false); pstep=1; profScreen();`); await tick();
    assert.equal(asked.length, 0, 'location must not be asked before she taps');
    const order = Array.from(d.querySelectorAll('#main button')).map(b => b.id || b.className);
    assert.equal(order[0], 'loc');                                   // the pin button comes first
    assert.match(d.querySelector('#loc').textContent, /மாநிலத்தை/);   // in her language
    d.querySelector('#loc').click(); await settle();
    assert.equal(asked.length, 1);
    assert.equal(asked[0].enableHighAccuracy, false);                 // coarse is enough for a state
    assert.match(d.querySelector('#main .big').textContent, /தமிழ்நாடு/);
    assert.ok(d.querySelector('#y.yn') && d.querySelector('#n.yn'));
    d.querySelector('#y').click(); await tick();
    assert.equal(ev('draft.state'), 'TN');
    assert.ok(d.querySelector('#dist'));                              // on to the district step
    // nothing about where she is went anywhere: only the boundary file was downloaded, and nothing is stored
    assert.deepEqual(fetched.map(f => f[0]), ['states.geo.json']);
    assert.ok(fetched.every(f => !f[1]));
    const stored = Object.keys(win.localStorage).map(k => win.localStorage.getItem(k)).join(' ');
    assert.doesNotMatch(stored, /13\.08|80\.27|latitude|longitude/);
    assert.doesNotMatch(JSON.stringify(ev('draft')), /13\.08|80\.27|lat|lon/);

    // "No" goes back to the list
    ev(`pstep=1; profScreen();`); await tick();
    d.querySelector('#loc').click(); await settle();
    d.querySelector('#n').click(); await settle();
    assert.ok(d.querySelector('.st[data-c="TN"]'));

    // she says no to the permission: a spoken message, and the list is still there
    answer = (ok, no) => no({ code: 1 });
    ev(`setLang('en'); pstep=1; profScreen();`); await tick();
    d.querySelector('#loc').click(); await settle();
    assert.equal(d.querySelector('#msg').textContent, ev('PU.en.locNo'));
    assert.ok(d.querySelector('.st[data-c="TN"]') && !d.querySelector('#loc').disabled);

    // outside India (Kathmandu): no state, so she picks from the list
    answer = ok => ok({ coords: { latitude: 27.72, longitude: 85.32 } });
    d.querySelector('#loc').click(); await settle();
    assert.equal(d.querySelector('#msg').textContent, ev('PU.en.locFail'));
  } finally {
    win.fetch = realFetch; delete win.navigator.geolocation; ev(`localStorage.clear(); profile=null; home();`);
  }
});

test('accessibility basics: lang attribute, labelled controls, live regions, hidden decorative icons', async () => {
  ev(`setLang('ta'); home();`); await tick();
  const d = win.document;
  assert.equal(d.documentElement.lang, 'ta');
  assert.ok(d.querySelector('#msg[aria-live]'));
  assert.ok(d.querySelector('#vnote[aria-live]'));
  assert.ok(d.querySelector('#vt[aria-pressed]'));
  assert.ok(d.querySelector('#more[aria-label]'));
  assert.ok(d.querySelector('#mic[aria-label]'));
  d.querySelectorAll('.ic').forEach(i => assert.equal(i.getAttribute('aria-hidden'), 'true'));
  d.querySelectorAll('svg').forEach(s => assert.ok(s.closest('[aria-hidden="true"]'), 'svg exposed to screen readers'));
  d.querySelectorAll('button').forEach(b => assert.ok((b.textContent || '').trim() || b.getAttribute('aria-label'), 'unlabelled button ' + b.className));
});

test('voice is ON by default; every screen tries to speak, and if the browser blocked it her first tap off a button replays it', async () => {
  const d = win.document;
  assert.equal(ev('voiceOn'), true);
  assert.equal(d.querySelector('#vt').getAttribute('aria-pressed'), 'true');
  ev(`window.__said = []; window.__realSay = say;
      say = t => { __said.push(t); return Promise.resolve(__said.length===1 ? 'blocked' : 'done'); };`);
  ev(`setLang('en'); home();`); await settle();
  assert.equal(ev('__said.length'), 1);                       // tried at once, without waiting for a tap
  assert.equal(ev('vctx.blocked'), true);
  assert.equal(d.querySelector('#tth').hidden, false);           // a big glowing speaker shows where to touch
  d.querySelector('#bt').click(); d.querySelector('#bt').click(); await settle();
  assert.equal(ev('__said.length'), 1);                       // a tap on a button does not replay
  d.querySelector('h1').click(); await settle();
  assert.equal(ev('__said.length'), 2);                       // a tap anywhere else does
  assert.equal(ev('__said[1]'), ev('U.en.homeV'));
  assert.equal(d.querySelector('#tth').hidden, true);
  ev(`voiceOn=false; home();`); await settle();
  assert.equal(ev('__said.length'), 2);                       // turned off: silent
  ev(`voiceOn=true; say = __realSay;`);
});

test('first screen: a glowing Listen button names each language in its own voice, and saying a language picks it', async () => {
  const d = win.document;
  const sr = fakeRecognition();
  ev(`window.__said = []; window.__realSay = say; say = t => { __said.push(t); return Promise.resolve('done'); };
      store.set('hands',''); localStorage.removeItem('hands'); handsOn = true; langScreen();`); await settle();
  const b = d.querySelector('.lsay');
  assert.ok(b && /Listen/.test(b.textContent) && /सुनिए/.test(b.textContent));
  b.click(); await settle();
  const intro = JSON.parse(ev('JSON.stringify(__said[__said.length-1])'));
  assert.deepEqual(intro.map(x => x[0]), ['hi', 'ta', 'te', 'en']);
  assert.match(intro[1][1], /தமிழ/);
  sr.say('தமிழ்'); await settle();                            // talk mode was on: she said her language
  assert.equal(ev('lang'), 'ta');
  // first time only: offer talk mode, explained and spoken, before the home screen
  assert.equal(d.querySelector('.big').textContent, ev('U.ta.hQ'));
  assert.equal(ev('__said[__said.length-1]'), ev(`U.ta.hQ+' '+U.ta.hSub`));
  d.querySelector('#y').click(); await settle();
  assert.equal(win.localStorage.getItem('hands'), '1');
  assert.ok(d.querySelector('#mic.search'));
  assert.equal(ev('__said[__said.length-1]'), ev(`U.ta.hHelp+' '+U.ta.homeV`));
  ev(`langScreen()`); await settle();
  d.querySelector('.tile[data-l="en"]').click(); await settle();
  assert.ok(d.querySelector('#mic.search'));                  // asked once: straight home next time
  ev(`say = __realSay; handsOn = false;`); sr.restore();
});

test('talk mode: after speaking it listens, and she can answer, repeat, go back and go home by voice', async () => {
  const d = win.document;
  const sr = fakeRecognition();
  ev(`window.__said = []; window.__realSay = say; say = t => { __said.push(t); return Promise.resolve('done'); };
      handsOn = true; setLang('en'); home();`); await settle();
  assert.equal(sr.count(), 1);                                // listening without a tap
  sr.say('garbhwati mahila yojana'); await settle();
  assert.equal(ev('cur.id'), 'pmmvy'); assert.equal(ev('step'), 0);
  sr.say('yes'); await settle();
  assert.equal(ev('step'), 1);
  const q = ev('__said[__said.length-1]');
  sr.say('repeat'); await settle();
  assert.equal(ev('__said[__said.length-1]'), q);              // said again
  sr.say('back'); await settle(); await settle();
  assert.equal(ev('step'), 0);                                // the phone's Back, by voice
  sr.say('something else entirely'); await settle();
  assert.equal(ev('__said[__said.length-1]'), ev('U.en.notU'));
  assert.equal(ev('step'), 0);
  const n = sr.count();
  sr.silence(); await settle();
  assert.equal(sr.count(), n + 1);                            // heard nothing: one more quiet try
  sr.silence(); await settle();
  assert.equal(sr.count(), n + 1);                            // then it stops and points to the mic button
  assert.equal(d.querySelector('#msg').textContent, ev('U.en.micT'));
  d.querySelector('#mic').click(); await settle();
  sr.say('home'); await settle();
  assert.equal(ev('cur'), null);
  assert.ok(d.querySelector('#mic.search'));
  // result screen: "steps", then "next" and "done"
  ev(`open('lpg')`); await settle();
  assert.match(ev('__said[__said.length-1]'), new RegExp(ev('U.en.resH').slice(0, 20)));
  sr.say('steps'); await settle();
  assert.match(d.querySelector('.over').textContent, /1 \//);
  sr.say('next'); await settle();
  assert.match(d.querySelector('.over').textContent, /2 \//);
  sr.say('done'); await settle();
  assert.ok(d.querySelector('#wa'));
  // what she says is never stored
  const keys = Object.keys(win.localStorage).filter(k => !/^(lang|voice|hands|big|profile|tr_\w+)$/.test(k));
  assert.deepEqual(keys, []);
  ev(`say = __realSay; handsOn = false; stopListening();`); sr.restore();
});

test('talk mode understands profile answers: numbers for age, choices, skip, state names', () => {
  const pick = (l, k, txt) => ev(`(()=>{ setLang('${l}'); return pickOption(PQ.find(q=>q.k==='${k}'), ${JSON.stringify(txt)}); })()`);
  assert.equal(pick('hi', 'age', 'मेरी उम्र 35 साल है'), 'a21');
  assert.equal(pick('hi', 'age', '१७'), 'u18');
  assert.equal(pick('hi', 'age', '18 से कम'), 'u18');
  assert.equal(pick('ta', 'age', '65'), 'a60');
  assert.equal(pick('hi', 'marital', 'मेरी शादी नहीं हुई'), 'single');
  assert.equal(pick('hi', 'marital', 'शादीशुदा'), 'married');
  assert.equal(pick('en', 'marital', 'I am unmarried'), 'single');
  assert.equal(pick('en', 'marital', 'married'), 'married');
  assert.equal(pick('ta', 'marital', 'கணவரை இழந்தவர்'), 'widow');
  assert.equal(pick('hi', 'cat', 'ओबीसी'), 'OBC');
  assert.equal(pick('en', 'cat', 'we are SC'), 'SC');
  assert.equal(pick('en', 'cat', 'I study'), null);
  assert.equal(pick('te', 'area', 'గ్రామం'), 'rural');
  assert.equal(pick('hi', 'area', 'शहर में'), 'urban');
  assert.equal(ev(`(setLang('hi'), said('skip', 'पता नहीं'))`), true);
  assert.equal(ev(`(setLang('ta'), saidNo('இல்லை') && !saidYes('இல்லை'))`), true);
  assert.equal(ev(`matchState('tamil nadu')`), 'TN');
  assert.equal(ev(`matchState('मैं उत्तर प्रदेश में रहती हूँ')`), 'UP');
  ev(`setLang('en')`);
});

test('voice out: short first part so speech starts sooner, on-device voices first, server voice fetched one part ahead', async () => {
  const parts = Array.from(ev(`chunks(${JSON.stringify('This is sentence number one. '.repeat(30).trim())})`));
  assert.ok(parts.length > 2);
  assert.ok(parts[0].length <= 120 && parts.slice(1).every(p => p.length <= 280));
  assert.equal(parts.join(' '), 'This is sentence number one. '.repeat(30).trim());
  assert.equal(ev(`voiceFor('ta', [{lang:'ta-IN',localService:false,name:'online'},{lang:'ta_IN',localService:true,name:'device'}]).name`), 'device');
  assert.equal(ev(`voiceFor('ta', [{lang:'en-IN',localService:true,name:'en'}])`), null);
  // no device voice for Tamil (a typical laptop): parts come from the server, the next one asked for before the first plays
  const calls = [];
  const realFetch = win.fetch, realPlay = win.HTMLMediaElement.prototype.play;
  win.URL.createObjectURL = () => 'blob:x'; win.URL.revokeObjectURL = () => {};
  win.fetch = (u, o) => { calls.push(JSON.parse(o.body).text); return Promise.resolve({ ok: true, blob: () => Promise.resolve('audio') }); };
  let played = 0;
  win.HTMLMediaElement.prototype.play = function () { played++; setTimeout(() => this.onended && this.onended(), 0); return Promise.resolve(); };
  ev(`API.ai = true; setLang('ta');`);
  const long = ev(`S.find(s=>s.id==='lpg').where.ta + ' ' + S.find(s=>s.id==='lpg').info.ta`);
  const want = Array.from(ev(`chunks(${JSON.stringify(long)})`));
  const r = await ev(`say(${JSON.stringify(long)})`);
  assert.equal(r, 'done');
  assert.equal(played, want.length);
  assert.deepEqual(calls, want);                              // each part once, in order
  calls.length = 0;
  ev(`open('pmmvy')`); await settle();
  assert.ok(calls.includes(ev(`chunks(S.find(s=>s.id==='pmmvy').qs[1].ta)[0]`)));   // next question warmed up
  ev(`API.ai = false; stopSpeech(); setLang('en');`);
  win.fetch = realFetch; win.HTMLMediaElement.prototype.play = realPlay;
});

test('no inline event handlers or secrets in the shipped HTML/JS', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(__dirname, '..', 'public', 'app.js'), 'utf8');
  assert.doesNotMatch(html, /\son\w+\s*=/i);
  assert.doesNotMatch(js, /onclick='|onclick="/);
  assert.doesNotMatch(js + html, /AIza[0-9A-Za-z_-]{20,}/);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i);
});

test('WhatsApp share link carries documents, steps, notes and helplines in the chosen language', async () => {
  for (const l of ['hi', 'ta', 'te', 'en']) {
    ev(`setLang('${l}'); open('lpg')`); await tick();
    const href = win.document.querySelector('#wa').getAttribute('href');
    assert.match(href, /^https:\/\/wa\.me\/\?text=/);
    const msg = decodeURIComponent(href.split('text=')[1]);
    assert.match(msg, /7718955555/);            // Indane booking number
    assert.match(msg, /1906/);                  // gas-leak emergency number
    assert.ok(msg.split('\n').length > 6);
    assert.equal(win.document.querySelector('#wa').getAttribute('rel'), 'noopener noreferrer');
  }
});

test('step-by-step mode splits instructions and walks through them', async () => {
  ev(`setLang('en'); open('lpg')`); await tick();
  const n = ev('stepsOf(cur).length');
  assert.ok(n >= 6);                            // carry list + 4 steps + note
  win.document.querySelector('#steps').click(); await tick();
  assert.match(win.document.querySelector('.over').textContent, new RegExp('1 / ' + n));
  win.document.querySelector('#sn').click(); await tick();
  assert.match(win.document.querySelector('.over').textContent, new RegExp('2 / ' + n));
  win.document.querySelector('#sp').click(); await tick();
  assert.match(win.document.querySelector('.over').textContent, new RegExp('1 / ' + n));
  ev(`stepScreen(${n - 1})`); await tick();
  win.document.querySelector('#sd').click(); await tick();
  assert.ok(win.document.querySelector('#wa'));  // back on the result screen
  ev(`setLang('hi'); open('pmmvy')`); await tick();   // sentence-based split (no numbered steps)
  assert.ok(ev('stepsOf(cur).length') >= 3);
});

test('large text mode toggles and is announced', () => {
  const b = win.document.querySelector('#bt');
  b.click();
  assert.equal(b.getAttribute('aria-pressed'), 'true');
  assert.ok(win.document.documentElement.classList.contains('big'));
  b.click();
  assert.ok(!win.document.documentElement.classList.contains('big'));
  assert.ok(b.getAttribute('aria-label'));
});

test('installable PWA: valid manifest, real PNG icons, service worker that never caches the API', () => {
  const root = path.join(__dirname, '..', 'public');
  const m = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
  assert.equal(m.display, 'standalone');
  assert.ok(m.name && m.short_name && m.start_url && m.theme_color);
  for (const ic of m.icons) {
    const png = fs.readFileSync(path.join(root, ic.src));
    assert.equal(png.toString('hex', 0, 8), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), parseInt(ic.sizes));
  }
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  assert.match(sw, /\/api\//);
  assert.match(sw, /\/api\//);
  assert.ok(win.document.querySelector('link[rel="manifest"]'));
});

test('every service links to an official HTTPS website that opens safely in a new tab', async () => {
  const ok = /(\.gov\.in|\.nic\.in|indianoil\.in|ebharatgas\.com|myhpgas\.in|npci\.org\.in)$/;
  const bad = ev(`S.filter(s=>!s.links.length).map(s=>s.id)`);
  assert.deepEqual(Array.from(bad), []);
  const urls = Array.from(ev(`S.flatMap(s=>s.links.map(l=>l[1]))`));
  assert.ok(urls.length >= 17);
  for (const u of urls) { const x = new URL(u); assert.equal(x.protocol, 'https:', u); assert.match(x.hostname, ok, u); }
  for (const l of ['hi', 'ta', 'te', 'en']) {
    ev(`setLang('${l}'); open('lpg')`); await tick();
    const a = Array.from(win.document.querySelectorAll('a.site'));
    assert.equal(a.length, 3);                                   // one button per gas company
    a.forEach(x => { assert.equal(x.getAttribute('target'), '_blank'); assert.equal(x.getAttribute('rel'), 'noopener noreferrer'); });
    const msg = decodeURIComponent(win.document.querySelector('#wa').getAttribute('href').split('text=')[1]);
    assert.match(msg, /https:\/\/cx\.indianoil\.in/);          // the WhatsApp message carries the link too
  }
});


test('keyboard users get a skip link that targets a focusable main landmark', () => {
  const d = win.document;
  const skip = d.querySelector('a.skip');
  assert.ok(skip);
  assert.equal(skip.getAttribute('href'), '#main');
  assert.equal(d.querySelector('main#main').getAttribute('tabindex'), '-1');
});

test('the phone Back button goes to the previous screen instead of leaving the app', async () => {
  const d = win.document, back = () => new Promise(r => { win.addEventListener('popstate', () => setTimeout(r, 0), { once: true }); win.history.back(); });
  ev(`setLang('en'); home();`); await tick();
  ev(`open('pmmvy')`); await tick();
  d.querySelector('#y').click(); await tick();               // question 2
  assert.equal(ev('step'), 1);
  await back();                                             // back to question 1
  assert.equal(ev('cur && cur.id'), 'pmmvy');
  assert.equal(ev('step'), 0);
  assert.ok(d.querySelector('#y'));
  await back();                                             // back to home
  assert.equal(ev('cur'), null);
  assert.ok(d.querySelector('#mic.search'));
});

test('questions are asked positively; for "do you already have...?" a "no" continues', async () => {
  const d = win.document;
  ev(`setLang('en'); open('jandhan')`); await tick();
  assert.doesNotMatch(d.querySelector('.big').textContent, /\bnot\b/);
  d.querySelector('#y').click(); await tick();               // already has an account
  assert.equal(ev('eligible'), false);
  ev(`open('jandhan')`); await tick();
  d.querySelector('#n').click(); await tick();               // no account yet
  assert.equal(ev('eligible'), true);
  assert.ok(d.querySelector('#ask'));
});

test('call buttons are single links (no button inside a link) and the footer and skip link follow the language', async () => {
  const d = win.document;
  ev(`setLang('ta'); open('lpg')`); await tick();
  const calls = d.querySelectorAll('a.call');
  assert.ok(calls.length >= 1);
  calls.forEach(a => { assert.match(a.getAttribute('href'), /^tel:/); assert.equal(a.querySelector('button'), null); });
  assert.equal(d.querySelector('#foot').textContent, ev('U.ta.foot'));
  assert.equal(d.querySelector('a.skip').textContent, ev('U.ta.skip'));
  assert.equal(d.querySelector('.lang[data-l="ta"]').getAttribute('aria-pressed'), 'true');
  assert.equal(d.querySelector('.lang[data-l="hi"]').getAttribute('aria-pressed'), 'false');
});

test('a returning user who never answered the talk-mode question is asked it once, where the browser can listen', () => {
  const root = path.join(__dirname, '..', 'public');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<script[^>]*src="app.js"[^>]*><\/script>/, '');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.fetch = () => Promise.reject(new Error('offline'));
  dom.window.SpeechRecognition = class { start() {} abort() {} };
  dom.window.localStorage.setItem('lang', 'ta');
  new vm.Script(fs.readFileSync(path.join(root, 'app.js'), 'utf8')).runInContext(dom.getInternalVMContext());
  const d = dom.window.document;
  assert.equal(d.querySelector('.big').textContent, new vm.Script('U.ta.hQ').runInContext(dom.getInternalVMContext()));
  d.querySelector('#n').click();
  assert.ok(d.querySelector('#mic.search'));
  assert.equal(dom.window.localStorage.getItem('hands'), '0');
  dom.window.close();
});

test('a returning user skips the language screen and lands on home in her language', () => {
  const root = path.join(__dirname, '..', 'public');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace(/<script[^>]*src="app.js"[^>]*><\/script>/, '');
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only', pretendToBeVisual: true });
  dom.window.fetch = () => Promise.reject(new Error('offline'));
  dom.window.localStorage.setItem('lang', 'te');
  new vm.Script(fs.readFileSync(path.join(root, 'app.js'), 'utf8')).runInContext(dom.getInternalVMContext());
  const d = dom.window.document;
  assert.equal(d.querySelector('.tile[data-l]'), null);
  assert.ok(d.querySelector('#mic.search'));
  assert.equal(d.documentElement.lang, 'te');
  dom.window.close();
});

test('each eligibility question asks one thing, so a single yes or no is clear', () => {
  // "A, or B?" is fine (yes to either is the same answer); "A and B?" is not (yes to one, no to the other has no button)
  const two = Array.from(ev(`S.flatMap(s=>s.qs.map(q=>s.id+': '+q.en))`)).filter(q => /\band (are|do|is|you|your)\b|, (and|with)\b/i.test(q));
  assert.deepEqual(two, []);
});

test('Magalir Urimai: "no" to the government-job question continues, "yes" ends kindly', async () => {
  const d = win.document;
  for (const [last, ok] of [['#n', true], ['#y', false]]) {
    ev(`setLang('en'); open('urimai')`); await tick();
    for (let k = 0; k < 4; k++) { d.querySelector('#y').click(); await tick(); }
    d.querySelector(last).click(); await tick();
    assert.equal(ev('eligible'), ok);
  }
});

test('redesign: header language button, Yes/No right under the question, picture rows on the result', async () => {
  const d = win.document;
  ev(`setLang('ta'); home();`); await tick();
  const lb = d.querySelector('#lgb');
  assert.match(lb.textContent, /தமிழ்/);                          // shows the current language by its own name
  assert.match(lb.getAttribute('aria-label'), /மொழி/);
  lb.click(); await tick();
  assert.equal(d.querySelectorAll('.tile[data-l]').length, 4);  // opens the big language tiles
  d.querySelector('.tile[data-l="en"]').click(); await tick();
  assert.equal(ev('lang'), 'en');
  assert.ok(d.querySelector('#mic.search'));                     // and lands on home
  assert.equal(d.querySelectorAll('.strip').length, 0);         // no sideways-scrolling rows
  // the voice switch keeps its words for screen readers even when phones show only the icon
  const vt = d.querySelector('#vt');
  assert.match(vt.textContent, /Voice (on|off)/);
  // question: Yes and No come before "Listen again" and the other buttons
  ev(`open('pmmvy')`); await tick();
  const order = Array.from(d.querySelectorAll('#main button')).map(b => b.id || b.className);
  assert.ok(order.indexOf('y') < order.findIndex(x => /listen/.test(x)), order.join(','));
  // result: every call button shows its number; documents are a picture list
  ev(`eligible=true; result();`); await tick();
  d.querySelectorAll('a.call').forEach(a => assert.match(a.textContent, /[0-9*#]{3,}/));
  assert.ok(d.querySelectorAll('ul.docs li .i').length >= 2);
  // profile questions show a progress bar
  ev(`profFlow(false); pstep=3; profScreen();`); await tick();
  assert.ok(d.querySelector('.bar[role="progressbar"] i'));
  ev(`home()`);
});
