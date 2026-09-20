import { lazy, Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaMicrophone } from 'react-icons/fa';
import { qlue } from '../data/qlue';
import ScrollReveal from '../components/ScrollReveal';
import VoiceConcierge from '../components/VoiceConcierge';

// Heavy interactive pieces — code-split so the route stays light until reached.
const QlueArchitecture = lazy(() => import('../components/QlueArchitecture'));
const ProjectQlue = qlue.Visual;

/*
 * /qlue-live — the dedicated Qlue demonstration screen, reached from the "Live
 * Demonstration" button on the Qlue project card. A product-landing layout: a
 * two-column hero (pitch + live app mockup) leads into the three interactive
 * proofs — the AI voice concierge, the real request pipeline, and the modes /
 * stack detail.
 */
const SectionHead = ({ kicker, title, subtitle }) => (
  <div className="flex flex-col items-center text-center mb-10">
    <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block mb-2">
      {kicker}
    </span>
    <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">{title}</h2>
    {subtitle && <p className="font-body text-[#a0a0b8] text-sm mt-2 max-w-lg">{subtitle}</p>}
  </div>
);

const QlueLive = () => {
  // This screen opens at the top regardless of where the visitor scrolled from.
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen">
      {/* ── Top bar with a back link ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[rgba(8,8,8,0.85)] backdrop-blur-[20px] border-b border-white/10">
        <div className="container max-w-[1200px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
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

      <main className="container max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-16">

        {/* ── Hero: pitch + live app mockup ──────────────────── */}
        <ScrollReveal>
          <section className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            {/* Pitch */}
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">
                  // FLAGSHIP · LIVE DEMO
                </span>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
                  <span className="font-body text-[10px] text-[var(--color-accent-glow)] font-medium tracking-wider uppercase">Interactive</span>
                </div>
              </div>
              <h1 className="text-[clamp(2.4rem,5.5vw,3.75rem)] font-display font-black leading-[0.95] tracking-tight section-title">
                {qlue.title}
              </h1>
              <p className="font-body text-sm md:text-base text-[var(--color-accent)] font-medium mt-3 tracking-wide uppercase">
                {qlue.subtitle}
              </p>
              <p className="font-body text-[#a0a0b8] text-sm md:text-[15px] leading-relaxed mt-5 max-w-xl">
                {qlue.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href="#try"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-body font-bold text-xs tracking-wider uppercase bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-glow)] shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-colors duration-300 cursor-hover"
                >
                  <FaMicrophone size={13} />
                  Try the live voice
                </a>
                <a
                  href={qlue.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-body font-bold text-xs tracking-wider uppercase border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors cursor-hover"
                >
                  <FaGithub size={16} />
                  View on GitHub
                  <FaExternalLinkAlt size={10} className="opacity-70" />
                </a>
              </div>
            </div>

            {/* Live app mockup */}
            <div className="relative">
              <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-accent)_12%,transparent)_0%,transparent_70%)] pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/[0.08] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                {ProjectQlue && <ProjectQlue />}
              </div>
            </div>
          </section>

          {/* Metrics strip — full width under the hero */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-12">
            {qlue.metrics.map((m) => (
              <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col items-center text-center">
                <span className="font-display font-black text-xl md:text-2xl text-[var(--color-accent-glow)] drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent-glow)_35%,transparent)]">
                  {m.value}
                </span>
                <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wider uppercase mt-1.5 leading-tight">{m.label}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* ── AI voice concierge (embedded) ──────────────────── */}
        <section id="try" className="mt-24 scroll-mt-24" aria-label="AI voice concierge demo">
          <SectionHead
            kicker="// TRY THE AI VOICE"
            title="Talk to the interviewer"
            subtitle="The same voice + chat pipeline Qlue uses. Tap the mic and ask about Rishi, or type a question — it answers out loud."
          />
          <VoiceConcierge embedded />
        </section>

        {/* ── Architecture pipeline ──────────────────────────── */}
        <section className="mt-24" aria-label="Qlue architecture pipeline">
          <SectionHead
            kicker="// UNDER THE HOOD"
            title="The Qlue pipeline"
            subtitle="How a spoken answer travels from the phone to the model and back in under two seconds. Trace a request to see each hop."
          />
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
