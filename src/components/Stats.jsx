import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import {
  FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaArrowRight,
  FaArrowUp, FaFire, FaBolt, FaCircle,
} from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

/*
 * Live coding-activity section. GitHub + LeetCode numbers are fetched at view
 * time from our own edge-cached proxies (/api/github, /api/leetcode), so they
 * track real changes (contributions, new repos, solved problems) rather than a
 * hardcoded snapshot — the CDN refreshes each source about hourly.
 *
 * Layout (top → bottom):
 *   1. Two contribution heatmaps (GitHub, LeetCode), always visible, sized to
 *      fit their panel width — no horizontal scroll.
 *   2. Two profile cards (GitHub, LeetCode). Clicking one opens a detail modal
 *      with the complete numbers (all repos / full difficulty breakdown, streak,
 *      ranking, submissions).
 *
 * The modal is a plain fixed overlay, rendered through a portal to <body>: this
 * <section> animates in with framer-motion, which leaves a `transform` on it, and
 * a transformed ancestor becomes the containing block for `position: fixed`
 * children — so without the portal the "fixed" overlay was positioned relative to
 * the tall section (not the viewport), pushing the card off-screen with no way to
 * scroll to it. The portal lifts it out to <body> so it's truly viewport-fixed
 * and its own content scrolls. Escape / focus-trap / scroll-lock are wired up by
 * hand to keep it accessible.
 */

const GITHUB_PROFILE = 'https://github.com/Rishi1435';
const LEETCODE_PROFILE = 'https://leetcode.com/u/Rishi_2311/';

// Language → dot colour, matching GitHub's linguist palette loosely.
const LANG_COLOR = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Dart: '#00B4AB', Python: '#3572A5',
  Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', C: '#555555',
  'C++': '#f34b7d', Go: '#00ADD8', Ruby: '#701516', Kotlin: '#A97BFF',
};

// Accepts an ISO string or an ms-epoch number; renders a compact "3h ago" style.
const relativeTime = (input) => {
  if (!input && input !== 0) return '';
  const t = typeof input === 'number' ? input : new Date(input).getTime();
  const diff = Date.now() - t;
  const s = Math.max(0, Math.round(diff / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24); if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30); if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
};

// Five-step emerald ramp: empty days read as a faint neutral, active days climb
// to the bright accent glow. Level 4 also gets a glow (applied on the cell).
const LEVEL_BG = [
  'rgba(255,255,255,0.045)',
  'color-mix(in srgb, var(--color-accent) 32%, transparent)',
  'color-mix(in srgb, var(--color-accent) 52%, transparent)',
  'color-mix(in srgb, var(--color-accent) 76%, transparent)',
  'var(--color-accent-glow)',
];
const levelBg = (level) => LEVEL_BG[level] ?? LEVEL_BG[0];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ─── Contribution heatmap — a real contribution graph, fills its
       container width (no scroll), with month labels + glow on hot days. ─── */
