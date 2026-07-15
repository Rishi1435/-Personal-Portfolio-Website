import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import ScrollReveal from './ScrollReveal';
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
    color: '#00C853',
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
    color: '#00E676',
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
    color: '#00C853',
    skills: [
      { name: 'Git',     icon: SiGit, speciality: 'Distributed Version Control', proficiency: '95%' },
      { name: 'GitHub',  icon: SiGithub, speciality: 'Collaborative Code Management', proficiency: '95%' },
      { name: 'Postman', icon: SiPostman, speciality: 'API Testing & Verification', proficiency: '92%' },
      { name: 'VS Code', icon: VscVscode, speciality: 'Optimized Developer Workflow', proficiency: '98%' },
    ],
  },
];

/* ─── Infinite Marquee with Pure CSS Animation & Mask ────────── */
const Marquee = () => {
  const doubled = [...allSkills, ...allSkills];
  return (
    <div className="relative overflow-hidden py-6 mb-16 border-y border-white/10 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)]">
      <div 
        className="flex gap-6 whitespace-nowrap w-max"
        style={{
          animation: 'marquee-scroll 32s linear infinite'
        }}
      >
        {doubled.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <div
              key={i}
              style={{
                borderRadius: '50px',
                padding: '8px 16px'
              }}
              className="glass-card flex items-center gap-3 transition-all duration-300 cursor-default flex-shrink-0 group hover:border-[#00C853]"
            >
              <Icon className="text-[#00C853] text-lg group-hover:text-[#00E676] transition-colors duration-300" />
              <span className="font-body text-xs font-semibold tracking-wide text-white uppercase group-hover:text-[#00E676] transition-colors duration-300">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

/* ─── Skill Icon Tile (Liquid Glass Pill) ─────────────── */
const SkillTile = ({ name, icon: Icon, index, speciality }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      style={{
        borderRadius: '50px',
        padding: '8px 16px'
      }}
      className="glass-card flex items-center gap-3 group transition-all duration-300 cursor-default flex-1 min-w-[160px] hover:!border-[#00C853]"
    >
      <div className="text-[#00C853] group-hover:text-[#00E676] transition-colors duration-300 flex-shrink-0">
        <Icon className="text-[1.3rem]" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="font-body text-xs font-semibold tracking-wide text-white group-hover:text-[#00E676] transition-colors duration-300 truncate">
          {name}
        </span>
        {speciality && (
          <span className="font-body text-[9px] text-[#a0a0b8] group-hover:text-white transition-colors duration-300 mt-0.5 truncate uppercase">
            {speciality}
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Category Card (Liquid Glass) ────────────────────────────────── */
const CategoryCard = ({ title, label, desc, skills, color, index }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className="glass-card p-6 md:p-7 h-full flex flex-col justify-between group"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <span className="font-body text-[10px] tracking-widest uppercase mb-1 block text-[#00C853] font-semibold">{label} · CATEGORY</span>
            <h3 className="font-display font-bold text-lg md:text-xl text-white tracking-tight group-hover:text-[#00E676] transition-colors duration-300">
              {title}
            </h3>
            <p className="font-body text-xs text-[#a0a0b8] mt-1">{desc}</p>
          </div>
          <span
            className="font-display font-black text-4xl leading-none select-none opacity-10"
            style={{ color }}
          >
            {label}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px mb-5 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

        {/* Skill tiles */}
        <div className="flex flex-wrap gap-2.5">
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
      initial={{ opacity: 0, y: 30 }}
      animate={sectionInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      id="skills" 
      className="relative overflow-hidden py-28"
    >
      <div className="container max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">

        {/* ── Header ──────────────────────────────────────── */}
        <ScrollReveal>
          <div className="mb-14">
            <span className="font-body text-xs text-[#00C853] font-semibold tracking-widest uppercase block mb-3">
              // 03 · TECH STACK
            </span>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-8">
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-display font-black leading-none tracking-tight section-title">
                Skills &amp; Technologies
              </h2>
              <p className="font-body text-[#a0a0b8] text-sm max-w-xs leading-relaxed pb-1 hidden md:block">
                Every language, framework &amp; tool in my developer arsenal.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Infinite Marquee Ticker (Pure CSS) ──────────────────────── */}
        <Marquee />

        {/* ── Bento Card Grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="md:col-span-3 h-full"><CategoryCard {...skillCategories[0]} index={0} /></div>
          <div className="md:col-span-2 h-full"><CategoryCard {...skillCategories[1]} index={1} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="md:col-span-2 h-full"><CategoryCard {...skillCategories[2]} index={2} /></div>
          <div className="md:col-span-3 h-full"><CategoryCard {...skillCategories[3]} index={3} /></div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <CategoryCard {...skillCategories[4]} index={4} />
        </div>
      </div>
    </motion.section>
  );
};

export default Skills;
