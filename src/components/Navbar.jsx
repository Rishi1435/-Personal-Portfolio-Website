import React, { useState, useEffect } from 'react';
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

      // Simple active section detection
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      
      // If we are at the very top of the page, active section is home
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') || 'home';
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-[rgba(0,0,0,0.8)] backdrop-blur-md border-[rgba(0,200,83,0.15)] py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a 
          href="#" 
          className="text-2xl font-display font-bold bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent tracking-wider uppercase"
        >
          Rishi
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
                className={`relative text-[15px] font-body transition-colors duration-300 ${
                  isActive ? 'text-accent font-semibold' : 'text-text-secondary hover:text-text-primary'
                } group`}
              >
                {link.name}
                <span 
                  className={`absolute -bottom-2 left-0 w-full h-[2px] bg-accent origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA: Let's Talk only */}
        <div className="hidden md:block">
          <a
            href="#contact"
            className="px-5 py-2 border border-accent text-accent font-body text-sm font-bold tracking-widest uppercase hover:bg-accent hover:text-primary-bg hover:shadow-[0_0_20px_rgba(0,200,83,0.4)] transition-all duration-300 rounded"
          >
            Let's Talk
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="md:hidden text-text-primary focus:outline-none cursor-pointer"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open Menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"></path>
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
            className="fixed inset-0 bg-primary-bg z-50 flex flex-col justify-center p-8 border-l border-accent-dim"
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-text-primary focus:outline-none cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path>
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
                    className={`font-display text-4xl uppercase tracking-widest transition-colors ${
                      isActive ? 'text-accent font-bold' : 'text-text-secondary hover:text-text-primary'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                );
              })}
              <a
                href="#contact"
                className="mt-8 px-8 py-4 border border-accent text-accent bg-transparent font-body text-lg font-bold tracking-widest uppercase hover:bg-accent hover:text-primary-bg transition-colors duration-300 text-center rounded"
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
