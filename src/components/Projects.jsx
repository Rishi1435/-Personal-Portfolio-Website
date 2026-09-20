import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectXpensia from './ProjectXpensia';
import ProjectMedia from './ProjectMedia';
import ScrollReveal from './ScrollReveal';
import { qlue } from '../data/qlue';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaStar, FaCodeBranch } from 'react-icons/fa';

/* ─── Featured Project Data ────────────────────────────────── */
// Qlue is the single source of truth in src/data/qlue.js (shared with /qlue-live).
const projects = [
  qlue,
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
      { value: '4', label: 'API Endpoints', note: 'POST/GET/PUT/DELETE on /transactions (Node + Express).' },
      { value: 'SMS', label: 'Auto-Import', note: 'Parses bank SMS to auto-populate expense entries.' },
      { value: 'Bio', label: 'Biometric Lock', note: 'Fingerprint / face unlock via Flutter local_auth.' },
    ],
    Visual: ProjectXpensia,
    status: 'SOURCE',
    featured: false,
  },
];

/* ─── Categorized 12 Projects Data ─────────────────────────── */
const categorizedProjects = [
  {
    category: 'BACKEND & DISTRIBUTED SYSTEMS',
    count: '05',
    projects: [
      {
        id: 'cqrs',
        index: '03',
        title: 'Event-Driven CQRS',
        description: 'Event-Driven CQRS architecture with Apache Kafka, Kafka Streams, and Materialized Views',
        tech: ['Java', 'Spring Boot', 'Apache Kafka', 'Kafka Streams', 'PostgreSQL'],
        github: 'https://github.com/Rishi1435/Event-Driven-CQRS',
        badge: 'BACKEND · KAFKA · JAVA',
        status: 'ARCHIVED'
      },
      {
        id: 'cart',
        index: '04',
        title: 'Distributed Shopping Cart Service',
        description: 'High-performance distributed shopping cart with Spring Boot and Redis caching for sub-10ms reads',
        tech: ['Java', 'Spring Boot', 'Redis', 'Docker'],
        github: 'https://github.com/Rishi1435/Distributed-Shopping-Cart-Service',
        badge: 'SPRING BOOT · REDIS · DISTRIBUTED',
        status: 'SOURCE'
      },
      {
        id: 'notification',
        index: '05',
        title: 'Event-Driven Notification Service',
        description: 'Scalable event-driven notification service with message queues and idempotency guarantees',
        tech: ['Node.js', 'RabbitMQ/Kafka', 'PostgreSQL'],
        github: 'https://github.com/Rishi1435/Event-Driven-Notification-Service',
        badge: 'NODE.JS · MICROSERVICE · QUEUE',
        status: 'SOURCE'
      },
      {
        id: 'property',
        index: '06',
        title: 'Multi-Region Property Listing Backend',
        description: 'Multi-region backend with NGINX load balancing, PostgreSQL replication, and Kafka messaging',
        tech: ['Node.js', 'NGINX', 'PostgreSQL', 'Kafka'],
        github: 'https://github.com/Rishi1435/Multi-Region-Property-Listing-Backend',
        badge: 'MULTI-REGION · NGINX · KAFKA',
        status: 'ARCHIVED'
      },
      {
        id: 'csvexport',
        index: '07',
        title: 'CSV Export Service',
        description: 'Large-scale async CSV export with streaming and real-time progress tracking',
        tech: ['Node.js', 'Streams', 'Redis'],
        github: 'https://github.com/Rishi1435/CSV-Export-Service-with-Async-Streaming-and-Progress-Tracking',
        badge: 'ASYNC · STREAMING · NODE.JS',
        status: 'SOURCE'
      }
    ]
  },
  {
    category: 'FULL-STACK & MOBILE APPS',
    count: '03',
    projects: [
      {
        id: 'saas',
        index: '08',
        title: 'Multi-Tenant SaaS Platform',
        description: 'Full-stack multi-tenant SaaS with project and task management, role-based access, and isolated workspaces',
        tech: ['JavaScript', 'Node.js', 'PostgreSQL', 'React'],
        github: 'https://github.com/Rishi1435/Multi-Tenant-SaaS-Platform-with-Project-Task-Management',
        badge: 'SAAS · MULTI-TENANT · FULL-STACK',
        status: 'SOURCE'
      },
      {
        id: 'fintrack',
        index: '09',
        title: 'FinTrack - Personal Finance App',
        description: 'Full-stack personal finance tracker with Node.js backend and Flutter mobile frontend',
        tech: ['Flutter', 'Dart', 'Node.js', 'MongoDB'],
        github: 'https://github.com/Rishi1435/FinTrack-Personal-Finance-Mobile-App',
        badge: 'FLUTTER · FINANCE · FULL-STACK',
        status: 'SOURCE'
      },
      {
        id: 'payment',
        index: '10',
        title: 'Payment Gateway',
        description: 'Multi-method payment gateway with hosted checkout, webhook support, and fraud detection hooks',
        tech: ['JavaScript', 'Node.js', 'Stripe API'],
        github: 'https://github.com/Rishi1435/Payment-Gateway',
        badge: 'PAYMENTS · NODE.JS · CHECKOUT',
        status: 'SOURCE'
      }
    ]
  },
  {
    category: 'AI / ML & CLOUD INFRA',
    count: '04',
    projects: [
      {
        id: 'objectdetection',
        index: '11',
        title: 'Real-Time Object Detection API',
        description: 'Real-time object detection REST API and web app powered by YOLOv8',
        tech: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV'],
        github: 'https://github.com/Rishi1435/Real-Time-Object-Detection-API-and-Web-App',
        badge: 'AI · YOLOV8 · PYTHON',
        status: 'SOURCE'
      },
      {
        id: 'promptrouter',
        index: '12',
        title: 'LLM Prompt Router',
        description: 'LLM-powered intent classification router that intelligently routes prompts to appropriate models',
        tech: ['Python', 'OpenAI API', 'LangChain'],
        github: 'https://github.com/Rishi1435/LLM-Prompt-Router-with-Intent-Classification',
        badge: 'AI · LLM · PYTHON',
        status: 'SOURCE'
      },
      {
        id: 'textract',
        index: '13',
        title: 'Invoice Processor AWS Textract',
        description: 'Automated invoice processing pipeline with AWS Textract, S3, and DynamoDB',
        tech: ['Python', 'AWS Textract', 'S3', 'DynamoDB'],
        github: 'https://github.com/Rishi1435/Automated-Invoice-Processing-Pipeline-AWS-Textract',
        badge: 'AWS · TEXTRACT · PIPELINE',
        status: 'SOURCE'
      },
      {
        id: 'cloudresume',
        index: '14',
        title: 'AWS Serverless Cloud Resume API',
        description: 'AWS Cloud Resume API with Lambda, DynamoDB, API Gateway, and CI/CD via GitHub Actions',
        tech: ['Python', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'GitHub Actions'],
        github: 'https://github.com/Rishi1435/AWS-Serverless-Cloud-Resume-API',
        badge: 'AWS · SERVERLESS · API',
        status: 'SOURCE'
      }
    ]
  }
];

