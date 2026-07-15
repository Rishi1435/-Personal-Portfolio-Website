import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TerminalTyping from './TerminalTyping';
import ScrollReveal from './ScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';

/* ─── Animated Counter ─────────────────────────────────────── */
const Counter = ({ target, suffix = '', prefix = '', label, sub }) => {
  const prefersReducedMotion = useReducedMotion();
  const [count, setCount] = useState(() => prefersReducedMotion ? target : 0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;
    const duration = 1800; // 1.8s
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * target);
      setCount(currentVal);
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(updateCounter);
  }, [inView, target, prefersReducedMotion]);

  return (
    <div ref={ref} className="relative flex flex-col items-center gap-2 group p-6 rounded-2xl bg-[#080808]/80 border border-[rgba(0,200,83,0.12)] hover:border-[rgba(0,200,83,0.4)] hover:shadow-[0_0_30px_rgba(0,200,83,0.12)] transition-all duration-400 overflow-hidden">
      {/* Corner glow */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[radial-gradient(circle,rgba(0,200,83,0.1)_0%,transparent_70%)] pointer-events-none" />
      <div className="text-[2.6rem] md:text-[3.2rem] font-display font-black leading-none">
        <span className="text-text-secondary text-2xl">{prefix}</span>
        <span className="text-accent drop-shadow-[0_0_18px_rgba(0,200,83,0.5)] group-hover:drop-shadow-[0_0_28px_rgba(0,200,83,0.8)] transition-all duration-300">{count}</span>
        <span className="text-accent text-2xl">{suffix}</span>
      </div>
      <div className="font-mono text-[10px] tracking-widest text-text-secondary uppercase text-center">{label}</div>
      {sub && <div className="font-body text-[10px] text-accent/50 text-center">{sub}</div>}
    </div>
  );
};

/* ─── Timeline Item ─────────────────────────────────────────── */
const TimelineItem = ({ role, company, period, desc, delay, isLast }) => (
  <ScrollReveal delay={delay} direction="left">
    <div className="relative flex gap-4">
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_rgba(0,200,83,0.6)] flex-shrink-0 mt-1" />
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-accent/40 to-transparent mt-1" />}
      </div>
      {/* Content */}
      <div className="pb-6 group">
        <span className="font-mono text-[9px] text-accent/70 tracking-widest uppercase">{period}</span>
        <h4 className="font-display font-bold text-text-primary text-sm md:text-base mt-0.5 group-hover:text-accent transition-colors duration-300">{role}</h4>
        <p className="font-mono text-[10px] text-accent/60 mb-1.5">@ {company}</p>
        <p className="font-body text-text-secondary text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  </ScrollReveal>
);

/* ─── Achievement Badge ─────────────────────────────────────── */
const AchievementBadge = ({ icon, title, sub, delay }) => (
  <ScrollReveal delay={delay}>
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 0 25px rgba(0,200,83,0.15)' }}
      className="flex items-start gap-3 bg-[#080808]/80 border border-[rgba(0,200,83,0.12)] rounded-xl p-4 transition-all duration-300"
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="font-body text-text-primary text-xs font-semibold leading-tight">{title}</p>
        <p className="font-mono text-[9px] text-accent/60 mt-0.5 tracking-wider">{sub}</p>
      </div>
    </motion.div>
  </ScrollReveal>
);

