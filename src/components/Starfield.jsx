import React, { useMemo } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const Starfield = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      // Random positions
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      // Random sizes between 1px and 2px
      const size = `${Math.random() * 1 + 1}px`;
      // Base opacity
      const opacity = Math.random() * 0.15 + 0.15; // 15% to 30%
      // Random animation duration and delay
      const duration = `${Math.random() * 3 + 2}s`;
      const delay = `${Math.random() * 2}s`;
      // Only 30% of stars twinkle
      const shouldTwinkle = Math.random() > 0.7 && !prefersReducedMotion;

      return {
        id: i,
        style: {
          top,
          left,
          width: size,
          height: size,
          opacity,
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: shouldTwinkle ? `twinkle ${duration} ease-in-out ${delay} infinite alternate` : 'none',
        }
      };
    });
  }, [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#000000]">
      {stars.map((star) => (
        <div key={star.id} style={star.style} />
      ))}
      <style>{`
        @keyframes twinkle {
          0% { opacity: 0.1; transform: scale(0.8); }
          100% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default Starfield;