/* Repo slugs already featured on this page (Qlue, Xpensia + the categorized
   grid) — excluded from the live GitHub grid so nothing is shown twice. Derived
   from the same data the cards render from, so it stays in sync automatically. */
const PORTFOLIO_REPO_SLUGS = [
  ...projects.map((p) => p.github),
  ...categorizedProjects.flatMap((c) => c.projects.map((p) => p.github)),
]
  .filter(Boolean)
  .map((url) => url.split('/').pop().toLowerCase());

/* ─── Sub-Component: Tech Badge (de-greened — green only on hover) ── */
const TechBadge = ({ label, i }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.25, delay: i * 0.03 }}
    className="px-3.5 py-1 text-xs font-body font-semibold tracking-wide bg-white/[0.05] border border-white/[0.08] text-white/70 rounded-full select-none hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/15 hover:text-[var(--color-accent)] transition-all duration-300"
  >
    {label}
  </motion.span>
);

/* ─── Animated stat value — counts up from 0 on first view (integers only) ─── */
const AnimatedNumber = ({ value }) => {
  const isNumeric = /^\d+$/.test(String(value));
  const target = isNumeric ? parseInt(value, 10) : 0;
  const prefersReducedMotion = useReducedMotion();
  const [n, setN] = useState(() => (!isNumeric || prefersReducedMotion ? target : 0));
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    if (!isNumeric || prefersReducedMotion || !inView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else setN(target);
    };
    requestAnimationFrame(tick);
  }, [inView, isNumeric, prefersReducedMotion, target]);

  return <span ref={ref}>{isNumeric ? n : value}</span>;
};

