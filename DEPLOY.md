# Deploying — 100% free

Everything here runs on free tiers with **no server cost, no paid TTS/STT/API**:

| Piece | How it's free |
| --- | --- |
| Static site + `/api/ask` | **Vercel Hobby** (free): static build + serverless function in one deploy |
| LLM | NVIDIA NIM **trial** key (free), called only from the server function |
| STT | Browser `SpeechRecognition` (free) → WASM Whisper from a CDN (free, on-device) → typed input |
| TTS | Browser `SpeechSynthesis` (free, on-device, instant); the client ranks the OS voices and the visitor can pick one |
| Rate limiting | In-memory by default (free); optional free Upstash tier |

## Use Vercel, not Render (for the free tier)

Vercel Hobby serves the static site **and** the `/api/ask` function together with
no cold-start. Render's free *web service* spins down after ~15 min idle and cold-
starts 30–50s — bad for a portfolio. (Render *static sites* are free but can't run
the `/api/ask` Node function.) So: **Vercel Hobby**.

## Steps

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
   The framework auto-detects as **Vite** (build `npm run build`, output `dist/`);
   `api/ask.js` is picked up as a serverless function automatically.
3. **Settings → Environment Variables**, add (Production + Preview):

   | Name | Value |
   | --- | --- |
   | `NVIDIA_API_KEY` | your key from build.nvidia.com (**required**) |
   | `GITHUB_TOKEN` | *(recommended)* fine-grained token, **no scopes** — lifts the GitHub API from 60/hr to 5,000/hr so the live stats can refresh every 5 min. Without it, README enrichment is skipped to stay under the unauth limit. |
   | `ASK_MODEL` | *(optional)* defaults to `openai/gpt-oss-20b` |
   | `UPSTASH_REDIS_REST_URL` / `_TOKEN` | *(optional)* free Upstash, cross-instance rate limit |

   Do **not** commit the key — `.env` is gitignored and local-only.
4. **Deploy.** Visit the URL, open the concierge (bottom-right orb), ask a question.

## Free-tier notes / gotchas

- **10s function limit on Hobby.** `openai/gpt-oss-20b` answers in ~3–9s, and the
  function self-aborts at 9.5s with a friendly "try again" rather than hitting the
  hard wall. If you upgrade to Pro, raise `ASK_TIMEOUT_MS` (e.g. `30000`).
- **NVIDIA trial key** is free but rate-limited on their side; the function also
  caps each visitor to 18 questions/hour. Rotate the key if it leaks.
- The Whisper STT model (~tens of MB) downloads from a CDN **only** on browsers
  without native `SpeechRecognition` (Firefox/Safari), and is cached after first
  use. It never touches your server.
- **TTS is on-device, no server.** The voice is the browser's own
  `SpeechSynthesis` — instant, free, and no network round-trip. The client ranks
  the OS voices and picks the most natural one, and the concierge exposes a picker
  so the visitor can choose another. Quality depends on the browser: **Microsoft
  Edge** on Windows exposes far better "Online (Natural)" neural voices than Chrome
  (the ranker auto-prefers them when present). No API key, no download.
- Update `og:url` / `canonical` in `index.html` if your final domain differs from
  `rishipediredla.vercel.app`.
