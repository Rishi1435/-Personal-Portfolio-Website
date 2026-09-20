import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { qlue } from '../data/qlue';
import ScrollReveal from '../components/ScrollReveal';
import VoiceConcierge from '../components/VoiceConcierge';

// Heavy interactive pieces — code-split so the route stays light until reached.
const QlueArchitecture = lazy(() => import('../components/QlueArchitecture'));
const ProjectQlue = qlue.Visual;

/*
 * /qlue-live — the dedicated Qlue demonstration screen. Reached from the "Live
 * Demonstration" button on the Qlue project card. It brings together everything
 * that used to be scattered on the main portfolio: the AI voice concierge (here
 * embedded inline rather than a floating orb), the real request-pipeline
 * architecture diagram, and Qlue's complete project detail.
 */
const QlueLive = () => {
  // This screen opens at the top regardless of where the visitor scrolled from.
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen">
      {/* ── Top bar with a back link ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-white/10">
        <div className="container max-w-[1280px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-[#a0a0b8] hover:text-white transition-colors cursor-hover"
          >
            <FaArrowLeft size={13} />
            Back to portfolio
          </Link>
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest hidden sm:block">
            Qlue · Live Demonstration
          </span>
        </div>
      </header>

      <main className="container max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20">

        {/* ── Hero ───────────────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">
              // FLAGSHIP · LIVE DEMO
            </span>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
              <span className="font-body text-[10px] text-[var(--color-accent-glow)] font-medium tracking-wider uppercase">Interactive</span>
            </div>
          </div>
          <h1 className="text-[clamp(2.8rem,7vw,5rem)] font-display font-black leading-[0.95] tracking-tight section-title">
            {qlue.title}
          </h1>
          <p className="font-body text-sm md:text-base text-[var(--color-accent)] font-medium mt-3 tracking-wide uppercase">
            {qlue.subtitle}
          </p>
          <p className="font-body text-[#a0a0b8] text-sm md:text-base leading-relaxed mt-6 max-w-3xl">
            {qlue.description}
          </p>

          {/* Metrics strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-8">
            {qlue.metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col items-center text-center">
                <span className="font-display font-black text-xl md:text-2xl text-[var(--color-accent-glow)] drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent-glow)_35%,transparent)]">
                  {m.value}
                </span>
                <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wider uppercase mt-1">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href={qlue.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-xl font-body font-bold text-xs tracking-wider uppercase border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors cursor-hover"
            >
              <FaGithub size={16} />
              View on GitHub
              <FaExternalLinkAlt size={11} className="opacity-70" />
            </a>
          </div>
        </ScrollReveal>

        {/* ── AI voice concierge (embedded) ──────────────────── */}
        <section className="mt-20" aria-label="AI voice concierge demo">
          <div className="flex flex-col items-center text-center mb-8">
            <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block mb-2">
              // TRY THE AI VOICE
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
              Talk to the interviewer
            </h2>
            <p className="font-body text-[#a0a0b8] text-sm mt-2 max-w-lg">
              The same voice + chat pipeline Qlue uses. Tap the mic and ask about Rishi, or type a question — it answers out loud.
            </p>
          </div>
          <VoiceConcierge embedded />
        </section>

        {/* ── Architecture pipeline ──────────────────────────── */}
        <section className="mt-24" aria-label="Qlue architecture pipeline">
          <div className="flex flex-col items-center text-center mb-10">
            <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block mb-2">
              // UNDER THE HOOD
            </span>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
              The Qlue pipeline
            </h2>
            <p className="font-body text-[#a0a0b8] text-sm mt-2 max-w-lg">
              How a spoken answer travels from the phone to the model and back in under two seconds. Trace a request to see each hop.
            </p>
          </div>
          <Suspense fallback={<div className="min-h-[280px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />}>
            <QlueArchitecture />
          </Suspense>
        </section>

        {/* ── Modes + tech ───────────────────────────────────── */}
        <section className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollReveal>
            <div className="glass-card p-6 md:p-7 h-full">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-body text-xs text-white/40 font-semibold tracking-widest uppercase">// 4 INTERVIEW MODES</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {qlue.modes.map((mode, i) => (
                  <div key={mode} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                    <span className="font-display font-black text-lg text-[var(--color-accent)]/40 select-none">0{i + 1}</span>
                    <span className="font-body text-sm text-white font-medium">{mode}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="glass-card p-6 md:p-7 h-full">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-body text-xs text-white/40 font-semibold tracking-widest uppercase">// BUILT WITH</span>
                <div className="flex-1 h-px bg-gradient-to-r from-white/[0.06] to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2">
                {qlue.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3.5 py-1 text-xs font-body font-semibold tracking-wide bg-white/[0.05] border border-white/[0.08] text-white/70 rounded-full select-none hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-accent)] transition-all duration-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── Visual mockup ──────────────────────────────────── */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">// THE APP</span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06] p-2"
          >
            {ProjectQlue && <ProjectQlue />}
          </motion.div>
        </section>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <div className="mt-24 flex flex-col items-center text-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-body text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-glow)] font-semibold tracking-wider uppercase border-b border-[var(--color-accent)]/30 hover:border-[var(--color-accent-glow)] transition-all duration-300 pb-0.5 cursor-hover"
          >
            <FaArrowLeft size={12} />
            Back to the full portfolio
          </Link>
        </div>
      </main>
    </div>
  );
};

export default QlueLive;
