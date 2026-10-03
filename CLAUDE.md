# Sakhi Saathi – project context for Claude (Claude Code, Claude Projects)

Read this first. It exists so no chat history is needed to continue the work.

## What this is
A voice-first guide that helps first-time women users in India find government services and schemes in their own language (Hindi, Tamil, Telugu, English + 7 more via Gemini). Built for the PromptWars × HackArena "Invisible Woman" challenge, and being grown into a **data-engineering portfolio project** (owner wants a data engineer career). Roadmap: `docs/ROADMAP.md`. Architecture: `docs/ARCHITECTURE.md`. Data layer: `data/README.md`.

## Commands
| | |
|---|---|
| `npm install` | dev dependency only (jsdom, used by tests and the data extractor) |
| `npm test` | all tests (server, app, data layer) – must pass before every push |
| `npm run check` | syntax check of server, app and data scripts |
| `npm run data:build` / `data:check` / `data:check:strict` | extract, validate and freshness-check the scheme data |
| `npm run data:geo` | rebuild `public/states.geo.json` (state map for "Find my state", lookup runs on the phone) |
| `GEMINI_API_KEY=... node server.js` | run locally on :8080 (without a key the app works in the 4 core languages) |
| `node tools/mock-gemini.js` + `GEMINI_BASE=http://localhost:9090 GEMINI_API_KEY=test node server.js` | exercise AI paths without a real key |

## Layout
`public/` the app (`app.js` holds all scheme content and UI, no framework, no inline scripts) · `server.js` zero-dependency Node server + Gemini proxy · `data/` extraction, validation, provenance (`sources.json`) · `test/` · `tools/` · `docs/` · `Dockerfile` (Cloud Run).

## Rules that must not be broken
- **No personal data.** No accounts, no tracking of individuals. The optional user profile lives only in the browser's localStorage and is never sent anywhere. GPS ("Find my state") is turned into a state on the phone; coordinates are never sent or stored. Any analytics must be aggregate and anonymous (see roadmap phase 2); no IP, no persistent ids, no free text.
- **The Gemini key exists only on the server** (`GEMINI_API_KEY`). Never in client code, the repo, chat, or logs. Never ask the owner to paste it.
- **Never set `last_verified` in `data/sources.json` for facts that were not actually re-checked**, and always record the `evidence_url`.
- Scheme facts change often (state governments rename and re-price schemes). Verify against an official or reputable source before editing amounts.
- Keep the page light (no frameworks, no external fonts/images), keep touch targets large, keep every text available in hi/ta/te/en (tests enforce this).
- Tests must pass; add a test with every behaviour change.

## Deployment (Google Cloud Run)
- Service `sakhi-saathi`, region `asia-south1`, URL `https://sakhi-saathi-567566086238.asia-south1.run.app`, project id `gen-lang-client-0623968849` (project number `567566086238`, shown as "Default Gemini Project").
- The project belongs to a **different Google account than the owner's main one**. Cloud Shell must be opened while signed in to that account, otherwise the project is not found.
- Deploy (the Gemini key setting is kept from the previous revision, do not pass it again):
  ```
  cd ~ && rm -rf sakhi-saathi-latest
  git clone https://github.com/balamurugangethub/-sakhi-saathi.git sakhi-saathi-latest
  cd sakhi-saathi-latest
  gcloud run deploy sakhi-saathi --source . --region asia-south1 --allow-unauthenticated
  ```
- Always clone into a **new folder name**; deploying a stale folder once republished old code.
- Health check: `/api/health` returns `{"ok":true,"ai":true}`. (Cloud Run reserves `/healthz`.)
- The service worker serves a cached copy first, so a fresh deploy may need a second page load to appear. When verifying a deploy from a script, unregister the service worker and clear caches first.
- The repo name starts with a dash (`-sakhi-saathi`), which breaks `cd` and some tools: always clone into an explicit folder name.

## Working agreements
- Work on a feature branch (`feature/...`), keep `main` deployable; the live demo and hackathon link must stay working.
- Commit messages end with the attribution lines the harness asks for.
- The owner is a student in Tamil Nadu learning data engineering: explain choices briefly, prefer simple, well-tested code, and keep everything demo-able.
