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
