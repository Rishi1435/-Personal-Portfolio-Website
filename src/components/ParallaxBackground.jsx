import { Parallax } from 'react-scroll-parallax';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ParallaxBackground = () => {
  const prefersReducedMotion = useReducedMotion();

  // If reduced motion is preferred, render static shapes or hide them
  const parallaxSpeed = (speed) => (prefersReducedMotion ? 0 : speed);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      
      {/* 1. Dotted Grid Panel (Top Right - Near Hero / About interface) */}
      <div className="absolute top-[15%] right-[5%] md:right-[10%] opacity-20">
        <Parallax speed={parallaxSpeed(-15)}>
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#00C853" />
            </pattern>
            <rect width="120" height="120" fill="url(#dot-grid)" />
          </svg>
        </Parallax>
      </div>

      {/* 2. Wireframe Hexagon (Middle Left - Near About / Skills split) */}
      <div className="absolute top-[40%] left-[3%] md:left-[8%] opacity-15">
        <Parallax speed={parallaxSpeed(-25)}>
          <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 50 5 L 90 28 L 90 72 L 50 95 L 10 72 L 10 28 Z" 
              stroke="#00C853" 
              strokeWidth="1" 
              strokeLinejoin="round" 
            />
            <path 
              d="M 50 15 L 82 33 L 82 67 L 50 85 L 18 67 L 18 33 Z" 
              stroke="#1B5E20" 
              strokeWidth="0.8" 
              strokeLinejoin="round" 
            />
          </svg>
        </Parallax>
      </div>

      {/* 3. Tech Circuit Line Tracks (Middle Right - Near Projects) */}
      <div className="absolute top-[65%] right-[4%] md:right-[8%] opacity-20">
        <Parallax speed={parallaxSpeed(-10)}>
          <svg width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Line tracks */}
            <path d="M 10 20 L 80 20 L 110 50 L 170 50" stroke="#00C853" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 40 80 L 100 80 L 130 110" stroke="#1B5E20" strokeWidth="1" strokeLinecap="round" />
            
            {/* Connector circles */}
            <circle cx="10" cy="20" r="3" fill="#00E676" />
            <circle cx="170" cy="50" r="3" fill="#00E676" />
            <circle cx="40" cy="80" r="2" fill="#00C853" />
            <circle cx="130" cy="110" r="2" fill="#00C853" />
          </svg>
        </Parallax>
      </div>

      {/* 4. Glowing Emerald Ring (Bottom Left - Near Contact) */}
      <div className="absolute bottom-[10%] left-[5%] md:left-[10%] opacity-25">
        <Parallax speed={parallaxSpeed(-20)}>
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full border border-accent-dim shadow-[0_0_40px_rgba(0,200,83,0.15)] flex items-center justify-center">
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-dashed border-accent opacity-40 animate-[spin_20s_linear_infinite]" />
          </div>
        </Parallax>
      </div>

    </div>
  );
};

export default ParallaxBackground;
