# Data layer

Everything a user is told (amounts, helplines, rules, official links) is **data that goes stale**:
state governments rename and re-price schemes several times a year. This folder treats that content
like a small data product: extracted into tables, validated, and checked for freshness on a schedule.

```
public/app.js ──extract──▶ data/build/*.ndjson ──validate──▶ report / CI gate
  (source of truth)        schemes · helplines · links         errors, stale, unverified, pending changes
                                      ▲
                          data/sources.json  (human-curated provenance: official source, last_verified, evidence)
```

## Commands
| Command | What it does |
|---|---|
| `npm run data:build` | Extract the registry and write `data/build/{schemes,helplines,links}.ndjson` (BigQuery load format) and `registry.json` |
| `npm run data:check` | Validate and print the freshness table. Exits 1 only on **errors** |
| `npm run data:check:strict` | Also fails on **stale** verifications and requests every official URL (needs internet) |

## Tables
**schemes** (one row per service) `scheme_id, kind, state_code, name_en|hi|te|ta, amount_label, amount_period, first_amount_mentioned_inr, age_min, age_max, question_count, document_count, facts_en, facts_chars`
`kind` is `basic_service`, `central_scheme` or `state_cash`. `first_amount_mentioned_inr` is the first rupee figure in the facts text (lakh/crore expanded); it is a coarse change-detection signal, not the benefit amount.

**helplines** `scheme_id, position, label_en, number, is_toll_free`

**links** `scheme_id, position, label, url, host`

## Quality rules (see `data/validate.js`, covered by `test/data.test.js`)
- Errors: duplicate ids, missing language names, facts missing, no helpline, no official link, malformed phone number, link not https or not on the government/gas-company allow-list, scheme without a `sources.json` entry (or an orphan entry), invalid or future `last_verified`, verified without an `evidence_url`.
- Stale: `last_verified` older than `review_every_days` (60 days for state cash schemes, 180 for central ones).
- Warnings: never verified; a known upcoming change is recorded in `pending_change`.

## How to verify a scheme
1. Check the official source (or a reputable news report for announcements) and fix the text in `public/app.js` if it changed.
2. In `data/sources.json` set `last_verified` to today and `evidence_url` to the page you used; clear or update `pending_change`.
3. `npm run data:check` should show the scheme as `fresh`.
Never set `last_verified` for something that was not actually re-checked.
