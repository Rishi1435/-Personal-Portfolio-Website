import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Boot sequence log lines ─────────────────────────────── */
const BOOT_LINES = [
  { text: '> BIOS_CHECK ................... [OK]',       delay: 300,  color: 'var(--color-accent)' },
  { text: '> KERNEL_INIT .................. [OK]',       delay: 600,  color: 'var(--color-accent)' },
  { text: '> LOADING_PORTFOLIO_ENGINE v3.1 ....',        delay: 900,  color: '#a0a0b8' },
  { text: '> PROJECTS_MODULE .............. [LOADED]',   delay: 1200, color: 'var(--color-accent-glow)' },
  { text: '> SKILLS_MATRIX ................ [INDEXED]',  delay: 1500, color: 'var(--color-accent-glow)' },
  { text: '> EXPERIENCE_LOG ............... [PARSED]',   delay: 1800, color: 'var(--color-accent)' },
  { text: '> CONTACT_SECURE ............... [AES-256]',  delay: 2100, color: 'var(--color-accent)' },
  { text: '> SYSTEM_READY ................. [ONLINE]',   delay: 2400, color: 'var(--color-accent-glow)' },
];

/* ASCII art logo lines */
const ASCII_LOGO = [
  ' ██████╗ ██████╗ ',
  ' ██╔══██╗██╔══██╗',
  ' ██████╔╝██████╔╝',
  ' ██╔══██╗██╔═══╝ ',
  ' ██║  ██║██║     ',
  ' ╚═╝  ╚═╝╚═╝     ',
];

/* ─── ASCII Progress Bar ─────────────────────────────────── */
const ProgressBar = ({ progress }) => {
  const total = 22;
  const filled = Math.round((progress / 100) * total);
  const bar = '█'.repeat(filled) + '░'.repeat(total - filled);
  return (
    <span>
      <span style={{ color: 'var(--color-accent)' }}>[{bar}]</span>{' '}
      <span style={{ color: 'var(--color-accent-glow)', fontWeight: 'bold' }}>{progress}%</span>
    </span>
  );
};

