# Architecture

## Today (shipped)
```mermaid
flowchart LR
  U[Browser PWA<br/>public/app.js] -->|/api/ask /route /translate /tts| S[Node server<br/>Cloud Run]
  S -->|key stays server-side| G[Gemini API]
  A[public/app.js<br/>scheme content] -->|data/extract.js| T[(NDJSON tables<br/>schemes, helplines, links)]
  M[data/sources.json<br/>provenance] --> V[data/validate.js]
  T --> V
  V -->|errors, stale, unverified| R[CI gate + weekly report]
```

## Target (roadmap)
```mermaid
flowchart LR
  U[Browser PWA] -->|anonymous events| E[/api/event<br/>validate · rate-limit/]
  E --> P[Pub/Sub]
  P --> BQraw[(BigQuery raw.events)]
  T[(scheme tables)] -->|Cloud Run Job| BQraw2[(BigQuery raw.schemes)]
  BQraw --> D[dbt: staging -> marts<br/>tests + docs]
  BQraw2 --> D
  D --> L[Looker Studio dashboard<br/>usage, search misses, data freshness]
  SCH[Cloud Scheduler] --> J[Cloud Run Jobs<br/>load + freshness check]
  J --> BQraw2
  D -->|search-miss backlog| F[New schemes and features]
```

## Design decisions
- **Privacy first.** The product promise is "no personal data". Events carry only coarse, non-identifying fields (event type, scheme id, language, optional state the user picked, app version, day). No IP, no cookie or persistent id, no free text, no voice. Dashboards hide groups smaller than a threshold.
- **The app stays the source of truth for content**; the pipeline reads it exactly as the browser does, so data and product cannot drift.
- **Freshness is a first-class metric.** Scheme facts expire; each has a provenance entry and a review window, and the weekly job fails when one goes stale.
- **Cost control.** BigQuery free tier is enough for this volume; tables are partitioned by day and clustered by event type, and dashboards query marts, not raw tables.
