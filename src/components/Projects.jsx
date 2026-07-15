import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ProjectQlue from './ProjectQlue';
import ProjectXpensia from './ProjectXpensia';
import ScrollReveal from './ScrollReveal';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

/* ─── Featured Project Data ────────────────────────────────── */
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
    status: '// LIVE'
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
    status: '// LIVE'
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
        status: '// ARCHIVED'
      },
      {
        id: 'cart',
        index: '04',
        title: 'Distributed Shopping Cart Service',
        description: 'High-performance distributed shopping cart with Spring Boot and Redis caching for sub-10ms reads',
        tech: ['Java', 'Spring Boot', 'Redis', 'Docker'],
        github: 'https://github.com/Rishi1435/Distributed-Shopping-Cart-Service',
        badge: 'SPRING BOOT · REDIS · DISTRIBUTED',
        status: '// LIVE'
      },
      {
        id: 'notification',
        index: '05',
        title: 'Event-Driven Notification Service',
        description: 'Scalable event-driven notification service with message queues and idempotency guarantees',
        tech: ['Node.js', 'RabbitMQ/Kafka', 'PostgreSQL'],
        github: 'https://github.com/Rishi1435/Event-Driven-Notification-Service',
        badge: 'NODE.JS · MICROSERVICE · QUEUE',
        status: '// LIVE'
      },
      {
        id: 'property',
        index: '06',
        title: 'Multi-Region Property Listing Backend',
        description: 'Multi-region backend with NGINX load balancing, PostgreSQL replication, and Kafka messaging',
        tech: ['Node.js', 'NGINX', 'PostgreSQL', 'Kafka'],
        github: 'https://github.com/Rishi1435/Multi-Region-Property-Listing-Backend',
        badge: 'MULTI-REGION · NGINX · KAFKA',
        status: '// ARCHIVED'
      },
      {
        id: 'csvexport',
        index: '07',
        title: 'CSV Export Service',
        description: 'Large-scale async CSV export with streaming and real-time progress tracking',
        tech: ['Node.js', 'Streams', 'Redis'],
        github: 'https://github.com/Rishi1435/CSV-Export-Service-with-Async-Streaming-and-Progress-Tracking',
        badge: 'ASYNC · STREAMING · NODE.JS',
        status: '// LIVE'
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
        status: '// LIVE'
      },
      {
        id: 'fintrack',
        index: '09',
        title: 'FinTrack - Personal Finance App',
        description: 'Full-stack personal finance tracker with Node.js backend and Flutter mobile frontend',
        tech: ['Flutter', 'Dart', 'Node.js', 'MongoDB'],
        github: 'https://github.com/Rishi1435/FinTrack-Personal-Finance-Mobile-App',
        badge: 'FLUTTER · FINANCE · FULL-STACK',
        status: '// LIVE'
      },
      {
        id: 'payment',
        index: '10',
        title: 'Payment Gateway',
        description: 'Multi-method payment gateway with hosted checkout, webhook support, and fraud detection hooks',
        tech: ['JavaScript', 'Node.js', 'Stripe API'],
        github: 'https://github.com/Rishi1435/Payment-Gateway',
        badge: 'PAYMENTS · NODE.JS · CHECKOUT',
        status: '// LIVE'
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
        status: '// LIVE'
      },
      {
        id: 'promptrouter',
        index: '12',
        title: 'LLM Prompt Router',
        description: 'LLM-powered intent classification router that intelligently routes prompts to appropriate models',
        tech: ['JavaScript', 'Node.js', 'OpenAI API', 'LangChain'],
        github: 'https://github.com/Rishi1435/LLM-Powered-Prompt-Router-for-Intent-Classification',
        badge: 'LLM · AI AGENTS · NODE.JS',
        status: '// LIVE'
      },
      {
        id: 'awsdeploy',
        index: '13',
        title: 'AWS Deploy - Pub/Sub',
        description: 'Pub/Sub messaging architecture deployed on AWS (SNS + SQS + Lambda)',
        tech: ['Java', 'Spring Boot', 'AWS SNS', 'AWS SQS', 'Lambda'],
        github: 'https://github.com/Rishi1435/AWS-Deploy',
        badge: 'AWS · SERVERLESS · JAVA',
        status: '// ARCHIVED'
      },
      {
        id: 'cloudconfig',
        index: '14',
        title: 'Centralized Configuration Service',
        description: 'Spring Cloud Config Server for centralized, environment-aware microservice configuration',
        tech: ['Java', 'Spring Boot', 'Spring Cloud Config'],
        github: 'https://github.com/Rishi1435/Centralized-Configuration-Service',
        badge: 'SPRING CLOUD · DEVOPS · JAVA',
        status: '// ARCHIVED'
      }
    ]
  }
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

