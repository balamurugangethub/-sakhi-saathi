# Architecture

Pictures of how Sakhi Saathi works, drawn from the code on `main`. Every diagram is [Mermaid](https://mermaid.js.org/):
GitHub draws it on this page, and it stays plain text, so it can be edited in the same pull request as the code it describes.
Each one has a short explanation and the functions to read next.

| # | Diagram | What it answers |
|---|---|---|
| 1 | [The big picture](#1-the-big-picture) | What runs where |
| 2 | [Where data lives](#2-where-data-lives-privacy-map) | What stays on the phone, what reaches the server, what is never collected |
| 3 | [Screen flow](#3-screen-flow) | The path a woman takes through the app |
| 4 | [Talk mode loop](#4-talk-mode-the-voice-loop-on-every-screen) | How every screen speaks, listens and reacts |
| 5 | [Voice out](#5-voice-out-choosing-a-voice) | Which voice reads the text, and how it starts fast |
| 6 | [Understanding a request](#6-understanding-what-she-asks-for) | How "I need gas" becomes the LPG screen |
| 7 | [Eligibility](#7-eligibility-logic) | Yes/no questions, and which schemes the home screen shows |
| 8 | [Profile and Find my state](#8-profile-wizard-and-find-my-state) | The optional profile, and GPS to state on the phone |
| 9 | [More languages](#9-more-languages-translation-on-demand) | How 7 extra languages are translated once and cached |
| 10 | [Server pipeline](#10-server-request-pipeline) | The checks every request passes |
| 11 | [Gemini resilience](#11-gemini-resilience) | Retries and model fallback |
| 12 | [Data pipeline](#12-data-pipeline-scheme-facts-as-a-data-product) | Scheme facts as tables, validation, freshness |
| 13 | [Build and deploy](#13-build-test-and-deploy) | CI, the weekly data check, Cloud Run |
| 14 | [Offline](#14-offline-the-service-worker) | The service worker cache |
| 15 | [Target (roadmap)](#15-target-roadmap) | The analytics platform still to be built |

---

## 1. The big picture

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

Almost everything happens on the phone: the screens, the scheme content, the eligibility rules, the profile and the
state lookup. The server has two jobs: serve the app's files, and act as a small proxy to Gemini so the API key never
reaches the browser. Without a key the app still works in Hindi, Tamil, Telugu and English with scripted answers and
device voices; the AI only adds extra languages, free-form answers, smarter matching and a voice for languages the
phone has none for.

**Code:** `public/app.js` (all screens and content), `server.js` (static files + `/api/*`), `public/sw.js` (offline).

---

## 2. Where data lives (privacy map)

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

The product promise is "no personal data", so this map is the one to check before any change. The profile and the
GPS position never leave the phone (`saveProfile`, `locateState`). Listening is done by the browser's own speech
service, which hands the app only text; the app uses that text for the current screen and drops it. Text reaches
our server only when it is needed for an answer, and the server keeps it only in small in-memory caches (translations,
the last 40 audio clips) that disappear on restart. The client's IP address is held in memory for rate limiting and
is never written to logs; the server logs only Gemini errors and model switches.

---

## 3. Screen flow

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

One idea per screen, and no dead ends. Every screen is a browser history entry (`screen()`), so the phone's Back
button goes one screen back instead of closing the app. On any screen she can also say "home", "back", "language",
"repeat" or "stop". A returning user skips the language screen.

**Code:** `langScreen`, `home`, `open`, `flow`, `result`, `stepScreen`, `askScreen`, `screen` and the `popstate` handler in `public/app.js`.

---

## 4. Talk mode: the voice loop on every screen

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

Every screen is built the same way: it renders its buttons, then hands `voiceScreen` the words to say and a handler
for her answer. The handler returns `false` when it did not understand, which drives the retry counter. On screens
that expect free speech (her need, her district, a question) a command only counts if it is three words or fewer, so
"I want to go back to my village" is not taken as "back". Browsers allow sound and the microphone only after one tap,
which is why the glowing speaker exists.

**Code:** `voiceScreen`, `speakThenHear`, `tapHint`, `hear`, `listen`, `command`, `act` in `public/app.js`.

---

## 5. Voice out: choosing a voice

```mermaid
flowchart TD
  t["Text to speak"] --> ch["Split at sentence ends<br/>first part short, about 120 characters,<br/>so she hears something quickly"]
  ch --> dv{"A device voice for<br/>this language?"}
  dv -- yes --> local["Browser speech<br/>an on-device voice first,<br/>online voices start later"]
  dv -- no --> ai{"AI on?"}
  ai -- yes --> tts["POST /api/tts for part 1<br/>part 2 is fetched while part 1 plays"]
  tts --> play["Play the WAV audio"]
  tts -- "first part failed" --> fb
  ai -- no --> fb{"Other voices exist and<br/>the language is not English?"}
  fb -- yes --> note["Show 'no voice for this<br/>language on this phone'"]
  fb -- no --> def["Default device voice"]
```

Many PCs have no Tamil or Telugu voice, so the server's Gemini voice fills the gap. Fetching one sentence group at a
time means she waits for the first sentence, not the whole paragraph, and `warm()` fetches the next question's audio
while she is still answering the current one. A new screen always cancels what the old one was saying (`speechToken`),
so two screens never talk over each other.

**Code:** `say`, `speakOne`, `chunks`, `voiceFor`, `speakLocal`, `ttsUrl`, `warm` in `public/app.js`; `apiTts`, `pcmToWav` in `server.js`.

---

## 6. Understanding what she asks for

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

The cheap, offline rules run first, so most requests never leave the phone; only words the rules cannot place are
sent to Gemini. Specific schemes are tried before broad ones because "my daughter's bank account" should open Sukanya
Samriddhi, not the bank-balance service. The server only accepts an id that is in the list it was given, so the model
cannot invent a service.

**Asking a question about a scheme** works the same way: with AI on, `/api/ask` answers in at most three short
sentences using only that scheme's facts; without AI (or if the call fails) the phone answers from the scheme's own
documents, "where to go" or money text, picked by keywords, or gives the helpline number.

**Code:** `route`, `fuzzyScheme`, `respond` in `public/app.js`; `apiRoute`, `apiAsk` in `server.js`.

---

## 7. Eligibility logic

**Inside a scheme:** yes/no questions, stopping at the first answer that rules her out.

```mermaid
flowchart TD
  o["She opens a scheme"] --> more{"More questions left?"}
  more -- no --> elig["Result: you can get this"]
  more -- yes --> ask["Ask the next question<br/>she says or taps yes or no"]
  ask --> want{"Is it the answer that<br/>keeps her eligible?<br/>usually yes, no for a few<br/>like 'do you already have one?'"}
  want -- yes --> more
  want -- no --> notE["Result: not for you<br/>with helplines"]
```

**On the home screen:** which scheme tiles she sees.

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

Each scheme has one small rule in `FIT`, for example *Matru Vandana: pregnant or a new mother, aged 18 to 59* or *a state cash scheme: same state, and her age group overlaps the scheme's age range*. A
skipped question counts as "maybe" (rules test `!== 'no'`), and a rule that errors counts as a pass, so the app would
rather show one scheme too many than hide one she could get. The questions inside a scheme still decide.

**Code:** `flow` (uses each scheme's `qs` and `qNo`), `home`, `FIT`, `fit`, `ageR` in `public/app.js`; tested in `test/app.test.js`.

---

## 8. Profile wizard and Find my state

```mermaid
flowchart TD
  intro["Intro: what is saved,<br/>and that it stays on this phone"] -- "yes" --> st["Which state?"]
  intro -- "no" --> home["Home"]
  st -- "pin button or 'location'" --> loc["Find my state<br/>on the phone"]
  loc --> conf{"'Tamil Nadu.<br/>Is this your state?'"}
  conf -- "yes" --> mic
  conf -- "no" --> st
  st -- "says or taps a state, or skips" --> mic{"Can this browser listen?"}
  mic -- yes --> dist["Say your district, or skip<br/>no typing anywhere"]
  mic -- no --> qs
  dist --> qs["9 questions, one per screen, each skippable<br/>age, married, category, minority,<br/>ration card, village or city,<br/>pregnant, daughter under 10, girl studying"]
  qs --> save["Save to localStorage only"]
  save --> fy["Home with 'Schemes for you'"]
```

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

```mermaid
flowchart TD
  p["Position, scaled to whole numbers"] --> each["For each state, for each outline"]
  each --> ray["Even-odd test: count how many<br/>outline edges a line going east crosses"]
  ray --> odd{"Odd number?"}
  odd -- yes --> inside["Inside: this is her state"]
  odd -- no --> near["Remember the nearest edge<br/>distance corrected for latitude"]
  near --> each
  each -- "no state contains it" --> close{"Nearest edge<br/>within about 30 km?"}
  close -- yes --> coast["That state<br/>for coasts and small islands"]
  close -- no --> none["Not found<br/>she picks from the list"]
```

Answers are spoken, not typed: a spoken number becomes an age group and "village"/"गाँव"/"கிராமம்" becomes `rural`
(`pickOption`). The state map ships with the app, so finding the state needs no reverse-geocoding API and nobody
learns where she is. A wrong guess near a border costs one "no". The map itself is built by a batch job (diagram 12).

**Code:** `profFlow`, `profScreen`, `locConfirm`, `profSave`, `locateState`, `stateAt`, `pickOption` in `public/app.js`; `test/geo.test.js`.

---

## 9. More languages: translation on demand

```mermaid
sequenceDiagram
  participant App as App on the phone
  participant LS as localStorage
  participant Srv as Server
  participant G as Gemini
  App->>App: collect every English text in the app
  App->>LS: read saved translations for this language
  App->>Srv: POST /api/translate, 40 missing strings per batch
  Srv->>Srv: skip strings already in its memory cache
  Srv->>G: translate the rest, answer as a JSON array
  G-->>Srv: JSON array
  Srv->>Srv: same length, all strings? otherwise error
  Srv-->>App: translated strings
  App->>LS: save, so next time needs no network
  App->>App: build screens, state names, yes and no words
```

Hindi, Tamil, Telugu and English are written by hand. Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi and
Odia are translated once per phone, cached in two places (the server's memory for everyone, the phone's localStorage
for her), and checked for shape before use. A cached language opens instantly and works offline.

**Code:** `collectTranslatable`, `ensureLang`, `applyTranslation`, `chooseLang` in `public/app.js`; `apiTranslate` in `server.js`.

---

## 10. Server request pipeline

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

Every response carries strict security headers (a Content-Security-Policy that blocks inline scripts, HSTS,
no-referrer, microphone and location allowed only for this site). Cheap checks come first, so a bad or abusive request
is rejected before it can cost a Gemini call. The server keeps no state that matters: Cloud Run can start or stop
copies of it at any time.

**Code:** `handler`, `handleApi`, `serveStatic`, `allow`, `validateAsk`/`Route`/`Translate`/`Tts`, `SECURITY_HEADERS` in `server.js`; `test/server.test.js`.

---

## 11. Gemini resilience

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

Google renames and retires Gemini models often. Instead of failing when that happens, the server finds a working model
by itself and keeps using it, so the live demo does not break on a model rename. On the phone every AI feature has a
non-AI fallback, so a 502 means a simpler answer, not an error screen.

**Code:** `gemini`, `callModel`, `discoverModel` in `server.js`; `tools/mock-gemini.js` to try it without a real key.

---

## 12. Data pipeline: scheme facts as a data product

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

```mermaid
flowchart LR
  ne["Natural Earth admin-1<br/>v5.1.2, public domain, 40 MB"] --> india["Keep India"]
  india --> codes["Rename codes to the app's<br/>UT to UK, OR to OD, ..."]
  codes --> fix["Drop known source errors"]
  fix --> simp["Simplify outlines<br/>Douglas-Peucker, about 1 km"]
  simp --> int["Round to 0.001 degree<br/>store as whole numbers"]
  int --> out["public/states.geo.json<br/>99 KB, 36 states and UTs"]
```

Scheme amounts and rules go out of date, so the content is treated like a dataset: extracted into flat tables in
BigQuery's load format (NDJSON), checked against rules, and given a freshness status from human-verified provenance.
Extraction runs the real app in jsdom, so the tables can never drift from what users see. Errors (a missing language, a
non-government link, a bad phone number, a scheme with no source) fail CI; a verification older than its review window
(60 days for state cash schemes, 180 for central ones) fails the weekly check. The state map is a second, smaller
batch job whose output ships with the app.

**Code:** `data/extract.js`, `data/validate.js`, `data/geo.js`, `data/sources.json`; `test/data.test.js`, `test/geo.test.js`. Details in [`data/README.md`](../data/README.md).

---

## 13. Build, test and deploy

```mermaid
flowchart LR
  br["Feature branch"] --> pr["Pull request"]
  pr --> ci["GitHub Actions CI<br/>npm run check, npm test,<br/>npm run data:check"]
  ci --> main["Merge to main"]
  main --> dep["Owner runs gcloud run deploy<br/>--source . in Cloud Shell"]
  dep --> img["Cloud Build makes the image<br/>from the Dockerfile:<br/>node:22-alpine, non-root user"]
  img --> svc["Cloud Run service sakhi-saathi<br/>asia-south1"]
  svc --> hc["/api/health"]
  cron["Every Monday 09:00 IST"] --> fw["Data freshness workflow<br/>strict check and link check"]
  fw --> art["Report and NDJSON tables<br/>uploaded as a build artifact"]
```

`main` is always deployable. Deploys are manual on purpose: the Cloud Run project belongs to a separate Google account,
and the Gemini key setting carries over from the previous revision. The image holds only `package.json`, `server.js`
and `public/`; it has no runtime dependencies to install.

**Code:** `.github/workflows/ci.yml`, `.github/workflows/data-freshness.yml`, `Dockerfile`; deploy steps in [`CLAUDE.md`](../CLAUDE.md).

---

## 14. Offline: the service worker

```mermaid
flowchart TD
  r["The browser asks for a file"] --> g{"GET, same site,<br/>and not /api/?"}
  g -- no --> net["Straight to the network<br/>answers, translations and audio are always live"]
  g -- yes --> c{"In the cache?"}
  c -- yes --> serve["Serve the cached copy now,<br/>refresh it in the background"]
  c -- no --> fetch["Fetch from the network<br/>and keep a copy"]
  fetch -- "offline" --> fail["Fails, nothing cached yet"]
```

The app opens instantly and works without signal in the four built-in languages. The cost of "cached copy first" is
that a fresh deploy appears on the second page load, not the first.

**Code:** `public/sw.js`.

---

## 15. Target (roadmap)

What is planned to turn this into a full data platform (see [`ROADMAP.md`](ROADMAP.md)). None of this is built yet.

```mermaid
flowchart LR
  U["Browser PWA"] -- "anonymous events" --> E["/api/event<br/>validate, rate-limit"]
  E --> P["Pub/Sub"]
  P --> BQraw[("BigQuery raw.events")]
  T[("scheme tables")] -- "Cloud Run Job" --> BQraw2[("BigQuery raw.schemes")]
  BQraw --> D["dbt: staging to marts<br/>tests and docs"]
  BQraw2 --> D
  D --> L["Looker Studio dashboard<br/>usage, search misses, data freshness"]
  SCH["Cloud Scheduler"] --> J["Cloud Run Jobs<br/>load and freshness check"]
  J --> BQraw2
  D -- "search-miss backlog" --> F["New schemes and features"]
```

## Design decisions
- **Privacy first.** The product promise is "no personal data". Events carry only coarse, non-identifying fields (event type, scheme id, language, optional state the user picked, app version, day). No IP, no cookie or persistent id, no free text, no voice. Dashboards hide groups smaller than a threshold.
- **Location stays on the phone.** "Find my state" turns GPS into a state with a bundled public-domain map (`public/states.geo.json`, built by `data/geo.js`), so no coordinates reach the server or a geocoding API.
- **Rules before AI.** Matching, eligibility and fallbacks run on the phone; Gemini is called only for what rules cannot do, which keeps cost, latency and data sent to a minimum, and keeps the app useful without a key.
- **The app stays the source of truth for content**; the pipeline reads it exactly as the browser does, so data and product cannot drift.
- **Freshness is a first-class metric.** Scheme facts expire; each has a provenance entry and a review window, and the weekly job fails when one goes stale.
- **Cost control.** BigQuery free tier is enough for this volume; tables are partitioned by day and clustered by event type, and dashboards query marts, not raw tables.
