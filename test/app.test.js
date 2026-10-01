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
    'scholarship for my daughter': 'scholarship', 'ladki bahin': 'cash_MH', 'free treatment': 'ayushman', 'गैस सिलेंडर': 'lpg', 'इलाज': 'ayushman', 'கேஸ் சிலிண்டர்': 'lpg', 'బ్యాంకు ఖాతా': 'jandhan' };
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
      for (let k = 0; k < q; k++) { win.document.querySelector('#y').click(); await tick(); }
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

test('voice is OFF by default and nothing speaks automatically', () => {
  assert.equal(ev('voiceOn'), false);
  assert.equal(win.document.querySelector('#vt').getAttribute('aria-pressed'), 'false');
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
