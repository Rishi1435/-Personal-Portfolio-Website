/*
 * GitHub stats proxy for the portfolio Stats section (Vercel Node function).
 *
 *   GET /api/github  ->  { profile, repos, topRepos, contributions, stats, streak, fetchedAt }
 *
 * Why a proxy: it lets us (1) combine several upstream calls into one response,
 * (2) attach an optional GITHUB_TOKEN server-side to lift the 60/hr unauth limit
 * without ever exposing it to the client, and (3) hard-cache at the edge so the
 * numbers stay live (they refresh ~hourly) without hammering GitHub.
 *
 * Nothing here is secret to the visitor — but the token, if set, must never reach
 * the client, hence the server hop.
 */

const USER = 'Rishi1435';
const UA = 'rishipediredla-portfolio (+https://rishipediredla.vercel.app)';
const TIMEOUT_MS = 8000; // stay under Vercel Hobby's 10s wall
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`;

const ALLOWED_ORIGINS = [
  'https://rishipediredla.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

export const config = { maxDuration: 10 };

function ghHeaders() {
  const h = { 'User-Agent': UA, Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

// ── Aggregate stats across every owned repo (stars, forks, language mix) ──
function aggregateRepos(raw) {
  let totalStars = 0;
  let totalForks = 0;
  const langCount = {};
  for (const r of raw) {
    totalStars += r.stargazers_count || 0;
    totalForks += r.forks_count || 0;
    if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
  }
  const topLanguages = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));
  return { totalStars, totalForks, topLanguages, publicRepos: raw.length };
}

// ── Streak + activity insights derived from the daily contribution array ──
function contributionInsights(days) {
  if (!days?.length) return null;
  let current = 0;
  let longest = 0;
  let run = 0;
  let bestDay = { date: null, count: 0 };
  const weekdayTotals = [0, 0, 0, 0, 0, 0, 0]; // Sun..Sat
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (const d of days) {
    if (d.count > 0) { run += 1; if (run > longest) longest = run; }
    else run = 0;
    if (d.count > bestDay.count) bestDay = { date: d.date, count: d.count };
    weekdayTotals[new Date(d.date).getDay()] += d.count;
  }

  // Current streak: walk backwards. Allow "today" to be a 0 if yesterday was
  // active (the day isn't over yet) so the streak doesn't read as broken.
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current += 1;
    else if (i === days.length - 1) continue; // today, not yet contributed
    else break;
  }

  let busiestWeekday = 0;
  for (let i = 1; i < 7; i++) if (weekdayTotals[i] > weekdayTotals[busiestWeekday]) busiestWeekday = i;

  return { current, longest, bestDay, busiestWeekday: WEEKDAYS[busiestWeekday] };
}

// ── Turn a repo's README into a one/two-sentence description ──────────────
// Strips markdown noise (badges, images, code, headings, tables, HTML) and
// returns the first substantial prose, capped to a card-friendly length.
function summarizeMarkdown(md, fallback = null) {
  if (!md) return fallback;
  let text = md;
  text = text.replace(/<!--[\s\S]*?-->/g, ' ');       // HTML comments
  text = text.replace(/```[\s\S]*?```/g, ' ');         // fenced code
  text = text.replace(/`[^`]*`/g, ' ');                // inline code
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');   // images
  text = text.replace(/<[^>]+>/g, ' ');                // HTML tags
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');  // links → text
  text = text.replace(/^\s*\[[^\]]+\]:\s*\S+.*$/gm, ' '); // ref-link defs

  const kept = [];
  for (const raw of text.split('\n')) {
    let line = raw.trim();
    if (!line) { kept.push(''); continue; }
    if (/^#{1,6}\s/.test(line)) continue;              // headings
    if (/^[-*_]{3,}$/.test(line)) continue;            // horizontal rules
    if (/^\|/.test(line)) continue;                    // table rows
    line = line.replace(/^(>\s?|\s*[-*+]\s|\s*\d+\.\s)/, ''); // quote/list markers
    line = line.replace(/[*_~`>#]/g, '').trim();       // leftover emphasis
    if (line) kept.push(line);
  }

  const paragraphs = kept.join('\n').split(/\n+/).map((s) => s.replace(/\s+/g, ' ').trim()).filter(Boolean);
  let summary = paragraphs.find((p) => p.split(/\s+/).length >= 6) || paragraphs[0] || '';
  if (!summary) return fallback;

  // Keep whole sentences up to ~220 chars.
  const sentences = summary.match(/[^.!?]+[.!?]+/g);
  if (sentences?.length) {
    let out = '';
    for (const s of sentences) {
      if (out && (out + s).length > 220) break;
      out += s;
      if (out.length >= 140) break;
    }
    summary = (out || summary).trim();
  }
  if (summary.length > 240) summary = `${summary.slice(0, 237).trimEnd()}…`;
  return summary || fallback;
}

// ── "Best" projects, auto-selected + refreshed from GitHub ───────────────
// Skip forks, archived repos, and the excluded repos; rank by stars then
// most-recently-pushed so the strongest, most-active work floats to the top.
// Names are matched case-insensitively.
const HIDE_REPOS = new Set(['-personal-portfolio-website', 'rishi1435', 'leetcode']);
function curateTopRepos(list, extraHide = new Set(), limit = 6) {
  const hidden = (name) => HIDE_REPOS.has(name) || extraHide.has(name);
  return list
    .filter((r) => !r.fork && !r.archived && !hidden((r.name || '').toLowerCase()))
    .sort((a, b) => {
      const stars = (b.stargazers_count || 0) - (a.stargazers_count || 0);
      if (stars !== 0) return stars;
      return new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0);
    })
    .slice(0, limit)
    .map((r) => ({
      name: r.name,
      description: r.description,
      html_url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      topics: Array.isArray(r.topics) ? r.topics.slice(0, 4) : [],
      pushed_at: r.pushed_at,
    }));
}

// Fetch a repo's README (raw) and summarize it; fall back to the GitHub
// description if there's no README or the fetch fails.
async function readmeSummary(repoName, fallback, signal) {
  try {
    const r = await fetch(`https://api.github.com/repos/${USER}/${repoName}/readme`, {
      headers: { ...ghHeaders(), Accept: 'application/vnd.github.raw' },
      signal,
    });
    if (!r.ok) return fallback;
    return summarizeMarkdown(await r.text(), fallback);
  } catch {
    return fallback;
  }
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Repos already featured elsewhere on the portfolio are passed by the client
  // (?exclude=slug1,slug2,…) so the live grid never duplicates a curated card.
  let extraHide = new Set();
  try {
    const excludeParam = new URL(req.url, 'http://localhost').searchParams.get('exclude') || '';
    extraHide = new Set(excludeParam.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean));
  } catch { /* malformed url — ignore, fall back to the built-in hide list */ }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const [profileRes, reposRes, contribRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`, { headers: ghHeaders(), signal: controller.signal }),
      // Pull up to 100 owned repos so aggregate stars/languages/topRepos are complete.
      fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=100&type=owner`, { headers: ghHeaders(), signal: controller.signal }),
      fetch(CONTRIB_API, { headers: { 'User-Agent': UA }, signal: controller.signal }),
    ]);

    if (!profileRes.ok) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'GitHub profile unavailable' });
    }
    const p = await profileRes.json();
    const profile = {
      login: p.login,
      name: p.name,
      bio: p.bio,
      avatar_url: p.avatar_url,
      html_url: p.html_url,
      public_repos: p.public_repos,
      followers: p.followers,
      following: p.following,
    };

    // Repos / contributions are best-effort — a partial payload still renders.
    let repos = [];
    let topRepos = [];
    let stats = null;
    if (reposRes.ok) {
      const raw = await reposRes.json();
      const list = Array.isArray(raw) ? raw : [];
      stats = aggregateRepos(list);
      topRepos = curateTopRepos(list, extraHide); // best, non-duplicated projects for the grid
      // Newest 6 for the "recently updated" grid (list is already sorted by update).
      repos = list.slice(0, 6).map((r) => ({
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        updated_at: r.updated_at,
      }));
    }

    let contributions = null;
    let streak = null;
    if (contribRes.ok) {
      const c = await contribRes.json();
      const days = Array.isArray(c?.contributions)
        ? c.contributions.map((d) => ({ date: d.date, count: d.count, level: d.level }))
        : [];
      contributions = {
        total: c?.total?.lastYear ?? (typeof c?.total === 'number' ? c.total : null),
        days,
      };
      streak = contributionInsights(days);
    }

    // Enrich the featured projects with a README-derived description (parallel,
    // best-effort). Each summary is an extra GitHub call, so with a 5-min refresh
    // window we only do it when authenticated (GITHUB_TOKEN → 5,000/hr). Without a
    // token we skip it and keep the repo's own description to stay under 60/hr.
    if (topRepos.length && process.env.GITHUB_TOKEN) {
      topRepos = await Promise.all(
        topRepos.map(async (r) => ({
          ...r,
          description: await readmeSummary(r.name, r.description, controller.signal),
        }))
      );
    }

    // Live but cheap: the CDN serves this instantly for 5 min, then revalidates
    // in the background (stale-while-revalidate) so a visitor never waits on
    // GitHub — freshness costs ~1 upstream fetch per region per 5 min, NOT one
    // per visitor. GITHUB_TOKEN keeps this well under the rate limit.
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    return res.status(200).json({ profile, repos, topRepos, contributions, stats, streak, fetchedAt: new Date().toISOString() });
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({ error: 'GitHub stats failed' });
  } finally {
    clearTimeout(timer);
  }
}
