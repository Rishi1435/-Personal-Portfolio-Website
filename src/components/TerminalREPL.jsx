import { useState, useRef, useEffect, useCallback } from 'react';

/*
 * Interactive terminal REPL for the About section.
 * Replaces the old pre-scripted typing animation with a real command loop:
 * arrow-key history, Tab completion, clickable suggestions, and an
 * aria-live output region so screen readers hear each result.
 */

const RESUME_URL = '/Rishi_Pediredla_Resume.pdf';

const COMMANDS = ['whoami', 'about', 'experience', 'skills', 'projects', 'resume', 'contact', 'help', 'clear'];

const OUTPUTS = {
  whoami: ['Rishi Pediredla — Full Stack Developer', 'Visakhapatnam, Andhra Pradesh, India'],
  about: [
    "Full Stack Developer building mobile apps and cloud-native systems.",
    "1.5+ years (18+ months) of hands-on trainee and representative experience —",
    "Flutter apps, Node.js APIs, and AWS serverless architectures.",
    "B.Tech CSE @ Aditya College of Engineering and Technology (expected 2027).",
  ],
  experience: [
    'Campus Ambassador & Trainee · LinkedIn        Sep 2025 – Present',
    'Flutter Trainee · Technical Hub               May 2025 – Present',
    'Cloud Computing Intern · APSSDC               Prior experience',
    '',
    '// 18+ months (1.5+ yrs) of active experience & traineeships',
  ],
  skills: [
    'Languages   : Java, JavaScript, Dart, C, SQL, HTML5, CSS3',
    'Frameworks  : Flutter, Node.js, Spring Boot, REST APIs, AI Agents',
    'Databases   : MongoDB, MySQL, Firebase, DynamoDB',
    'Cloud/DevOps: AWS, Docker, Kubernetes, Jenkins, SonarQube',
    'Tools       : Git, GitHub, Postman, VS Code',
  ],
  projects: [
    '[01] Qlue      — AI-powered voice interview platform (Top 5 @ Project Space)',
    '[02] Xpensia   — Cross-platform expense tracker (SMS + biometric)',
    '     + 12 more backend, full-stack, and AI/ML projects.',
    "     Scroll to Projects, or run 'contact' to reach out.",
  ],
  help: [
    'Available commands:',
    '  whoami      who I am',
    '  about       short bio',
    '  experience  roles & timeline',
    '  skills      tech stack',
    '  projects    featured work',
    '  resume      download my résumé',
    '  contact     jump to the contact form',
    '  clear       clear the screen',
    '  help        show this list',
    '',
    'Tip: ↑/↓ for history, Tab to autocomplete.',
  ],
};

const BANNER = [
  { type: 'out', lines: ["Welcome — this is an interactive shell. Type 'help' to begin."] },
];

const Prompt = () => (
  <span className="select-none whitespace-nowrap">
    <span className="text-[var(--color-accent)] font-bold">rishi@portfolio</span>
    <span className="text-white/40">:</span>
    <span className="text-[var(--color-accent-glow)]">~</span>
    <span className="text-white/40">$ </span>
  </span>
);

const TerminalREPL = () => {
  const [entries, setEntries] = useState(BANNER);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Keep the newest output in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries]);

  const push = useCallback((...items) => setEntries((prev) => [...prev, ...items]), []);

  const run = useCallback((raw) => {
    const cmd = raw.trim();
    if (cmd === '') { push({ type: 'cmd', text: '' }); return; }

    setCmdHistory((h) => [...h, cmd]);
    setHistIndex(-1);
    push({ type: 'cmd', text: cmd });

    const name = cmd.toLowerCase().split(/\s+/)[0];

    if (name === 'clear') { setEntries([]); return; }

    if (name === 'resume') {
      const a = document.createElement('a');
      a.href = RESUME_URL;
      a.download = 'Rishi_Pediredla_Resume.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      push({ type: 'out', lines: ['Downloading Rishi_Pediredla_Resume.pdf…'] });
      return;
    }

    if (name === 'contact') {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      push({ type: 'out', lines: ['Opening the contact section…'] });
      return;
    }

    if (OUTPUTS[name]) { push({ type: 'out', lines: OUTPUTS[name] }); return; }

    push({ type: 'err', lines: [`command not found: ${name}. Type 'help' for options.`] });
  }, [push]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const next = histIndex === -1 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(next);
      setInput(cmdHistory[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === -1) return;
      const next = histIndex + 1;
      if (next >= cmdHistory.length) { setHistIndex(-1); setInput(''); }
      else { setHistIndex(next); setInput(cmdHistory[next]); }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const frag = input.trim().toLowerCase();
      if (!frag) return;
      const matches = COMMANDS.filter((c) => c.startsWith(frag));
      if (matches.length === 1) {
        setInput(matches[0]);
      } else if (matches.length > 1) {
        push({ type: 'out', lines: [matches.join('   ')] });
      }
    }
  };

  return (
    <div
      className="p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed bg-[#000000] min-h-[400px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Scrollable transcript */}
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        className="max-h-[320px] overflow-y-auto pr-1 space-y-1"
      >
        {entries.map((entry, i) => {
          if (entry.type === 'cmd') {
            return (
              <div key={i} className="flex flex-wrap items-baseline text-white break-words">
                <Prompt />
                <span>{entry.text}</span>
              </div>
            );
          }
          const color = entry.type === 'err' ? 'text-red-400' : 'text-[#a0a0b8]';
          return (
            <div key={i} className={`${color} pl-1 whitespace-pre-wrap break-words`}>
              {entry.lines.map((l, j) => <div key={j}>{l || ' '}</div>)}
            </div>
          );
        })}

        {/* Live input line */}
        <div className="flex items-baseline text-white">
          <Prompt />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command input"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            className="flex-1 min-w-0 bg-transparent text-white caret-[var(--color-accent-glow)] focus:outline-none"
          />
        </div>
      </div>

      {/* Suggested commands */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap gap-2">
        <span className="text-white/30 text-[10px] uppercase tracking-wider self-center mr-1">try:</span>
        {['help', 'about', 'experience', 'skills', 'projects', 'resume', 'contact'].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => { run(c); inputRef.current?.focus(); }}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)] hover:border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] transition-colors cursor-pointer"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TerminalREPL;
