import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectQlue from './ProjectQlue';
import ProjectXpensia from './ProjectXpensia';
import ScrollReveal from './ScrollReveal';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

/* ─── Project Data ─────────────────────────────────────────── */
const projects = [
  {
    id: 'qlue',
    index: '01',
    title: 'Qlue',
    subtitle: 'AI-Powered Voice Interview Simulation App — v2',
    description:
      'A voice-based, AI-powered mock interview platform built with Flutter, Firebase, AWS (Lambda, S3, DynamoDB, Bedrock), Node.js, and Docker. It acts as a realistic AI interviewer that reads your resume, asks personalized questions, scores spoken answers in real time, and sends a detailed feedback report. Secured a Top 5 ranking out of all submissions at Project Space. Supports 4 modes: Resume-based technical, HR behavioural, Self-introduction coaching, and URL/Website-based tutoring.',
    modes: ['Resume Technical', 'HR Behavioural', 'Self-Introduction', 'URL Tutoring'],
    tech: ['Flutter', 'Dart', 'Node.js', 'AWS Lambda', 'AWS SAM', 'Bedrock (Nemotron + Claude)', 'Amazon Polly', 'Textract', 'DynamoDB', 'S3', 'Firebase Auth', 'API Gateway', 'WebSocket', 'FCM'],
    github: 'https://github.com/Rishi1435/Qlue-v2',
    metrics: [
      { value: '4', label: 'Interview Modes' },
      { value: '<2s', label: 'AI Response Time' },
      { value: '5', label: 'Polly AI Voices' },
    ],
    Visual: ProjectQlue,
    accentShade: 'rgba(0,200,83,0.07)',
  },
  {
    id: 'xpensia',
    index: '02',
    title: 'Xpensia',
    subtitle: 'Smart Cross-Platform Expense Tracker',
    description:
      'A feature-rich personal expense tracker that goes far beyond basic CRUD. Standout features include SMS auto-detection that reads bank messages to auto-populate expenses, biometric lock (fingerprint/face via local_auth), CSV & PDF export, and a glassmorphism UI. Backed by a Node.js/Express REST API with Firebase JWT validation, MongoDB Atlas for transaction storage, and fl_chart + table_calendar for rich data visualization — all deployed on the free tier.',
    tech: ['Flutter', 'Dart', 'Firebase Auth', 'Google Sign-In', 'Node.js', 'Express', 'MongoDB Atlas', 'fl_chart', 'table_calendar', 'local_auth', 'Render'],
    github: 'https://github.com/Rishi1435/Xpensia',
    metrics: [
      { value: '4', label: 'API Endpoints' },
      { value: 'SMS', label: 'Auto-Import' },
      { value: 'Bio', label: 'Biometric Lock' },
    ],
    Visual: ProjectXpensia,
    accentShade: 'rgba(0,200,83,0.05)',
  },
];

/* ─── Tech Badge ───────────────────────────────────────────── */
const TechBadge = ({ label, i }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: i * 0.05 }}
    whileHover={{ scale: 1.07, boxShadow: '0 0 10px rgba(0,200,83,0.3)' }}
    className="px-3 py-1 bg-[rgba(0,200,83,0.05)] border border-[rgba(0,200,83,0.18)] rounded-full text-[10px] font-mono text-accent tracking-wider uppercase cursor-default"
  >
    {label}
  </motion.span>
);

/* ─── Metric Chip ──────────────────────────────────────────── */
const Metric = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 text-center">
    <span className="font-display font-black text-accent text-xl md:text-2xl leading-none drop-shadow-[0_0_10px_rgba(0,200,83,0.5)]">
      {value}
    </span>
    <span className="font-mono text-[9px] text-text-secondary/50 tracking-widest uppercase">{label}</span>
  </div>
);

