import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '../hooks/useReducedMotion';

const terminalData = [
  {
    cmd: 'whoami',
    output: 'Rishi Pediredla',
    type: 'text'
  },
  {
    cmd: 'cat role.txt',
    output: 'Full Stack Developer',
    type: 'text'
  },
  {
    cmd: 'cat about.md',
    output: "I am a Computer Science undergraduate at Aditya College of Engineering and Technology, Visakhapatnam, Andhra Pradesh, currently in my 2nd year (BTech, 2023–2027). I'm a passionate full-stack and mobile developer, actively building real-world projects. I have trainee and representative experience building mobile applications with Flutter, full-stack systems with Node.js, and serverless infrastructure with AWS (Lambda, S3, DynamoDB, Bedrock). I am passionate about cloud-native architectures, AI agent development, and building products that solve real-world problems.",
    type: 'text'
  },
  {
    cmd: 'cat experience.json',
    output: [
      { text: '// 12+ months of active experience & traineeships', isComment: true },
      { text: '{\n  "roles": [\n    {\n      "title": "Campus Ambassador & Trainee",\n      "company": "LinkedIn",\n      "period": "Sep 2025 – Present"\n    },\n    {\n      "title": "Flutter Trainee",\n      "company": "Technical Hub",\n      "period": "May 2025 – Present"\n    },\n    {\n      "title": "Cloud Computing Intern",\n      "company": "APSSDC",\n      "period": "Prior Experience"\n    }\n  ]\n}', isJSON: true }
    ],
    type: 'json'
  },
  {
    cmd: 'cat education.txt',
    output: 'B.Tech in Computer Science — Aditya College of Engineering and Technology, Visakhapatnam, AP (Expected May 2027)\nCGPA: 8.78 / 10.0',
    type: 'text'
  },
  {
    cmd: 'cat achievements.log',
    output: [
      { prefix: '[PROJECT] ', text: 'Qlue ranked in the Top 5 among all entries at Project Space: A voice-based, AI-powered mock interview platform.', color: 'text-[#00E676]' },
      { prefix: '[ROLE] ', text: 'Campus Ambassador & Trainee @ LinkedIn: Representing LinkedIn Learning at my college (Sep 2025 – Present).', color: 'text-[#00C853]' },
      { prefix: '[WIN] ', text: '1st Prize, CampusConnect Case Study: Led a 5-person team to 1st place among 14 universities in a national LinkedIn case study competition.', color: 'text-[#00E676]' }
    ],
    type: 'log'
  }
];

const TerminalTyping = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(() =>
    prefersReducedMotion
      ? terminalData.map(block => ({ ...block, typedCmd: block.cmd, showOutput: true }))
      : []
  );
  const [currentCmdIndex, setCurrentCmdIndex] = useState(() =>
    prefersReducedMotion ? terminalData.length : 0
  );
  const [currentTypedText, setCurrentTypedText] = useState('');

  useEffect(() => {
    if (!inView || prefersReducedMotion) return;

    let activeIndex = 0;
    let charIdx = 0;
    let textAccumulator = '';
    let typingTimer;

    const typeNextChar = () => {
      if (activeIndex >= terminalData.length) {
        setCurrentCmdIndex(terminalData.length);
        return;
      }

      const currentBlock = terminalData[activeIndex];

      if (charIdx < currentBlock.cmd.length) {
        textAccumulator += currentBlock.cmd[charIdx];
        setCurrentTypedText(textAccumulator);
        charIdx++;
        typingTimer = setTimeout(typeNextChar, 25); // speed of typing
      } else {
        // Command completed typing, append block to visible lines list
        setVisibleLines(prev => [
          ...prev,
          { ...currentBlock, typedCmd: currentBlock.cmd, showOutput: true }
        ]);

        // Reset current typing variables
        setCurrentTypedText('');
        textAccumulator = '';
        charIdx = 0;
        activeIndex++;
        setCurrentCmdIndex(activeIndex);

        // Pause before typing next command
        typingTimer = setTimeout(typeNextChar, 500);
      }
    };

    // Initial delay before first line starts typing
    typingTimer = setTimeout(typeNextChar, 600);

    return () => clearTimeout(typingTimer);
  }, [inView, prefersReducedMotion]);

  return (
    <div ref={ref} className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed text-white space-y-8 bg-[#000000] overflow-x-auto min-h-[400px]">

      {/* 1. Render all fully typed lines */}
      {visibleLines.map((block, idx) => (
        <div key={idx} className="fade-in">
          {/* Command Prompt */}
          <div className="flex items-center text-[#00C853] gap-2 select-none font-bold">
            <span>$</span>
            <span>{block.typedCmd}</span>
          </div>

          {/* Command Output */}
          {block.showOutput && (
            <div className="mt-2 pl-4">
              {block.type === 'text' && (
                <div className="text-white whitespace-pre-wrap">{block.output}</div>
              )}

              {block.type === 'json' && (
                <div className="space-y-1">
                  {block.output.map((line, lineIdx) => (
                    <div key={lineIdx}>
                      {line.isComment && <span className="text-[#a0a0b8] opacity-60">{line.text}</span>}
                      {line.isJSON && (
                        <pre className="text-[#00E676] font-mono text-xs md:text-sm mt-1 whitespace-pre-wrap">
                          {line.text}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {block.type === 'log' && (
                <div className="space-y-2">
                  {block.output.map((line, lineIdx) => (
                    <div key={lineIdx} className="leading-relaxed">
                      <span className={`${line.color} font-bold`}>{line.prefix}</span>
                      <span>{line.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 2. Render currently typing line if not finished */}
      {currentCmdIndex < terminalData.length && inView && (
        <div>
          <div className="flex items-center text-[#00C853] gap-2 select-none font-bold">
            <span>$</span>
            <span className="flex items-center text-white">
              {currentTypedText}
              <span className="w-2.5 h-4 bg-[#00E676] ml-1 animate-[pulse_0.8s_infinite]" />
            </span>
          </div>
        </div>
      )}

      {/* 3. Render idle prompt after typing everything is finished */}
      {currentCmdIndex === terminalData.length && (
        <div className="flex items-center text-[#00C853] gap-2 select-none font-bold">
          <span>$</span>
          <span className="w-2.5 h-4 bg-[#00E676] animate-[pulse_0.8s_infinite]" />
        </div>
      )}

      {/* Initial state before scroll in */}
      {!inView && !prefersReducedMotion && (
        <div className="flex items-center text-[#00C853] gap-2 select-none font-bold">
          <span>$</span>
          <span className="w-2.5 h-4 bg-[#00E676] animate-[pulse_0.8s_infinite]" />
        </div>
      )}
    </div>
  );
};

export default TerminalTyping;