const Heatmap = ({ days, unit = 'contribution' }) => {
  if (!days?.length) return null;
  // Front-pad so the first column starts on the correct weekday (0 = Sun).
  const firstWeekday = new Date(days[0].date).getDay();
  const cells = [...Array(firstWeekday).fill(null), ...days];
  const cols = Math.ceil(cells.length / 7);

  // Month labels, placed above the column where each new month first appears.
  const months = [];
  let lastMonth = -1;
  for (let c = 0; c < cols; c++) {
    let day = null;
    for (let r = 0; r < 7; r++) { const cc = cells[c * 7 + r]; if (cc) { day = cc; break; } }
    if (!day) continue;
    const m = new Date(day.date).getMonth();
    if (m !== lastMonth) { months.push({ col: c, label: MONTHS[m] }); lastMonth = m; }
  }
  // Drop a leading label crammed against the next one.
  if (months.length > 1 && months[1].col - months[0].col < 3) months.shift();

  const gridCols = { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` };

  return (
    <div>
      {/* Month labels — SAME column gap as the cell grid below so the labels
          line up with the columns they mark. */}
      <div className="grid mb-1.5 gap-px sm:gap-[3px]" style={gridCols}>
        {months.map((m) => (
          <span
            key={`${m.label}-${m.col}`}
            className="font-mono text-[9px] text-white/35 whitespace-nowrap"
            style={{ gridColumnStart: m.col + 1 }}
          >
            {m.label}
          </span>
        ))}
      </div>
      {/* Cells — aspect-ratio on the container (cols/7) + 1fr tracks makes
          every cell square and fluid, with no auto-row collapse. */}
      <div
        className="grid w-full gap-px sm:gap-[3px]"
        style={{
          ...gridCols,
          gridTemplateRows: 'repeat(7, 1fr)',
          gridAutoFlow: 'column',
          aspectRatio: `${cols} / 7`,
        }}
      >
        {cells.map((d, i) =>
          d ? (
            <span
              key={d.date}
              title={`${d.count} ${unit}${d.count === 1 ? '' : 's'} · ${d.date}`}
              className="rounded-[3px] transition-transform duration-150 hover:scale-[1.5] hover:ring-1 hover:ring-white/70 cursor-pointer"
              style={{
                backgroundColor: levelBg(d.level),
                boxShadow: d.level >= 4 ? '0 0 7px color-mix(in srgb, var(--color-accent-glow) 75%, transparent)' : 'none',
              }}
            />
          ) : (
            <span key={`pad-${i}`} />
          )
        )}
      </div>
    </div>
  );
};

/* ─── Heatmap legend (less → more) ─────────────────────────────── */
const HeatmapLegend = () => (
  <div className="flex items-center gap-1 text-[9px] text-white/40 font-mono">
    <span>less</span>
    {[0, 1, 2, 3, 4].map((l) => (
      <span key={l} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: levelBg(l) }} />
    ))}
    <span>more</span>
  </div>
);

/* ─── Always-visible heatmap panel ─────────────────────────────── */
const HeatmapPanel = ({ icon: Icon, iconColor, title, handle, total, totalLabel, tint, days, unit }) => (
  <div className="glass-card p-5 md:p-6">
    <div className="flex items-end justify-between gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-2.5">
        <Icon className="text-xl" style={{ color: iconColor }} />
        <div>
          <p className="font-display font-bold text-white text-sm leading-tight">{title}</p>
          <span className="font-mono text-[11px] text-[var(--color-accent)]">{handle}</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-body text-[11px] text-white/50">
          <span className="font-display font-black text-[var(--color-accent-glow)] text-sm">{total}</span> {totalLabel}
        </span>
        <HeatmapLegend />
      </div>
    </div>
    <div className="rounded-xl p-3 md:p-4" style={{ background: tint }}>
      <Heatmap days={days} unit={unit} />
    </div>
  </div>
);

/* ─── Small key-number card ────────────────────────────────────── */
const StatCard = ({ value, label, icon: Icon }) => (
  <div className="glass-card flex flex-col items-center justify-center gap-1 p-5 text-center">
    {Icon && <Icon className="text-[var(--color-accent)] text-lg mb-0.5" />}
    <span className="font-display font-black text-2xl md:text-3xl text-[var(--color-accent-glow)] drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent-glow)_35%,transparent)] leading-none">
      {value}
    </span>
    <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wider uppercase mt-1">{label}</span>
  </div>
);

/* ─── Inline mini-stat (used on card faces) ────────────────────── */
const MiniStat = ({ value, label }) => (
  <div className="flex flex-col">
    <span className="font-display font-black text-lg md:text-xl text-[var(--color-accent-glow)] leading-none">{value}</span>
    <span className="font-body text-[9px] text-[#a0a0b8] font-medium tracking-wider uppercase mt-1">{label}</span>
  </div>
);

/* ─── LeetCode difficulty bar ──────────────────────────────────── */
const DiffBar = ({ label, count, total, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span className="font-body text-xs font-semibold" style={{ color }}>{label}</span>
      <span className="font-mono text-xs text-white/60">{count}</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: total ? `${Math.min(100, (count / total) * 100)}%` : '0%', backgroundColor: color }} />
    </div>
  </div>
);

const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-2xl bg-white/[0.04] ${className}`} />
);

