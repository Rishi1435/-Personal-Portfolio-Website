import { useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const Starfield = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const [starsData] = useState(() => {
    return Array.from({ length: 80 }).map((_, i) => {
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const size = `${Math.random() * 1 + 1}px`;
      const opacity = Math.random() * 0.15 + 0.15;
      const duration = `${Math.random() * 3 + 2}s`;
      const delay = `${Math.random() * 2}s`;
      const twinkleFlag = Math.random() > 0.7;

      return {
        id: i,
        top,
        left,
        size,
        opacity,
        duration,
        delay,
        twinkleFlag
      };
    });
  });

  const stars = starsData.map((star) => ({
    id: star.id,
    style: {
      top: star.top,
      left: star.left,
      width: star.size,
      height: star.size,
      opacity: star.opacity,
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      borderRadius: '50%',
      pointerEvents: 'none',
      animation: (star.twinkleFlag && !prefersReducedMotion)
        ? `twinkle ${star.duration} ease-in-out ${star.delay} infinite alternate`
        : 'none',
    }
  }));

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