/* ─── Main About Component ──────────────────────────────────── */
const About = () => {
  const timeline = [
    {
      role: 'Campus Ambassador & Trainee',
      company: 'LinkedIn',
      period: 'Sep 2025 – Present',
      desc: 'Representing LinkedIn Learning at my college. Promoting professional development, digital skills, and learning resources across the student community.',
    },
    {
      role: 'Flutter Trainee',
      company: 'Technical Hub',
      period: 'May 2025 – Present',
      desc: 'Focusing on cross-platform mobile app development, building real-world projects, and integrating with advanced cloud backends.',
    },
    {
      role: 'Cloud Computing Intern',
      company: 'APSSDC',
      period: 'Prior Experience',
      desc: 'Deployed AWS serverless infrastructure and architected real-time AI services using Lambda + DynamoDB.',
    },
  ];

  const achievements = [
    { icon: '🚀', title: 'Top 5 Project Ranking — Qlue', sub: 'Ranked in the Top 5 among 160+ projects at Project Space', delay: 0.1 },
    { icon: '🎓', title: '4 Anthropic Certifications', sub: 'Completed in a single learning sprint (Apr 2026)', delay: 0.18 },
    { icon: '🏆', title: '1st Prize — CampusConnect Case Study', sub: 'Led 5-person team · Beat 14 universities nationally', delay: 0.26 },
    { icon: '🎯', title: 'Tech Fest Event Coordinator', sub: 'Directed coding contest · 200+ participants', delay: 0.34 },
  ];

  return (
    <section
      id="about"
      className="relative bg-[#000000] overflow-hidden py-28"
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />
      {/* Left ambient glow */}
      <div className="absolute -left-32 top-1/3 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,200,83,0.06)_0%,transparent_65%)] pointer-events-none" />
      {/* Right ambient glow */}
      <div className="absolute -right-32 bottom-1/3 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(0,200,83,0.04)_0%,transparent_65%)] pointer-events-none" />

      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ─────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="font-mono text-[11px] text-accent tracking-[0.35em] uppercase block"
              >
                // section_01 · about_me
              </motion.span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgba(0,200,83,0.1)] border border-[rgba(0,200,83,0.35)] rounded-full shadow-[0_0_12px_rgba(0,200,83,0.25)]">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span className="font-mono text-[9px] text-accent font-bold tracking-widest uppercase">● ONLINE — OPEN FOR OPPORTUNITIES</span>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black text-text-primary leading-none tracking-[-0.03em]">
                Who Am <span className="text-accent relative">
                  I<span className="text-accent">?</span>
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[3px] bg-accent rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />
                </span>
              </h2>
              <p className="font-body text-text-secondary text-base max-w-xl leading-relaxed hidden md:block">
                A developer who turns ideas into scalable, real-world systems — from mobile screens to cloud infrastructure.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Stat Counters Row ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-14">
          <ScrollReveal delay={0.05}><Counter target={18} suffix="+" label="Months Experience" sub="Trainee & Ambassador Roles" /></ScrollReveal>
          <ScrollReveal delay={0.12}><Counter target={500} suffix="+" label="LinkedIn Connections" sub="Professional Network" /></ScrollReveal>
          <ScrollReveal delay={0.19}><Counter target={6} suffix="" label="Technical Certifications" sub="Anthropic & Microsoft" /></ScrollReveal>
        </div>

        {/* ── Main Two-Column Grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-14 items-start">

          {/* ── LEFT (3 cols) ─────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-7">

            {/* Bio Card */}
            <ScrollReveal delay={0.1} direction="left">
              <div className="relative bg-[#070707] border border-[rgba(0,200,83,0.15)] rounded-2xl p-7 overflow-hidden group hover:border-[rgba(0,200,83,0.3)] transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-25 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[radial-gradient(circle,rgba(0,200,83,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase">bio.txt</span>
                </div>

                {/* Large decorative quote */}
                <div className="text-6xl text-accent/10 font-display font-black leading-none mb-2 select-none">"</div>
                <p className="font-body text-text-secondary text-sm md:text-base leading-relaxed -mt-4">
                  I'm a <span className="text-text-primary font-semibold">Full Stack Developer</span> passionate about
                  building mobile apps and cloud-native systems. With{' '}
                  <span className="text-accent font-semibold">1.5+ years</span> of hands-on trainee and representative experience,
                  I've shipped Flutter apps, Node.js APIs, and{' '}
                  <span className="text-text-primary font-semibold">AWS serverless architectures</span> that serve
                  real users at scale. Currently pursuing B.Tech in Computer Science at{' '}
                  <span className="text-text-primary font-semibold">Aditya College of Engineering and Technology, Visakhapatnam</span>.
                </p>
              </div>
            </ScrollReveal>

            {/* Experience Timeline */}
            <ScrollReveal delay={0.2} direction="left">
              <div className="bg-[#070707] border border-[rgba(0,200,83,0.15)] rounded-2xl p-6 md:p-7">
                <div className="flex items-center gap-3 mb-7">
                  <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase">// experience</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,200,83,0.3)] to-transparent" />
                </div>
                <div className="flex flex-col">
                  {timeline.map((item, i) => (
                    <TimelineItem key={i} {...item} delay={0.05 * i} isLast={i === timeline.length - 1} />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Achievements */}
            <div className="flex flex-col gap-3">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-[10px] text-accent tracking-[0.25em] uppercase">// achievements</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,200,83,0.3)] to-transparent" />
                </div>
              </ScrollReveal>
              {achievements.map((a, i) => <AchievementBadge key={i} {...a} />)}
            </div>

          </div>

          {/* ── RIGHT (3 cols) — Enhanced Terminal ────────── */}
          <ScrollReveal delay={0.15} direction="right" className="lg:col-span-3">
            <div className="sticky top-28 lg:top-28">

              {/* Outer glow frame */}
              <div className="absolute -inset-1 rounded-2xl bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,200,83,0.08)_0%,transparent_60%)] pointer-events-none" />

              <div className="relative bg-[#070707] border border-[rgba(0,200,83,0.22)] rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,200,83,0.07),0_25px_60px_rgba(0,0,0,0.8)] hover:shadow-[0_0_100px_rgba(0,200,83,0.12)] transition-shadow duration-500 group">

                {/* Top glow line */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500" />

                {/* Title Bar */}
                <div className="bg-[#090909] border-b border-[rgba(0,200,83,0.1)] px-5 py-4 flex items-center justify-between select-none">
                  <div className="flex gap-2 items-center">
                    {[['#FF5F56', '#ff5f5666'], ['#FFBD2E', '#ffbd2e66'], ['#27C93F', '#27c93f66']].map(([bg, shadow], i) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.3, boxShadow: `0 0 8px ${shadow}` }}
                        className="w-3 h-3 rounded-full cursor-default transition-shadow"
                        style={{ background: bg }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-accent"
                    />
                    <span className="text-accent">rishi</span>
                    <span className="text-text-secondary/50">@</span>
                    <span className="text-text-secondary">portfolio</span>
                    <span className="text-text-secondary/30">:~</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/30" />
                    <span className="font-mono text-[9px] text-text-secondary/30 tracking-widest">zsh</span>
                  </div>
                </div>

                {/* Terminal Content */}
                <TerminalTyping />

                {/* Bottom status bar */}
                <div className="border-t border-[rgba(0,200,83,0.08)] bg-[#060606] px-5 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3 font-mono text-[9px] text-text-secondary/30 tracking-wider">
                    <span className="text-accent/40">●</span>
                    <span>main</span>
                    <span className="text-text-secondary/20">|</span>
                    <span>node v20</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-accent"
                    />
                    <span className="font-mono text-[9px] text-accent/50 tracking-widest">LIVE</span>
                  </div>
                </div>

              </div>

              {/* Tech stack pills below terminal */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-5 flex flex-wrap gap-2 justify-center"
              >
                {['Flutter', 'Node.js', 'AWS Lambda', 'Spring Boot', 'Docker', 'MongoDB', 'Firebase', 'React'].map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    whileHover={{ scale: 1.1, boxShadow: '0 0 12px rgba(0,200,83,0.3)' }}
                    className="px-3 py-1.5 font-mono text-[10px] tracking-wider uppercase border border-[rgba(0,200,83,0.2)] text-accent/80 bg-[rgba(0,200,83,0.04)] rounded-full cursor-default"
                  >
                    {t}
                  </motion.span>
                ))}
              </motion.div>

            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default About;
