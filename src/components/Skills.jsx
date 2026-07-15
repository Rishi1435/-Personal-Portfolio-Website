import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import {
  SiJavascript, SiDart, SiC, SiMysql,
  SiFlutter, SiNodedotjs, SiSpringboot,
  SiMongodb, SiFirebase,
  SiDocker, SiKubernetes, SiJenkins, SiSonarqubeserver,
  SiGit, SiGithub, SiPostman
} from 'react-icons/si';
import { FaJava, FaAws, FaCode, FaDatabase, FaBrain, FaHtml5, FaCss3 } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';

/* ─── All skills flat list for marquee ─────────────────────── */
const allSkills = [
  { name: 'Java',        icon: FaJava, proficiency: '95%' },
  { name: 'JavaScript',  icon: SiJavascript, proficiency: '92%' },
  { name: 'Dart',        icon: SiDart, proficiency: '90%' },
  { name: 'Flutter',     icon: SiFlutter, proficiency: '95%' },
  { name: 'Node.js',     icon: SiNodedotjs, proficiency: '88%' },
  { name: 'Spring Boot', icon: SiSpringboot, proficiency: '85%' },
  { name: 'AWS',         icon: FaAws, proficiency: '82%' },
  { name: 'Docker',      icon: SiDocker, proficiency: '85%' },
  { name: 'MongoDB',     icon: SiMongodb, proficiency: '88%' },
  { name: 'Firebase',    icon: SiFirebase, proficiency: '90%' },
  { name: 'Kubernetes',  icon: SiKubernetes, proficiency: '78%' },
  { name: 'Git',         icon: SiGit, proficiency: '95%' },
  { name: 'GitHub',      icon: SiGithub, proficiency: '95%' },
  { name: 'Postman',     icon: SiPostman, proficiency: '92%' },
  { name: 'MySQL',       icon: SiMysql, proficiency: '86%' },
  { name: 'DynamoDB',    icon: FaDatabase, proficiency: '84%' },
  { name: 'Jenkins',     icon: SiJenkins, proficiency: '80%' },
  { name: 'VS Code',     icon: VscVscode, proficiency: '98%' },
  { name: 'REST APIs',   icon: FaCode, proficiency: '94%' },
  { name: 'SonarQube',   icon: SiSonarqubeserver, proficiency: '82%' },
  { name: 'HTML5',       icon: FaHtml5, proficiency: '96%' },
  { name: 'CSS3',        icon: FaCss3, proficiency: '92%' },
  { name: 'AI Agents',   icon: FaBrain, proficiency: '88%' },
];