/* ─── Metric card with count-up + provenance affordance ─────── */
const MetricCard = ({ value, label, note, size = 'sm' }) => {
  const [open, setOpen] = useState(false);
  const lg = size === 'lg';
  return (
    <div className={`relative flex flex-col items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] group hover:border-[var(--color-accent)]/40 transition-all duration-300 ${lg ? 'p-4 rounded-2xl' : 'p-3'}`}>
      {note && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={`How “${label}” is measured`}
          title={note}
          className="absolute top-1.5 right-1.5 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white/40 border border-white/15 hover:text-[var(--color-accent-glow)] hover:border-[var(--color-accent-glow)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--color-accent-glow)]"
        >
          i
        </button>
      )}
      <span className={`font-display font-black text-[var(--color-accent-glow)] drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent-glow)_40%,transparent)] group-hover:scale-105 transition-transform ${lg ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
        <AnimatedNumber value={value} />
      </span>
      <span className={`font-body text-[#a0a0b8] font-medium tracking-wider uppercase text-center ${lg ? 'text-[10px] mt-1.5' : 'text-[10px] mt-1'}`}>
        {label}
      </span>
      {open && note && (
        <p role="note" className="mt-2 text-[10px] leading-snug font-body text-white/60 text-center normal-case">
          {note}
        </p>
      )}
    </div>
  );
};

/* ─── Sub-Component: Magnetic Button ───────────────────────── */
const MagneticButton = ({ href, children, className = '', featured = false }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxMove = featured ? 6 : 4;
    const moveX = (x / rect.width) * maxMove * 2;
    const moveY = (y / rect.height) * maxMove * 2;
    btnRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
  };

  const handleMouseLeave = () => {
    if (!btnRef.current) return;
    btnRef.current.style.transform = 'translate(0, 0)';
  };

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, boxShadow: '0 0 30px color-mix(in srgb, var(--color-accent) 40%, transparent)' }}
      whileTap={{ scale: 0.97 }}
      className={className}
      style={{
        border: '1px solid var(--color-accent)',
        color: 'var(--color-accent)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, color 0.3s ease',
      }}
    >
      {children}
    </motion.a>
  );
};

/* ─── Featured Project Card (Qlue — flagship, refined & compact) ─────────
   Text lives on the content side; the animated app mockup + a tight metrics
   strip anchor the media side. Smaller type scale and lighter padding so the
   flagship reads as polished rather than oversized. */
