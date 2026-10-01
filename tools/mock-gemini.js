'use strict';
// Local stand-in for the Gemini API, used to exercise the app without a real key:
//   GEMINI_BASE=http://localhost:9090 GEMINI_API_KEY=test node server.js
const http = require('http');
http.createServer((req, res) => {
  let body = '';
  req.on('data', c => body += c);
  req.on('end', () => {
    const j = JSON.parse(body || '{}');
    const model = decodeURIComponent(req.url.split('/models/')[1] || '').split(':')[0];
    const sys = (j.systemInstruction && j.systemInstruction.parts[0].text) || '';
    const user = (j.contents && j.contents[0].parts[0].text) || '';
    let parts;
    if (/tts/.test(model)) {                          // 1 second 440 Hz tone, 24 kHz mono PCM16
      const pcm = Buffer.alloc(48000);
      for (let i = 0; i < 24000; i++) pcm.writeInt16LE(Math.round(Math.sin(i / 24000 * 2 * Math.PI * 440) * 6000), i * 2);
      parts = [{ inlineData: { mimeType: 'audio/L16;codec=pcm;rate=24000', data: pcm.toString('base64') } }];
    } else if (/translate/i.test(sys)) {              // prefix each string so the pipeline is visible
      const lang = /into simple, spoken, respectful (\w+)/.exec(sys);
      parts = [{ text: JSON.stringify(JSON.parse(user).map(s => '[' + (lang ? lang[1] : '??') + '] ' + s)) }];
    } else if (/Pick the single best/.test(sys)) {
      parts = [{ text: 'balance' }];
    } else {
      parts = [{ text: 'This is a mock answer. Please ask your Anganwadi worker.' }];
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ candidates: [{ content: { parts } }] }));
  });
}).listen(9090, () => console.log('mock gemini on 9090'));