/* ─── Category data ────────────────────────────────────────── */
const skillCategories = [
  {
    title: 'Languages',
    label: '01',
    desc: 'The languages I think in',
    color: '#00C853',
    skills: [
      { name: 'Java',       icon: FaJava, speciality: 'Scalable Backend Development', proficiency: '95%' },
      { name: 'JavaScript', icon: SiJavascript, speciality: 'Dynamic Interface Logic', proficiency: '92%' },
      { name: 'Dart',       icon: SiDart, speciality: 'Cross-Platform Client State', proficiency: '90%' },
      { name: 'C',          icon: SiC, speciality: 'Low Level Memory Management', proficiency: '80%' },
      { name: 'SQL',        icon: SiMysql, speciality: 'Complex Query Optimization', proficiency: '86%' },
      { name: 'HTML5',      icon: FaHtml5, speciality: 'Semantic Document Structures', proficiency: '96%' },
      { name: 'CSS3',       icon: FaCss3, speciality: 'Responsive Layout Systems', proficiency: '92%' },
    ],
  },
  {
    title: 'Frameworks & Emerging Tech',
    label: '02',
    desc: 'Frameworks and emerging technologies I build with',
    color: '#00E676',
    skills: [
      { name: 'Flutter',     icon: SiFlutter, speciality: 'High Performance Mobile Apps', proficiency: '95%' },
      { name: 'Node.js',     icon: SiNodedotjs, speciality: 'Event Driven Server Logic', proficiency: '88%' },
      { name: 'Spring Boot', icon: SiSpringboot, speciality: 'Enterprise Rest Microservices', proficiency: '85%' },
      { name: 'REST APIs',   icon: FaCode, speciality: 'Clean Endpoint Implementations', proficiency: '94%' },
      { name: 'AI Agents',   icon: FaBrain, speciality: 'LLM Workflow Automations', proficiency: '88%' },
    ],
  },
  {
    title: 'Databases',
    label: '03',
    desc: 'Where data lives',
    color: '#69F0AE',
    skills: [
      { name: 'MongoDB',  icon: SiMongodb, speciality: 'NoSQL Document Schema Design', proficiency: '88%' },
      { name: 'MySQL',    icon: SiMysql, speciality: 'Relational Database Architecture', proficiency: '86%' },
      { name: 'Firebase', icon: SiFirebase, speciality: 'Serverless Realtime Integrations', proficiency: '90%' },
      { name: 'DynamoDB', icon: FaDatabase, speciality: 'Distributed High Throughput DB', proficiency: '84%' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    label: '04',
    desc: 'Infra I deploy & scale on',
    color: '#00C853',
    skills: [
      { name: 'AWS',        icon: FaAws, speciality: 'Cloud Resource Orchestration', proficiency: '82%' },
      { name: 'Docker',     icon: SiDocker, speciality: 'Microservice Containerization', proficiency: '85%' },
      { name: 'Kubernetes', icon: SiKubernetes, speciality: 'Container Scaling & Routing', proficiency: '78%' },
      { name: 'Jenkins',    icon: SiJenkins, speciality: 'Automated Deployment Pipelines', proficiency: '80%' },
      { name: 'SonarQube',  icon: SiSonarqubeserver, speciality: 'Static Code Security Analysis', proficiency: '82%' },
    ],
  },
  {
    title: 'Tools',
    label: '05',
    desc: 'My daily workflow kit',
    color: '#00E676',
    skills: [
      { name: 'Git',     icon: SiGit, speciality: 'Distributed Version Control', proficiency: '95%' },
      { name: 'GitHub',  icon: SiGithub, speciality: 'Collaborative Code Management', proficiency: '95%' },
      { name: 'Postman', icon: SiPostman, speciality: 'API Testing & Verification', proficiency: '92%' },
      { name: 'VS Code', icon: VscVscode, speciality: 'Optimized Developer Workflow', proficiency: '98%' },
    ],
  },
];

/* ─── Infinite Marquee with Scan-line Sweep ────────────────── */
const Marquee = () => {
  const doubled = [...allSkills, ...allSkills];
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="relative overflow-visible py-4 mb-16 border-y border-[rgba(0,200,83,0.12)] bg-[#040404]">
      {/* Scan-line sweep animation over the marquee */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(0,230,118,0.18)_50%,transparent_100%)] w-1/2 h-full animate-scan-sweep pointer-events-none z-20" />
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#000] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#000] to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={prefersReducedMotion ? { x: '0%' } : { x: ['0%', '-50%'] }}
        transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
      >
        {doubled.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <div
              key={i}
              className="relative flex items-center gap-3 px-5 py-2.5 bg-[#0A0A0A] border border-[rgba(0,200,83,0.1)] rounded-xl group hover:border-[rgba(0,200,83,0.4)] hover:bg-[rgba(0,200,83,0.04)] hover:shadow-[0_0_15px_rgba(0,200,83,0.15)] transition-all duration-300 cursor-default flex-shrink-0"
            >
              <Icon className="text-accent/60 text-lg group-hover:text-accent transition-colors duration-300" />
              <span className="font-mono text-[11px] tracking-widest text-text-secondary/60 uppercase group-hover:text-accent transition-colors duration-300">
                {skill.name}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#050505] border border-accent/60 rounded text-[9px] font-mono text-accent tracking-widest uppercase shadow-[0_0_12px_rgba(0,200,83,0.4)] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>PROFICIENCY: {skill.proficiency || '90%'}</span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

/* ─── Skill Icon Tile with Proficiency Tooltip ─────────────── */
const SkillTile = ({ name, icon: Icon, index, speciality, proficiency }) => {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: prefersReducedMotion ? 0 : 0.3 }}
      whileHover={prefersReducedMotion ? {} : { y: -3, scale: 1.02 }}
      className="relative flex items-center gap-3.5 px-4 py-3 bg-[#0C0C0C] border border-[rgba(255,255,255,0.05)] rounded-xl group hover:border-[rgba(0,200,83,0.3)] hover:bg-[rgba(0,200,83,0.03)] hover:shadow-[0_0_20px_rgba(0,200,83,0.08)] transition-all duration-300 cursor-default min-w-[170px] flex-1 overflow-visible"
    >
      <div className="text-text-secondary/50 group-hover:text-accent transition-colors duration-300 flex-shrink-0">
        <Icon className="text-[1.6rem]" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-text-primary group-hover:text-white transition-colors duration-300">
          {name}
        </span>
        {speciality && (
          <span className="font-body text-[8px] text-text-secondary/50 group-hover:text-accent/80 transition-colors duration-300 mt-0.5 truncate uppercase tracking-wider">
            {speciality}
          </span>
        )}
      </div>

      {/* Proficiency Level Tooltip */}
      <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#050505] border border-accent/60 rounded text-[9px] font-mono text-accent tracking-widest uppercase shadow-[0_0_12px_rgba(0,200,83,0.4)] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span>PROFICIENCY: {proficiency || '90%'}</span>
      </div>
    </motion.div>
  );
};

