import { useState } from 'react';
import SectionPagination from './SectionPagination';
import ScrollReveal from './ScrollReveal';
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      console.warn(
        `%c[Contact Form]%c To receive actual form transmissions via email, please visit https://web3forms.com and add VITE_WEB3FORMS_ACCESS_KEY to .env`,
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
      className="relative overflow-hidden flex items-center py-28"
    >
      <div className="container max-w-[1050px] mx-auto px-6 md:px-12 relative z-10 w-full">
        
        {/* Section Heading */}
        <ScrollReveal>
          <div className="mb-16 text-center">
            <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase mb-3 block select-none">
              // 05 · GET IN TOUCH
            </span>
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black leading-none tracking-tight section-title select-none">
              Let's Connect
            </h2>
            <p className="font-body text-[#a0a0b8] text-sm md:text-base max-w-[580px] mx-auto mt-5 leading-relaxed select-none">
              I am open to internship opportunities, full-time roles, and technical collaborations. Submit the form below or reach out directly.
            </p>
          </div>
        </ScrollReveal>

        {/* Contact Dashboard Split */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
            
            {/* Left Panel: Direct Channels & Social Icons */}
            <div className="lg:col-span-5 flex flex-col justify-between p-7 md:p-8 glass-card">
              <div className="space-y-8 relative z-10">
                {/* Header Widget */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="font-body text-xs text-[#00C853] font-semibold tracking-wider uppercase">CONTACT INFO</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="font-body text-[10px] text-[#00E676] font-semibold tracking-wider">ONLINE</span>
                  </div>
                </div>

                {/* Email Display */}
                <div className="space-y-6 pt-2">
                  <div>
                    <h3 className="font-body text-xs text-[#00C853] font-semibold tracking-wider uppercase mb-1">LOCATION</h3>
                    <p className="font-body text-white text-sm font-medium">Visakhapatnam, Andhra Pradesh, India</p>
                  </div>
                  
                  <div>
                    <h3 className="font-body text-xs text-[#00C853] font-semibold tracking-wider uppercase mb-1">DIRECT CHANNEL</h3>
                    <a 
                      href="mailto:pediredlarishi2005@gmail.com" 
                      className="font-body text-white hover:text-[#00E676] transition-colors text-sm break-all font-semibold block"
                    >
                      pediredlarishi2005@gmail.com
                    </a>
                    <p className="font-body text-[#a0a0b8] text-xs mt-1">+91 9290015858</p>
                  </div>
                </div>
              </div>

              {/* Social icon buttons */}
              <div className="flex flex-col gap-4 mt-10 relative z-10">
                <span className="font-body text-[11px] text-[#a0a0b8] font-semibold tracking-widest uppercase">SOCIAL CHANNELS</span>
                <div className="flex items-center gap-4">
                  <a 
                    href="mailto:pediredlarishi2005@gmail.com"
                    aria-label="Email direct"
                    style={{ borderRadius: '50%', width: '48px', height: '48px' }}
                    className="glass-card flex items-center justify-center text-white hover:text-[#00E676] transition-all duration-300 hover:!border-[#00E676] hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]"
                  >
                    <FaEnvelope size={18} />
                  </a>
                  <a 
                    href="https://linkedin.com/in/rishi-pediredla-2305nov" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    style={{ borderRadius: '50%', width: '48px', height: '48px' }}
                    className="glass-card flex items-center justify-center text-white hover:text-[#00C853] transition-all duration-300 hover:!border-[#00C853] hover:shadow-[0_0_20px_rgba(0,200,83,0.4)]"
                  >
                    <FaLinkedin size={18} />
                  </a>
                  <a 
                    href="https://github.com/Rishi1435" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    style={{ borderRadius: '50%', width: '48px', height: '48px' }}
                    className="glass-card flex items-center justify-center text-white hover:text-[#00E676] transition-all duration-300 hover:!border-[#00E676] hover:shadow-[0_0_20px_rgba(0,230,118,0.4)]"
                  >
                    <FaGithub size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Panel: Futuristic Contact Console Form */}
            <div className="lg:col-span-7 p-7 md:p-8 glass-card">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <span className="font-body text-xs text-[#00C853] font-semibold tracking-wider uppercase">SEND A MESSAGE</span>
                <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wide">SECURE SSL</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div>
                  <label 
                    htmlFor="name" 
                    className="block font-body text-xs font-semibold tracking-wider text-[#a0a0b8] uppercase mb-2"
                  >
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    value={formState.name}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Doe"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: focusedField === 'name' ? '0 0 0 2px rgba(0, 200, 83, 0.4)' : 'none',
                      border: focusedField === 'name' ? '1px solid rgba(0, 200, 83, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px'
                    }}
                    className="w-full px-4 py-3.5 font-body text-sm text-white placeholder-[#a0a0b8]/40 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Email field */}
                <div>
                  <label 
                    htmlFor="email" 
                    className="block font-body text-xs font-semibold tracking-wider text-[#a0a0b8] uppercase mb-2"
                  >
                    Your Email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    required
                    value={formState.email}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: focusedField === 'email' ? '0 0 0 2px rgba(0, 200, 83, 0.4)' : 'none',
                      border: focusedField === 'email' ? '1px solid rgba(0, 200, 83, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px'
                    }}
                    className="w-full px-4 py-3.5 font-body text-sm text-white placeholder-[#a0a0b8]/40 focus:outline-none transition-all duration-300"
                  />
                </div>

                {/* Message field */}
                <div>
                  <label 
                    htmlFor="message" 
                    className="block font-body text-xs font-semibold tracking-wider text-[#a0a0b8] uppercase mb-2"
                  >
                    Message
                  </label>
                  <textarea 
                    id="message"
                    required
                    rows="4"
                    value={formState.message}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="How can I help you?"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      boxShadow: focusedField === 'message' ? '0 0 0 2px rgba(0, 200, 83, 0.4)' : 'none',
                      border: focusedField === 'message' ? '1px solid rgba(0, 200, 83, 0.8)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '16px'
                    }}
                    className="w-full px-4 py-3.5 font-body text-sm text-white placeholder-[#a0a0b8]/40 focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    background: status === 'error' 
                      ? 'linear-gradient(135deg, #ef4444, #f97316)' 
                      : 'linear-gradient(135deg, #00C853, #00E676)',
                    borderRadius: '12px'
                  }}
                  className="w-full py-4 relative font-body font-bold text-sm text-black tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_8px_30px_rgba(0,200,83,0.5)] hover:-translate-y-0.5"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending Message...
                    </span>
                  ) : status === 'success' ? (
                    <span>Message Sent Successfully!</span>
                  ) : status === 'error' ? (
                    <span>Transmission Failed. Try Again.</span>
                  ) : (
                    <>
                      <FaPaperPlane size={14} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </ScrollReveal>

      </div>

      <SectionPagination number="05" title="Contact" />
    </section>
  );
};

export default Contact;
