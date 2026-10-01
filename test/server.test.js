'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const srv = require('../server.js');

let server, base;
const geminiReply = parts => ({ ok: true, status: 200, json: async () => ({ candidates: [{ content: { parts } }] }) });

test.before(async () => {
  server = srv.createServer();
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = 'http://127.0.0.1:' + server.address().port;
});
test.after(() => server.close());
test.beforeEach(() => { process.env.GEMINI_API_KEY = 'test-key'; });

const post = (path, body, headers = {}) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('healthz reports ok and whether AI is configured', async () => {
  let j = await (await fetch(base + '/api/health')).json();
  assert.deepEqual(j, { ok: true, ai: true });
  delete process.env.GEMINI_API_KEY;
  j = await (await fetch(base + '/api/health')).json();
  assert.equal(j.ai, false);
});

test('every response carries the security headers', async () => {
  const r = await fetch(base + '/');
  assert.equal(r.status, 200);
  for (const h of Object.keys(srv.SECURITY_HEADERS)) assert.ok(r.headers.get(h), h + ' missing');
  assert.match(r.headers.get('content-security-policy'), /script-src 'self'/);
  assert.doesNotMatch(r.headers.get('content-security-policy'), /script-src[^;]*unsafe-inline/);
});

test('static files are served with the right type; traversal and unknown paths are refused', async () => {
  assert.match((await fetch(base + '/app.js')).headers.get('content-type'), /javascript/);
  assert.match((await fetch(base + '/style.css')).headers.get('content-type'), /css/);
  assert.equal((await fetch(base + '/nope.html')).status, 404);
  assert.equal((await fetch(base + '/..%2fserver.js')).status, 403);
  assert.equal((await fetch(base + '/%00')).status, 400);
  assert.equal((await fetch(base + '/', { method: 'DELETE' })).status, 405);
});

test('the Gemini key is never exposed to the browser', async () => {
  for (const f of ['/', '/app.js', '/index.html', '/style.css']) {
    const t = await (await fetch(base + f)).text();
    assert.doesNotMatch(t, /AIza[0-9A-Za-z_-]{20,}/);
    assert.doesNotMatch(t, /x-goog-api-key/i);
  }
});

test('validators accept good input and reject bad input', () => {
  assert.equal(srv.validateAsk({ q: 'how much', lang: 'ta', facts: 'x' }), null);
  assert.ok(srv.validateAsk({ q: '', lang: 'ta' }));
  assert.ok(srv.validateAsk({ q: 'x'.repeat(301), lang: 'ta' }));
  assert.ok(srv.validateAsk({ q: 'x', lang: 'xx' }));
  assert.equal(srv.validateRoute({ q: 'gas', services: [{ id: 'lpg', hint: 'gas' }] }), null);
  assert.ok(srv.validateRoute({ q: 'gas', services: [{ id: 'bad id!', hint: 'x' }] }));
  assert.ok(srv.validateTranslate({ lang: 'en', strings: ['a'] }));
  assert.equal(srv.validateTranslate({ lang: 'bn', strings: ['a'] }), null);
  assert.ok(srv.validateTranslate({ lang: 'bn', strings: new Array(61).fill('a') }));
  assert.ok(srv.validateTts({ text: '', lang: 'hi' }));
});

test('/api/ask returns a grounded answer and never leaks upstream details', async () => {
  let seen;
  srv.deps.fetch = async (url, opts) => { seen = { url, opts }; return geminiReply([{ text: 'Go to the Anganwadi.' }]); };
  const r = await post('/api/ask', { q: 'where do I go', lang: 'hi', facts: 'PMMVY facts' });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { answer: 'Go to the Anganwadi.' });
  assert.equal(seen.opts.headers['x-goog-api-key'], 'test-key');
  assert.match(JSON.parse(seen.opts.body).systemInstruction.parts[0].text, /Hindi/);
  srv.deps.fetch = async () => ({ ok: false, status: 500, json: async () => ({}) });
  const bad = await post('/api/ask', { q: 'x', lang: 'hi' });
  assert.equal(bad.status, 502);
  assert.doesNotMatch(await bad.text(), /500|key|google/i);
});

