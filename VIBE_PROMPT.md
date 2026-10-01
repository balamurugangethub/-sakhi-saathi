# Vibe-coding prompt (paste into Google AI Studio → Build)

Build a mobile-first, single-page web app called **"Sakhi Saathi" (सखी साथी)** for the "Invisible Woman" challenge (SDG 5, 4, 10). It helps a first-time smartphone user in rural India (a woman with no English, no tech background, no one to ask) independently access government services and schemes using **voice or very simple text in her own language**. It must need zero prior digital knowledge.

## Languages
Hindi, Tamil, Telugu and English. First screen = four huge language buttons labelled in their own script (हिन्दी / தமிழ் / తెలుగు / English). Remember the choice. Easy to add a language later (all text lives in one translations object).

## Home screen (most popular first)
Title in her language: "What help do you need?" with one big 🎤 mic button ("say what you need") and a 2-column grid of large picture tiles (emoji/icon + max 5 words), ordered by popularity among Indian women:
1. 🔥 Book a gas (LPG) cylinder
2. 🏦 Free bank account (Jan Dhan)
3. 🏥 Free treatment up to ₹5 lakh (Ayushman Bharat)
4. 🎁 Free gas connection (PM Ujjwala)
5. 🤰 ₹5,000 for pregnant mothers (PM Matru Vandana)
6. 👧 Savings for daughters (Sukanya Samriddhi)
7. 💵 ₹1,000/month for women heads of family (Kalaignar Magalir Urimai Thogai, Tamil Nadu)
8. 🧵 Free skill training (Skill India / PMKVY)
Tiles must be easy to extend (a data array), so more schemes (Mudra loans, Lakhpati Didi, Ladli Behna) can be added with one object each.

## Flow for each service
1. Spoken intro (text-to-speech) + one-line description.
2. 1–3 big **✅ Yes / ❌ No** eligibility questions (tap OR say yes/no by voice). LPG booking has no questions, it goes straight to steps.
3. Result screen: 🎉 eligible message, **documents to carry** (icon list), **where to go / what to do** (numbered, very short sentences), **what she gets / important safety tip**, one-tap **📞 call buttons** (tel: links), and a **🔊 Listen** button that reads the whole page aloud.
4. "❓ Ask something" → she speaks a question → Gemini (`gemini-3.8-flash`) answers in her language in ≤3 very short sentences using ONLY the facts about that scheme; if no API key or offline, fall back to built-in answers for "documents / where / how much". Never ask for OTP, passwords or bank details.
5. Voice router on home: she says "gas" / "bank" / "மகளிர் உரிமைத் தொகை" → open the matching service (keywords first, Gemini as fallback).
Not-eligible screen: kind message, link back home, helpline numbers. Never dead-end.

## Facts (keep exactly; include "confirm at your Anganwadi / bank / e-Sevai centre")
- LPG booking: call your gas company IVRS (Indane 7718955555, Bharat Gas 1800224344, HP Gas 9222201122), follow voice, delivery in 1–2 days, give delivery OTP, take receipt, don't overpay; gas leak: don't touch switches, open windows, call 1906.
- Ujjwala: free LPG connection for adult women of poor households with no connection; Aadhaar, ration/BPL card, bank passbook, photo; apply at gas agency. Helpline 1800-266-6696.
- Magalir Urimai Thogai (TN): ₹1,000/month to woman head of family (ration card), age 21+, family income < ₹2.5 lakh, no govt employee/income-tax payer; apply at camps / e-Sevai; ration card, Aadhaar, passbook, Aadhaar-linked mobile. Helpline 1100.
- PMMVY: ₹5,000 in 3 instalments (1,000 / 2,000 / 2,000) for pregnant/lactating women 19+, first child; Form 1-A at Anganwadi/ASHA; Aadhaar, passbook, MCP card. Helpline 7998799804.
- Sukanya Samriddhi: girl under 10, open at post office/bank with ₹250, up to ₹1.5 lakh a year.
- Jan Dhan: zero-balance account, RuPay card, ₹2 lakh accident insurance; Aadhaar, photo, mobile.
- Ayushman Bharat: ₹5 lakh/family/year cashless; free card at Ayushman Mitra desk/CSC; helpline 14555.
- Skill India: free courses + certificate; helpline 08800055555.