/* ─── Main Loading Screen ─────────────────────────────────── */
const LoadingScreen = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const [progress, setProgress]         = useState(0);
  const [showReady, setShowReady]       = useState(false);
  const [logoLines, setLogoLines]       = useState([]);
  const [cursorOn, setCursorOn]         = useState(true);

  /* ── cursor blink ────────────────────────── */
  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  /* ── ASCII logo reveal (collected timers → single cleanup array) ── */
  useEffect(() => {
    const timers = ASCII_LOGO.map((line, i) =>
      setTimeout(() => setLogoLines(prev => [...prev, line]), i * 90)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Boot log lines ──────────────────────── */
  useEffect(() => {
    const timers = BOOT_LINES.map((entry) =>
      setTimeout(
        () => setVisibleLines(prev => [...prev, entry]),
        entry.delay
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  /* ── Progress counter (0 → 100 over ~2.6s) ─ */
  useEffect(() => {
    const DURATION = 2600;
    const TICK     = 40;
    let elapsed    = 0;
    const id = setInterval(() => {
      elapsed += TICK;
      const pct = Math.min(100, Math.round((elapsed / DURATION) * 100));
      setProgress(pct);
      if (pct >= 100) clearInterval(id);
    }, TICK);
    return () => clearInterval(id);
  }, []);

  /* ── "SYSTEM READY" phase ────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setShowReady(true), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      key="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: 'fixed', inset: 0, zIndex: 100000, background: '#000', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* ── Scanline overlay ───────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, color-mix(in srgb, var(--color-accent) 6%, transparent) 2px, color-mix(in srgb, var(--color-accent) 6%, transparent) 4px)',
        backgroundSize: '100% 4px'
      }} />

      {/* ── Moving grid ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.035,
        backgroundImage: 'linear-gradient(color-mix(in srgb, var(--color-accent) 100%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 100%, transparent) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        animation: 'grid-scroll 10s linear infinite'
      }} />

      {/* ── Corner glows ────────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '380px', height: '380px', background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 14%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: '340px', height: '340px', background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent-glow) 10%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Terminal window ─────────────────────────────────── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '640px', margin: '0 16px' }}>

        {/* Title bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 20px',
          background: 'color-mix(in srgb, var(--color-accent) 6%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-accent) 18%, transparent)',
          borderBottom: 'none',
          borderRadius: '16px 16px 0 0',
          backdropFilter: 'blur(20px)'
        }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FF5F56', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#27C93F', display: 'inline-block' }} />
          <span style={{ flex: 1, textAlign: 'center', fontFamily: 'monospace', fontSize: '11px', color: 'color-mix(in srgb, var(--color-accent) 55%, transparent)', letterSpacing: '0.22em', textTransform: 'uppercase', userSelect: 'none' }}>
            rishi@portfolio — boot.sh
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'color-mix(in srgb, var(--color-accent) 35%, transparent)', userSelect: 'none' }}>zsh</span>
        </div>

        {/* Body */}
        <div style={{
          background: 'rgba(0,6,0,0.92)',
          border: '1px solid color-mix(in srgb, var(--color-accent) 18%, transparent)',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          backdropFilter: 'blur(24px)',
          padding: '24px',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>

          {/* ASCII Logo + version badge */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '10px', lineHeight: '1.35', color: 'var(--color-accent)', userSelect: 'none' }}>
              {logoLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {line}
                </motion.div>
              ))}
            </div>
            {logoLines.length === ASCII_LOGO.length && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginBottom: '2px' }}
              >
                {/* Glitch text manually (no className dependency) */}
                <span style={{ position: 'relative', display: 'inline-block', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold', color: 'var(--color-accent-glow)', letterSpacing: '0.28em', textTransform: 'uppercase' }}>
                  PORTFOLIO_v3
                  <span aria-hidden style={{ position: 'absolute', inset: 0, color: '#ff3030', opacity: 0.35, clipPath: 'polygon(0 55%, 100% 55%, 100% 75%, 0 75%)', animation: 'glitch-r 3s steps(3) infinite' }}>PORTFOLIO_v3</span>
                  <span aria-hidden style={{ position: 'absolute', inset: 0, color: 'var(--color-accent-glow)', opacity: 0.55, clipPath: 'polygon(0 15%, 100% 15%, 100% 35%, 0 35%)', animation: 'glitch-g 2.7s steps(2) infinite' }}>PORTFOLIO_v3</span>
                </span>
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent)' }} />

          {/* Boot log area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '12px' }}>
            <AnimatePresence>
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ color: line.color, letterSpacing: '0.04em', lineHeight: 1.6 }}
                >
                  {line.text}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking cursor */}
            {!showReady && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ color: 'var(--color-accent)' }}>{'>'}</span>
                <span style={{
                  display: 'inline-block', width: '8px', height: '14px',
                  background: 'var(--color-accent-glow)',
                  opacity: cursorOn ? 1 : 0,
                  transition: 'opacity 0.1s'
                }} />
              </div>
            )}

            {/* System ready */}
            {showReady && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
              >
                <div style={{ height: '1px', width: '100%', background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent)' }} />
                <motion.p
                  style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-accent-glow)', fontWeight: 'bold', letterSpacing: '0.25em', textTransform: 'uppercase' }}
                  animate={{ opacity: [1, 0.45, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ◉ SYSTEM ONLINE — LAUNCHING PORTFOLIO
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, color-mix(in srgb, var(--color-accent) 20%, transparent), transparent)' }} />

          {/* Progress bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.04em' }}>
              <ProgressBar progress={progress} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '9px', color: 'color-mix(in srgb, var(--color-accent) 35%, transparent)', letterSpacing: '0.18em', textTransform: 'uppercase', userSelect: 'none' }}>
              <span>BOOT SEQUENCE</span>
              <span>AES-256 ACTIVE</span>
              <span>SECURE CHANNEL</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── CSS keyframes ───────────────────────────────────── */}
      <style>{`
        @keyframes grid-scroll {
          from { transform: translateY(0); }
          to   { transform: translateY(44px); }
        }
        @keyframes glitch-r {
          0%  { transform: translateX(-2px); }
          33% { transform: translateX(2px); }
          66% { transform: translateX(-1px); }
          100%{ transform: translateX(2px); }
        }
        @keyframes glitch-g {
          0%  { transform: translateX(2px); }
          50% { transform: translateX(-2px); }
          100%{ transform: translateX(2px); }
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingScreen;
