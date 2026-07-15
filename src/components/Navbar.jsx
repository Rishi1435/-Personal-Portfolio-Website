import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') || 'home';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-white/10 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.7)]' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#" 
          className="flex items-center gap-2 font-display font-bold text-xl md:text-2xl tracking-wide group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#00C853] animate-pulse shadow-[0_0_12px_#00C853]" />
          <span 
            className="font-black"
            style={{
              background: 'linear-gradient(90deg, #00C853, #00E676)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Rishi
          </span>
          <span className="font-body text-xs text-[#a0a0b8] group-hover:text-white transition-colors">Portfolio</span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => {
            const linkId = link.href.substring(1) || 'home';
            const isActive = activeSection === linkId;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative py-1 text-sm font-body font-medium tracking-wide transition-colors duration-300 flex items-center gap-1.5 ${
                  isActive ? 'text-white font-semibold drop-shadow-[0_0_10px_rgba(0,200,83,0.5)]' : 'text-[#a0a0b8] hover:text-white'
                }`}
              >
                <span>{link.name}</span>

                {/* Sliding layoutId underline */}
                {isActive && (
                  <motion.span
                    layoutId="navbar-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00C853] to-[#00E676] shadow-[0_0_12px_rgba(0,200,83,0.8)] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA: Let's Talk */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#contact"
            className="relative group px-5 py-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-white font-body text-xs font-semibold tracking-wide uppercase transition-all duration-300 hover:border-[#00C853] hover:shadow-[0_0_20px_rgba(0,200,83,0.35)] hover:bg-[#00C853]/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] group-hover:bg-white animate-pulse" />
              Let's Talk
            </span>
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-white focus:outline-none cursor-pointer"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <svg className="w-8 h-8 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 bg-[#040404]/95 backdrop-blur-2xl z-50 flex flex-col justify-center p-8 border-l border-white/10 shadow-2xl"
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white focus:outline-none cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <svg className="w-10 h-10 text-[#00C853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <nav className="flex flex-col space-y-6">
              {navLinks.map((link) => {
                const linkId = link.href.substring(1) || 'home';
                const isActive = activeSection === linkId;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`font-display text-2xl md:text-3xl uppercase tracking-wider transition-colors flex items-center gap-2 ${
                      isActive ? 'text-[#00E676] font-bold drop-shadow-[0_0_12px_rgba(0,230,118,0.6)]' : 'text-[#a0a0b8] hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {isActive && <span className="text-[#00C853] animate-pulse">&gt;</span>}
                    <span>{link.name}</span>
                  </a>
                );
              })}
              <a
                href="#contact"
                className="mt-8 px-8 py-4 border border-[#00C853]/50 text-white bg-[linear-gradient(135deg,#00C853,#00E676)] font-body text-base font-bold tracking-wide uppercase transition-all duration-300 text-center rounded-xl shadow-[0_0_20px_rgba(0,200,83,0.4)] hover:scale-[1.02]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Let's Talk
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
