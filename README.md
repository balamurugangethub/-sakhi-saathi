# 🌸 Sakhi Saathi (सखी साथी) – The Invisible Woman Challenge

A voice-first, zero-typing AI guide that helps a first-time woman user — no English, no tech background, no one to ask — independently access **one government scheme: PM Matru Vandana Yojana (PMMVY)**, ₹5,000 for pregnant and nursing mothers, in **Hindi or Telugu**.

**Live demo:** _add GitHub Pages link here_

## Problem
48% of rural Indian girls have never used the internet. Women are locked out of digital systems by design, not capability (SDG 5.1, 5.b · SDG 4.3, 4.4 · SDG 10.2).

## Services covered (8) – in Hindi, Tamil, Telugu and English
| | Service |
|---|---|
| 🔥 | **Book an LPG cylinder** (IVRS call steps, safety, leak number 1906) |
| 🎁 | PM Ujjwala – free gas connection |
| 💵 | **Kalaignar Magalir Urimai Thogai** – ₹1,000/month (Tamil Nadu) |
| 🤰 | PM Matru Vandana Yojana – ₹5,000 |
| 👧 | Sukanya Samriddhi – savings for daughters |
| 🏦 | PM Jan Dhan – free bank account |
| 🏥 | Ayushman Bharat – ₹5 lakh free treatment |
| 🧵 | Skill India / PMKVY – free skill training |

## How it works (zero digital knowledge needed)
1. Pick a language with one big button (🗣️ हिन्दी / தமிழ் / తెలుగు / English). From then on everything is **spoken aloud** – she never has to read.
2. Tap a picture, **or just say what she needs** ("gas", "bank", "இலவச சிகிச்சை") – the voice router picks the service (Gemini helps when a key is set).
3. Big ✅/❌ eligibility questions (tap or say yes/no in her language).
4. Spoken + visual result: **documents to carry** (icons), **where to go / what to do**, **what she gets**, and one-tap **call buttons**.
5. **Ask anything by voice** about the service – answered by **Google Gemini** (`gemini-2.5-flash`) in her language, with an offline answer fallback.

## Tech
- Single static `index.html`, no build step, works on any phone browser (Chrome recommended for voice).
- Web Speech API for speech-to-text and text-to-speech (`hi-IN`, `ta-IN`, `te-IN`, `en-IN`).
- Gemini API for free-form Q&A and intent routing. The API key is **never committed**: tap the logo 5× to paste a key (stored only in that browser's localStorage). The app is fully usable without it.
- Built with AI-assisted vibe coding.
- Adding a scheme = one object in the `S` array; adding a language = one block in `U` plus a field per scheme.

## Scale path
Same engine → add scheme JSON + language block → full AI navigator for all government schemes for women (Ujjwala, Sukanya Samriddhi, Ladli Behna, PMKVY skilling).

## Run locally
Open `index.html` in Chrome, or `python -m http.server`.