test('AI endpoints answer 503 when no key is configured', async () => {
  delete process.env.GEMINI_API_KEY;
  assert.equal((await post('/api/ask', { q: 'x', lang: 'hi' })).status, 503);
});

test('bad requests: wrong method, content type, invalid JSON, oversized body', async () => {
  assert.equal((await fetch(base + '/api/ask')).status, 405);
  assert.equal((await post('/api/ask', '{}', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post('/api/ask', '{not json')).status, 400);
  assert.equal((await post('/api/ask', JSON.stringify({ q: 'x', lang: 'hi', facts: 'f'.repeat(200000) }))).status, 413);
  assert.equal((await post('/api/missing', {})).status, 404);
});

test('/api/translate keeps order, caches, and rejects a malformed model reply', async () => {
  let calls = 0;
  srv.deps.fetch = async (url, opts) => { calls++; const arr = JSON.parse(JSON.parse(opts.body).contents[0].parts[0].text); return geminiReply([{ text: JSON.stringify(arr.map(s => s.toUpperCase())) }]); };
  let r = await (await post('/api/translate', { lang: 'bn', strings: ['one', 'two'] })).json();
  assert.deepEqual(r.strings, ['ONE', 'TWO']);
  r = await (await post('/api/translate', { lang: 'bn', strings: ['two', 'three'] })).json();
  assert.deepEqual(r.strings, ['TWO', 'THREE']);
  assert.equal(calls, 2);
  srv.deps.fetch = async () => geminiReply([{ text: '["only one"]' }]);
  assert.equal((await post('/api/translate', { lang: 'mr', strings: ['a', 'b'] })).status, 502);
});

test('/api/tts wraps Gemini PCM audio into a playable WAV', async () => {
  const pcm = Buffer.alloc(4800, 1);
  srv.deps.fetch = async () => geminiReply([{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: pcm.toString('base64') } }]);
  const r = await post('/api/tts', { text: 'வணக்கம் அக்கா', lang: 'ta' });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('content-type'), 'audio/wav');
  const buf = Buffer.from(await r.arrayBuffer());
  assert.equal(buf.length, 44 + 4800);
  assert.equal(buf.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buf.readUInt32LE(24), 24000);
});

test('pcmToWav writes a correct header', () => {
  const w = srv.pcmToWav(Buffer.alloc(100), 16000);
  assert.equal(w.toString('ascii', 8, 12), 'WAVE');
  assert.equal(w.readUInt32LE(24), 16000);
  assert.equal(w.readUInt32LE(40), 100);
});

test('rate limiter blocks after the limit and recovers after the window', () => {
  const now = 1_000_000;
  for (let i = 0; i < 3; i++) assert.equal(srv.allow('9.9.9.9', 'x', 3, 1000, now + i), true);
  assert.equal(srv.allow('9.9.9.9', 'x', 3, 1000, now + 10), false);
  assert.equal(srv.allow('9.9.9.9', 'x', 3, 1000, now + 5000), true);
  assert.equal(srv.allow('8.8.8.8', 'x', 3, 1000, now + 10), true);
});

test('PWA files are served with correct types and the service worker is never browser-cached', async () => {
  const m = await fetch(base + '/manifest.webmanifest');
  assert.match(m.headers.get('content-type'), /manifest\+json/);
  assert.equal((await fetch(base + '/icon-192.png')).headers.get('content-type'), 'image/png');
  const sw = await fetch(base + '/sw.js');
  assert.match(sw.headers.get('content-type'), /javascript/);
  assert.equal(sw.headers.get('cache-control'), 'no-cache');
});

