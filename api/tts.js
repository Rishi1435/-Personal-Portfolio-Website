/*
 * TTS proxy for the voice concierge (Vercel Node function).
 *
 *   GET /api/tts?q=<text, up to 200 chars>[&tl=en]  ->  audio/mpeg (MP3)
 *
 * Why a proxy exists: Chrome's ORB (Opaque Response Blocking) refuses to load
 * Google's translate_tts into an <audio> element cross-origin, so a browser can't
 * fetch Google directly. This function fetches server-side (no ORB there) and
 * streams the MP3 back *same-origin*, which plays fine — including on our
 * cross-origin-isolated page.
 *
 * Rate-limit strategy (the user's priority — "no user faces issues"):
 *   1. Hard edge cache. The audio for a given text never changes, so we send a
 *      long s-maxage; Vercel serves a repeated phrase straight from its CDN
 *      WITHOUT re-invoking this function or re-hitting Google. Portfolio answers
 *      reuse the same phrases constantly, so Google sees each phrase ~once total.
 *   2. Per-IP limit as abuse protection (cache hits don't count — they never run
 *      this code).
 *   3. On any failure/429 here, the client finishes the turn with the device's
 *      native voice, so a visitor never hears silence.
 *
 * Free: no API key, no paid TTS. Google's public endpoint is unofficial and can
 * change — hence the native-voice fallback on the client.
 */

const GOOGLE_TTS = 'https://translate.google.com/translate_tts';
const MAX_CHARS = 200; // Google's q-parameter limit
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const TIMEOUT_MS = 5000; // Google answers in ~200ms; abort well under Vercel's wall

// English only (portfolio language) — also stops the endpoint being repurposed as
// a general free TTS API for other languages.
const ALLOWED_TL = /^en(-[a-z]{2})?$/i;

// Soft anti-hotlink: block requests whose Referer is a *different* site (so it
// can't be embedded as a free TTS API elsewhere). A missing Referer is allowed —
// privacy setups strip it, and that's a legitimate visitor. `.vercel.app` covers
// production + every preview deploy. Add a custom domain here if you point one at
// the site later (otherwise its visitors just get the native voice, not broken).
const ALLOWED_REFERER_HOSTS = ['vercel.app', 'localhost', '127.0.0.1'];

const RATE_LIMIT = 400; // audio requests per IP per hour (~33 full answers; cache hits are free and don't count)
const RATE_WINDOW_SEC = 3600;

// ── Rate limiting (Upstash Redis if configured, else per-instance memory) ──
const memHits = new Map();

async function upstash(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url}/${command.join('/')}`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return null;
    return (await res.json()).result;
  } catch {
    return null;
  }
}

async function checkRateLimit(ip) {
  const bucket = Math.floor(Date.now() / 1000 / RATE_WINDOW_SEC);
  const key = `tts:rl:${ip}:${bucket}`;
  const viaRedis = await upstash(['INCR', key]);
  if (viaRedis !== null) {
    if (viaRedis === 1) await upstash(['EXPIRE', key, String(RATE_WINDOW_SEC)]);
    return viaRedis <= RATE_LIMIT;
  }
  const n = (memHits.get(key) || 0) + 1;
  memHits.set(key, n);
  if (memHits.size > 5000) memHits.clear();
  return n <= RATE_LIMIT;
}

function getIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '').split(',')[0]).trim() || req.socket?.remoteAddress || 'unknown';
}

export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Anti-hotlink: reject a Referer that's clearly another site.
  const referer = req.headers['referer'] || '';
  if (referer) {
    try {
      const host = new URL(referer).hostname;
      if (!ALLOWED_REFERER_HOSTS.some((h) => host === h || host.endsWith('.' + h))) {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(403).json({ error: 'Forbidden' });
      }
    } catch {
      /* malformed Referer → treat as absent (allowed) */
    }
  }

  const q = (req.query?.q ?? '').toString();
  const tl = (req.query?.tl ?? 'en').toString();
  if (!q.trim()) { res.setHeader('Cache-Control', 'no-store'); return res.status(400).json({ error: 'Missing q' }); }
  if (q.length > MAX_CHARS) { res.setHeader('Cache-Control', 'no-store'); return res.status(413).json({ error: 'Text too long' }); }
  if (!ALLOWED_TL.test(tl)) { res.setHeader('Cache-Control', 'no-store'); return res.status(400).json({ error: 'Unsupported language' }); }

  const ip = getIp(req);
  if (!(await checkRateLimit(ip))) {
    // Client falls back to the native voice for this turn.
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Retry-After', '600');
    return res.status(429).json({ error: 'Rate limited' });
  }

  const url = `${GOOGLE_TTS}?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(q)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'audio/mpeg,*/*' },
    });
    if (!upstream.ok) { res.setHeader('Cache-Control', 'no-store'); return res.status(502).json({ error: 'Upstream error' }); }
    const ct = upstream.headers.get('content-type') || '';
    if (!ct.includes('audio')) { res.setHeader('Cache-Control', 'no-store'); return res.status(502).json({ error: 'Unexpected upstream response' }); }
    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.length < 200) { res.setHeader('Cache-Control', 'no-store'); return res.status(502).json({ error: 'Empty audio' }); }

    // Cache hard at the edge — a given text always yields the same audio, so a
    // repeat is served from Vercel's CDN without re-invoking us or Google.
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=31536000, immutable');
    return res.status(200).send(buf);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({ error: 'TTS failed' });
  } finally {
    clearTimeout(timer);
  }
}
