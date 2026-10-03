# Roadmap: from hackathon app to data platform

Goal: a complete, demo-able project that shows end-to-end data engineering (ingest, validate, store, transform, orchestrate, serve, monitor) on a real, socially useful product. Stack: Google Cloud (Cloud Run, Pub/Sub, BigQuery, Cloud Scheduler, Looker Studio) + dbt.

| # | Phase | Status |
|---|---|---|
| 1 | **Scheme data layer**: extract app content into tables, provenance file, validation rules, freshness report, weekly CI check (`data/`) | done |
| 2 | **Anonymous usage events**: event contract (JSON schema), `/api/event` endpoint (validation, rate limit, no PII), client instrumentation (screen, scheme opened, voice search routed or missed, language changed), consent-free because nothing identifying is collected | planned |
| 3 | **Warehouse**: Pub/Sub -> BigQuery streaming, scheme tables loaded by a Cloud Run Job, datasets `raw` / `staging` / `marts`, partitioning and clustering | planned |
| 4 | **Transformations**: dbt project (staging, marts, tests, docs), models such as daily usage by scheme and language, search-miss ranking, data freshness mart | planned |
| 5 | **Orchestration and ops**: Cloud Scheduler + Cloud Run Jobs, alerting on stale data and load failures, infrastructure as code (Terraform), cost guard | planned |
| 6 | **Serving**: Looker Studio dashboard (usage, funnels, search misses, freshness) with small-group suppression | planned |
| 7 | **Product features driven by the data**: new schemes from the search-miss backlog (e.g. Mudra loans), better voice search, eligibility checker improvements | planned |
| 8 | **UI redesign**: fresher visual design, same large touch targets, accessibility kept | planned |
| 9 | **Portfolio polish**: architecture diagram, README story with real numbers, demo video, resume bullets | planned |

## Decisions still open
- Tamil Nadu *Magalir Urimai Thogai*: Rs 2,500 has been announced but payments were still Rs 1,000 in September 2026. Show a "hike announced, confirm locally" note, or wait for the official order? (see `pending_change` in `data/sources.json`)
- 16 of 17 schemes are still `unverified`. Verifying them against official sources (`data/README.md`, "How to verify") is the quickest way to make the data layer meaningful.