## Design (simple, minimal, professional – NOT a typical government website)
- Clean and calm: lots of white space, one accent colour (warm pink/magenta), soft rounded cards, subtle shadows, a friendly logo 🌸. No banners, carousels, marquee text, popups, cookie walls, tiny links or dense tables.
- Touch targets at least 56px tall; font size ≥18px body, 24px+ for questions/buttons; high contrast (WCAG AA); icons always paired with a word.
- One task per screen, one primary button per screen, big back/home buttons, progress dots. No typing needed anywhere.
- Fast and light on any device: single HTML file, no frameworks or heavy libraries or large images (use emoji/SVG), system fonts with Noto fallbacks for Devanagari/Tamil/Telugu, no layout shift, no animation except a gentle mic pulse; honour `prefers-reduced-motion`. Works on a ₹6,000 Android phone on 3G, in Chrome/Safari/Firefox/Samsung Internet, tablet and desktop (centered max-width 480px column on large screens).
- Responsive from 320px up; respect safe-area insets; works in portrait and landscape; supports 200% text zoom; keyboard and screen-reader accessible (semantic buttons, aria-labels, lang attributes).
- Text-to-speech and speech-to-text via Web Speech API (`hi-IN`, `ta-IN`, `te-IN`, `en-IN`); if voice isn't supported, everything still works by tapping.

## Tech/security
- Gemini API key must NEVER be hard-coded or committed. Read it from an input in a hidden settings panel (tap the logo 5 times), store only in localStorage. The app must be fully usable without a key.
- No tracking, no login, no personal data stored.
- Add a short footer: "Information from official scheme guidelines. Please confirm at your local centre."

## Judging requirements (the platform auto-scores these – satisfy ALL)
- **Deployable on Google Cloud Run**: include a `Dockerfile` (small Node image, listens on `$PORT`, 0.0.0.0) and a `/healthz` endpoint. The deployed URL must stay working.
- **Security**: the Gemini API key is read ONLY on the server from `process.env.GEMINI_API_KEY` (never in client code or the repo). The client calls our own `POST /api/ask` endpoint. Server validates input (type, max 300 chars), rate-limits per IP, sets security headers (CSP, X-Content-Type-Options, Referrer-Policy), escapes all output (no innerHTML with user text), has no secrets in git (`.gitignore`, `.env.example`).
- **Google services**: Gemini API (`gemini-3.8-flash`) for answers, intent routing and translation; deployed on Cloud Run; optionally Google Cloud Text-to-Speech / Translation as an upgrade over browser voices.
- **Testing**: automated tests (e.g. `node --test` or Vitest) for scheme data completeness (every scheme has hi/ta/te text, docs, calls), the keyword router, input validation on `/api/ask`, and the health endpoint. `npm test` must pass.
- **Accessibility**: semantic HTML, `lang` attribute switching per language, aria-labels, visible focus rings, ≥4.5:1 contrast, 56px touch targets, works at 200% zoom, `prefers-reduced-motion`, screen-reader announcements (`aria-live`) for spoken results.
- **Efficiency**: no frameworks, total page < 100 KB, no external fonts, gzip enabled, cache headers for static files.
- **Code quality**: small modules (data / ui / voice / api), JSDoc comments, ESLint-clean, a README with problem statement, SDG alignment (5.1, 5.b, 4.3, 4.4, 10.2), architecture, how to run/test/deploy.
- **Problem alignment**: one-sentence statement in README: "A first-time woman user with no English or tech background can independently access essential services by voice in Hindi, Tamil, Telugu or English."

## Voice behaviour (important)
- Voice output is **OFF by default**: nothing may speak automatically on page load. A clear 🔊 "Voice on / 🔇 Voice off" toggle (label in the selected language, `aria-pressed`) is shown at the top and remembered in localStorage. Turning it on speaks a short confirmation.
- When ON, each screen is read aloud automatically; the 🔊 "Listen again" button on every screen always works manually, even when the toggle is off.
- The spoken language MUST match the selected language (`hi-IN`, `ta-IN`, `te-IN`, `en-IN`): pick a matching `SpeechSynthesisVoice`, and never read Hindi/Tamil/Telugu text with an English voice. If no matching voice exists on the device, show a short message in that language explaining how to install one, instead of speaking in the wrong language.
- Changing language or leaving a screen cancels any speech in progress.

## Icons and imagery
- **No emoji anywhere in the UI.** Use a consistent set of simple, flat, friendly illustrated **inline SVG icons** (one per service: gas cylinder, gift box, rupee note, mother-and-baby heart, girl, bank building, hospital cross, sewing spool; plus document icons: ID card, passbook, phone, camera, certificate; and UI glyphs: mic, speaker, phone, home, back, check, cross). Same palette (pink, amber, blue, green, dark plum), same stroke weight.
- Icons are decorative (`aria-hidden="true"`) and always paired with a text label; inline SVG only (no external image files or icon fonts) so pages stay tiny and crisp on every screen.
- No decorative animations, GIFs or stock photos.

## Speech recognition must be robust (a common failure)
- Use the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) with `interimResults: true` and show the live words on screen so she can see she is being heard; use the final result, and fall back to the last interim text if the engine ends without a final one.
- Map errors to specific, friendly messages in her language: `not-allowed` (allow the microphone), `network` (needs internet), `audio-capture` (no microphone), `no-speech` (speak again). If `language-not-supported`, retry once with `en-IN`. Call the failure handler exactly once.
- Keyword routing must also match Roman-script and mixed spellings (e.g. "gais", "khata", "ilaj", "silai") and all four languages' words, and accept the top 3 recognition alternatives.
- Everything must remain usable by tapping if speech is unavailable. Test in Chrome/Edge over HTTPS (Cloud Run URL), not inside an embedded preview frame, which blocks the microphone.

