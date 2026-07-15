import { useState } from 'react';
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
    status: 'LIVE'
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
    status: 'LIVE'
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
        status: 'LIVE'
      },
      {
        id: 'notification',
        index: '05',
        title: 'Event-Driven Notification Service',
        description: 'Scalable event-driven notification service with message queues and idempotency guarantees',
        tech: ['Node.js', 'RabbitMQ/Kafka', 'PostgreSQL'],
        github: 'https://github.com/Rishi1435/Event-Driven-Notification-Service',
        badge: 'NODE.JS · MICROSERVICE · QUEUE',
        status: 'LIVE'
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
        status: 'LIVE'
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
        status: 'LIVE'
      },
      {
        id: 'fintrack',
        index: '09',
        title: 'FinTrack - Personal Finance App',
        description: 'Full-stack personal finance tracker with Node.js backend and Flutter mobile frontend',
        tech: ['Flutter', 'Dart', 'Node.js', 'MongoDB'],
        github: 'https://github.com/Rishi1435/FinTrack-Personal-Finance-Mobile-App',
        badge: 'FLUTTER · FINANCE · FULL-STACK',
        status: 'LIVE'
      },
      {
        id: 'payment',
        index: '10',
        title: 'Payment Gateway',
        description: 'Multi-method payment gateway with hosted checkout, webhook support, and fraud detection hooks',
        tech: ['JavaScript', 'Node.js', 'Stripe API'],
        github: 'https://github.com/Rishi1435/Payment-Gateway',
        badge: 'PAYMENTS · NODE.JS · CHECKOUT',
        status: 'LIVE'
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
        status: 'LIVE'
      },
      {
        id: 'promptrouter',
        index: '12',
        title: 'LLM Prompt Router',
        description: 'LLM-powered intent classification router that intelligently routes prompts to appropriate models',
        tech: ['Python', 'OpenAI API', 'LangChain'],
        github: 'https://github.com/Rishi1435/LLM-Prompt-Router-with-Intent-Classification',
        badge: 'AI · LLM · PYTHON',
        status: 'LIVE'
      },
      {
        id: 'textract',
        index: '13',
        title: 'Invoice Processor AWS Textract',
        description: 'Automated invoice processing pipeline with AWS Textract, S3, and DynamoDB',
        tech: ['Python', 'AWS Textract', 'S3', 'DynamoDB'],
        github: 'https://github.com/Rishi1435/Automated-Invoice-Processing-Pipeline-AWS-Textract',
        badge: 'AWS · TEXTRACT · PIPELINE',
        status: 'LIVE'
      },
      {
        id: 'cloudresume',
        index: '14',
        title: 'AWS Serverless Cloud Resume API',
        description: 'AWS Cloud Resume API with Lambda, DynamoDB, API Gateway, and CI/CD via GitHub Actions',
        tech: ['Python', 'AWS Lambda', 'DynamoDB', 'API Gateway', 'GitHub Actions'],
        github: 'https://github.com/Rishi1435/AWS-Serverless-Cloud-Resume-API',
        badge: 'AWS · SERVERLESS · API',
        status: 'LIVE'
      }
    ]
  }
];

/* ─── Sub-Component: Tech Badge ────────────────────────────── */
const TechBadge = ({ label, i }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.25, delay: i * 0.03 }}
    className="px-3.5 py-1 text-xs font-body font-semibold tracking-wide bg-[#00C853]/15 border border-[#00C853]/30 text-[#00C853] rounded-full select-none hover:border-[#00E676] hover:bg-[#00C853]/25 transition-all duration-300"
  >
    {label}
  </motion.span>
);

/* ─── Sub-Component: Metric Pill ───────────────────────────── */
const Metric = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-[#00C853]/40 transition-all duration-300">
    <span className="text-xl md:text-2xl font-display font-black text-[#00E676] drop-shadow-[0_0_12px_rgba(0,230,118,0.4)] group-hover:scale-105 transition-transform">
      {value}
    </span>
    <span className="text-[10px] font-body text-[#a0a0b8] font-medium tracking-wider uppercase mt-1 text-center">
      {label}
    </span>
  </div>
);