/* ─── Featured Project Card ────────────────────────────────── */
const ProjectCard = ({ project, reverse, cardIndex }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { index, title, subtitle, description, tech, github, metrics, Visual, accentShade, status } = project;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: cardIndex * 0.15 }}
      className="relative group w-full bg-[#070707] border border-[rgba(255,255,255,0.05)] rounded-3xl overflow-hidden hover:border-[rgba(0,255,128,0.5)] hover:shadow-[0_0_20px_rgba(0,255,128,0.3)] transition-all duration-500"
    >
      {/* Shimmer gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,200,83,0.07)] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-0" />

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
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] tracking-[0.3em] text-accent/50 uppercase block">{index} /</span>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-accent font-semibold tracking-widest px-2.5 py-0.5 bg-[rgba(0,200,83,0.08)] border border-[rgba(0,200,83,0.2)] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>{status || '// LIVE'}</span>
              </div>
            </div>
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
        <div className={`flex flex-col justify-between p-8 relative z-10 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>

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

/* ─── Categorized Project Card ─────────────────────────────── */
const CategorizedProjectCard = ({ project }) => {
  const { index, title, description, tech, github, badge, status } = project;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className="relative group bg-[#070707] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 md:p-7 flex flex-col justify-between overflow-hidden hover:border-[rgba(0,255,128,0.5)] hover:shadow-[0_0_20px_rgba(0,255,128,0.3)] transition-all duration-500 h-full"
    >
      {/* Shimmer gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,200,83,0.08)] to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none z-0" />
      
      {/* Top scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-10" />

      {/* Header section */}
      <div className="relative z-10 mb-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-mono text-[9px] tracking-[0.15em] text-accent font-bold uppercase block px-2.5 py-1 bg-[rgba(0,200,83,0.08)] border border-[rgba(0,200,83,0.25)] rounded-full truncate max-w-[70%]">
            {badge}
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-accent font-semibold tracking-widest flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>{status || '// LIVE'}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-2">
          <h4 className="font-display font-black text-lg md:text-xl text-text-primary group-hover:text-white transition-colors duration-300 leading-snug">
            {title}
          </h4>
          <span className="font-mono text-xs text-accent/40 font-bold select-none flex-shrink-0">{index}</span>
        </div>

        <p className="font-body text-text-secondary text-xs md:text-sm leading-relaxed mt-3 opacity-90">
          {description}
        </p>
      </div>

      {/* Footer section: tech stack + repo link */}
      <div className="relative z-10 pt-5 border-t border-[rgba(255,255,255,0.05)] mt-auto flex flex-col gap-4.5">
        <div className="flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <span 
              key={t}
              className="px-2.5 py-0.5 bg-[rgba(0,200,83,0.04)] border border-[rgba(0,200,83,0.15)] rounded-md text-[9px] font-mono text-accent/90 uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-between gap-2 py-2.5 px-3.5 bg-[#0a0a0a] border border-white/5 hover:border-accent/40 rounded-xl text-accent hover:text-accent-glow font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 w-full group/btn"
        >
          <span className="flex items-center gap-2">
            <FaGithub size={14} />
            View Repository
          </span>
          <FaExternalLinkAlt size={10} className="opacity-60 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
        </a>
      </div>
    </motion.div>
  );
};

/* ─── Main Projects Component ──────────────────────────────── */
const Projects = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeTab, setActiveTab] = useState('ALL');

  // Flatten all projects with category names attached
  const allCategorizedList = categorizedProjects.flatMap(cat => 
    cat.projects.map(p => ({ ...p, categoryName: cat.category }))
  );

  // Filter projects based on active terminal tab
  const filteredProjects = activeTab === 'ALL'
    ? allCategorizedList
    : allCategorizedList.filter(p => p.categoryName === activeTab);

  const categoriesTabs = [
    { key: 'ALL', label: 'ALL PROJECTS', count: '12' },
    { key: 'BACKEND & DISTRIBUTED SYSTEMS', label: 'BACKEND & DISTRIBUTED', count: '05' },
    { key: 'FULL-STACK & MOBILE APPS', label: 'FULL-STACK & MOBILE', count: '03' },
    { key: 'AI / ML & CLOUD INFRA', label: 'AI / ML & CLOUD', count: '04' }
  ];

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      id="projects" 
      className="relative bg-[#000000] overflow-hidden py-28"
    >
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

        {/* ── Featured Project Cards Stack ──────────────────── */}
        <div className="flex flex-col gap-8 mb-24">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} reverse={i % 2 !== 0} cardIndex={i} />
          ))}
        </div>

        {/* ── Terminal Tab Bar Header & Categorized Grid ────── */}
        <div className="pt-12 border-t border-[rgba(0,200,83,0.2)]">
          
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-10">
              <span className="font-mono text-[10px] text-accent tracking-[0.3em] uppercase block mb-2">
                // ARCHIVE &amp; EXPERIMENTS //
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-text-primary tracking-tight">
                Explore All Key Engineering Projects
              </h3>
              <p className="font-body text-text-secondary/70 text-xs sm:text-sm mt-1 max-w-lg">
                Filter across distributed backends, full-stack architectures, and AI microservices.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Terminal Tab Bar */}
          <div className="mb-12 flex flex-col items-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 bg-[#060606] border border-[rgba(0,200,83,0.25)] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_15px_rgba(0,200,83,0.08)] backdrop-blur-md">
              {categoriesTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-mono text-xs font-bold tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? 'text-[#000000] drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]' 
                        : 'text-accent/70 hover:text-white hover:bg-[rgba(0,200,83,0.06)]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-gradient-to-r from-accent to-accent-glow rounded-xl shadow-[0_0_20px_#00E676] -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#000000] animate-ping' : 'bg-accent/40'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                      isActive ? 'bg-[#000000]/20 text-[#000000]' : 'bg-[rgba(0,200,83,0.1)] text-accent'
                    }`}>
                      [{tab.count}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Projects Grid with layout animation */}
          <motion.div 
            layout 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <CategorizedProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* ── Footer CTA ─────────────────────────────────────── */}
        <ScrollReveal delay={0.2}>
          <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
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
    </motion.section>
  );
};

export default Projects;


