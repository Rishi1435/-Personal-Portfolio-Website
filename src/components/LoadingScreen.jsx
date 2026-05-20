import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [bootStep, setBootStep] = useState(0);

  useEffect(() => {
    // Stagger the showing of terminal logs for a realistic BIOS boot feel
    const logs = [
      setTimeout(() => setBootStep(1), 400),
      setTimeout(() => setBootStep(2), 1000),
      setTimeout(() => setBootStep(3), 1700),
    ];

    return () => logs.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -30,
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 bg-[#000000] z-[999999] flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="w-[300px] flex flex-col font-mono text-[10px] text-accent select-none">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,200,83,0.15)] pb-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="tracking-widest uppercase">BOOTING_SEQUENCE</span>
          </div>
          <span className="text-[9px] text-accent/50">V2.4.0</span>
        </div>

        {/* Boot Logs */}
        <div className="min-h-[55px] space-y-1 text-[9px] text-accent-glow/90 font-medium">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            &gt; SYSTEM_INIT // RISHI_CORE ... <span className="text-white font-bold">[OK]</span>
          </motion.div>

          {bootStep >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              &gt; NETWORK_SECURE // AES_256_ACTIVE ... <span className="text-white font-bold">[100%]</span>
            </motion.div>
          )}

          {bootStep >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              &gt; LOADING HUD AND SHADERS ... <span className="text-white font-bold">[READY]</span>
            </motion.div>
          )}

          {bootStep >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              &gt; ESTABLISHING SAT_COMM SIGNAL ... <span className="text-white font-bold">[STABLE]</span>
            </motion.div>
          )}
        </div>

        {/* Core Progress Bar */}
        <div className="w-full h-1 bg-[rgba(0,200,83,0.1)] rounded-full overflow-hidden mt-5 relative">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.95, ease: 'easeInOut' }}
            className="h-full bg-accent shadow-[0_0_10px_#00E676]"
          />
        </div>

        <div className="flex justify-between items-center mt-2 text-[8px] text-accent/40 font-semibold tracking-wider">
          <span>CONNECTING PORTAL</span>
          <span className="animate-pulse">DECRYPTING...</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
