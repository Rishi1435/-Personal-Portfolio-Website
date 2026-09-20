import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import QlueLive from './pages/QlueLive';
import LoadingScreen from './components/LoadingScreen';
import ResumeModal from './components/ResumeModal';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/* ─── Custom Cursor (desktop only, pointer:fine) ─────────────── */
// Trail tuning: fade speed per frame, px between recorded points, head width,
// and a hard cap on points. Higher LIFE_DECAY + lower MAX_POINTS = shorter tail;
// TRAIL_ALPHA scales overall opacity.
const TRAIL_LIFE_DECAY = 0.07; // ~0.24s to fully fade at 60fps — short tail
const TRAIL_MIN_STEP = 3;      // px between recorded points
const TRAIL_MAX_POINTS = 18;   // short trail — hard cap for fast flicks
const TRAIL_ALPHA = 0.28;      // peak opacity of the head segment

// The native OS cursor is kept as-is; this only paints a faint light trail that
// follows the pointer's path and fades out shortly after it stops moving.
const CustomCursor = () => {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const trail = useRef([]);            // [{ x, y, life }] — recent pointer path
  const size = useRef({ w: 0, h: 0 }); // viewport size in CSS px (canvas clear rect)
  const rafId = useRef(null);
  // Fine pointer only, and only when motion is allowed.
  const [enabled] = useState(
    () => isFinePointer() &&
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    // Trail colour pulled from the live theme (accent glow), fallback emerald.
    const trailColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--color-accent-glow')
        .trim() || '#00E676';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size.current = { w: window.innerWidth, h: window.innerHeight };
      canvas.width = size.current.w * dpr;
      canvas.height = size.current.h * dpr;
      canvas.style.width = `${size.current.w}px`;
      canvas.style.height = `${size.current.h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const pts = trail.current;
      const { x, y } = mousePos.current;
      const last = pts[pts.length - 1];
      // Drop a new point only after the pointer has moved a little, so a
      // resting cursor lets the tail fade out completely.
      if (x >= 0 && (!last || Math.hypot(x - last.x, y - last.y) > TRAIL_MIN_STEP)) {
        pts.push({ x, y, life: 1 });
        if (pts.length > TRAIL_MAX_POINTS) pts.shift();
      }
      // Age every point; retire the dead ones from the tail.
      for (const p of pts) p.life -= TRAIL_LIFE_DECAY;
      while (pts.length && pts[0].life <= 0) pts.shift();

      ctx.clearRect(0, 0, size.current.w, size.current.h);
      if (pts.length > 1) {
        // Additive blend + glow reads as light rather than paint.
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = trailColor;
        ctx.shadowColor = trailColor;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i];
          const b = pts[i - 1];
          const life = Math.max(0, a.life);
          ctx.globalAlpha = life * TRAIL_ALPHA; // faint, glowy
          ctx.lineWidth = 1 + life * 2.5;       // tapers from head to tail
          ctx.shadowBlur = 6 * life;
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.globalCompositeOperation = 'source-over';
      }
      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[99997]"
      aria-hidden="true"
    />
  );
};

// Show the boot screen only on the first visit of a session, and never when the
// visitor has asked for reduced motion.
const shouldShowLoader = () => {
  if (typeof window === 'undefined') return false;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visited = window.sessionStorage?.getItem('visited') === 'true';
  return !prefersReduced && !visited;
};

// Minimum time the boot animation stays up so it doesn't flash-and-vanish.
const LOADER_FLOOR_MS = 550;
// Hard safety cap: scroll is never locked longer than this, even if `load` stalls.
const LOADER_MAX_MS = 2000;

function App() {
  const [loading, setLoading] = useState(shouldShowLoader);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!loading) return;

    // Mark the session as visited so a reload/return skips the boot screen.
    try { window.sessionStorage.setItem('visited', 'true'); } catch { /* private mode */ }

    const startedAt = performance.now();
    let dismissed = false;
    let floorTimer;

    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      setLoading(false);
    };

    // Dismiss once the page is actually loaded, but not before the floor elapses.
    const dismissAfterFloor = () => {
      const remaining = Math.max(0, LOADER_FLOOR_MS - (performance.now() - startedAt));
      floorTimer = setTimeout(dismiss, remaining);
    };

    if (document.readyState === 'complete') {
      dismissAfterFloor();
    } else {
      window.addEventListener('load', dismissAfterFloor, { once: true });
    }

    // Safety cap so a hung asset can't hold the overlay (and scroll lock) forever.
    const maxTimer = setTimeout(dismiss, LOADER_MAX_MS);

    // Let the visitor skip immediately with a tap/click or Escape.
    const onKeyDown = (e) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('pointerdown', dismiss);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(floorTimer);
      clearTimeout(maxTimer);
      window.removeEventListener('load', dismissAfterFloor);
      window.removeEventListener('pointerdown', dismiss);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [loading]);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="text-white font-body overflow-x-hidden min-h-screen relative selection:bg-[var(--color-accent)] selection:text-white bg-[#000000]">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Modern Emerald Gradient Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] origin-left z-[99999] shadow-[0_0_16px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]" 
        style={{ scaleX }} 
      />

      {/* Subtle Ambient Spotlight Glow (pure CSS radial gradient, no canvas/JS loops) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-300 hidden md:block"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, color-mix(in srgb, var(--color-accent-glow) 3%, transparent) 40%, transparent 80%)'
        }}
      />

      {/* Routed pages */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/qlue-live" element={<QlueLive />} />
        </Routes>
      </div>

      {/* Global résumé preview (opened via openResume() from anywhere) */}
      <ResumeModal />
    </div>
  );
}

export default App;
