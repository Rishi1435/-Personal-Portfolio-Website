import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/* ─── Custom Cursor (desktop only, pointer:fine) ─────────────── */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const hoveringRef = useRef(false);
  const rafId = useRef(null);
  // Computed once — never changes for the lifetime of the mount.
  const [enabled] = useState(isFinePointer);

  useEffect(() => {
    // Runs exactly once on mount. `hovering` is read from a ref inside the RAF
    // loop, so entering/leaving a hover target no longer tears down and rebuilds
    // the loop and its listeners.
    if (!enabled) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      const hovering = hoveringRef.current;
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x - (hovering ? 7 : 4)}px, ${mousePos.current.y - (hovering ? 7 : 4)}px)`;
      }
      // Ring follows with spring lag
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - (hovering ? 24 : 18)}px, ${ringPos.current.y - (hovering ? 24 : 18)}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    // Toggle the visual state directly on the nodes — no React re-render.
    const setHover = (state) => {
      hoveringRef.current = state;
      dotRef.current?.classList.toggle('hovering', state);
      ringRef.current?.classList.toggle('hovering', state);
    };
    const isTarget = (el) =>
      el?.closest?.('a, button, [role="button"], input, textarea, select, .cursor-hover');
    const handleMouseOver = (e) => { if (isTarget(e.target)) setHover(true); };
    const handleMouseOut = (e) => { if (isTarget(e.target)) setHover(false); };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
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
    <div className="text-white font-body overflow-x-hidden min-h-screen relative selection:bg-[#00C853] selection:text-white bg-[#000000]" style={{ cursor: window.matchMedia?.('(pointer: fine)')?.matches ? 'none' : 'auto' }}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {/* Custom Cursor */}
      <CustomCursor />

      {/* Modern Emerald Gradient Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#00C853] to-[#00E676] origin-left z-[99999] shadow-[0_0_16px_rgba(0,200,83,0.6)]" 
        style={{ scaleX }} 
      />

      {/* Subtle Ambient Spotlight Glow (pure CSS radial gradient, no canvas/JS loops) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[2] transition-opacity duration-300 hidden md:block"
        style={{
          background: 'radial-gradient(600px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(0, 200, 83, 0.08) 0%, rgba(0, 230, 118, 0.03) 40%, transparent 80%)'
        }}
      />

      {/* Core Layout Structure */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