/* ─── Project Card ─────────────────────────────────────────── */
const ProjectCard = ({ project, reverse, cardIndex }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { index, title, subtitle, description, tech, github, metrics, Visual, accentShade } = project;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: cardIndex * 0.15 }}
      className="relative group w-full bg-[#070707] border border-[rgba(255,255,255,0.05)] rounded-3xl overflow-hidden hover:border-[rgba(0,200,83,0.25)] hover:shadow-[0_0_60px_rgba(0,200,83,0.07)] transition-all duration-500"
    >
      {/* Top scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-10" />

      {/* Ambient corner glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at ${reverse ? '100% 0%' : '0% 0%'}, ${accentShade} 0%, transparent 60%)` }}
      />

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? 'lg:grid-flow-dense' : ''}`}>

        {/* ── Visual Panel ─────────────────────────────────── */}
        <div className={`relative flex flex-col justify-between bg-[#040404] border-b ${reverse ? 'lg:border-b-0 lg:border-l lg:col-start-2' : 'lg:border-b-0 lg:border-r'} border-[rgba(255,255,255,0.04)] p-6 md:p-8 min-h-[240px] lg:min-h-[280px]`}>
          {/* Project number watermark */}
          <div className="absolute top-4 right-5 font-display font-black text-[5rem] leading-none text-accent/[0.04] select-none pointer-events-none group-hover:text-accent/[0.07] transition-colors duration-500">
            {index}
          </div>

          {/* Header */}
          <div className="relative z-10 mb-6">
            <span className="font-mono text-[10px] tracking-[0.3em] text-accent/50 uppercase block mb-1">{index} /</span>
            <h3 className="font-display font-black text-3xl md:text-4xl text-text-primary tracking-tight group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-sm text-accent/70 mt-1">{subtitle}</p>
          </div>

          {/* SVG Visual */}
          <div className="relative z-10 rounded-xl overflow-hidden">
            <Visual />
          </div>

          {/* Metrics strip */}
          <div className="relative z-10 mt-6 pt-5 border-t border-[rgba(0,200,83,0.08)] grid grid-cols-3 gap-4">
            {metrics.map((m) => <Metric key={m.label} {...m} />)}
          </div>
        </div>

        {/* ── Content Panel ────────────────────────────────── */}
        <div className={`flex flex-col justify-between p-8 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="font-mono text-[10px] text-accent/50 tracking-[0.3em] uppercase">// project overview</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,200,83,0.2)] to-transparent" />
            </div>
            <p className="font-body text-text-secondary text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[10px] text-accent/50 tracking-[0.3em] uppercase">// built with</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[rgba(0,200,83,0.2)] to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tech.map((t, i) => <TechBadge key={t} label={t} i={i} />)}
            </div>

            {/* GitHub CTA */}
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,200,83,0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-accent to-accent-glow text-primary-bg font-body font-bold text-sm tracking-[0.1em] uppercase rounded-xl transition-all duration-300"
            >
              <FaGithub size={16} />
              View Repository
              <FaExternalLinkAlt size={11} className="opacity-70" />
            </motion.a>
          </div>

        </div>
      </div>
    </motion.article>
  );
};

/* ─── Main Projects Component ──────────────────────────────── */
const Projects = () => (
  <section id="projects" className="relative bg-[#000000] overflow-hidden py-28">
    {/* Dot grid BG */}
    <div
      className="absolute inset-0 opacity-[0.022] pointer-events-none"
      style={{ backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)', backgroundSize: '28px 28px' }}
    />
    {/* Ambient glows */}
    <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,200,83,0.05)_0%,transparent_65%)] pointer-events-none" />
    <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,200,83,0.04)_0%,transparent_65%)] pointer-events-none" />

    <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

      {/* ── Section Header ────────────────────────────────── */}
      <ScrollReveal>
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="font-mono text-[11px] text-accent tracking-[0.35em] uppercase block mb-3"
          >
            // section_03 · featured_work
          </motion.span>
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
            <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black text-text-primary leading-none tracking-[-0.03em]">
              Featured{' '}
              <span className="text-accent relative">
                Projects
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] bg-accent rounded-full"
                  initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                />
              </span>
            </h2>
            <p className="font-body text-text-secondary text-sm max-w-sm leading-relaxed pb-1 hidden md:block opacity-70">
              Real products I've designed, built, and shipped end-to-end.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* ── Project Cards Stack ────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} reverse={i % 2 !== 0} cardIndex={i} />
        ))}
      </div>

      {/* ── Footer CTA ─────────────────────────────────────── */}
      <ScrollReveal delay={0.2}>
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-accent"
            />
            <span className="font-mono text-xs text-text-secondary/50 tracking-widest uppercase">More projects in progress</span>
          </div>
          <a
            href="https://github.com/Rishi1435"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs text-accent/70 hover:text-accent tracking-widest uppercase border-b border-accent/20 hover:border-accent transition-all duration-300 pb-0.5"
          >
            <FaGithub size={12} />
            github.com/Rishi1435
          </a>
        </div>
      </ScrollReveal>

    </div>
  </section>
);

export default Projects;
