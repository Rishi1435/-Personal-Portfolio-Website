import RishiPic from '../assets/images/Rishi\'s_Pic.png';
import RishiResume from '../assets/files/Rishi_Resume(new).pdf';
import { FaTerminal, FaMapMarkerAlt, FaEnvelope, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#000000] pt-24 pb-12"
    >
      {/* Corner Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(0,200,83,0.12)_0%,transparent_60%)] pointer-events-none z-0 animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vh] bg-[radial-gradient(circle,rgba(0,200,83,0.12)_0%,transparent_60%)] pointer-events-none z-0 animate-[pulse_6s_ease-in-out_infinite_delay-2s]" />

      {/* Decorative Border Frame — desktop only */}
      <div className="absolute top-[8%] bottom-[8%] left-[6%] right-[6%] border border-[rgba(0,200,83,0.12)] rounded-lg pointer-events-none z-0 hidden lg:block" />

      <div className="container max-w-[1280px] mx-auto px-4 sm:px-6 md:px-12 relative z-10 w-full">

        {/* ── Desktop: 3-column grid ── Mobile: stacked ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8 items-center w-full">

          {/* LEFT HUD card — hidden on mobile, shown on lg+ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="hidden lg:flex lg:col-span-1 flex-col justify-center items-start z-40"
          >
            <div className="w-full bg-[#080808]/75 backdrop-blur-md border border-[rgba(0,200,83,0.15)] rounded-xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[rgba(0,200,83,0.3)] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FaTerminal className="text-accent text-xs" />
                  <span className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">// CORE ARCHITECTURE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span className="font-mono text-[9px] tracking-widest text-accent uppercase">ACTIVE</span>
                </div>
              </div>
              <p className="font-body text-text-secondary text-sm leading-relaxed mb-4 opacity-90">
                Building mobile apps and cloud-native systems that scale — from Flutter front-ends to AWS serverless back-ends.
              </p>
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2 font-mono text-[10px] text-text-secondary">
                <div className="flex items-center justify-between">
                  <span className="text-accent-glow">CLOUD SPECIALTY:</span>
                  <span className="text-white">AWS Serverless</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-accent-glow">MOBILE FRAMEWORK:</span>
                  <span className="text-white">Flutter & Dart</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-accent-glow">BACK-END SYSTEMS:</span>
                  <span className="text-white">Node.js & Spring</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER: Photo + Text stack */}
          <div className="lg:col-span-2 relative flex flex-col items-center justify-end h-[300px] sm:h-[420px] md:h-[500px] lg:h-[580px] select-none w-full">

            {/* Layer 1: Solid background text */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-text-primary text-center select-none pointer-events-none z-10 uppercase tracking-tighter w-full leading-[0.8]"
              style={{ fontSize: 'clamp(2rem, 8vw, 6.5rem)', whiteSpace: 'nowrap' }}
            >
              Rishi<br />Pediredla
              <span className="block text-accent font-black tracking-wider text-[clamp(0.75rem,2.5vw,1.8rem)] mt-2 md:mt-3">
                Full Stack Developer
              </span>
            </motion.h1>

            {/* Layer 2: Photo with entrance + float */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative z-20 h-full w-full flex items-end justify-center pointer-events-none overflow-hidden"
              style={{ transform: 'scale(1.02)' }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="h-full w-full flex items-end justify-center"
              >
                <img
                  src={RishiPic}
                  alt="Rishi Pediredla"
                  className="h-full w-auto object-contain drop-shadow-[0_0_35px_rgba(0,200,83,0.25)]"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12%)'
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Layer 3: Outline text overlay */}
            <motion.h1
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-transparent text-center select-none pointer-events-none z-30 uppercase tracking-tighter w-full leading-[0.8]"
              style={{
                fontSize: 'clamp(2rem, 8vw, 6.5rem)',
                whiteSpace: 'nowrap',
                WebkitTextStroke: '1.8px rgba(255,255,255,0.75)',
              }}
            >
              Rishi<br />Pediredla
              <span
                className="block text-transparent font-black tracking-wider text-[clamp(0.75rem,2.5vw,1.8rem)] mt-2 md:mt-3"
                style={{ WebkitTextStroke: '1.5px #00C853' }}
              >
                Full Stack Developer
              </span>
            </motion.h1>
          </div>

          {/* RIGHT HUD card — full width on mobile, 1 col on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="lg:col-span-1 w-full flex flex-col justify-center items-center z-40"
          >
            <div className="w-full bg-[#080808]/75 backdrop-blur-md border border-[rgba(0,200,83,0.15)] rounded-xl p-5 shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-[rgba(0,200,83,0.3)] transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30" />
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <FaChevronRight className="text-accent text-xs" />
                  <span className="font-mono text-[10px] tracking-wider text-text-secondary uppercase">// INITIATE ACTIONS</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-4">
                <a href="#projects" className="w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-glow text-primary-bg font-body font-bold text-xs tracking-[0.1em] uppercase hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,200,83,0.4)] transition-all duration-300 rounded text-center block">
                  View My Work
                </a>
                <a
                  href={RishiResume}
                  download="Rishi_Pediredla_Resume.pdf"
                  className="w-full px-4 py-3 bg-[rgba(0,200,83,0.08)] border border-accent text-accent font-body font-bold text-xs tracking-[0.1em] uppercase hover:bg-accent hover:text-primary-bg hover:shadow-[0_0_20px_rgba(0,200,83,0.35)] hover:scale-[1.03] transition-all duration-300 rounded text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  View Résumé
                </a>
                <a href="mailto:pediredlarishi2005@gmail.com" className="w-full px-4 py-3 border border-[rgba(255,255,255,0.08)] text-text-secondary bg-transparent font-body font-bold text-xs tracking-[0.1em] uppercase hover:border-accent hover:text-accent hover:scale-[1.03] transition-all duration-300 rounded text-center block">
                  Get In Touch
                </a>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex flex-col gap-2.5 font-mono text-[10px] text-text-secondary">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-accent text-[11px] flex-shrink-0" />
                  <span>Visakhapatnam, Andhra Pradesh, India</span>
                </div>
                <a href="mailto:pediredlarishi2005@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors duration-200 min-w-0">
                  <FaEnvelope className="text-accent text-[11px] flex-shrink-0" />
                  <span className="truncate">pediredlarishi2005@gmail.com</span>
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 opacity-50">
        <a href="#about" aria-label="Scroll to About Me" className="text-accent block animate-bounce">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
