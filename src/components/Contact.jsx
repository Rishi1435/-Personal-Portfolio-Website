import { useState } from 'react';
import SectionPagination from './SectionPagination';
import ScrollReveal from './ScrollReveal';
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      // Mock fallback submission for demo / dev testing without setup
      console.warn(
        `%c[Contact Form]%c To receive actual form transmissions via email, please do the following:\n` +
        `1. Visit https://web3forms.com to get a free access key.\n` +
        `2. Create a .env file in the project root.\n` +
        `3. Add: VITE_WEB3FORMS_ACCESS_KEY=your_key_here\n` +
        `Running fallback mockup transmission for now.`,
        'color: #00C853; font-weight: bold;',
        'color: inherit;'
      );

      setTimeout(() => {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 4000);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formState.name,
          email: formState.email,
          message: formState.message,
          subject: `Portfolio Contact from ${formState.name}`,
          from_name: 'Portfolio Contact'
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setFormState({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 4000);
      } else {
        console.error('Web3Forms Error:', result);
        setStatus('error');
        setTimeout(() => setStatus(''), 4000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <section 
      id="contact" 
      className="relative min-h-screen bg-primary-bg overflow-hidden flex items-center py-24"
    >
      {/* Background digital grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,200,83,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

      <div className="container max-w-[1050px] mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Section Heading */}
        <ScrollReveal>
          <div className="mb-14 text-center">
            <span className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase mb-2 block select-none">
              // channel_initiation
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black text-text-primary leading-none tracking-[-0.03em] select-none">
              Get In <span className="text-accent relative">
                Touch
                <motion.span
                  className="absolute -bottom-1.5 left-0 h-[3px] bg-accent rounded-full w-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              </span>
            </h2>
            <p className="font-body text-text-secondary text-sm md:text-base max-w-[580px] mx-auto mt-6 leading-relaxed select-none opacity-80">
              I am open to internship opportunities, full-time roles, and technical collaborations. Submit the connection form below or ping me directly. Let's build.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Dashboard Split */}
        <ScrollReveal delay={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
            
            {/* Left Panel: Cyber Dossier Card */}
            <div className="lg:col-span-5 flex flex-col justify-between p-7 md:p-8 bg-[#060606]/85 backdrop-blur-md border border-[rgba(0,200,83,0.18)] rounded-2xl relative overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/70" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/70" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/70" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/70" />
              
              {/* Top scanning line */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="space-y-8 relative z-10">
                {/* Header Widget */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-accent tracking-[0.25em] uppercase">dossier.sys</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="font-mono text-[8px] text-accent/80 tracking-widest">ONLINE</span>
                  </div>
                </div>

                {/* Radar Rotating Graphic */}
                <div className="flex justify-center py-2">
                  <div className="w-24 h-24 rounded-full border border-accent/15 flex items-center justify-center relative overflow-hidden bg-[#000000]">
                    <div className="absolute inset-2 rounded-full border border-accent/5" />
                    <div className="absolute inset-6 rounded-full border border-accent/5" />
                    {/* Rotating Scanner Line */}
                    <div 
                      className="absolute w-full h-[1px] bg-gradient-to-r from-transparent to-accent/40 top-1/2 left-0 origin-center animate-[spin_5s_linear_infinite]"
                      style={{ transformOrigin: 'center' }}
                    />
                    <FaEnvelope className="text-accent/60 text-xl animate-pulse" />
                  </div>
                </div>

                <div className="space-y-6 pt-2">
                  <div>
                    <h3 className="font-mono text-[9px] text-accent tracking-[0.3em] uppercase mb-1">LOCATION_DATA</h3>
                    <p className="font-body text-text-primary text-sm font-medium">Visakhapatnam, Andhra Pradesh, India</p>
                    <span className="font-mono text-[8px] text-text-secondary/40 block mt-0.5">LAT/LONG: 17.6868° N, 83.2185° E</span>
                  </div>
                  
                  <div>
                    <h3 className="font-mono text-[9px] text-accent tracking-[0.3em] uppercase mb-1">DIRECT_CHANNEL</h3>
                    <a 
                      href="mailto:pediredlarishi2005@gmail.com" 
                      className="font-mono text-text-primary hover:text-accent transition-colors text-sm break-all font-semibold block"
                    >
                      pediredlarishi2005@gmail.com
                    </a>
                    <p className="font-body text-text-secondary/70 text-xs mt-1">+91 9290015858</p>
                  </div>
                </div>
              </div>

              {/* Dossier Social Badges */}
              <div className="flex flex-col gap-2.5 mt-10 relative z-10">
                <a 
                  href="mailto:pediredlarishi2005@gmail.com"
                  className="flex items-center justify-center gap-3 px-5 py-3 border border-accent/30 bg-[rgba(0,200,83,0.03)] hover:border-accent text-accent rounded-xl font-body font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_15px_rgba(0,200,83,0.2)] transition-all duration-300 w-full"
                >
                  <FaEnvelope size={13} /> Send Email Direct
                </a>

                <div className="grid grid-cols-2 gap-2.5">
                  <a 
                    href="https://linkedin.com/in/rishi-pediredla-2305nov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border border-white/5 bg-[#0a0a0a]/50 text-text-secondary hover:text-accent hover:border-accent/40 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-all duration-300"
                  >
                    <FaLinkedin size={14} className="text-accent/70" /> LinkedIn
                  </a>
                  <a 
                    href="https://github.com/Rishi1435" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2.5 border border-white/5 bg-[#0a0a0a]/50 text-text-secondary hover:text-accent hover:border-accent/40 rounded-xl font-mono text-[10px] tracking-wider uppercase transition-all duration-300"
                  >
                    <FaGithub size={14} className="text-accent/70" /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel: Futuristic Contact Console Form */}
            <div className="lg:col-span-7 p-7 md:p-8 bg-[#060606]/85 backdrop-blur-md border border-[rgba(0,200,83,0.18)] rounded-2xl relative shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              {/* Corner Brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/70" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/70" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/70" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/70" />

              {/* Status Ticker Bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-text-secondary/50">ENVELOPE_SECURE:</span>
                  <span className="font-mono text-[9px] text-accent font-bold">AES_256_ACTIVE</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] text-text-secondary/40">
                  <span>PING: 14MS</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div className="relative">
                  <label 
                    htmlFor="name" 
                    className={`block font-mono text-[10px] tracking-widest uppercase mb-1.5 transition-colors duration-200 ${
                      focusedField === 'name' ? 'text-accent' : 'text-text-secondary/60'
                    }`}
                  >
                    [01] SENDER_NAME
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formState.name}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="enter your name here..."
                      className="w-full bg-[#030303] border border-white/5 focus:border-accent/40 rounded-xl px-4 py-3.5 font-body text-sm text-text-primary focus:outline-none focus:shadow-[0_0_20px_rgba(0,200,83,0.06)] transition-all duration-300"
                    />
                    {/* Glowing bottom accent line */}
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-400 ${
                        focusedField === 'name' ? 'w-[95%] opacity-100 shadow-[0_0_10px_#00C853]' : 'w-0 opacity-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="relative">
                  <label 
                    htmlFor="email" 
                    className={`block font-mono text-[10px] tracking-widest uppercase mb-1.5 transition-colors duration-200 ${
                      focusedField === 'email' ? 'text-accent' : 'text-text-secondary/60'
                    }`}
                  >
                    [02] SENDER_EMAIL
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formState.email}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="address://domain.com"
                      className="w-full bg-[#030303] border border-white/5 focus:border-accent/40 rounded-xl px-4 py-3.5 font-body text-sm text-text-primary focus:outline-none focus:shadow-[0_0_20px_rgba(0,200,83,0.06)] transition-all duration-300"
                    />
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-400 ${
                        focusedField === 'email' ? 'w-[95%] opacity-100 shadow-[0_0_10px_#00C853]' : 'w-0 opacity-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Message field */}
                <div className="relative">
                  <label 
                    htmlFor="message" 
                    className={`block font-mono text-[10px] tracking-widest uppercase mb-1.5 transition-colors duration-200 ${
                      focusedField === 'message' ? 'text-accent' : 'text-text-secondary/60'
                    }`}
                  >
                    [03] MESSAGE_PAYLOAD
                  </label>
                  <div className="relative">
                    <textarea 
                      id="message"
                      required
                      rows="4"
                      value={formState.message}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="write your message packet details here..."
                      className="w-full bg-[#030303] border border-white/5 focus:border-accent/40 rounded-xl px-4 py-3.5 font-body text-sm text-text-primary focus:outline-none focus:shadow-[0_0_20px_rgba(0,200,83,0.06)] transition-all duration-300 resize-none"
                    />
                    <div 
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-400 ${
                        focusedField === 'message' ? 'w-[95%] opacity-100 shadow-[0_0_10px_#00C853]' : 'w-0 opacity-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Submit button with cyber layout */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`w-full py-4 relative font-body font-black text-sm tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    status === 'error'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_30px_rgba(239,68,68,0.45)] hover:scale-[1.01]'
                      : 'bg-gradient-to-r from-accent to-accent-glow text-primary-bg hover:shadow-[0_0_30px_rgba(0,200,83,0.45)] hover:scale-[1.01]'
                  }`}
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-primary-bg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      TRANSMITTING SIGNAL...
                    </span>
                  ) : status === 'success' ? (
                    <span>SIGNAL TRANSMITTED SUCCESSFULLY!</span>
                  ) : status === 'error' ? (
                    <span>TRANSMISSION FAILED. TRY AGAIN.</span>
                  ) : (
                    <>
                      <FaPaperPlane size={11} /> TRANSMIT SIGNAL
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </ScrollReveal>

      </div>

      <SectionPagination number="04" title="Contact" />
    </section>
  );
};

export default Contact;
