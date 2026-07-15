import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const CursorParticles = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isVisibleRef = useRef(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-fidelity spring configurations
  // Snappy core dot pointer
  const dotX = useSpring(mouseX, { damping: 20, stiffness: 800, mass: 0.1 });
  const dotY = useSpring(mouseY, { damping: 20, stiffness: 800, mass: 0.1 });

  // Smooth outer ring
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 220, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 220, mass: 0.5 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      // Update CSS variables for spotlight elements in the app
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [prefersReducedMotion, mouseX, mouseY]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .cursor-pointer');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <>
      {/* 1. Inner Pointer Dot */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-1.5 h-1.5 bg-[#00E676] rounded-full pointer-events-none z-[1000000] will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicked ? 1.2 : isHovered ? 2.2 : 1,
          boxShadow: isHovered 
            ? '0 0 15px #00E676, 0 0 30px rgba(0, 230, 118, 0.5)' 
            : '0 0 8px rgba(0, 230, 118, 0.8)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />

      {/* 2. Outer Radar Reticle Ring */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 rounded-full border border-accent/40 pointer-events-none z-[1000000] will-change-transform flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovered ? 1.5 : 1,
          borderColor: isHovered ? '#00E676' : 'rgba(0, 200, 83, 0.4)',
          backgroundColor: isHovered ? 'rgba(0, 230, 118, 0.06)' : 'rgba(0, 200, 83, 0)',
          boxShadow: isHovered 
            ? '0 0 20px rgba(0, 230, 118, 0.2)' 
            : '0 0 0px rgba(0, 200, 83, 0)',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      >
        {/* Rotating sweep container */}
        <div 
          className={`absolute inset-0 rounded-full border border-dashed border-transparent transition-all duration-300 ${
            isHovered ? 'border-[#00E676]/35 animate-spin' : ''
          }`}
          style={{ animationDuration: '6s' }}
        />
      </motion.div>
    </>
  );
};

export default CursorParticles;