/* ─── Category Card ────────────────────────────────────────── */
const CategoryCard = ({ title, label, desc, skills, color, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 28, scale: prefersReducedMotion ? 1 : 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.1, duration: prefersReducedMotion ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-[#070707] border border-[rgba(255,255,255,0.05)] rounded-2xl overflow-visible group hover:border-[rgba(0,200,83,0.2)] hover:shadow-[0_0_40px_rgba(0,200,83,0.06)] transition-all duration-500 h-full"
      style={{ '--card-color': color }}
    >
      {/* Bold left accent bar */}
      <div
        className="absolute left-0 top-0 w-[3px] h-full rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to bottom, ${color}, transparent)` }}
      />

      {/* Top gradient glow */}
      <div
        className="absolute top-0 left-0 w-full h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 30% 0%, ${color}0D 0%, transparent 70%)` }}
      />

      <div className="p-6 md:p-7 pl-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1 block" style={{ color: `${color}80` }}>{label}</span>
            <h3 className="font-display font-black text-lg md:text-xl text-text-primary tracking-tight group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-[10px] text-text-secondary/40 mt-0.5">{desc}</p>
          </div>
          <span
            className="font-display font-black text-5xl leading-none select-none opacity-[0.05] group-hover:opacity-[0.09] transition-opacity duration-500"
            style={{ color }}
          >
            {label}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px mb-5" style={{ background: `linear-gradient(to right, ${color}33, transparent)` }} />

        {/* Skill tiles */}
        <div className={
          label === '01' || label === '04'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-visible'
            : label === '05'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 overflow-visible'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-visible'
        }>
          {skills.map((skill, i) => <SkillTile key={skill.name} {...skill} index={i} />)}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Skills Component ────────────────────────────────── */
const Skills = () => {
  const [sectionRef, sectionInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0, y: 50 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      id="skills" 
      className="relative bg-[#000000] overflow-hidden py-28"
    >
      {/* Dot grid BG */}
      <div
        className="absolute inset-0 opacity-[0.022] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,200,83,0.055)_0%,transparent_65%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(0,200,83,0.04)_0%,transparent_65%)] pointer-events-none" />

      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Header ──────────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-14">
            <motion.span
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="font-mono text-[11px] text-accent tracking-[0.35em] uppercase block mb-3"
            >
              // section_02 · tech_stack
            </motion.span>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black text-text-primary leading-none tracking-[-0.03em]">
                Skills &amp;{' '}
                <span className="text-accent relative">
                  Technologies
                  <motion.span
                    className="absolute -bottom-1 left-0 h-[3px] bg-accent rounded-full"
                    initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  />
                </span>
              </h2>
              <p className="font-body text-text-secondary text-sm max-w-xs leading-relaxed pb-1 hidden md:block opacity-70">
                Every language, framework &amp; tool in my developer arsenal.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Infinite Marquee Ticker ──────────────────────── */}
        <Marquee />

        {/* ── Bento Card Grid ─────────────────────────────── */}
        {/* Row 1: Languages (wide) + Frameworks */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
          <div className="md:col-span-3 h-full"><CategoryCard {...skillCategories[0]} index={0} /></div>
          <div className="md:col-span-2 h-full"><CategoryCard {...skillCategories[1]} index={1} /></div>
        </div>
        {/* Row 2: Databases + Cloud & DevOps (wide) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-5">
          <div className="md:col-span-2 h-full"><CategoryCard {...skillCategories[2]} index={2} /></div>
          <div className="md:col-span-3 h-full"><CategoryCard {...skillCategories[3]} index={3} /></div>
        </div>
        {/* Row 3: Tools full width */}
        <div className="grid grid-cols-1 gap-5">
          <CategoryCard {...skillCategories[4]} index={4} />
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;

