import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
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
    <div className="text-white font-body overflow-x-hidden min-h-screen relative selection:bg-[#00C853] selection:text-white bg-[#000000]">
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

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