const FeaturedProjectCard = ({ project }) => {
  const { index, title, subtitle, description, tech, github, metrics, Visual, status, video, poster, demo } = project;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.article
      ref={ref}
      id={`${project.id}-card`}
      style={{ scrollMarginTop: '90px' }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card-featured group overflow-hidden"
    >
      {/* Flagship hairline glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* ── Media Panel (the product) ───────────────────── */}
        <div className="p-5 md:p-6 flex flex-col gap-5 bg-gradient-to-br from-white/[0.02] to-transparent border-b lg:border-b-0 lg:border-r border-white/[0.06]">
          {/* Flagship tag + status */}
          <div className="flex items-center justify-between relative z-10">
            <span className="inline-flex items-center gap-2 font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)]" />
              Flagship
            </span>
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full font-body text-[10px] font-semibold tracking-wider uppercase ${status === 'ARCHIVED' ? 'bg-white/5 border border-white/10 text-white/50' : 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25 text-[var(--color-accent-glow)]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'ARCHIVED' ? 'bg-white/30' : 'bg-[var(--color-accent-glow)] animate-pulse'}`} />
              <span>{status || 'SOURCE'}</span>
            </div>
          </div>

          {/* Visual — video loop when available, else animated SVG mockup */}
          <div className="relative z-10 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06] p-2">
            <ProjectMedia webm={video} poster={poster} Fallback={Visual} label={`${title} demo`} />
          </div>

          {/* Metrics strip — compact */}
          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {metrics.map((m) => <MetricCard key={m.label} size="sm" {...m} />)}
          </div>
        </div>

        {/* ── Content Panel ───────────────────────────────── */}
        <div className="flex flex-col p-5 md:p-6 relative z-10">

          {/* Title block */}
          <div className="flex items-start gap-3 mb-4">
            <span className="font-display font-bold text-base text-white/15 select-none leading-none pt-1.5">{index}</span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight leading-[0.95] group-hover:text-[var(--color-accent-glow)] transition-colors duration-500">
                {title}
              </h3>
              <p className="font-body text-[11px] sm:text-xs text-[var(--color-accent)] font-medium mt-1.5 tracking-wide uppercase">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Overview — clamped; full detail lives on /qlue-live */}
          <p className="font-body text-[#a0a0b8] text-sm leading-relaxed line-clamp-4">
            {description}
          </p>

          {/* Tech Stack — a curated slice keeps the card tight */}
          <div className="flex flex-wrap gap-2 mt-5">
            {tech.slice(0, 7).map((t, i) => <TechBadge key={t} label={t} i={i} />)}
            {tech.length > 7 && (
              <span className="px-3 py-1 text-xs font-body font-semibold tracking-wide text-white/40 select-none self-center">
                +{tech.length - 7} more
              </span>
            )}
          </div>

          {/* CTAs — Live Demonstration (in-app route) + GitHub */}
          <div className="flex flex-wrap items-center gap-3 mt-auto pt-6">
            {demo && (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to={demo}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-body font-bold text-xs tracking-wider uppercase bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-glow)] shadow-[0_0_30px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-colors duration-300 cursor-hover"
                >
                  <FaPlay size={12} />
                  Live Demonstration
                </Link>
              </motion.div>
            )}
            <MagneticButton
              href={github}
              featured={true}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-transparent font-body font-bold text-xs tracking-wider uppercase rounded-xl hover:!bg-[var(--color-accent)] hover:!text-white cursor-hover"
            >
              <FaGithub size={16} />
              View on GitHub
              <FaExternalLinkAlt size={10} className="opacity-70" />
            </MagneticButton>
          </div>

        </div>
      </div>
    </motion.article>
  );
};

/* ─── Standard Project Card (e.g. Xpensia) ─────────────────── */
const ProjectCard = ({ project, reverse }) => {
  const { index, title, subtitle, description, tech, github, metrics, Visual, status, video, poster } = project;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.article
      ref={ref}
      id={`${project.id}-card`}
      style={{ scrollMarginTop: '90px' }}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card group overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        
        {/* ── Visual Panel ────────────────────────────────── */}
        <div className={`p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white/[0.02] to-transparent border-b lg:border-b-0 ${reverse ? 'lg:border-l lg:order-2 border-white/[0.06]' : 'lg:border-r border-white/[0.06]'}`}>
          
          {/* Top meta row */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-3xl text-white/10 select-none">
                {index}
              </span>
              <div className="h-4 w-px bg-white/10" />
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-body text-[10px] font-semibold tracking-wider uppercase ${status === 'ARCHIVED' ? 'text-white/50' : 'text-[var(--color-accent-glow)]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'ARCHIVED' ? 'bg-white/30' : 'bg-[var(--color-accent-glow)] animate-pulse'}`} />
                <span>{status || 'SOURCE'}</span>
              </div>
            </div>
            <span className="font-body text-xs text-white/30 font-bold tracking-widest uppercase">
              // FEATURED
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight leading-none group-hover:text-[var(--color-accent-glow)] transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-[var(--color-accent)] font-medium mt-2 tracking-wide uppercase">
              {subtitle}
            </p>
          </div>

          {/* Visual — video loop when available, else animated SVG mockup */}
          <div className="relative z-10 rounded-2xl overflow-hidden bg-black/40 border border-white/[0.06] p-2">
            <ProjectMedia webm={video} poster={poster} Fallback={Visual} label={`${title} demo`} />
          </div>

          {/* Metrics strip */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.08] grid grid-cols-3 gap-4">
            {metrics.map((m) => <MetricCard key={m.label} size="sm" {...m} />)}
          </div>
        </div>

        {/* ── Content Panel ────────────────────────────────── */}
        <div className={`flex flex-col justify-between p-8 relative z-10 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">// OVERVIEW</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <p className="font-body text-[#a0a0b8] text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">// BUILT WITH</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tech.map((t, i) => <TechBadge key={t} label={t} i={i} />)}
            </div>

            {/* GitHub CTA: Magnetic */}
            <MagneticButton
              href={github}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-transparent font-body font-bold text-xs tracking-wider uppercase rounded-xl hover:!bg-[var(--color-accent)] hover:!text-white cursor-hover"
            >
              <FaGithub size={16} />
              View on GitHub
              <FaExternalLinkAlt size={11} className="opacity-70" />
            </MagneticButton>
          </div>

        </div>
      </div>
    </motion.article>
  );
};

/* ─── Categorized Project Card (Dark glass + hover payoff) ─────────── */
const CategorizedProjectCard = ({ project, cardIndex }) => {
  const { index, title, description, tech, github, badge, status } = project;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.4, delay: cardIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ 
        scale: 1.02, 
        y: -6,
        transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
      }}
      className="glass-card p-6 md:p-7 flex flex-col justify-between h-full group shrink-0 snap-center w-[85%] sm:w-[60%] md:w-auto"
    >
      {/* Header section */}
      <div className="relative z-10 mb-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-body text-[10px] tracking-wider text-white/50 font-bold uppercase block px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full truncate max-w-[70%]">
            {badge}
          </span>
          <div className={`flex items-center gap-1.5 font-body text-[10px] font-semibold tracking-wider flex-shrink-0 ${status === 'ARCHIVED' ? 'text-white/50' : 'text-[var(--color-accent-glow)]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'ARCHIVED' ? 'bg-white/30' : 'bg-[var(--color-accent-glow)] animate-pulse'}`} />
            <span>{status || 'SOURCE'}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-2">
          <h4 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[var(--color-accent-glow)] transition-colors duration-300 leading-snug">
            {title}
          </h4>
          <span className="font-body text-xs text-white/15 font-bold select-none flex-shrink-0">{index}</span>
        </div>

        <p className="font-body text-[#a0a0b8] text-xs md:text-sm leading-relaxed mt-3">
          {description}
        </p>
      </div>

      {/* Footer section: tech stack + repo link */}
      <div className="relative z-10 pt-5 border-t border-white/[0.06] mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <span 
              key={t}
              className="px-2.5 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wide bg-white/[0.04] border border-white/[0.06] text-white/50 rounded-full hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-all duration-300"
            >
              {t}
            </span>
          ))}
        </div>

        {/* View on GitHub — magnetic */}
        <MagneticButton
          href={github}
          className="inline-flex items-center justify-between gap-2 py-2.5 px-4 bg-transparent hover:!bg-[var(--color-accent)] hover:!text-white rounded-xl font-body text-xs font-bold tracking-wider uppercase w-full group/btn cursor-hover"
        >
          <span className="flex items-center gap-2">
            <FaGithub size={14} />
            View on GitHub
          </span>
          <FaExternalLinkAlt size={10} className="opacity-60 group-hover/btn:opacity-100 transition-all" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};

