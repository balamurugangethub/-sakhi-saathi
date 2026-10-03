'use strict';
/**
 * Sakhi Saathi server (zero dependencies, Node 20+).
 *  - serves the static app from ./public with strict security headers
 *  - keeps the Gemini API key on the server (GEMINI_API_KEY) – the browser never sees it
 *  - POST /api/ask        grounded answers to a woman's spoken question
 *  - POST /api/route      maps a spoken request to one of the services
 *  - POST /api/translate  translates UI/scheme text so extra languages work
 *  - POST /api/tts        Gemini text-to-speech (Tamil, Telugu and more) → audio/wav
 *  - GET  /healthz        liveness + whether AI features are configured
 * Designed for Google Cloud Run (listens on $PORT, 0.0.0.0, stateless).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');

const PUBLIC_DIR = path.join(__dirname, 'public');
const LANGS = {
  hi: 'Hindi', ta: 'Tamil', te: 'Telugu', en: 'English', bn: 'Bengali', mr: 'Marathi',
  gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia'
};
const LIMITS = { body: 120 * 1024, question: 300, facts: 1600, ttsText: 1500, strings: 60, stringLen: 700, services: 24 };
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt']);

const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'microphone=(self), camera=(), geolocation=(self), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

/** Replaceable in tests. */
const deps = { fetch: (...a) => globalThis.fetch(...a) };

const cfg = () => ({
  key: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
  ttsModel: process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-preview-tts',
  ttsVoice: process.env.GEMINI_TTS_VOICE || 'Kore'
});

// ---------------------------------------------------------------- rate limiting
const hits = new Map();
/** Sliding window limiter. Returns true when the call is allowed. */
function allow(ip, bucket, max, windowMs = 60000, now = Date.now()) {
  const k = bucket + '|' + ip;
  const arr = (hits.get(k) || []).filter(t => now - t < windowMs);
  if (arr.length >= max) { hits.set(k, arr); return false; }
  arr.push(now); hits.set(k, arr);
  if (hits.size > 5000) for (const key of hits.keys()) { hits.delete(key); if (hits.size < 2500) break; }
  return true;
}
const clientIp = req => String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

// ---------------------------------------------------------------- validation
const isStr = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.length <= max;
const clean = s => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();

function validateAsk(b) {
  if (!b || !isStr(b.q, 1, LIMITS.question)) return 'q must be 1-300 characters';
  if (!LANGS[b.lang]) return 'unsupported lang';
  if (b.facts !== undefined && !isStr(b.facts, 0, LIMITS.facts)) return 'facts too long';
  return null;
}
function validateRoute(b) {
  if (!b || !isStr(b.q, 1, LIMITS.question)) return 'q must be 1-300 characters';
  if (!Array.isArray(b.services) || b.services.length < 1 || b.services.length > LIMITS.services) return 'services must be 1-24 items';
  for (const s of b.services) if (!s || !/^[A-Za-z0-9_]{1,24}$/.test(s.id) || !isStr(s.hint || 'x', 1, 160)) return 'bad service';
  return null;
}
function validateTranslate(b) {
  if (!b || !LANGS[b.lang] || b.lang === 'en') return 'unsupported lang';
  if (!Array.isArray(b.strings) || b.strings.length < 1 || b.strings.length > LIMITS.strings) return 'strings must be 1-60 items';
  for (const s of b.strings) if (!isStr(s, 1, LIMITS.stringLen)) return 'bad string';
  return null;
}
function validateTts(b) {
  if (!b || !isStr(b.text, 1, LIMITS.ttsText)) return 'text must be 1-1500 characters';
  if (!LANGS[b.lang]) return 'unsupported lang';
  return null;
}

// ---------------------------------------------------------------- Gemini helpers
const baseUrl = () => process.env.GEMINI_BASE || 'https://generativelanguage.googleapis.com';
/** Model names that worked (or were discovered) at runtime, per kind: 'text' | 'tts'. */
const modelCache = {};