/* ─── Project Card (Featured Stack) ─────────────────────────────────── */
const ProjectCard = ({ project, reverse }) => {
  const { index, title, subtitle, description, tech, github, metrics, Visual, status } = project;
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card group overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        
        {/* ── Visual Panel ────────────────────────────────── */}
        <div className={`p-6 md:p-8 flex flex-col justify-between bg-gradient-to-br from-white/[0.02] to-transparent border-b lg:border-b-0 ${reverse ? 'lg:border-l lg:order-2 border-white/5' : 'lg:border-r border-white/5'}`}>
          
          {/* Top meta row */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-3xl text-white/10 select-none">
                {index}
              </span>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-body text-[10px] text-[#00E676] font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                <span>{status || 'LIVE'}</span>
              </div>
            </div>
            <span className="font-body text-xs text-[#00C853] font-bold tracking-widest uppercase">
              // FEATURED
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight leading-none group-hover:text-[#00E676] transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-[#00C853] font-medium mt-2 tracking-wide uppercase">
              {subtitle}
            </p>
          </div>

          {/* Visual */}
          <div className="relative z-10 rounded-2xl overflow-hidden bg-black/40 border border-white/5 p-2">
            <Visual />
          </div>

          {/* Metrics strip */}
          <div className="relative z-10 mt-6 pt-5 border-t border-white/10 grid grid-cols-3 gap-4">
            {metrics.map((m) => <Metric key={m.label} {...m} />)}
          </div>
        </div>

        {/* ── Content Panel ────────────────────────────────── */}
        <div className={`flex flex-col justify-between p-8 relative z-10 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>

          {/* Description */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase">// OVERVIEW</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <p className="font-body text-[#a0a0b8] text-sm md:text-base leading-relaxed">
              {description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase">// BUILT WITH</span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {tech.map((t, i) => <TechBadge key={t} label={t} i={i} />)}
            </div>

            {/* GitHub CTA: Ghost style */}
            <motion.a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,200,83,0.4)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                border: '1px solid #00C853',
                color: '#00C853'
              }}
              className="inline-flex items-center gap-3 px-7 py-3.5 bg-transparent font-body font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 hover:!bg-[#00C853] hover:!text-white"
            >
              <FaGithub size={16} />
              View on GitHub
              <FaExternalLinkAlt size={11} className="opacity-70" />
            </motion.a>
          </div>

        </div>
      </div>
    </motion.article>
  );
};

/* ─── Categorized Project Card (Liquid Glass) ─────────────────────────────── */
const CategorizedProjectCard = ({ project }) => {
  const { index, title, description, tech, github, badge, status } = project;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-6 md:p-7 flex flex-col justify-between h-full group hover:!border-[#00E676]/50"
    >
      {/* Header section */}
      <div className="relative z-10 mb-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-body text-[10px] tracking-wider text-[#00C853] font-bold uppercase block px-3 py-1 bg-white/5 border border-white/10 rounded-full truncate max-w-[70%]">
            {badge}
          </span>
          <div className="flex items-center gap-1.5 font-body text-[10px] text-[#00E676] font-semibold tracking-wider flex-shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            <span>{status || 'LIVE'}</span>
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-2">
          <h4 className="font-display font-bold text-lg md:text-xl text-white group-hover:text-[#00E676] transition-colors duration-300 leading-snug">
            {title}
          </h4>
          <span className="font-body text-xs text-[#00C853]/60 font-bold select-none flex-shrink-0">{index}</span>
        </div>

        <p className="font-body text-[#a0a0b8] text-xs md:text-sm leading-relaxed mt-3">
          {description}
        </p>
      </div>

      {/* Footer section: tech stack + repo link */}
      <div className="relative z-10 pt-5 border-t border-white/10 mt-auto flex flex-col gap-4">
        <div className="flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <span 
              key={t}
              style={{
                background: 'rgba(0, 200, 83, 0.12)',
                color: '#00C853',
                border: '1px solid rgba(0, 200, 83, 0.3)',
                borderRadius: '50px'
              }}
              className="px-2.5 py-0.5 text-[10px] font-body font-semibold uppercase tracking-wide"
            >
              {t}
            </span>
          ))}
        </div>

        {/* View on GitHub Ghost button */}
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            border: '1px solid #00C853',
            color: '#00C853'
          }}
          className="inline-flex items-center justify-between gap-2 py-2.5 px-4 bg-transparent hover:!bg-[#00C853] hover:!text-white rounded-xl font-body text-xs font-bold tracking-wider uppercase transition-all duration-300 w-full group/btn"
        >
          <span className="flex items-center gap-2">
            <FaGithub size={14} />
            View on GitHub
          </span>
          <FaExternalLinkAlt size={10} className="opacity-60 group-hover/btn:opacity-100 transition-all" />
        </a>
      </div>
    </motion.div>
  );
};

/* ─── Main Projects Component ──────────────────────────────── */
const Projects = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [activeTab, setActiveTab] = useState('ALL');

  const allCategorizedList = categorizedProjects.flatMap(cat => 
    cat.projects.map(p => ({ ...p, categoryName: cat.category }))
  );

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
      initial={{ opacity: 0, y: 30 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      id="projects" 
      className="relative overflow-hidden py-28"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section Header ────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-16">
            <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase block mb-3">
              // 04 · FEATURED WORK
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

        {/* ── Featured Project Cards Stack ──────────────────── */}
        <div className="flex flex-col gap-10 mb-24">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} reverse={i % 2 !== 0} />
          ))}
        </div>

        {/* ── Tab Bar Header & Categorized Grid with Gradient Underline Divider ────── */}
        <div className="pt-12 border-t border-white/10">
          
          <ScrollReveal>
            <div className="flex flex-col items-center text-center mb-10">
              <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase block mb-2">
                // ARCHIVES &amp; EXPERIMENTS
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                Explore All Key Engineering Projects
              </h3>
              <p className="font-body text-[#a0a0b8] text-xs sm:text-sm mt-1 max-w-lg">
                Filter across distributed backends, full-stack architectures, and AI microservices.
              </p>
              {/* Category headers gradient underline divider */}
              <div className="w-40 h-1 bg-gradient-to-r from-[#00C853] to-[#00E676] rounded-full mt-5 mx-auto shadow-[0_0_12px_rgba(0,200,83,0.6)]" />
            </div>
          </ScrollReveal>

          {/* Interactive Liquid Glass Tab Bar */}
          <div className="mb-12 flex flex-col items-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 p-2 glass-card !rounded-2xl">
              {categoriesTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative px-4 sm:px-5 py-2.5 rounded-xl font-body text-xs font-bold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? 'text-white' 
                        : 'text-[#a0a0b8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-tab-pill"
                        className="absolute inset-0 bg-gradient-to-r from-[#00C853] to-[#00E676] rounded-xl shadow-[0_0_15px_rgba(0,200,83,0.6)] -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-[#00C853]'}`} />
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#00C853]/15 text-[#00C853]'
                    }`}>
                      [{tab.count}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Projects Grid */}
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
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span className="font-body text-xs text-[#a0a0b8] font-medium tracking-wide uppercase">More projects in progress</span>
            </div>
            <a
              href="https://github.com/Rishi1435"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-xs text-[#00C853] hover:text-[#00E676] font-semibold tracking-wider uppercase border-b border-[#00C853]/30 hover:border-[#00E676] transition-all duration-300 pb-0.5"
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
