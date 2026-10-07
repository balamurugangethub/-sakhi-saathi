# Sakhi Saathi (सखी साथी)
**Challenge: The Invisible Woman** · PromptWars × HackArena · SDG 5 (5.1, 5.b), SDG 4 (4.3, 4.4), SDG 10 (10.2)

> A first-time woman user with no English and no tech background can independently find and use essential government services – by **voice or one tap, in her own language**.

**Live demo (Google Cloud Run):** https://sakhi-saathi-567566086238.asia-south1.run.app

## The problem
48% of rural girls in India have never used the internet, and most who have were guided by a male family member. Women are locked out of digital systems by design, not capability.

## What it does
- **Four hand-written languages** – Hindi, Tamil, Telugu, English – plus **seven more** (Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia) translated on demand by **Gemini** and cached on the device.
- **Basic services, no login or profile:** book an LPG cylinder, check a bank balance by missed call, open a Jan Dhan account.
- **Schemes:** Matru Vandana, Ujjwala, Sukanya Samriddhi, Ayushman Bharat, Skill India, widow pension, girls' scholarships, women's savings groups (Lakhpati Didi), Tamil Nadu Magalir Urimai Thogai and monthly-cash schemes for Maharashtra, Karnataka, West Bengal, Madhya Pradesh and Odisha.
- **Optional profile** (state, district, age, category …) that filters "Schemes for you". It lives **only in the phone's localStorage**, is never sent anywhere (not even to Gemini) and can be deleted in one tap.
- **Voice in:** Web Speech API with live transcript and specific, translated error messages. **Talk mode** is on by default wherever the browser can listen (a 🎤 switch in the header turns it off): after the app speaks, it listens, so she can pick her language, answer "yes"/"no", say a choice, her state or district, open her profile, hear the helpline numbers, or say "next", "back", "repeat", "home", "language" or "stop" on any screen. Buttons stay as an optional fallback, and there is no typing anywhere. What she says is used for that screen only and never stored. **Voice out:** on by default; every screen tries to speak as soon as it opens, and because browsers allow sound only after the first tap, that first tap replays what was missed (the first screen also has a glowing "Listen" button that names each language in its own voice). Turning voice off is remembered. Uses a device voice for the language when one exists (an on-device one first, as online voices start later), otherwise **Gemini text-to-speech** from the server (this is what makes Tamil/Telugu work on PCs that have no such voice), fetched a sentence or two at a time so she hears the first words much sooner instead of waiting for the whole text to be made.
- **Official website button** on every service (pmuy.gov.in, pmmvy.wcd.gov.in, scholarships.gov.in, the gas companies' booking sites, state portals …): opens in a new tab with a safety note ("press Back to return; never share your OTP or PIN") and is included in the WhatsApp message.
- **Share on WhatsApp:** one tap sends the checklist (documents, where to go, helplines) in her language, so she can show it at the Anganwadi or send it to a relative.
- **Listen step by step:** reads one short instruction at a time with Next/Back, for slow listeners.
- **Installable and offline-ready (PWA):** "Install app" puts an icon on the home screen; the core app works offline in the four built-in languages.
- **Large-text mode (A+)** for a helper or weak eyesight.
- Every screen: one task, big buttons (≥56 px), illustrated flat icons (no emoji), documents-to-carry list, step-by-step instructions, one-tap call buttons, and no dead ends.

## Architecture
```mermaid
flowchart LR
  subgraph phone["Her phone: browser, installable as an app"]
    UI["App screens<br/>public/app.js"]
    SW["Service worker<br/>offline copy of the app"]
    LS[("localStorage<br/>language, profile, settings,<br/>translated text")]
    GEO["states.geo.json<br/>state map"]
    SP["Browser speech<br/>listening and device voices"]
  end
  subgraph cloud["Google Cloud Run"]
    SRV["Node server<br/>server.js, zero dependencies"]
  end
  GEM["Gemini API"]
  GOV["Official government sites"]
  WA["WhatsApp"]
  TEL["Phone dialer"]

  SW -. "serves app files" .-> UI
  UI <--> LS
  UI <--> SP
  UI --> GEO
  UI -- "/api/ask, /route, /translate, /tts<br/>never the profile or location" --> SRV
  SRV -- "GEMINI_API_KEY lives only here" --> GEM
  UI -- "opens in a new tab" --> GOV
  UI -- "shares the checklist" --> WA
  UI -- "helpline tel: links" --> TEL
```

Almost everything runs on the phone: screens, scheme content, eligibility rules, the profile and the state lookup. The server only serves the app and passes requests to Gemini, so the API key never reaches the browser.

### How it works, in pictures
All 19 diagrams, with explanations and the code behind each one, are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

**Where data lives.** The profile and GPS position never leave the phone; text reaches the server only when an answer needs Gemini, and is not saved.

```mermaid
flowchart LR
  subgraph stays["Stays on the phone"]
    P["Profile: state, district, age group,<br/>category, yes/no answers"]
    L["GPS position<br/>used once to find the state, then dropped"]
    S["Settings: language, voice,<br/>talk mode, large text"]
    T["Translated text cache"]
  end
  subgraph passes["Passes through the server for one request, not saved"]
    Q["Her spoken request, only when the<br/>phone could not match it by itself"]
    A["Her question about a scheme,<br/>with that scheme's public facts"]
    X["App text to translate or read aloud"]
  end
  subgraph never["Never collected"]
    N["Name, phone number, Aadhaar,<br/>accounts, cookies, tracking ids,<br/>recordings of her voice"]
  end
  passes --> GEM["Gemini"]
```

**Screen flow.** One idea per screen, no dead ends; the phone's Back button and the spoken words "home", "back", "language", "repeat" and "stop" work everywhere.

```mermaid
flowchart TD
  start(["Open the app"]) --> saved{"Language already<br/>saved on this phone?"}
  saved -- no --> lang["Language screen<br/>say or tap Hindi, Tamil, Telugu, English<br/>+7 more when AI is on"]
  saved -- yes --> home
  lang --> home["Home<br/>'What do you need?' and picture tiles"]
  home -- "'profile'" --> prof["Profile wizard<br/>see diagram 8"]
  prof --> home
  home -- "says or taps a need" --> route["Understand the request<br/>see diagram 6"]
  route -- "scheme with questions" --> q["Question screen<br/>one yes/no question at a time"]
  route -- "basic service, no questions" --> ok
  q -- "every answer fits" --> ok["Result: you can get this<br/>documents, where to go, money, helplines,<br/>official site, share on WhatsApp"]
  q -- "an answer rules her out" --> no["Result: not for you<br/>helplines, back home"]
  ok -- "'steps'" --> steps["Step by step<br/>one instruction per screen"]
  steps -- "'done'" --> ok
  ok -- "'question'" --> ask["Ask a question<br/>see diagram 6"]
  ask -- "back" --> ok
  ok -- "'call'" --> calls["Reads the helpline numbers<br/>digit by digit"]
  no --> home
```

**Talk mode.** Every screen speaks, then listens, retries quietly on silence, and accepts commands before passing her words to the screen.

```mermaid
flowchart TD
  open["A screen opens and calls<br/>voiceScreen(text, handler)"] --> von{"Voice on?"}
  von -- yes --> say["Speak the screen<br/>see diagram 5"]
  von -- no --> tm
  say --> blk{"Browser held the sound<br/>back until a first tap?"}
  blk -- yes --> tap["Show a big glowing speaker<br/>her first tap replays the screen"]
  tap --> say
  blk -- no --> tm{"Talk mode on and the<br/>browser can listen?"}
  tm -- no --> wait["Wait for a tap<br/>buttons are the fallback"]
  tm -- yes --> listen["Listen once<br/>live words shown on screen"]
  listen -- "silence" --> quiet{"Fewer than 3<br/>quiet tries?"}
  quiet -- yes --> listen
  quiet -- no --> micT["Say 'tap the mic to talk'"]
  listen -- "mic not allowed" --> off["Turn talk mode off<br/>and say how to allow it"]
  listen -- "heard words" --> cmd{"A command?<br/>stop, repeat, home,<br/>back, language"}
  cmd -- yes --> doit["Do it"]
  cmd -- no --> handler{"Did this screen's<br/>handler understand?"}
  handler -- yes --> next["Next screen<br/>the loop starts again there"]
  handler -- no --> miss{"Fewer than 3 misses?"}
  miss -- yes --> sorry["Say 'I did not understand'"]
  sorry --> listen
  miss -- no --> giveup["Say the screen's give-up hint<br/>for example 'tap a picture'"]
```

**Understanding a request.** Keyword rules, then name matching, run on the phone; Gemini is asked only when both fail.

```mermaid
flowchart TD
  words["Her words on the home screen"] --> pc{"'profile' or 'delete'?"}
  pc -- yes --> pw["Open or delete the profile"]
  pc -- no --> kw{"1. Keyword rules<br/>specific schemes first: state cash,<br/>widow, scholarship, savings groups,<br/>then broad ones: gas, bank"}
  kw -- match --> openS["Open that service"]
  kw -- none --> fz{"2. Fuzzy match<br/>most words of a scheme name,<br/>common words skipped"}
  fz -- match --> openS
  fz -- none --> aiq{"3. AI on?"}
  aiq -- yes --> api["POST /api/route<br/>Gemini picks one id from the list, or none"]
  api -- "id from the list" --> openS
  api -- none --> miss["Not understood<br/>ask again, see diagram 4"]
  aiq -- no --> miss
```

**Eligibility.** Yes/no questions stop at the first answer that rules her out; the home screen shows schemes whose rule passes for her profile, counting skipped questions as "maybe".

```mermaid
flowchart TD
  o["She opens a scheme"] --> more{"More questions left?"}
  more -- no --> elig["Result: you can get this"]
  more -- yes --> ask["Ask the next question<br/>she says or taps yes or no"]
  ask --> want{"Is it the answer that<br/>keeps her eligible?<br/>usually yes, no for a few<br/>like 'do you already have one?'"}
  want -- yes --> more
  want -- no --> notE["Result: not for you<br/>with helplines"]
```

```mermaid
flowchart TD
  all["Every service"] --> basic{"Basic service?<br/>LPG, bank balance, Jan Dhan"}
  basic -- yes --> b["Always shown<br/>under 'Basic services'"]
  basic -- no --> hp{"Profile saved?"}
  hp -- no --> so{"State-only scheme?"}
  so -- no --> pop["Shown under 'Popular schemes'"]
  so -- yes --> h1["Hidden until she gives her state<br/>still reachable by voice"]
  hp -- yes --> fit{"Does the scheme's rule<br/>pass for her profile?"}
  fit -- yes --> fy["Shown under 'Schemes for you'"]
  fit -- no --> h2["Hidden"]
```

**Find my state.** The phone turns GPS into a state with a bundled map; the coordinates are never sent or stored.

```mermaid
sequenceDiagram
  actor W as Woman
  participant App as App on the phone
  participant GPS as Phone location
  participant Srv as Our server
  W->>App: taps the pin, or says "location"
  App->>GPS: ask for a coarse position
  App->>Srv: GET states.geo.json, the same file for everyone
  GPS-->>App: latitude, longitude
  Srv-->>App: state outlines, 36 states and UTs
  App->>App: stateAt(lat, lon) on the phone
  Note over App: the coordinates are dropped here, never sent or stored
  App->>W: "Tamil Nadu. Is this your state?" with big Yes and No
  W->>App: Yes
  App->>App: profile.state = TN, saved in localStorage
```

**Server and Gemini.** Cheap checks reject bad requests first; a retired or busy Gemini model is replaced automatically.

```mermaid
flowchart TD
  req["Request"] --> h{"/api/health?"}
  h -- yes --> hj["ok, and whether AI is on"]
  h -- no --> isApi{"Starts with /api/?"}
  isApi -- no --> path{"Path stays inside public/?"}
  path -- no --> f403["403"]
  path -- yes --> etag{"Browser already has<br/>this version? ETag"}
  etag -- yes --> n304["304, nothing to send"]
  etag -- no --> gz["File, gzipped once per version"]
  isApi -- yes --> known{"Known route?"}
  known -- no --> n404["404"]
  known -- yes --> post{"POST with JSON?"}
  post -- no --> e405["405 or 415"]
  post -- yes --> rl{"Under the per-IP limit?<br/>per minute: ask 20, route 20,<br/>translate 40, tts 60"}
  rl -- no --> e429["429, wait a minute"]
  rl -- yes --> body{"Body under 120 KB<br/>and valid JSON?"}
  body -- no --> e413["413 or 400"]
  body -- yes --> val{"Fields valid?<br/>lengths, language, ids"}
  val -- no --> e400["400"]
  val -- yes --> run["Handler, then Gemini<br/>see diagram 11"]
  run --> out["JSON, or audio/wav"]
```

```mermaid
flowchart TD
  start["gemini(kind, body)"] --> key{"API key set?"}
  key -- no --> e503["503: AI not configured<br/>the app falls back to scripted answers"]
  key -- yes --> try1["Call the model<br/>the last one that worked, or the configured one"]
  try1 --> r{"Result"}
  r -- "ok" --> ok["Return the answer"]
  r -- "404, model retired" --> disc["List the models this key can use,<br/>pick the newest suitable one, stable before preview,<br/>retry and remember it"]
  disc --> r2{"Result"}
  r -- "429 or 5xx, busy" --> retry["Wait 0.7 s, retry,<br/>then wait 1.8 s, retry"]
  r2 -- "ok" --> ok
  r2 -- "busy" --> retry
  retry -- "ok" --> ok
  retry -- "still busy" --> alt["Try one different model once<br/>not remembered, the outage is temporary"]
  alt -- "ok" --> ok
  alt -- "fails" --> e502["502 to the browser<br/>details go to the server log only"]
  r -- "other error" --> e502
  r2 -- "other error" --> e502
```

**Data pipeline.** Scheme facts are extracted into tables, validated, and checked for freshness every week.

```mermaid
flowchart LR
  app["public/app.js<br/>source of truth for content"] -- "extract.js<br/>loads the app in jsdom" --> reg["registry.json"]
  reg --> sch[("schemes.ndjson")]
  reg --> hl[("helplines.ndjson")]
  reg --> ln[("links.ndjson")]
  src["data/sources.json<br/>human-checked provenance:<br/>official source, last_verified,<br/>evidence_url, review window"] --> val["validate.js"]
  sch --> val
  hl --> val
  ln --> val
  val --> res{"Result per scheme"}
  res -- "rule broken" --> err["error: fails CI"]
  res -- "verified too long ago" --> stale["stale: fails the weekly check"]
  res -- "never verified or<br/>change announced" --> warn["warning: reported"]
  res -- "all good" --> fresh["fresh"]
```

The diagrams are [Mermaid](https://mermaid.js.org/) text that GitHub draws; their sources live in `docs/ARCHITECTURE.md`, and a test checks the README copies stay identical.

### Key properties
- **Google services:** Gemini API (answers, intent routing, translation, text-to-speech) and Google Cloud Run.
- **Security:** key never reaches the browser; CSP forbids inline scripts (`script-src 'self'`); all user text is escaped; request size/length validation; per-IP rate limits; no tracking, no accounts, no personal data stored server-side; non-root container.
- **Efficiency:** no framework, no external fonts or images (inline SVG), small gzip transfer, stateless server.
- **Accessibility:** semantic buttons, `lang` switching, `aria-live` status regions, decorative icons hidden from screen readers, high contrast, large touch targets, reduced-motion support.

## How this maps to the evaluation criteria
| Criterion | Where to look |
|---|---|
| **Problem-statement alignment** | One woman, no English, no tech background, no one to ask: voice-first flow, 4 hand-written languages (+7 via Gemini), picture cards, spoken steps, no typing, no login (`public/app.js`) |
| **Google services** | Gemini API for answers, intent routing, translation and text-to-speech; deployed on Google Cloud Run; secrets in Secret Manager (`server.js`, `Dockerfile`) |
| **Security** | Key only on the server, strict CSP/HSTS headers, input validation, rate limiting, non-root container, on-device profile ([SECURITY.md](SECURITY.md), `test/server.test.js`) |
| **Efficiency** | Zero runtime dependencies, no framework, inline SVG instead of images, ETag revalidation, per-version gzip cache, service-worker offline shell |
| **Testing** | 33 automated tests (`npm test`, `npm run coverage`), CI on every push (`.github/workflows/ci.yml`) |
| **Accessibility** | Skip link, `lang` switching, `aria-live` status regions, labelled controls, hidden decorative icons, 56 px targets, large-text mode, reduced-motion and high-contrast support (`test/app.test.js`) |
| **Code quality** | Small documented server, content-complete data tables enforced by tests, JSDoc on server helpers, `.editorconfig`, MIT licence |

## Run locally
```bash
npm install          # only needed for tests (jsdom)
GEMINI_API_KEY=your_key node server.js     # http://localhost:8080
npm test             # 33 tests: server, security, content completeness, eligibility rules, a11y
```
Without a key everything still works in the four core languages (scripted answers, browser voices); AI answers, extra languages and server voice need `GEMINI_API_KEY`.
To try the AI paths without a key: `node tools/mock-gemini.js` and `GEMINI_BASE=http://localhost:9090 GEMINI_API_KEY=test node server.js`.

## Deploy to Google Cloud Run
```bash
gcloud auth login && gcloud config set project YOUR_PROJECT
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com
printf "YOUR_GEMINI_KEY" | gcloud secrets create gemini-api-key --data-file=-
gcloud run deploy sakhi-saathi --source . --region asia-south1 --allow-unauthenticated \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```
(Grant the Cloud Run service account the *Secret Manager Secret Accessor* role if prompted.) Open the printed URL in Chrome or Edge; the microphone needs HTTPS, which Cloud Run provides.

## Project layout
| Path | Purpose |
|---|---|
| `public/` | the app: `index.html`, `app.js` (data, voice, UI), `style.css`, `sw.js` + `manifest.webmanifest` (PWA), icons |
| `server.js` | static hosting + Gemini proxy, validation, rate limiting, security headers |
| `test/` | `server.test.js`, `app.test.js` (`npm test`) |
| `docs/` | `ARCHITECTURE.md` (diagrams of how the app works), `ROADMAP.md` |
| `data/` | scheme data extraction, validation and provenance ([data/README.md](data/README.md)) |
| `tools/` | `mictest.html` (microphone diagnostics), `mock-gemini.js`, `make-icons.js` |
| `Dockerfile` | Cloud Run image |
| `VIBE_PROMPT.md` | the prompt used to vibe-code the app |

## Adding a service or language
- **Service:** add one object to `S` in `public/app.js` (name, description, questions, documents, where, info, helplines, facts) and, if needed, an eligibility rule in `FIT`. Tests fail if any core language is missing.
- **Language:** hand-write a block in `U`/`PU` and a column per text, or add it to `EXTRA` to have Gemini translate it.

## Honest limits
Scheme amounts, helpline numbers and eligibility rules were compiled from public guidelines and **must be confirmed locally** (the app says so). District is stored for display only; district-level offices are not bundled. Extra-language translations are machine-generated and should be reviewed by a native speaker before wide use.

## Model names
Defaults: text `gemini-3.1-flash-lite`, voice `gemini-3.8-flash-preview-tts` (override with `GEMINI_MODEL` / `GEMINI_TTS_MODEL`). If Google retires a model (HTTP 404) the server lists the models available to the key, switches to the newest suitable one, remembers it and retries – so a model rename does not take the app down. Details are written to the server log only.