/** Ask Google which models this key can use and pick the newest suitable one (stable before preview). */
async function discoverModel(kind, avoid, loose = false) {
  const r = await deps.fetch(`${baseUrl()}/v1beta/models?pageSize=200`, { headers: { 'x-goog-api-key': cfg().key } });
  if (!r.ok) return null;
  const j = await r.json();
  const names = (j.models || []).filter(m => (m.supportedGenerationMethods || []).includes('generateContent')).map(m => String(m.name).replace(/^models\//, ''));
  const pool = kind === 'tts'
    ? names.filter(n => /tts/i.test(n))
    : names.filter(n => /flash/i.test(n) && !/(tts|image|live|audio|embed|robotics|computer)/i.test(n) && (loose || !/lite/i.test(n)));
  const preview = n => (/preview|exp/i.test(n) ? 1 : 0);
  pool.sort((x, y) => preview(x) - preview(y) || y.localeCompare(x, 'en', { numeric: true }));
  return pool.find(n => n !== avoid) || null;
}

async function callModel(model, body, timeoutMs) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await deps.fetch(`${baseUrl()}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': cfg().key },
      body: JSON.stringify(body)
    });
    if (r.ok) return { status: r.status, json: await r.json() };
    let detail = ''; try { detail = (await r.text()).slice(0, 400); } catch (x) { /* ignore */ }
    return { status: r.status, detail };
  } catch (err) {
    console.error(JSON.stringify({ severity: 'ERROR', event: 'gemini_unreachable', model, message: String(err.message).slice(0, 200) }));
    const e = new Error('upstream unavailable'); e.status = 502; throw e;
  } finally { clearTimeout(timer); }
}

/**
 * Calls Gemini for a kind of work ('text' or 'tts'). If the configured model has been retired (404),
 * discovers a working one once, remembers it, and retries – so a model rename never takes the app down.
 * Upstream details go to the server log only, never to the browser.
 */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const TRANSIENT = new Set([429, 500, 502, 503, 504]);
const RETRY_DELAYS = () => (process.env.GEMINI_RETRY_MS ? process.env.GEMINI_RETRY_MS.split(',').map(Number) : [700, 1800]);

async function gemini(kind, body, timeoutMs = 30000) {
  const c = cfg();
  if (!c.key) { const e = new Error('AI not configured'); e.status = 503; throw e; }
  let model = modelCache[kind] || (kind === 'tts' ? c.ttsModel : c.model);
  let res = await callModel(model, body, timeoutMs);

  // 1) retired model (404): discover a working one, remember it, retry
  if (res.status === 404) {
    console.error(JSON.stringify({ severity: 'WARNING', event: 'gemini_model_missing', kind, model, detail: res.detail }));
    let alt = null; try { alt = await discoverModel(kind, model); } catch (x) { /* fall through */ }
    if (alt) {
      console.error(JSON.stringify({ severity: 'NOTICE', event: 'gemini_model_switch', kind, from: model, to: alt }));
      model = alt; res = await callModel(model, body, timeoutMs);
      if (res.json) modelCache[kind] = model;
    }
  }
  // 2) temporary overload / rate limit (503, 429 ...): back off and retry the same model
  for (const delay of RETRY_DELAYS()) {
    if (res.json || !TRANSIENT.has(res.status)) break;
    console.error(JSON.stringify({ severity: 'WARNING', event: 'gemini_retry', kind, model, status: res.status }));
    await sleep(delay);
    res = await callModel(model, body, timeoutMs);
  }
  // 3) still overloaded: try one different model (not remembered, the outage is temporary)
  if (!res.json && TRANSIENT.has(res.status)) {
    let alt = null; try { alt = await discoverModel(kind, model, true); } catch (x) { /* none */ }
    if (alt) {
      console.error(JSON.stringify({ severity: 'WARNING', event: 'gemini_fallback_model', kind, from: model, to: alt }));
      res = await callModel(alt, body, timeoutMs); model = alt;
    }
  }
  if (!res.json) {
    console.error(JSON.stringify({ severity: 'ERROR', event: 'gemini_error', model, status: res.status, detail: res.detail }));
    const e = new Error('upstream ' + res.status); e.status = 502; throw e;
  }
  return res.json;
}
const textOf = j => (j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts || []).map(p => p.text || '').join('').trim();

/** Wrap raw 16-bit mono PCM (Gemini TTS: 24 kHz) in a WAV container the browser can play. */
function pcmToWav(pcm, sampleRate = 24000) {
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length, 4); h.write('WAVE', 8); h.write('fmt ', 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE(sampleRate * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

async function apiAsk(b) {
  const sys = `You are Sakhi Saathi, a kind voice assistant for a rural Indian woman with no tech knowledge. Reply ONLY in ${LANGS[b.lang]}, in at most 3 very short, simple sentences, no markdown. Use only these facts and say to ask the Anganwadi worker if unsure: ${clean(b.facts || '')} Never ask for OTP, passwords, PIN or bank details, and never give investment or legal advice.`;
  const j = await gemini('text', { systemInstruction: { parts: [{ text: sys }] }, contents: [{ role: 'user', parts: [{ text: clean(b.q) }] }] });
  const answer = textOf(j);
  if (!answer) { const e = new Error('empty answer'); e.status = 502; throw e; }
  return { answer };
}

async function apiRoute(b) {
  const list = b.services.map(s => `${s.id} = ${clean(s.hint || '')}`).join(' | ');
  const sys = 'Pick the single best matching service id for the woman\'s request (any Indian language or English). Reply with ONLY the id, or the word none. Services: ' + list;
  const j = await gemini('text', { systemInstruction: { parts: [{ text: sys }] }, contents: [{ role: 'user', parts: [{ text: clean(b.q) }] }] });
  const raw = textOf(j).toLowerCase();
  const hit = b.services.find(s => raw.includes(s.id.toLowerCase()));
  return { id: hit ? hit.id : null };
}

const trCache = new Map();
async function apiTranslate(b) {
  const out = new Array(b.strings.length), todo = [], idx = [];
  b.strings.forEach((s, i) => {
    const hit = trCache.get(b.lang + '|' + s);
    if (hit) out[i] = hit; else { todo.push(s); idx.push(i); }
  });
  if (todo.length) {
    const sys = `You translate short UI and government-scheme text for a rural Indian woman who has never used the internet. Translate every string in the JSON array into simple, spoken, respectful ${LANGS[b.lang]}. Keep numbers, the rupee sign, phone numbers, URLs, and names of schemes/banks/documents (Aadhaar, Ujjwala, Jan Dhan, SBI, MCP, OTP, UPI, CSC, VAO, PMKVY) recognisable; you may write them in the target script. Return ONLY a JSON array of strings with exactly ${todo.length} items, same order.`;
    const j = await gemini('text', {
      systemInstruction: { parts: [{ text: sys }] },
      contents: [{ role: 'user', parts: [{ text: JSON.stringify(todo) }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
    }, 60000);
    let arr;
    try { arr = JSON.parse(textOf(j)); } catch (e) { arr = null; }
    if (!Array.isArray(arr) || arr.length !== todo.length || arr.some(x => typeof x !== 'string')) { const e = new Error('bad translation'); e.status = 502; throw e; }
    arr.forEach((t, k) => { out[idx[k]] = t; trCache.set(b.lang + '|' + todo[k], t); });
    if (trCache.size > 20000) trCache.clear();
  }
  return { strings: out };
}

const ttsCache = new Map();
async function apiTts(b) {
  const key = crypto.createHash('sha1').update(b.lang + '|' + b.text).digest('hex');
  if (ttsCache.has(key)) return ttsCache.get(key);
  const c = cfg();
  const j = await gemini('tts', {
    contents: [{ parts: [{ text: clean(b.text) }] }],
    generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: c.ttsVoice } } } }
  }, 45000);
  const part = j && j.candidates && j.candidates[0] && j.candidates[0].content && (j.candidates[0].content.parts || []).find(p => p.inlineData && p.inlineData.data);
  if (!part) { const e = new Error('no audio'); e.status = 502; throw e; }
  const m = /rate=(\d+)/.exec(part.inlineData.mimeType || '');
  const wav = pcmToWav(Buffer.from(part.inlineData.data, 'base64'), m ? +m[1] : 24000);
  ttsCache.set(key, wav);
  if (ttsCache.size > 40) ttsCache.delete(ttsCache.keys().next().value);
  return wav;
}

// ---------------------------------------------------------------- http plumbing
function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}
const sendJson = (res, status, obj) => send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });

function readBody(req, limit = LIMITS.body) {
  return new Promise((resolve, reject) => {
    let size = 0, over = false; const chunks = [];
    // keep draining (without buffering) after the limit so the client can read our 413 instead of a reset
    req.on('data', c => { size += c.length; if (over) return; if (size > limit) { over = true; chunks.length = 0; reject(Object.assign(new Error('payload too large'), { status: 413 })); } else chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const ROUTES = {
  '/api/ask': { validate: validateAsk, run: apiAsk, max: 20 },
  '/api/route': { validate: validateRoute, run: apiRoute, max: 20 },
  '/api/translate': { validate: validateTranslate, run: apiTranslate, max: 40 },
  // speech is fetched one sentence group at a time (so it starts sooner), which takes a few more requests
  '/api/tts': { validate: validateTts, run: apiTts, max: 60, audio: true }
};

async function handleApi(req, res, pathname) {
  const route = ROUTES[pathname];
  if (!route) return sendJson(res, 404, { error: 'not found' });
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'POST only' });
  if (!/^application\/json/i.test(req.headers['content-type'] || '')) return sendJson(res, 415, { error: 'send JSON' });
  if (!allow(clientIp(req), pathname, route.max)) return sendJson(res, 429, { error: 'too many requests, please wait a minute' });
  let body;
  try { body = JSON.parse(await readBody(req)); } catch (e) { return sendJson(res, e.status || 400, { error: e.status === 413 ? 'payload too large' : 'invalid JSON' }); }
  const bad = route.validate(body);
  if (bad) return sendJson(res, 400, { error: bad });
  try {
    const result = await route.run(body);
    if (route.audio) return send(res, 200, result, { 'Content-Type': 'audio/wav', 'Content-Length': result.length, 'Cache-Control': 'private, max-age=3600' });
    return sendJson(res, 200, result);
  } catch (e) {
    return sendJson(res, e.status || 500, { error: e.status === 503 ? 'AI is not configured on this server' : 'service temporarily unavailable' });
  }
}

/** gzip once per file version (keyed by ETag) instead of on every request. */
const gzCache = new Map();
const gzipCached = (etag, data) => {
  let z = gzCache.get(etag);
  if (!z) { z = zlib.gzipSync(data); gzCache.set(etag, z); if (gzCache.size > 50) gzCache.delete(gzCache.keys().next().value); }
  return z;
};

function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
  let rel;
  try { rel = decodeURIComponent(pathname); } catch (e) { return send(res, 400, 'Bad request'); }
  if (rel.includes('\0')) return send(res, 400, 'Bad request');
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (file !== PUBLIC_DIR && !file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const ext = path.extname(file).toLowerCase();
    // code and pages always revalidate (cheap 304 via ETag) so a new deploy shows up immediately; images may be cached
    const etag = '"' + crypto.createHash('sha1').update(data).digest('base64url').slice(0, 20) + '"';
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream', ETag: etag, 'Cache-Control': ['.png', '.jpg', '.webp', '.ico'].includes(ext) ? 'public, max-age=86400' : 'no-cache' };
    if (req.headers['if-none-match'] === etag) return send(res, 304, undefined, headers);
    if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
      data = gzipCached(etag, data); headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
    }
    headers['Content-Length'] = data.length;
    send(res, 200, req.method === 'HEAD' ? undefined : data, headers);
  });
}

async function handler(req, res) {
  const { pathname } = new URL(req.url, 'http://localhost');
  // note: Cloud Run's front end reserves /healthz, so the app uses /api/health (kept /healthz for other hosts)
  if (pathname === '/api/health' || pathname === '/healthz') return sendJson(res, 200, { ok: true, ai: !!cfg().key });
  if (pathname.startsWith('/api/')) return handleApi(req, res, pathname);
  return serveStatic(req, res, pathname);
}

function createServer() { return http.createServer((req, res) => { handler(req, res).catch(() => { if (!res.headersSent) sendJson(res, 500, { error: 'server error' }); }); }); }

if (require.main === module) {
  const port = Number(process.env.PORT) || 8080;
  const server = createServer();
  server.listen(port, '0.0.0.0', () => console.log(`Sakhi Saathi listening on ${port} (AI ${cfg().key ? 'on' : 'off'})`));
  process.on('SIGTERM', () => server.close(() => process.exit(0)));
}

module.exports = { modelCache, createServer, handler, pcmToWav, allow, validateAsk, validateRoute, validateTranslate, validateTts, deps, LANGS, SECURITY_HEADERS };