## Optional profile (no login wall) and state-aware schemes
- **Basic services need no profile or login**: LPG booking, bank balance check (missed-call numbers: SBI 9223766666, Bank of Baroda 8468001111, Canara 09015483483, Union Bank 09223008586, or *99#), Jan Dhan account.
- An optional **"My profile"** (not a password login) asks, one big question at a time, each skippable: state (all 36 states/UTs, names in all 4 languages, tap or say it), district (optional text/voice), age band, married/unmarried/widow, category (General/OBC/SC/ST), minority religion yes/no (used only for scholarships), poor-family ration card, village/city, pregnant/baby under 6 months, daughter under 10, girl studying.
- **Privacy:** the profile is stored ONLY in the device's localStorage, never sent to any server or to Gemini, with a clear one-tap "Delete my data". Say this on the first profile screen in the user's language. Do not collect name, phone or Aadhaar.
- With a profile, home shows "Schemes for you" (filtered by eligibility rules); without one it shows "Popular schemes". Extra services: widow pension (NSAP), scholarships for girls (SC/ST/OBC/minority, National Scholarship Portal), women's savings groups (Lakhpati Didi / NRLM), and state monthly-cash schemes (Maharashtra Ladki Bahin, Karnataka Gruha Lakshmi, West Bengal Lakshmir Bhandar, Madhya Pradesh Ladli Behna, Odisha Subhadra, Tamil Nadu Magalir Urimai Thogai), always with "rules can change, confirm locally".

## Visual style: Google Arts & Culture–inspired editorial look
- White page, near-black text, one magenta accent, generous whitespace, large bold tight headings (clamp-based), system "Google Sans"-style font stack, 1px hairlines, soft layered shadows.
- Home = big heading + a pill "search" bar with a round mic button, an optional profile promo card, a horizontally scrolling snap strip for basic services and a responsive grid (2 columns on phones, 3–4 on desktop) of tall **artwork cards**: rich two-colour gradient, soft translucent circles for depth, a white circular badge holding the illustrated SVG icon, title bottom-left over a dark scrim, gentle hover lift (respect `prefers-reduced-motion`).
- Sticky translucent header with logo, a segmented language control and the voice toggle; compact two-row header on phones.
- Flow screens are single centred cards (max 620px) with big pill-radius buttons (≥56px), tinted circular icon badges, document lists with icon tiles, and a left-accent callout for instructions. No emoji, no clutter, no horizontal scroll at 320px.

## Architecture and judging requirements (final)
- Static front end in `public/` (no inline scripts or handlers) plus a **zero-dependency Node server** (`server.js`) that serves it with a strict CSP and proxies Gemini: `/api/ask`, `/api/route`, `/api/translate`, `/api/tts`, `/healthz`. `GEMINI_API_KEY` exists only on the server (Cloud Run secret). Validate every input, rate-limit per IP, never echo upstream errors.
- **Voice out**: use a device voice if one matches the language; otherwise request Gemini text-to-speech from `/api/tts` (wrap the 24 kHz PCM as WAV). This is required because many PCs have no Tamil/Telugu voice.
- **More languages** beyond Hindi/Tamil/Telugu/English (Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia): translate all UI/scheme strings on demand through `/api/translate`, cache in localStorage, show a progress message, and fall back gracefully offline.
- Tests (`npm test`): server security/validation/TTS/translate, content completeness per language, eligibility rules, routing, accessibility, no secrets. Dockerfile for Cloud Run.
- **Look:** flat illustration style — each service card is a gradient "scene" (sun, layered hills, soft shadow) holding that service's own flat illustration; the home hero shows a flat illustration of a woman speaking to her phone.

## Helper features
- **Share on WhatsApp** (`https://wa.me/?text=` link, `rel="noopener noreferrer"`) with the service name, documents, steps, important note and helplines in the selected language.
- **Listen step by step**: split the instructions into short steps (carry list, each step, important note) shown one per screen with Next/Back and spoken on each step.
- **PWA**: web manifest, 192/512 PNG icons, service worker (stale-while-revalidate for the shell; never cache `/api/*` or `/healthz`), and an "Install app" button on `beforeinstallprompt`.
- **Large-text toggle (A+)** for helpers; remembered locally; `aria-pressed`.
- Serve static code with `Cache-Control: no-cache` + ETag so new deployments are never stale.

## Official website links
- Every service result shows an "Open official website" button (blue, `target="_blank" rel="noopener noreferrer"`) to the scheme's official HTTPS portal (government domains, or the gas companies' own booking sites for LPG – one button per company), with a note in her language: this is the government website, press Back to return, never share OTP or PIN. Include the link in the WhatsApp share text. Test that every service has a link and every host is on an allow-list.
