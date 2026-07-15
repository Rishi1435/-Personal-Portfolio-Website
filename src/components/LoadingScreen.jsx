import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const bootLogs = [
  { text: 'INITIALIZING CORE MODULES .............. ', status: '[OK]', color: 'text-white font-bold' },
  { text: 'LOADING PORTFOLIO ENGINE v3.1.0 ......... ', status: '[OK]', color: 'text-white font-bold' },
  { text: 'AUTHENTICATING USER SESSION ............. ', status: '[VERIFIED]', color: 'text-accent font-bold' },
  { text: 'CONNECTING TO CLOUD NODES .............. ', status: '[ACTIVE]', color: 'text-accent-glow font-bold' },
  { text: 'INJECTING SKILL MATRIX ................. ', status: '[LOADED]', color: 'text-white font-bold' },
  { text: 'DEPLOYING INTERFACE .................... ', status: '[100%]', color: 'text-accent font-bold' },
  { text: 'SYSTEM ONLINE. WELCOME, VISITOR.', status: '', color: 'text-accent font-black tracking-widest mt-1 block' }
];

const MatrixBackground = () => {
  const [lines] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #00C853 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
      {/* Animated falling digital lines */}
      <div className="absolute inset-0 flex justify-around">
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ y: -200, opacity: line.opacity }}
            animate={{ y: ['-100%', '200%'] }}
            transition={{
              duration: line.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: line.delay
            }}
            className="w-[1px] h-32 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        ))}
      </div>
    </div>
  );
};

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [activeLogs, setActiveLogs] = useState([]);

  useEffect(() => {
    // Increment progress bar smoothly up to 100%
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 22);

    // Stagger boot logs one by one with delays
    const logTimers = bootLogs.map((log, index) => {
      // First 6 lines type out rapidly every ~240ms (~80ms character delay feel), last line appears right before complete
      const delay = index === 6 ? 1850 : 200 + index * 260;
      return setTimeout(() => {
        setActiveLogs((prev) => [...prev, log]);
      }, delay);
    });

    return () => {
      clearInterval(progressInterval);
      logTimers.forEach(clearTimeout);
    };
  }, []);

  // Compute ASCII bar: 20 characters total
  const totalBarChars = 20;
  const filledChars = Math.floor((progress / 100) * totalBarChars);
  const asciiBar = '█'.repeat(filledChars) + '░'.repeat(totalBarChars - filledChars);

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ 
        opacity: 0,
        scale: 1.06,
        filter: 'blur(12px) brightness(1.6)',
        x: [0, -10, 10, -5, 5, 0],
        transition: { duration: 0.55, ease: 'easeInOut' } 
      }}
      className="fixed inset-0 bg-[#020202] z-[999999] flex flex-col items-center justify-center pointer-events-auto select-none overflow-hidden"
    >
      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 crt-overlay pointer-events-none z-20" />

      {/* Matrix / Digital Grid Background */}
      <MatrixBackground />

      <div className="w-[340px] sm:w-[420px] flex flex-col font-mono text-[11px] text-accent relative z-30 p-6 bg-[#060606]/90 border border-[rgba(0,200,83,0.25)] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(0,200,83,0.1)] backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,200,83,0.2)] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping shadow-[0_0_8px_#00E676]" />
            <span className="tracking-widest font-black uppercase animate-text-glitch">BOOTING_SEQUENCE</span>
          </div>
          <span className="text-[10px] text-accent/60 font-semibold tracking-wider">V2.4.0</span>
        </div>

        {/* Boot Logs Container */}
        <div className="min-h-[140px] space-y-1.5 text-[10px] sm:text-[11px] text-accent/90 font-medium">
          {activeLogs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start leading-tight"
            >
              {log.status !== '' ? (
                <>
                  <span className="text-accent-glow mr-1.5 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                    &gt;
                  </span>
                  <span className="flex-1 break-words">
                    {log.text}
                    <span className={log.color}>{log.status}</span>
                  </span>
                </>
              ) : (
                <div className="w-full text-center py-1 mt-2 border-t border-[rgba(0,200,83,0.15)] font-display text-xs">
                  <span className="w-2 h-2 rounded-full bg-accent inline-block mr-2 animate-ping" />
                  {log.text}
                </div>
              )}
            </motion.div>
          ))}
          {activeLogs.length < bootLogs.length && (
            <div className="flex items-center gap-1.5 text-accent/50 text-[10px] animate-pulse pt-1">
              <span>●</span>
              <span>EXECUTING INITIALIZATION SCRIPT...</span>
            </div>
          )}
        </div>

        {/* ASCII Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[rgba(0,200,83,0.15)] flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-mono font-bold tracking-wider">
            <span className="text-accent-glow">PROGRESS</span>
            <span className="text-white drop-shadow-[0_0_8px_rgba(0,200,83,0.8)]">[{asciiBar}] {progress}%</span>
          </div>

          {/* Smooth Solid Progress Bar */}
          <div className="w-full h-1.5 bg-[rgba(0,200,83,0.12)] rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-glow shadow-[0_0_12px_#00E676] transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 text-[9px] text-accent/50 font-semibold tracking-widest uppercase">
          <span>PORTAL // RISHI_CORE</span>
          <span className="animate-pulse text-accent-glow">STATUS: DECRYPTING...</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;

