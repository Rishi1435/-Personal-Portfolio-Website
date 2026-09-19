# Lighthouse Performance Log

Measurement conditions (kept identical across every run so the numbers are comparable):

- **Tool:** Lighthouse CLI (`npx lighthouse`), category `performance` only
- **Form factor:** mobile, with mobile screen emulation
- **Throttling:** simulated (Lighthouse default mobile preset ≈ Slow 4G, 4× CPU slowdown)
- **Target:** production build served by `vite preview` at `http://localhost:4173/`
- **Browser:** headless Chrome (`--headless=new`)

Reproduce with:

```bash
npm run build
npm run preview -- --port 4173   # in a separate shell
CHROME_PATH="/path/to/chrome" npx lighthouse http://localhost:4173/ \
  --only-categories=performance --form-factor=mobile --screenEmulation.mobile \
  --throttling-method=simulate --chrome-flags="--headless=new" \
  --output=html --output-path=./lh.html
```

> Note: values from the CLI move a few points run-to-run (simulated throttling is
> stochastic). Treat single-digit deltas as noise; the LCP and performance-score
> swings below are well outside that band.

---

## Phase 0 — Baseline (before any changes)

Commit: `7b0d7f4` (pre-brief `main`)

| Metric | Value |
| --- | --- |
| **Performance score** | **41** |
| **LCP** (Largest Contentful Paint) | **11.0 s** |
| **TBT** (Total Blocking Time) | **1,250 ms** |
| **CLS** (Cumulative Layout Shift) | **0.038** |
| First Contentful Paint | 3.2 s |
| Speed Index | 5.2 s |

**Root causes visible in the trace:**

1. A hard-coded `setTimeout(() => setLoading(false), 3800)` gate in `App.jsx` keeps
   the real content out of the DOM for ~3.8s, so the LCP element can't paint until
   then regardless of network.
2. The LCP element is `src/assets/images/Rishi's_Pic.png` — 1086×1448 RGBA PNG,
   1.6 MB — with no `width`/`height` and no `fetchpriority`.
3. The whole page is client-rendered; FCP waits on the JS bundle (~483 kB / 152 kB gzip).

This is the number every later phase improves against. Re-measured after Phase 1
and again in Phase 6 (see below).

---

## After Phase 1 — Critical performance & correctness

| Metric | Baseline | After Phase 1 | Δ |
| --- | --- | --- | --- |
| **Performance score** | 41 | **75** | **+34** |
| **LCP** | 11.0 s | **3.2 s** | **−7.8 s** |
| **TBT** | 1,250 ms | **460 ms** | −790 ms |
| **CLS** | 0.038 | **0** | −0.038 |
| First Contentful Paint | 3.2 s | 2.7 s | −0.5 s |
| Speed Index | 5.2 s | 4.6 s | −0.6 s |

**What moved the needle:**

- Removing the fixed 3.8s loading gate (now dismisses on the real `load` event with
  a 550ms floor, or instantly on tap/Escape) let the hero paint as soon as it was ready.
- The hero image went from a 1.6 MB PNG to a 38 KB AVIF / 49 KB WebP `<picture>` at
  the actual rendered resolution, with `fetchpriority="high"` — this is the LCP element.
- Explicit `width`/`height` on the `<img>` drove CLS to 0.

LCP is now gated mainly by First Contentful Paint (the client bundle must execute
before anything paints). Phase 2's meta/prerender work targets that ceiling.

---

## Final — after all phases (Phase 6)

| Metric | Baseline | Final | Δ vs baseline |
| --- | --- | --- | --- |
| **Performance score** | 41 | **69** | **+28** |
| **LCP** | 11.0 s | **3.5 s** | **−7.5 s** |
| **TBT** | 1,250 ms | **550 ms** | −700 ms |
| **CLS** | 0.038 | **0.019** | −0.019 |
| First Contentful Paint | 3.2 s | 2.8 s | −0.4 s |
| Speed Index | 5.2 s | 4.8 s | −0.4 s |
| Best Practices | — | **100** | — |
| Console errors on load | — | **none** | — |

