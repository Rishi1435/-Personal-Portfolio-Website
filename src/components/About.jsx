import { useEffect, useState } from 'react';
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
    const duration = 1500; // 1.5s
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
    <div ref={ref} className="glass-card flex flex-col items-center justify-center gap-1.5 group p-6 transition-all duration-300">
      <div className="text-[2.6rem] md:text-[3.2rem] font-display font-black leading-none flex items-center">
        <span className="text-[#00C853] text-2xl mr-0.5">{prefix}</span>
        <span className="text-[#00E676] drop-shadow-[0_0_15px_rgba(0,230,118,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(0,230,118,0.7)] transition-all duration-300">{count}</span>
        <span className="text-[#00C853] text-2xl ml-0.5">{suffix}</span>
      </div>
      <div className="font-body text-xs font-semibold tracking-wider text-white uppercase text-center mt-1">{label}</div>
      {sub && <div className="font-body text-[11px] text-[#a0a0b8] text-center">{sub}</div>}
    </div>
  );
};

/* ─── Timeline Item ─────────────────────────────────────────── */
const TimelineItem = ({ role, company, period, desc, delay, isLast }) => (
  <ScrollReveal delay={delay} direction="left">
    <div className="relative flex gap-4">
      {/* Line + dot */}
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[#00C853] shadow-[0_0_10px_rgba(0,200,83,0.6)] flex-shrink-0 mt-1.5" />
        {!isLast && <div className="w-px flex-1 bg-gradient-to-b from-[#00C853]/40 to-transparent mt-1" />}
      </div>
      {/* Content */}
      <div className="pb-6 group">
        <span className="font-body text-[11px] text-[#00E676] font-medium tracking-wide uppercase">{period}</span>
        <h4 className="font-display font-bold text-white text-sm md:text-base mt-0.5 group-hover:text-[#00C853] transition-colors duration-300">{role}</h4>
        <p className="font-body text-xs text-[#00C853] font-medium mb-1.5">@ {company}</p>
        <p className="font-body text-[#a0a0b8] text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  </ScrollReveal>
);

/* ─── Achievement Badge ─────────────────────────────────────── */
const AchievementBadge = ({ icon, title, sub, delay }) => (
  <ScrollReveal delay={delay}>
    <div className="glass-card flex items-start gap-3 p-4 transition-all duration-300">
      <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="font-body text-white text-xs font-semibold leading-tight">{title}</p>
        <p className="font-body text-[11px] text-[#00E676]/80 mt-1">{sub}</p>
      </div>
    </div>
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
    { icon: '🎓', title: '4 Anthropic Certifications', sub: 'Completed in a single learning sprint (Apr 2026)', delay: 0.15 },
    { icon: '🏆', title: '1st Prize — CampusConnect Case Study', sub: 'Led 5-person team · Beat 14 universities nationally', delay: 0.2 },
    { icon: '🎯', title: 'Tech Fest Event Coordinator', sub: 'Directed coding contest · 200+ participants', delay: 0.25 },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden py-28"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ─────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase block">
                // 02 · ABOUT ME
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full shadow-sm backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                <span className="font-body text-[10px] text-white font-medium tracking-wider uppercase">AVAILABLE FOR OPPORTUNITIES</span>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black leading-none tracking-tight section-title">
                Who Am I?
              </h2>
              <p className="font-body text-[#a0a0b8] text-base max-w-xl leading-relaxed hidden md:block">
                A developer who turns ideas into scalable, real-world systems — from mobile screens to cloud infrastructure.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Stat Counters Row (Each individual glass-card with hover glow) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
          <ScrollReveal delay={0.05}><Counter target={18} suffix="+" label="Months Experience" sub="Trainee & Ambassador Roles" /></ScrollReveal>
          <ScrollReveal delay={0.12}><Counter target={500} suffix="+" label="LinkedIn Connections" sub="Professional Network" /></ScrollReveal>
          <ScrollReveal delay={0.19}><Counter target={6} suffix="" label="Technical Certifications" sub="Anthropic & Microsoft" /></ScrollReveal>
        </div>

        {/* ── Main Two-Column Grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 xl:gap-14 items-start">

          {/* ── LEFT (2 cols) ─────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-7">

            {/* Bio Card in glass-card class */}
            <ScrollReveal delay={0.1} direction="left">
              <div className="glass-card p-7 group">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
                  <span className="font-body text-xs text-[#00E676] font-semibold tracking-widest uppercase">bio.txt</span>
                </div>

                <p className="font-body text-[#a0a0b8] text-sm md:text-base leading-relaxed">
                  I'm a <span className="text-white font-semibold">Full Stack Developer</span> passionate about
                  building mobile apps and cloud-native systems. With{' '}
                  <span className="text-[#00C853] font-semibold">1.5+ years</span> of hands-on trainee and representative experience,
                  I've shipped Flutter apps, Node.js APIs, and{' '}
                  <span className="text-white font-semibold">AWS serverless architectures</span> that serve
                  real users at scale. Currently pursuing B.Tech in Computer Science at{' '}
                  <span className="text-white font-semibold">Aditya College of Engineering and Technology, Visakhapatnam</span>.
                </p>
              </div>
            </ScrollReveal>

            {/* Experience Timeline */}
            <ScrollReveal delay={0.2} direction="left">
              <div className="glass-card p-6 md:p-7">
                <div className="flex items-center gap-3 mb-7">
                  <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase">// EXPERIENCE</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
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
                  <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase">// ACHIEVEMENTS</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
                </div>
              </ScrollReveal>
              {achievements.map((a, i) => <AchievementBadge key={i} {...a} />)}
            </div>

          </div>

          {/* ── RIGHT (3 cols) — Enhanced Terminal Glass Box ────────── */}
          <ScrollReveal delay={0.15} direction="right" className="lg:col-span-3">
            <div className="sticky top-28 lg:top-28">

              {/* Profile image border & Glass Terminal card: border: 2px solid rgba(0, 200, 83, 0.4) with a soft glow */}
              <div 
                className="glass-card overflow-hidden group transition-all duration-300"
                style={{
                  border: '2px solid rgba(0, 200, 83, 0.4)',
                  boxShadow: '0 0 35px rgba(0, 200, 83, 0.2), 0 20px 50px rgba(0, 0, 0, 0.8)'
                }}
              >

                {/* Title Bar */}
                <div className="bg-white/[0.03] border-b border-white/10 px-5 py-4 flex items-center justify-between select-none">
                  <div className="flex gap-2 items-center">
                    {[['#FF5F56'], ['#FFBD2E'], ['#27C93F']].map(([bg], i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full cursor-default transition-transform hover:scale-110"
                        style={{ background: bg }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 font-body text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="text-[#00C853]">rishi</span>
                    <span className="text-[#a0a0b8]/50">@</span>
                    <span className="text-white">portfolio</span>
                    <span className="text-[#a0a0b8]/40">:~</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]/50" />
                    <span className="font-body text-[10px] text-[#a0a0b8] font-medium tracking-wider">zsh</span>
                  </div>
                </div>

                {/* Terminal Content */}
                <TerminalTyping />

                {/* Bottom status bar */}
                <div className="border-t border-white/10 bg-white/[0.02] px-5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3 font-body text-[10px] text-[#a0a0b8] font-medium tracking-wide">
                    <span className="text-[#00C853]">●</span>
                    <span>main</span>
                    <span className="text-white/10">|</span>
                    <span>node v20</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                    <span className="font-body text-[10px] text-[#00E676] font-semibold tracking-widest">LIVE</span>
                  </div>
                </div>

              </div>

              {/* Tech stack badges below terminal */}
              <div className="mt-6 flex flex-wrap gap-2.5 justify-center">
                {['Flutter', 'Node.js', 'AWS Lambda', 'Spring Boot', 'Docker', 'MongoDB', 'Firebase', 'React'].map((t) => (
                  <span
                    key={t}
                    style={{
                      background: 'rgba(0, 200, 83, 0.12)',
                      color: '#00C853',
                      border: '1px solid rgba(0, 200, 83, 0.3)'
                    }}
                    className="px-3.5 py-1.5 font-body text-xs font-semibold tracking-wide rounded-full cursor-default transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(0,200,83,0.3)]"
                  >
                    {t}
                  </span>
                ))}
              </div>

            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default About;