/* ─── Live GitHub repo card (auto-selected "best" projects) ────────
   Data comes from /api/github → topRepos: forks/archived/portfolio filtered,
   ranked by stars then most-recent push, refreshed hourly at the edge. No manual
   curation — new strong work appears here on its own. */
const LANG_COLOR = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Dart: '#00B4AB', Python: '#3572A5',
  Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051', C: '#555555',
  'C++': '#f34b7d', Go: '#00ADD8', Ruby: '#701516', Kotlin: '#A97BFF',
};
const repoRelativeTime = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const day = 86400000;
  if (diff < day) return 'today';
  if (diff < 2 * day) return 'yesterday';
  if (diff < 30 * day) return `${Math.round(diff / day)}d ago`;
  if (diff < 365 * day) return `${Math.round(diff / (30 * day))}mo ago`;
  return `${Math.round(diff / (365 * day))}y ago`;
};
const prettyRepoName = (name) =>
  name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const LiveRepoCard = ({ repo, i }) => {
  const link = repo.homepage || repo.html_url;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -6, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      className="glass-card p-6 md:p-7 flex flex-col justify-between h-full group"
    >
      <div className="relative z-10 mb-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3.5">
          <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-wider text-[var(--color-accent-glow)] font-bold uppercase px-3 py-1 bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
            LIVE
          </span>
          <span className="font-mono text-[10px] text-white/40 whitespace-nowrap">updated {repoRelativeTime(repo.pushed_at)}</span>
        </div>

        <h4 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[var(--color-accent-glow)] transition-colors duration-300 leading-snug">
          {prettyRepoName(repo.name)}
        </h4>

        <p className="font-body text-[#a0a0b8] text-xs md:text-sm leading-relaxed mt-3 line-clamp-3">
          {repo.description || 'No description provided.'}
        </p>

        {/* Language + stars/forks */}
        <div className="flex items-center gap-4 mt-4 font-mono text-[11px] text-white/50">
          {repo.language && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: LANG_COLOR[repo.language] || '#8b949e' }} />
              {repo.language}
            </span>
          )}
          {repo.stars > 0 && <span className="flex items-center gap-1"><FaStar size={10} /> {repo.stars}</span>}
          {repo.forks > 0 && <span className="flex items-center gap-1"><FaCodeBranch size={10} /> {repo.forks}</span>}
        </div>
      </div>

      <div className="relative z-10 pt-5 border-t border-white/[0.06] mt-auto flex flex-col gap-4">
        {repo.topics?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {repo.topics.map((t) => (
              <span
                key={t}
                className="px-2.5 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wide bg-white/[0.04] border border-white/[0.06] text-white/50 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <MagneticButton
          href={link}
          className="inline-flex items-center justify-between gap-2 py-2.5 px-4 bg-transparent hover:!bg-[var(--color-accent)] hover:!text-white rounded-xl font-body text-xs font-bold tracking-wider uppercase w-full group/btn cursor-hover"
        >
          <span className="flex items-center gap-2">
            <FaGithub size={14} />
            {repo.homepage ? 'View Live / Code' : 'View on GitHub'}
          </span>
          <FaExternalLinkAlt size={10} className="opacity-60 group-hover/btn:opacity-100 transition-all" />
        </MagneticButton>
      </div>
    </motion.div>
  );
};

/* ─── Tab ⇄ URL slug mapping (shareable, back-button friendly) ─── */
const CATEGORY_TABS = [
  { key: 'ALL', slug: 'all', label: 'ALL PROJECTS', count: '12' },
  { key: 'BACKEND & DISTRIBUTED SYSTEMS', slug: 'backend', label: 'BACKEND & DISTRIBUTED', count: '05' },
  { key: 'FULL-STACK & MOBILE APPS', slug: 'fullstack', label: 'FULL-STACK & MOBILE', count: '03' },
  { key: 'AI / ML & CLOUD INFRA', slug: 'ai', label: 'AI / ML & CLOUD', count: '04' },
];
const slugToKey = (slug) => CATEGORY_TABS.find((t) => t.slug === slug)?.key || 'ALL';
const keyToSlug = (key) => CATEGORY_TABS.find((t) => t.key === key)?.slug || 'all';
const readStackFromUrl = () => {
  if (typeof window === 'undefined') return 'ALL';
  return slugToKey(new URLSearchParams(window.location.search).get('stack'));
};

/* ─── Main Projects Component ──────────────────────────────── */
const Projects = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeTab, setActiveTab] = useState(readStackFromUrl);
  const tabRefs = useRef([]);

  // Best repos, pulled live from GitHub (edge-cached ~hourly) once in view.
  const [liveRepos, setLiveRepos] = useState(null);
  const [liveErr, setLiveErr] = useState(false);
  useEffect(() => {
    if (!sectionInView) return;
    let alive = true;
    const controller = new AbortController();
    fetch(`/api/github?exclude=${encodeURIComponent(PORTFOLIO_REPO_SLUGS.join(','))}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (alive) setLiveRepos(Array.isArray(d.topRepos) ? d.topRepos : []); })
      .catch(() => { if (alive) setLiveErr(true); });
    return () => { alive = false; controller.abort(); };
  }, [sectionInView]);
  const showLive = !liveErr && (liveRepos === null || liveRepos.length > 0);

  const allCategorizedList = categorizedProjects.flatMap(cat =>
    cat.projects.map(p => ({ ...p, categoryName: cat.category }))
  );

  const filteredProjects = activeTab === 'ALL'
    ? allCategorizedList
    : allCategorizedList.filter(p => p.categoryName === activeTab);

  const categoriesTabs = CATEGORY_TABS;

  // Write the active filter to ?stack= so the view is shareable; pushState keeps
  // the back button working across filter changes.
  const selectTab = (key, { push = true } = {}) => {
    setActiveTab(key);
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (key === 'ALL') url.searchParams.delete('stack');
    else url.searchParams.set('stack', keyToSlug(key));
    if (push) window.history.pushState({}, '', url);
  };

  // Sync when the user navigates back/forward.
  useEffect(() => {
    const onPop = () => setActiveTab(readStackFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Left/right arrow navigation between tabs (roving focus).
  const onTabKeyDown = (e) => {
    const idx = categoriesTabs.findIndex((t) => t.key === activeTab);
    let next = null;
    if (e.key === 'ArrowRight') next = (idx + 1) % categoriesTabs.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + categoriesTabs.length) % categoriesTabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = categoriesTabs.length - 1;
    if (next == null) return;
    e.preventDefault();
    selectTab(categoriesTabs[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      id="projects" 
      className="relative overflow-hidden py-20 md:py-24"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-16">
            <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block mb-3">
              // 05 · FEATURED WORK
            </span>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black leading-none tracking-tight section-title">
                Featured Projects
              </h2>
              <p className="font-body text-[#a0a0b8] text-sm max-w-sm leading-relaxed pb-1 hidden md:block">
                Real products I've designed, built, and shipped end-to-end.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Project Card Stack ──────────────────── */}
        <div className="flex flex-col gap-10 mb-10">
          {projects.map((project, i) => (
            project.featured
              ? <FeaturedProjectCard key={project.id} project={project} />
              : <ProjectCard key={project.id} project={project} reverse={i % 2 !== 0} />
          ))}
        </div>

        {/* ── Tab Bar Header & Categorized Grid ────── */}
        <div className="pt-12 border-t border-white/[0.06]">
          
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-10">
              <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase block mb-2">
                // ARCHIVES &amp; EXPERIMENTS
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                Explore All Key Engineering Projects
              </h3>
              <p className="font-body text-[#a0a0b8] text-xs sm:text-sm mt-1 max-w-lg">
                Filter across distributed backends, full-stack architectures, and AI microservices.
              </p>
              {/* Category headers gradient underline divider */}
              <div className="w-40 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] rounded-full mt-5 mx-auto shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]" />
            </div>
          </ScrollReveal>

          {/* Interactive Tab Bar */}
          <div className="mb-12 flex flex-col items-center">
            <div
              role="tablist"
              aria-label="Filter projects by stack"
              onKeyDown={onTabKeyDown}
              className="inline-flex flex-wrap items-center justify-center gap-2 p-2 glass-card !rounded-2xl"
            >
              {categoriesTabs.map((tab, i) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    ref={(el) => (tabRefs.current[i] = el)}
                    role="tab"
                    id={`tab-${tab.slug}`}
                    aria-selected={isActive}
                    aria-controls="projects-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(tab.key)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] ${
                      isActive
                        ? 'text-white'
                        : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] rounded-xl shadow-[0_0_15px_color-mix(in_srgb,var(--color-accent)_60%,transparent)] -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-white/30'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-white/40'
                    }`}>
                      [{tab.count}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile swipe hint */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-3 text-white/40 font-mono text-[10px] uppercase tracking-wider">
            <span>Swipe</span>
            <span aria-hidden="true">→</span>
          </div>

          {/* Filtered Projects — horizontal snap carousel on mobile, grid on md+ */}
          <div
            id="projects-panel"
            role="tabpanel"
            aria-label={`${categoriesTabs.find((t) => t.key === activeTab)?.label || 'All'} projects`}
            className="flex md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-6 px-6 md:mx-0 md:px-0 pb-4 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <CategorizedProjectCard key={project.id} project={project} cardIndex={i} />
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* ── Live from GitHub: best repos, auto-selected & refreshed ── */}
        {showLive && (
          <div className="pt-16 mt-16 border-t border-white/[0.06]">
            <ScrollReveal>
              <div className="flex flex-col items-center text-center mb-10">
                <span className="inline-flex items-center gap-2 font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
                  // LIVE FROM GITHUB
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                  Latest, Straight from My GitHub
                </h3>
                <p className="font-body text-[#a0a0b8] text-xs sm:text-sm mt-1 max-w-lg">
                  Auto-selected top repositories, refreshed hourly — this grid updates itself as I ship new work.
                </p>
                <div className="w-40 h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] rounded-full mt-5 mx-auto shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_60%,transparent)]" />
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {liveRepos === null
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass-card h-56 animate-pulse bg-white/[0.02]" />
                  ))
                : liveRepos.map((repo, i) => <LiveRepoCard key={repo.name} repo={repo} i={i} />)}
            </div>
          </div>
        )}

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent-glow)] animate-pulse" />
              <span className="font-body text-xs text-[#a0a0b8] font-medium tracking-wide uppercase">More projects in progress</span>
            </div>
            <a
              href="https://github.com/Rishi1435"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-glow)] font-semibold tracking-wider uppercase border-b border-[var(--color-accent)]/30 hover:border-[var(--color-accent-glow)] transition-all duration-300 pb-0.5"
            >
              <FaGithub size={12} />
              github.com/Rishi1435
            </a>
          </div>
        </ScrollReveal>

      </div>
    </motion.section>
  );
};

export default Projects;