LCP is **materially better than baseline** (11.0 s → 3.5 s), which was the goal
of tasks 1–2.

The performance score sits at 69 vs the 75 measured right after Phase 1: Phase 5
added three interactive features (the getUserMedia voice demo, the terminal REPL,
and the command palette), which grew the client bundle (~483 kB → ~508 kB) and
nudged TBT up. That is an intentional trade — the brief explicitly asked for those
features — and the dominant metric, LCP, stayed far below baseline. (Simulated
throttling also varies a few points run-to-run.)

**Documented follow-up (not done here to keep Phase 6 verification-only):** the
build warns the main chunk is >500 kB. `React.lazy` on the below-the-fold
`VoicePipelineDemo` and `CommandPalette` would trim initial JS and recover TBT.

**Best Practices = 100** and the `errors-in-console` audit reported **no console
errors or warnings** on load.

---

## Phase 8 — after the depth features (Phase 7)

Phase 7 added the Qlue architecture diagram, the project-media/video component,
deep-linked filter tabs, count-up metrics, and mobile parity (carousel + sticky
bar). Re-measured under the same conditions.

**Important — read the numbers with the drift check below.** By this point the
test machine was heavily loaded (a long session's worth of node/vite/headless
Chrome), and simulated-throttling Lighthouse is CPU-contention sensitive. Raw
Phase 7 runs landed at **perf 43–49, LCP 4.1–5.6 s, TBT 1.3–2.9 s** — worse than
the Phase 6 reading. To attribute that honestly, the **Phase 6 build (commit
`aa36329`) was rebuilt and re-measured on the same loaded machine**:

| Build measured now | perf | LCP | TBT |
| --- | --- | --- | --- |
| Phase 6 build (`aa36329`) | 49 | 4.2 s | 1,700 ms |
| Phase 8 build (current) | 43–49 | 4.1–5.6 s | 1,310–1,430 ms |

The Phase 6 code that originally scored **69 / 3.5 s / 550 ms** now scores
**49 / 4.2 s / 1,700 ms** on the same machine — so the drop is **environment
drift, not a Phase 7 regression.** The two builds measure the same within noise;
the above-the-fold LCP path (hero image) is unchanged, and the main bundle is in
fact *smaller* after Phase 8's code-split (522 → 505 kB, with two ~9 kB lazy
chunks). Best Practices stayed 100 and console stayed clean.

For a clean absolute number, re-run on an idle machine — the Phase 6 methodology
and the reproduce command at the top of this file still apply.

### Phase 8 verification checklist (all via headless Chrome DevTools Protocol)

- **Console clean** on load and across every new interaction — diagram node
  click, trace-request animation, filter-tab switch, count-up, arrow-key tab
  nav, mobile carousel. `errors-in-console` = 0, Best Practices = 100.
- **Architecture diagram**: node click opens the chosen/rejected/latency panel;
  Trace request reaches the "under 2s" total; keyboard-operable (buttons).
- **Filter tabs**: click writes `?stack=backend`, sets `aria-selected`;
  Left/Right arrow keys move selection and update the URL (History API).
- **Count-up metrics**: final values render (e.g. 649) after scroll-in.
- **Video**: no `<video>` autoplays (none ship yet — `ProjectMedia` falls back to
  the SVG mockups), so nothing autoplays with sound; `preload="none"` keeps video
  out of the LCP path when added; data-saver also maps to the SVG fallback.
- **Reduced motion**: the diagram trace resolves instantly (no step animation);
  count-up renders final values immediately; the boot loader is skipped.
- **Responsive / mobile**: no horizontal overflow at 375 px or 1440 px; the
  sticky mobile action bar is `position: fixed` (bottom), clears the footer via
  page padding, and sits below the top scroll-progress bar; the project carousel
  is `overflow-x: auto` on mobile and reverts to the grid at md+.

---

## Phase 10 — after the AI voice concierge (Phase 9)

Phase 9 replaced the old voice-pipeline demo with the AI voice concierge (overlay
`/api/ask` proxy + two-tier STT + TTS). Re-measured on a **now-idle machine**,
which also settles the Phase 8 drift question:

