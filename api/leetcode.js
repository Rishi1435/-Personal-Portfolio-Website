/*
 * LeetCode stats proxy for the portfolio Stats section (Vercel Node function).
 *
 *   GET /api/leetcode  ->  { username, solved, ranking, calendar, fetchedAt }
 *
 * Why a proxy: LeetCode's GraphQL endpoint is CORS-blocked in the browser and
 * expects a leetcode.com Referer, so it can only be called server-side. We shape
 * the response down to just what the UI needs and hard-cache it at the edge so
 * the numbers stay live (refresh ~hourly) without hammering LeetCode.
 */

const USER = 'Rishi_2311';
const LEETCODE_GQL = 'https://leetcode.com/graphql';
const TIMEOUT_MS = 8000;

const QUERY = `query getUser($username: String!) {
  matchedUser(username: $username) {
    username
    submitStats { acSubmissionNum { difficulty count } }
    profile { ranking }
    userCalendar { streak totalActiveDays submissionCalendar }
  }
}`;

// LeetCode's submissionCalendar is a JSON string mapping UTC-midnight unix
// seconds -> submission count, and only includes days that had activity. We
// expand it into a dense last-365-days array shaped exactly like the GitHub
// proxy's contributions.days ({ date, count, level }) so the same <Heatmap>
// component renders both. Levels are bucketed by daily submission count.
const DAY_MS = 86400000;
const lcLevel = (count) => {
  if (!count) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
};
function buildCalendarDays(submissionCalendarJson) {
  let map;
  try { map = JSON.parse(submissionCalendarJson || '{}') || {}; } catch { map = {}; }
  // Re-key by YYYY-MM-DD (UTC) for lookup.
  const byDate = {};
  for (const [ts, count] of Object.entries(map)) {
    const d = new Date(Number(ts) * 1000);
    byDate[d.toISOString().slice(0, 10)] = Number(count) || 0;
  }
  const days = [];
  const today = new Date();
  const start = new Date(today.getTime() - 364 * DAY_MS);
  for (let t = start.getTime(); t <= today.getTime(); t += DAY_MS) {
    const date = new Date(t).toISOString().slice(0, 10);
    const count = byDate[date] || 0;
    days.push({ date, count, level: lcLevel(count) });
  }
  return days;
}

const ALLOWED_ORIGINS = [
  'https://rishipediredla.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
];

export const config = { maxDuration: 10 };

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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(LEETCODE_GQL, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // LeetCode rejects the GraphQL call without a matching Referer/Origin.
        Referer: `https://leetcode.com/u/${USER}/`,
        Origin: 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ query: QUERY, variables: { username: USER } }),
    });

    if (!upstream.ok) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(502).json({ error: 'LeetCode unavailable' });
    }
    const data = await upstream.json();
    const user = data?.data?.matchedUser;
    if (!user) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ error: 'LeetCode user not found' });
    }

    const nums = user.submitStats?.acSubmissionNum || [];
    const by = (d) => nums.find((n) => n.difficulty === d)?.count ?? 0;
    const cal = user.userCalendar || {};
    const days = buildCalendarDays(cal.submissionCalendar);
    const payload = {
      username: user.username,
      solved: { all: by('All'), easy: by('Easy'), medium: by('Medium'), hard: by('Hard') },
      ranking: user.profile?.ranking ?? null,
      calendar: {
        streak: cal.streak ?? 0,
        totalActiveDays: cal.totalActiveDays ?? 0,
        submissions: days.reduce((sum, d) => sum + d.count, 0),
        days,
      },
      fetchedAt: new Date().toISOString(),
    };

    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(payload);
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(err?.name === 'AbortError' ? 504 : 500).json({ error: 'LeetCode stats failed' });
  } finally {
    clearTimeout(timer);
  }
}