/* ─── Headline stat pill (the live strip under the header) ─────── */
const PillStat = ({ icon: Icon, value, label, iconColor }) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
    <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.04] flex-shrink-0">
      <Icon style={{ color: iconColor || 'var(--color-accent)' }} className="text-base" />
    </span>
    <div className="min-w-0">
      <div className="font-display font-black text-lg md:text-xl text-white leading-none">{value}</div>
      <div className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wider uppercase mt-1 truncate">{label}</div>
    </div>
  </div>
);

/* ─── Top-languages bar chart (across all repos) ───────────────── */
const LanguageBars = ({ languages }) => {
  if (!languages?.length) return null;
  const max = Math.max(...languages.map((l) => l.count));
  return (
    <div className="flex flex-col gap-3">
      {languages.map((l) => (
        <div key={l.name}>
          <div className="flex items-center justify-between mb-1">
            <span className="flex items-center gap-2 font-body text-xs text-white/70">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANG_COLOR[l.name] || '#8b949e' }} />
              {l.name}
            </span>
            <span className="font-mono text-[10px] text-white/40">{l.count} repo{l.count === 1 ? '' : 's'}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(l.count / max) * 100}%`, backgroundColor: LANG_COLOR[l.name] || '#8b949e' }} />
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Live systems / uptime board ──────────────────────────────────
   Pings the portfolio's own live surfaces (site + serverless functions)
   from the visitor's browser and shows each as operational with real
   round-trip latency. Any HTTP response (even a 405 to a HEAD) means the
   surface is reachable; only a network error / timeout reads as down. Add a
   deployed project's URL to STATUS_TARGETS to include it here. */
const STATUS_TARGETS = [
  { name: 'Portfolio', path: '/', desc: 'Live site' },
  { name: 'GitHub API', path: '/api/github', desc: 'Stats proxy' },
  { name: 'LeetCode API', path: '/api/leetcode', desc: 'Stats proxy' },
  { name: 'AI Concierge', path: '/api/ask', desc: 'Serverless fn' },
];
const SystemStatus = ({ active }) => {
  const [rows, setRows] = useState(() => STATUS_TARGETS.map((t) => ({ ...t, state: 'checking', ms: null })));

  useEffect(() => {
    if (!active) return;
    let alive = true;
    (async () => {
      const results = await Promise.all(
        STATUS_TARGETS.map(async (t) => {
          const ctrl = new AbortController();
          const to = setTimeout(() => ctrl.abort(), 6000);
          const start = performance.now();
          try {
            await fetch(t.path, { method: 'HEAD', cache: 'no-store', signal: ctrl.signal });
            return { ...t, state: 'up', ms: Math.round(performance.now() - start) };
          } catch {
            return { ...t, state: 'down', ms: null };
          } finally {
            clearTimeout(to);
          }
        })
      );
      if (alive) setRows(results);
    })();
    return () => { alive = false; };
  }, [active]);

  const up = rows.filter((r) => r.state === 'up').length;
  const allUp = up === rows.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <FaBolt className="text-[var(--color-accent)]" />
          <span className="font-display font-bold text-white text-sm">Live Systems</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-white/50">
          <span className={`w-1.5 h-1.5 rounded-full ${allUp ? 'bg-[var(--color-accent-glow)] animate-pulse' : 'bg-[#f85149]'}`} />
          {up}/{rows.length} operational
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-white/[0.05]">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center gap-3 py-2.5">
            <FaCircle
              size={8}
              className={r.state === 'checking' ? 'text-white/25 animate-pulse' : ''}
              style={{ color: r.state === 'up' ? 'var(--color-accent-glow)' : r.state === 'down' ? '#f85149' : undefined }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-body text-[13px] text-white/80 leading-tight">{r.name}</p>
              <p className="font-body text-[10px] text-white/35">{r.desc}</p>
            </div>
            <span className="font-mono text-[10px] whitespace-nowrap flex-shrink-0" style={{ color: r.state === 'up' ? 'var(--color-accent)' : '#a0a0b8' }}>
              {r.state === 'checking' ? '…' : r.state === 'up' ? `${r.ms}ms` : 'down'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ─── A titled glass panel wrapper for the feed columns ────────── */
const FeedPanel = ({ icon: Icon, iconColor, title, badge, children }) => (
  <div className="glass-card p-5 md:p-6 flex flex-col">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <Icon className="text-lg" style={{ color: iconColor }} />
        <span className="font-display font-bold text-white text-sm">{title}</span>
      </div>
      {badge}
    </div>
    {children}
  </div>
);

/* ─── Fixed-overlay modal (below the cursor's z-index so the branded
       spring cursor shows over it). Escape + focus-trap + scroll-lock. ── */
const StatModal = ({ open, onClose, labelledById, children }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => panelRef.current?.focus(), 0);

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const list = [...focusables];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
      if (prevFocus instanceof HTMLElement) prevFocus.focus();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop — click to dismiss */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledById}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-featured relative z-10 w-[min(94vw,860px)] max-h-[86vh] overflow-y-auto p-6 md:p-8 outline-none [scrollbar-width:thin]"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

const ModalHeader = ({ icon: Icon, iconColor, title, handle, href, onClose, id }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      <Icon className="text-2xl" style={{ color: iconColor }} />
      <div>
        <h3 id={id} className="font-display font-black text-white text-lg leading-tight">{title}</h3>
        <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-glow)] transition-colors">{handle}</a>
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close details"
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors cursor-pointer text-lg leading-none flex-shrink-0"
    >
      ×
    </button>
  </div>
);

/* ─── Clickable profile card ───────────────────────────────────── */
const ProfileCard = ({ avatar, icon: Icon, iconColor, iconBg, title, handle, stats, onOpen }) => (
  <button
    type="button"
    onClick={onOpen}
    aria-haspopup="dialog"
    className="glass-card p-6 flex flex-col text-left w-full transition-all duration-300 group cursor-pointer hover:border-[var(--color-accent)]/40 hover:-translate-y-1"
  >
    <div className="flex items-center gap-4 mb-5">
      {avatar ? (
        <img src={avatar} alt="" className="w-14 h-14 rounded-full border border-white/10 object-cover flex-shrink-0" loading="lazy" />
      ) : (
        <span className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border border-white/10" style={{ background: iconBg }}>
          <Icon className="text-2xl" style={{ color: iconColor }} />
        </span>
      )}
      <div className="min-w-0">
        <p className="font-display font-bold text-white text-base truncate">{title}</p>
        <span className="font-mono text-xs text-[var(--color-accent)]">{handle}</span>
      </div>
      <span className="ml-auto text-white/30 group-hover:text-[var(--color-accent-glow)] transition-colors flex-shrink-0">
        <FaArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </span>
    </div>

    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => <MiniStat key={s.label} {...s} />)}
    </div>

    <span className="mt-5 pt-4 border-t border-white/[0.06] font-body text-[11px] font-semibold tracking-wider uppercase text-white/40 group-hover:text-[var(--color-accent-glow)] transition-colors flex items-center gap-1.5">
      View full details <FaArrowRight size={9} className="group-hover:translate-x-0.5 transition-transform" />
    </span>
  </button>
);

const ErrorPanel = ({ icon: Icon, iconColor, href, label }) => (
  <div className="glass-card p-6 flex flex-col justify-center items-center text-center min-h-[10rem]">
    <Icon className="text-2xl mb-3" style={{ color: iconColor, opacity: 0.4 }} />
    <p className="font-body text-sm text-white/40">
      {label} stats are taking a break — see them on{' '}
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--color-accent)] hover:underline">the profile</a>.
    </p>
  </div>
);

const Stats = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [gh, setGh] = useState(null);
  const [lc, setLc] = useState(null);
  const [ghErr, setGhErr] = useState(false);
  const [lcErr, setLcErr] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(null); // 'github' | 'leetcode' | null

  // Fetch once the section scrolls into view (keeps it off the critical path).
  useEffect(() => {
    if (!sectionInView) return;
    let alive = true;
    const controller = new AbortController();
    (async () => {
      const [ghRes, lcRes] = await Promise.allSettled([
        fetch('/api/github', { signal: controller.signal }).then((r) => (r.ok ? r.json() : Promise.reject())),
        fetch('/api/leetcode', { signal: controller.signal }).then((r) => (r.ok ? r.json() : Promise.reject())),
      ]);
      if (!alive) return;
      if (ghRes.status === 'fulfilled') setGh(ghRes.value); else setGhErr(true);
      if (lcRes.status === 'fulfilled') setLc(lcRes.value); else setLcErr(true);
      setLoading(false);
    })();
    return () => { alive = false; controller.abort(); };
  }, [sectionInView]);

  const contribTotal = gh?.contributions?.total;
  const closeModal = () => setOpenModal(null);
  const stillLoadingGh = loading && !gh && !ghErr;
  const stillLoadingLc = loading && !lc && !lcErr;

  // Headline "live strip" — built from whatever data arrived (graceful if one
  // source is down). Order: GitHub reach → GitHub depth → LeetCode.
  const pillStats = [];
  if (contribTotal != null) pillStats.push({ icon: FaBolt, value: contribTotal, label: 'Contributions', iconColor: 'var(--color-accent)' });
  if (gh?.stats?.totalStars != null) pillStats.push({ icon: FaStar, value: gh.stats.totalStars, label: 'Stars Earned', iconColor: '#e3b341' });
  if (gh?.streak?.current != null) pillStats.push({ icon: FaFire, value: `${gh.streak.current}d`, label: 'Current Streak', iconColor: '#ff7b39' });
  if (lc?.solved?.all != null) pillStats.push({ icon: SiLeetcode, value: lc.solved.all, label: 'Problems Solved', iconColor: '#FFA116' });
  if (lc?.ranking != null) pillStats.push({ icon: FaArrowUp, value: `#${lc.ranking.toLocaleString()}`, label: 'Global Rank', iconColor: 'var(--color-accent-glow)' });

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      id="stats"
      className="relative overflow-hidden py-20 md:py-24"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Header ──────────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block">
                // 04 · BY THE NUMBERS
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full shadow-sm backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
                <span className="font-body text-[10px] text-white font-medium tracking-wider uppercase">LIVE · AUTO-UPDATES</span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black leading-none tracking-tight section-title">
                Coding Activity
              </h2>
              <p className="font-body text-[#a0a0b8] text-sm max-w-sm leading-relaxed pb-1 hidden md:block">
                Live GitHub &amp; LeetCode contributions, pulled straight from the source. Tap a profile for the full breakdown.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Live stat strip ─────────────────────────────── */}
        {stillLoadingGh && stillLoadingLc ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonBlock key={i} className="h-[68px]" />)}
          </div>
        ) : pillStats.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {pillStats.map((s) => <PillStat key={s.label} {...s} />)}
          </div>
        ) : null}

        {/* ── Heatmaps (separate, always visible) ─────────── */}
        <div className="grid grid-cols-1 gap-5 mb-6">
          {stillLoadingGh ? (
            <SkeletonBlock className="h-[188px]" />
          ) : gh ? (
            <HeatmapPanel
              icon={FaGithub}
              iconColor="#fff"
              title="GitHub"
              handle="@Rishi1435"
              total={contribTotal ?? '—'}
              totalLabel="contributions this year"
              tint="rgba(255,255,255,0.02)"
              days={gh.contributions?.days}
              unit="contribution"
            />
          ) : (
            <ErrorPanel icon={FaGithub} iconColor="#fff" href={GITHUB_PROFILE} label="GitHub" />
          )}

          {stillLoadingLc ? (
            <SkeletonBlock className="h-[188px]" />
          ) : lc ? (
            <HeatmapPanel
              icon={SiLeetcode}
              iconColor="#FFA116"
              title="LeetCode"
              handle="@Rishi_2311"
              total={lc.calendar?.submissions ?? '—'}
              totalLabel="submissions this year"
              tint="rgba(255,161,22,0.04)"
              days={lc.calendar?.days}
              unit="submission"
            />
          ) : (
            <ErrorPanel icon={SiLeetcode} iconColor="#FFA116" href={LEETCODE_PROFILE} label="LeetCode" />
          )}
        </div>

        {/* ── Top languages + live systems board ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {stillLoadingGh ? (
            <SkeletonBlock className="h-56" />
          ) : gh?.stats?.topLanguages?.length ? (
            <FeedPanel
              icon={FaCodeBranch}
              iconColor="var(--color-accent)"
              title="Top Languages"
              badge={<span className="font-mono text-[10px] text-white/40">{gh.stats.publicRepos} repos</span>}
            >
              <LanguageBars languages={gh.stats.topLanguages} />
            </FeedPanel>
          ) : (
            <div className="glass-card p-5 md:p-6 flex items-center justify-center min-h-[10rem]">
              <span className="font-body text-sm text-white/40">Language mix unavailable.</span>
            </div>
          )}

          <div className="glass-card p-5 md:p-6">
            <SystemStatus active={sectionInView} />
          </div>
        </div>

        {/* ── Profile cards → open detail modal ───────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stillLoadingGh ? (
            <SkeletonBlock className="h-52" />
          ) : gh ? (
            <ProfileCard
              avatar={gh.profile?.avatar_url}
              title={gh.profile?.name || 'GitHub'}
              handle="@Rishi1435"
              onOpen={() => setOpenModal('github')}
              stats={[
                { value: contribTotal ?? '—', label: 'Contributions' },
                { value: gh.profile?.public_repos ?? '—', label: 'Repos' },
                { value: gh.profile?.followers ?? '—', label: 'Followers' },
              ]}
            />
          ) : (
            <ErrorPanel icon={FaGithub} iconColor="#fff" href={GITHUB_PROFILE} label="GitHub" />
          )}

          {stillLoadingLc ? (
            <SkeletonBlock className="h-52" />
          ) : lc ? (
            <ProfileCard
              icon={SiLeetcode}
              iconColor="#FFA116"
              iconBg="rgba(255,161,22,0.12)"
              title="LeetCode"
              handle="@Rishi_2311"
              onOpen={() => setOpenModal('leetcode')}
              stats={[
                { value: lc.solved?.all ?? '—', label: 'Solved' },
                { value: lc.calendar?.streak ?? '—', label: 'Day Streak' },
                { value: lc.calendar?.totalActiveDays ?? '—', label: 'Active Days' },
              ]}
            />
          ) : (
            <ErrorPanel icon={SiLeetcode} iconColor="#FFA116" href={LEETCODE_PROFILE} label="LeetCode" />
          )}
        </div>
      </div>

      {/* ── GitHub detail modal ─────────────────────────────── */}
      <StatModal open={openModal === 'github'} onClose={closeModal} labelledById="gh-modal-title">
        {gh && (
          <>
            <ModalHeader id="gh-modal-title" icon={FaGithub} iconColor="#fff" title={gh.profile?.name || 'GitHub'} handle="@Rishi1435" href={GITHUB_PROFILE} onClose={closeModal} />

            <div className="grid grid-cols-3 gap-3 mb-4">
              <StatCard value={gh.profile?.public_repos ?? '—'} label="Public Repos" />
              <StatCard value={gh.stats?.totalStars ?? '—'} label="Stars Earned" />
              <StatCard value={contribTotal ?? '—'} label="Contributions" />
            </div>

            {gh.streak && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 font-mono text-[11px] text-white/50">
                <span className="flex items-center gap-1.5"><FaFire className="text-[#ff7b39]" size={11} /> Longest streak <span className="text-white/80">{gh.streak.longest}d</span></span>
                {gh.streak.bestDay?.date && (
                  <span>Best day <span className="text-white/80">{gh.streak.bestDay.count} · {gh.streak.bestDay.date}</span></span>
                )}
                <span>Busiest <span className="text-white/80">{gh.streak.busiestWeekday}</span></span>
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className="font-body text-xs text-white/40 font-semibold tracking-widest uppercase">// RECENTLY UPDATED</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
            </div>
            {gh.repos?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gh.repos.slice(0, 6).map((r) => (
                  <a
                    key={r.name}
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 hover:border-[var(--color-accent)]/40 hover:bg-white/[0.05] transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-body text-sm font-semibold text-white truncate group-hover:text-[var(--color-accent-glow)] transition-colors">{r.name}</span>
                      <FaExternalLinkAlt className="text-white/20 group-hover:text-[var(--color-accent)] transition-colors flex-shrink-0" size={10} />
                    </div>
                    <p className="font-body text-[11px] text-[#a0a0b8] leading-snug line-clamp-2 flex-1">
                      {r.description || 'No description'}
                    </p>
                    <div className="flex items-center gap-3 mt-3 font-mono text-[10px] text-white/50">
                      {r.language && (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANG_COLOR[r.language] || '#8b949e' }} />
                          {r.language}
                        </span>
                      )}
                      {r.stars > 0 && <span className="flex items-center gap-1"><FaStar size={9} /> {r.stars}</span>}
                      {r.forks > 0 && <span className="flex items-center gap-1"><FaCodeBranch size={9} /> {r.forks}</span>}
                      <span className="ml-auto">{relativeTime(r.updated_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="font-body text-sm text-white/40 py-4 text-center">Repos unavailable right now.</p>
            )}
          </>
        )}
      </StatModal>

      {/* ── LeetCode detail modal ───────────────────────────── */}
      <StatModal open={openModal === 'leetcode'} onClose={closeModal} labelledById="lc-modal-title">
        {lc && (
          <>
            <ModalHeader id="lc-modal-title" icon={SiLeetcode} iconColor="#FFA116" title="LeetCode" handle="@Rishi_2311" href={LEETCODE_PROFILE} onClose={closeModal} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center justify-center py-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <span className="font-display font-black text-5xl text-[var(--color-accent-glow)] drop-shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent-glow)_40%,transparent)] leading-none">
                  {lc.solved?.all ?? '—'}
                </span>
                <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-widest uppercase mt-2">Problems Solved</span>
                {lc.ranking != null && (
                  <span className="font-mono text-[11px] text-white/50 mt-2">Global rank #{lc.ranking.toLocaleString()}</span>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4">
                <DiffBar label="Easy" count={lc.solved?.easy ?? 0} total={lc.solved?.all ?? 0} color="#00b8a3" />
                <DiffBar label="Medium" count={lc.solved?.medium ?? 0} total={lc.solved?.all ?? 0} color="#ffb800" />
                <DiffBar label="Hard" count={lc.solved?.hard ?? 0} total={lc.solved?.all ?? 0} color="#ff375f" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <StatCard value={lc.calendar?.streak ?? '—'} label="Day Streak" />
              <StatCard value={lc.calendar?.totalActiveDays ?? '—'} label="Active Days" />
              <StatCard value={lc.calendar?.submissions ?? '—'} label="Submissions" />
            </div>
          </>
        )}
      </StatModal>
    </motion.section>
  );
};

export default Stats;
