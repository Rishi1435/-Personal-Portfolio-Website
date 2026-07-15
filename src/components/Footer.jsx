import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const [ping, setPing] = useState(16);
  const [matrixLines] = useState(() =>
    Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 3
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuating ping between 12ms and 28ms
      setPing(Math.floor(Math.random() * (28 - 12 + 1)) + 12);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-[#020202] py-12 border-t border-[rgba(0,200,83,0.2)] overflow-hidden">
      {/* Subtle Matrix Rain / Digital Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        <div className="absolute inset-0 flex justify-around">
          {matrixLines.map((line) => (
            <motion.div
              key={line.id}
              initial={{ y: -100, opacity: line.opacity }}
              animate={{ y: ['-100%', '300%'] }}
              transition={{
                duration: line.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: line.delay
              }}
              className="w-[1px] h-28 bg-gradient-to-b from-transparent via-accent to-transparent"
            />
          ))}
        </div>
      </div>

      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Author Credit & Ping status */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-text-secondary text-xs font-mono tracking-wider uppercase select-none flex items-center gap-2">
            <span className="text-accent">&gt;</span> Designed &amp; Built by <span className="text-white font-bold">Rishi Pediredla</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 bg-[#080808] border border-[rgba(0,200,83,0.25)] rounded-full shadow-[0_0_10px_rgba(0,200,83,0.1)] font-mono text-[10px] text-accent font-bold tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>PING: {ping}ms</span>
          </div>
        </div>
        
        {/* Social Icons with Emerald Glow Hover */}
        <div className="flex items-center gap-6">
          <a 
            href="https://github.com/Rishi1435" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[rgba(0,200,83,0.15)] flex items-center justify-center text-accent/80 hover:text-accent hover:border-accent hover:shadow-[0_0_15px_#00E676] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="GitHub Profile"
          >
            <FaGithub size={18} />
          </a>
          <a 
            href="https://linkedin.com/in/rishi-pediredla-2305nov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[rgba(0,200,83,0.15)] flex items-center justify-center text-accent/80 hover:text-accent hover:border-accent hover:shadow-[0_0_15px_#00E676] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={18} />
          </a>
          <a 
            href="mailto:pediredlarishi2005@gmail.com" 
            className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[rgba(0,200,83,0.15)] flex items-center justify-center text-accent/80 hover:text-accent hover:border-accent hover:shadow-[0_0_15px_#00E676] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="Send Email"
          >
            <FaEnvelope size={18} />
          </a>
        </div>

        {/* Copyright & Terminal signature */}
        <div className="flex items-center gap-2 text-text-secondary/50 text-xs font-mono select-none">
          <span>PORTAL // SYSTEM_V3</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;

