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

/* ─── Custom Cursor (desktop only, pointer:fine) ─────────────── */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Check for fine pointer (no touch devices)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
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

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('a, button, [role="button"], input, textarea, select, .cursor-hover')) {
        setHovering(true);
      }
    };
    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.closest('a, button, [role="button"], input, textarea, select, .cursor-hover')) {
        setHovering(false);
      }
    };

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
  }, [hovering]);

  // Only render on pointer:fine devices
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <>
      <div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} />
      <div ref={ringRef} className={`custom-cursor-ring ${hovering ? 'hovering' : ''}`} />
    </>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3800); // Allow boot sequence animation to complete
    return () => clearTimeout(timer);
  }, []);

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
