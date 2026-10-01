# 🌸 Sakhi Saathi (सखी साथी) – The Invisible Woman Challenge

A voice-first, zero-typing AI guide that helps a first-time woman user — no English, no tech background, no one to ask — independently access **one government scheme: PM Matru Vandana Yojana (PMMVY)**, ₹5,000 for pregnant and nursing mothers, in **Hindi or Telugu**.

**Live demo:** _add GitHub Pages link here_

## Problem
48% of rural Indian girls have never used the internet. Women are locked out of digital systems by design, not capability (SDG 5.1, 5.b · SDG 4.3, 4.4 · SDG 10.2).

## How it works (zero digital knowledge needed)
1. Opens speaking aloud in her language — she never has to read.
2. Three big **✅ / ❌ buttons** (or she just says *"haan / nahi"*) check eligibility: pregnant/infant, first child, age 19+.
3. Spoken + visual result: eligibility, **documents to carry** (icons), **where to go** (Anganwadi / ASHA), **how much money** (₹1,000 + ₹2,000 + ₹2,000), helpline one-tap call.
4. **Ask anything by voice** – answered by **Google Gemini** (`gemini-2.5-flash`) in her language; offline FAQ fallback when no key/network.

## Tech
- Single static `index.html`, no build step, works on any phone browser (Chrome recommended for voice).
- Web Speech API (speech-to-text + text-to-speech, `hi-IN`, `te-IN`).
- Gemini API for free-form Q&A. The API key is **never committed**: tap the logo 5× to paste a key (stored only in that browser's localStorage). The app is fully usable without it.
- Built with Google AI "vibe coding".

## Scale path
Same engine → add scheme JSON + language block → full AI navigator for all government schemes for women (Ujjwala, Sukanya Samriddhi, Ladli Behna, PMKVY skilling).

## Run locally
Open `index.html` in Chrome, or `python -m http.server`.
