import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-primary-bg py-10 border-t border-[rgba(0,200,83,0.15)]">
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Author Credit */}
        <div className="text-text-secondary text-sm font-body tracking-wider uppercase select-none">
          Designed & Built by Rishi Pediredla
        </div>
        
        {/* Social Icons with Emerald Glow Hover */}
        <div className="flex items-center gap-8">
          <a 
            href="https://github.com/Rishi1435" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-text-secondary hover:text-accent-glow hover:scale-110 transition-all duration-300"
            aria-label="GitHub Profile"
          >
            <FaGithub size={20} />
          </a>
          <a 
            href="https://linkedin.com/in/rishi-pediredla-2305nov" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-text-secondary hover:text-accent-glow hover:scale-110 transition-all duration-300"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin size={20} />
          </a>
          <a 
            href="mailto:pediredlarishi2005@gmail.com" 
            className="text-text-secondary hover:text-accent-glow hover:scale-110 transition-all duration-300"
            aria-label="Send Email"
          >
            <FaEnvelope size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-text-secondary text-sm font-mono opacity-50 select-none">
          © {new Date().getFullYear()}
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
