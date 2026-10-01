# Security

## Design
- The Gemini API key exists only on the server (`GEMINI_API_KEY`, a Cloud Run secret). The browser never receives it.
- Strict CSP (`script-src 'self'`), HSTS, `nosniff`, `no-referrer`, frame denial, same-origin resource policy.
- Every `/api/*` input is validated (type, length, language allow-list); bodies are capped at 120 KB; per-IP rate limits apply.
- Upstream errors are logged server-side only; the browser gets a generic message.
- No accounts, no cookies, no analytics. The optional profile lives only in the device's `localStorage` and can be deleted in one tap.
- The container runs as a non-root user and has no runtime dependencies.

## Reporting a vulnerability
Please open a private security advisory on the GitHub repository rather than a public issue.
