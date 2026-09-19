import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer 
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)'
      }}
      className="relative py-12 overflow-hidden backdrop-blur-md"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        
        {/* Author Credit */}
        <div className="font-body text-xs text-[#a0a0b8] tracking-wider uppercase select-none flex items-center gap-2">
          <span className="text-[var(--color-accent)] font-bold">//</span> Designed &amp; Built by <span className="text-white font-semibold">Rishi Pediredla</span>
        </div>
        
        {/* Social Icons with Emerald Hover */}
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/Rishi1435" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:text-[var(--color-accent-glow)] hover:border-[var(--color-accent-glow)] hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent-glow)_40%,transparent)] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="GitHub Profile"
          >
            <FaGithub size={16} />
          </a>
          <a 
            href="https://linkedin.com/in/rishi-pediredla-2305nov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={16} />
          </a>
          <a 
            href="mailto:pediredlarishi2005@gmail.com" 
            className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-white hover:text-[var(--color-accent-glow)] hover:border-[var(--color-accent-glow)] hover:shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent-glow)_40%,transparent)] hover:-translate-y-0.5 transition-all duration-300"
            aria-label="Send Email"
          >
            <FaEnvelope size={16} />
          </a>
        </div>

        {/* Copyright */}
        <div className="font-body text-[#a0a0b8]/60 text-xs tracking-wider select-none">
          <span>© {new Date().getFullYear()} · All rights reserved.</span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