test('static files revalidate with ETag so a new deploy is never stale', async () => {
  const r = await fetch(base + '/app.js');
  const etag = r.headers.get('etag');
  assert.ok(etag);
  assert.equal(r.headers.get('cache-control'), 'no-cache');
  const again = await fetch(base + '/app.js', { headers: { 'If-None-Match': etag } });
  assert.equal(again.status, 304);
  assert.ok(again.headers.get('content-security-policy'));
  assert.match((await fetch(base + '/icon-512.png')).headers.get('cache-control'), /max-age=86400/);
});


test('a retired model is replaced automatically: 404 -> discover -> retry -> remembered', async () => {
  for (const k of Object.keys(srv.modelCache)) delete srv.modelCache[k];
  const calls = [];
  srv.deps.fetch = async url => {
    calls.push(String(url).replace(/^https?:\/\/[^/]+/, ''));
    if (/\/v1beta\/models\?/.test(url)) return { ok: true, status: 200, json: async () => ({ models: [
      { name: 'models/gemini-9-flash-preview', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-9-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-9-flash-tts', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/embedding-1', supportedGenerationMethods: ['embedContent'] }] }) };
    if (/gemini-3\.8-flash/.test(url)) return { ok: false, status: 404, text: async () => '{"error":{"message":"no longer available"}}' };
    return geminiReply([{ text: 'Answer from the new model.' }]);
  };
  const r = await post('/api/ask', { q: 'hello', lang: 'en', facts: 'x' });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { answer: 'Answer from the new model.' });
  assert.equal(srv.modelCache.text, 'gemini-9-flash');      // stable chosen over preview, never a tts/embedding model
  const before = calls.length;
  await post('/api/ask', { q: 'again', lang: 'en', facts: 'x' });
  assert.equal(calls.length - before, 1);                    // remembered: no second discovery
  for (const k of Object.keys(srv.modelCache)) delete srv.modelCache[k];
});


test('temporary overload (503) is retried, then a backup model is tried', async () => {
  process.env.GEMINI_RETRY_MS = '1,1';
  for (const k of Object.keys(srv.modelCache)) delete srv.modelCache[k];
  let n = 0;
  srv.deps.fetch = async url => {
    if (/\/v1beta\/models\?/.test(url)) return { ok: true, status: 200, json: async () => ({ models: [
      { name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-3.8-flash-lite', supportedGenerationMethods: ['generateContent'] }] }) };
    n++;
    if (/gemini-3\.8-flash-lite/.test(url)) return geminiReply([{ text: 'Backup model answer.' }]);
    if (/gemini-3\.8-flash/.test(url) && n === 2) return geminiReply([{ text: 'Recovered on retry.' }]);
    return { ok: false, status: 503, text: async () => '{"error":{"status":"UNAVAILABLE"}}' };
  };
  // first call: 503, then retry succeeds
  let r = await post('/api/ask', { q: 'hi', lang: 'en', facts: 'x' });
  assert.deepEqual(await r.json(), { answer: 'Recovered on retry.' });
  // second scenario: the main model stays overloaded -> backup model answers
  srv.deps.fetch = async url => {
    if (/\/v1beta\/models\?/.test(url)) return { ok: true, status: 200, json: async () => ({ models: [
      { name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-3.8-flash-lite', supportedGenerationMethods: ['generateContent'] }] }) };
    if (/lite/.test(url)) return geminiReply([{ text: 'Backup model answer.' }]);
    return { ok: false, status: 503, text: async () => '{}' };
  };
  r = await post('/api/ask', { q: 'hi', lang: 'en', facts: 'x' });
  assert.deepEqual(await r.json(), { answer: 'Backup model answer.' });
  assert.equal(srv.modelCache.text, undefined);          // a temporary outage is not remembered
  // third scenario: everything down -> clean 502, no upstream details leaked
  srv.deps.fetch = async () => ({ ok: false, status: 503, text: async () => 'secret upstream text' });
  r = await post('/api/ask', { q: 'hi', lang: 'en', facts: 'x' });
  assert.equal(r.status, 502);
  assert.doesNotMatch(await r.text(), /secret|503|UNAVAILABLE/);
  delete process.env.GEMINI_RETRY_MS;
});