| Metric | Value |
| --- | --- |
| **Performance score** | **73** |
| **LCP** | **3.8 s** |
| **TBT** | **310 ms** |
| Best Practices | **100** |
| Console errors | **0** |

With the machine quiet again, perf is back to **73 / LCP 3.8 s / TBT 310 ms** —
right where Phase 6 sat (69) despite everything Phases 7 + 9 added. That confirms
the Phase 8 dip was environment drift, not regressions. The concierge ships as
its **own lazy chunk** (`VoiceConcierge-*.js`, ~11 kB) — it is **not in the
initial `index` bundle**, so it doesn't tax first paint, and transformers.js
loads from a CDN only on the WASM STT path (never bundled).

### Phase 10 verification checklist

Verified here (headless Chrome + CDP, `/api/ask` stubbed for the client flow):

- **Key isolation (check 4):** `NVIDIA_API_KEY`, `nvapi-`, and the NVIDIA
  endpoint do **not** appear anywhere in `dist/`; the client request body is only
  `{ question }`. The key lives solely in `api/ask.js` (server).
- **Rate-limit cooldown (check 3):** server harness (fetch stubbed) confirmed
  18 questions allowed then HTTP 429 with a friendly "try again / email" message
  — not a silent failure. Also verified 204/405/400/413, section-enum parsing,
  and defensive non-JSON parsing.
- **Section auto-scroll (check 5):** a typed question returning `section:"skills"`
  smoothly scrolls to `#skills` and pulses it; the scroll-progress bar stays
  present and the scroll-reveals aren't disturbed. Console stayed clean.
- **Reduced motion (check 6):** the orb drops its ping animation and the panel
  still opens/works.
- **Keyboard (check 7):** orb is a real `<button>`; panel opens, the typed input
  submits on Enter, and Escape closes — full loop with no mouse.
- **Cross-browser fallback logic (check 2):** with `SpeechRecognition` deleted
  (the Firefox/Safari case), the component falls to the WASM/typed path and the
  **typed input is always present and works**; spoken output uses
  `SpeechSynthesis` (supported on Safari/Firefox).
- **Lazy-load (check 8):** confirmed above — separate chunk, first paint unaffected.

### Live model test (real NVIDIA key, run locally through `api/ask.js`)

A real trial key was used to exercise the actual endpoint. Findings:

- **Auth + model + reasoning-off work.** The key is valid, `nvidia/nemotron-3.5-lightning-30b-a3b`
  is provisioned, and `chat_template_kwargs.enable_thinking=false` is honoured
  (`reasoning_content: null`).
- **Grounding + JSON + section enum work.** "How can I contact Rishi?" returned a
  correctly grounded answer with `section:"contact"`. (One cold on-topic request
  once returned a bare greeting — occasional flakiness, tolerated by the defensive
  parser but worth noting.)
- **⚠️ Latency is the blocker: ~50–110 s per completion on the trial tier.** That
  is unusable for a live "voice concierge", exceeds Vercel Hobby's 10 s function
  cap, and even with `maxDuration = 60` gives a 1–2 minute wait. With the 55 s
  upstream timeout now in place, requests simply return 504.
- **Refusal boundary (check 1): not conclusively verified live** — the off-topic /
  injection / gap probes all hit the 55 s timeout before the model responded. The
  system prompt is built for refusal (strict grounding, Rishi-only scope, worked
  accepted/refused + injection examples, gap→email), and the one non-timed-out
  answer was correctly grounded, but the model is too slow to confirm the full
  battery. **Needs a faster endpoint/tier to verify and to be usable.**
- **Real Safari/Firefox runtime (check 2):** only the *logic* was exercised here
  (Chrome with native SR removed). Confirm on actual Safari/Firefox after deploy.

**Recommendation:** the code is complete and hardened, but this model on the trial
tier is too slow to ship as-is. Either point `api/ask.js` at a faster tier/endpoint
for the same model, or switch to a faster model the account can invoke (note: the
trial key returns 404 "not found for account" for `nemotron-nano-3-30b-a3b` and
`llama-3.1-nemotron-70b-instruct`, so model choice is constrained by what the key
is provisioned for).
