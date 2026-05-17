import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorParticles from './components/CursorParticles';
import ParallaxBackground from './components/ParallaxBackground';
import LoadingScreen from './components/LoadingScreen';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

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
    }, 2000);
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

  return (
    <div className="bg-[#000000] text-text-primary font-body overflow-x-hidden min-h-screen relative selection:bg-accent selection:text-[#000000]">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-accent origin-left z-[99999] shadow-[0_0_12px_#00E676,0_0_4px_#00C853]" 
        style={{ scaleX }} 
      />

      {/* Interactive Cursor Follower Layer */}
      <CursorParticles />

      {/* Interactive Cursor Spotlight Glow (effecting the portfolio screen on movement) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-300 hidden md:block"
        style={{
          background: 'radial-gradient(550px circle at var(--mouse-x, 50vw) var(--mouse-y, 50vh), rgba(0, 200, 83, 0.08) 0%, transparent 80%)'
        }}
      />

      {/* Floating Parallax Background Shapes */}
      <div className="absolute inset-0 z-0">
        <ParallaxBackground />
      </div>

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
