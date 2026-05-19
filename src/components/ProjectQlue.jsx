import React from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ProjectQlue = () => {
  const prefersReducedMotion = useReducedMotion();
  const a = !prefersReducedMotion;

  return (
    <div className="relative w-full h-52 flex items-center justify-center bg-[#030303] rounded-xl overflow-hidden border border-[rgba(0,200,83,0.12)] group-hover:border-[rgba(0,200,83,0.28)] transition-all duration-300">

      {/* Ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,200,83,0.07)_0%,transparent_70%)] pointer-events-none" />

      <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

        {/* ── Grid lines ─────────────────────────────────────── */}
        {[40,80,120,160,200,240,280,320,360,400].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="rgba(0,200,83,0.025)" strokeWidth="1"/>
        ))}
        {[45,90,135].map(y => (
          <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(0,200,83,0.025)" strokeWidth="1"/>
        ))}

        {/* ── PHONE FRAME (center) ───────────────────────────── */}
        <rect x="155" y="8" width="110" height="164" rx="14" fill="#0A0A0A" stroke="rgba(0,200,83,0.35)" strokeWidth="1.5"/>
        {/* Notch */}
        <rect x="188" y="12" width="44" height="6" rx="3" fill="#111"/>
        {/* Screen bg */}
        <rect x="159" y="22" width="102" height="148" rx="6" fill="#050505"/>

        {/* ── APP HEADER BAR ─────────────────────────────────── */}
        <rect x="159" y="22" width="102" height="20" rx="6" fill="#0C0C0C"/>
        <rect x="159" y="34" width="102" height="8" fill="#0C0C0C"/>
        <circle cx="168" cy="32" r="4" fill="rgba(0,200,83,0.15)" stroke="#00C853" strokeWidth="0.8"/>
        <text x="176" y="35" fill="#00C853" fontSize="6" fontFamily="monospace" fontWeight="bold">qlue</text>
        {/* Status dot */}
        <circle cx="253" cy="32" r="2.5" fill="#00C853">
          {a && <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>}
        </circle>

        {/* ── SESSION INFO BLOCK ─────────────────────────────── */}
        <rect x="163" y="46" width="94" height="28" rx="4" fill="#0F0F0F" stroke="rgba(0,200,83,0.08)" strokeWidth="0.8"/>
        <text x="210" y="57" fill="rgba(255,255,255,0.5)" fontSize="5" fontFamily="monospace" textAnchor="middle">RESUME-BASED INTERVIEW</text>
        <text x="210" y="68" fill="#00C853" fontSize="7" fontFamily="monospace" fontWeight="bold" textAnchor="middle">Q4 of 8</text>

        {/* ── AI AVATAR / MIC INDICATOR ──────────────────────── */}
        <circle cx="210" cy="94" r="14" fill="#0A0A0A" stroke="rgba(0,200,83,0.2)" strokeWidth="1">
          {a && <animate attributeName="stroke" values="rgba(0,200,83,0.2);rgba(0,200,83,0.6);rgba(0,200,83,0.2)" dur="2.5s" repeatCount="indefinite"/>}
        </circle>
        {/* Mic icon inside */}
        <rect x="206.5" y="86" width="7" height="12" rx="3.5" fill="#00C853"/>
        <path d="M203 95 A7 7 0 0 0 217 95" stroke="#00C853" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <line x1="210" y1="102" x2="210" y2="106" stroke="#00C853" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="207" y1="106" x2="213" y2="106" stroke="#00C853" strokeWidth="1.2" strokeLinecap="round"/>

        {/* Pulse rings around mic */}
        <circle cx="210" cy="94" r="18" fill="none" stroke="rgba(0,200,83,0.15)" strokeWidth="1">
          {a && <animate attributeName="r" values="18;24;18" dur="2.5s" repeatCount="indefinite"/>}
          {a && <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite"/>}
        </circle>
        <circle cx="210" cy="94" r="22" fill="none" stroke="rgba(0,200,83,0.08)" strokeWidth="0.8">
          {a && <animate attributeName="r" values="22;30;22" dur="2.5s" repeatCount="indefinite" begin="0.6s"/>}
          {a && <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" begin="0.6s"/>}
        </circle>

        {/* ── SCORE BAR ──────────────────────────────────────── */}
        <rect x="163" y="114" width="94" height="3" rx="1.5" fill="#111"/>
        <rect x="163" y="114" width="72" height="3" rx="1.5" fill="#00C853">
          {a && <animate attributeName="width" values="30;72;30" dur="4s" repeatCount="indefinite"/>}
        </rect>
        <text x="163" y="124" fill="rgba(255,255,255,0.3)" fontSize="4.5" fontFamily="monospace">SCORE</text>
        <text x="257" y="124" fill="#00C853" fontSize="4.5" fontFamily="monospace" textAnchor="end">76%</text>

        {/* ── 4 MODE TABS ────────────────────────────────────── */}
        {[
          { label:'Resume', x:163 },
          { label:'HR', x:189 },
          { label:'Intro', x:208 },
          { label:'URL', x:229 },
        ].map((tab, i) => (
          <g key={tab.label}>
            <rect x={tab.x} y="128" width={i===0?24:18} height="9" rx="2"
              fill={i===0 ? 'rgba(0,200,83,0.2)' : '#0C0C0C'}
              stroke={i===0 ? '#00C853' : 'rgba(255,255,255,0.04)'} strokeWidth="0.6"/>
            <text x={tab.x + (i===0?12:9)} y="135" fill={i===0?'#00C853':'rgba(255,255,255,0.25)'}
              fontSize="4" fontFamily="monospace" fontWeight={i===0?'bold':'normal'} textAnchor="middle">{tab.label}</text>
          </g>
        ))}

        {/* ── POLLY WAVEFORM BAR at bottom ───────────────────── */}
        <text x="163" y="148" fill="rgba(255,255,255,0.2)" fontSize="4" fontFamily="monospace">AI VOICE</text>
        {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88].map((offset, i) => {
          const h = [4,7,10,14,10,7,12,16,10,6,14,9,13,6,10,14,8,12,7,10,14,8,5][i] || 6;
          return (
            <rect key={offset} x={163 + offset} y={158 - h/2} width="2.5" height={h} rx="1" fill="rgba(0,200,83,0.5)">
              {a && <animate attributeName="height" values={`${h};${Math.max(2,h*1.6)};${h}`} dur={`${0.4 + i*0.07}s`} repeatCount="indefinite"/>}
              {a && <animate attributeName="y" values={`${158-h/2};${158-h*0.8};${158-h/2}`} dur={`${0.4+i*0.07}s`} repeatCount="indefinite"/>}
            </rect>
          );
        })}

        {/* ── LEFT PANEL: Stack badges ───────────────────────── */}
        <text x="12" y="28" fill="rgba(0,200,83,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">STACK</text>
        {[
          { label:'Flutter/Dart', y:40 },
          { label:'AWS Lambda', y:54 },
          { label:'Bedrock LLM', y:68 },
          { label:'Amazon Polly', y:82 },
          { label:'DynamoDB', y:96 },
          { label:'Firebase Auth', y:110 },
          { label:'Textract', y:124 },
          { label:'AWS SAM', y:138 },
        ].map(({ label, y }) => (
          <g key={label}>
            <rect x="8" y={y-8} width="62" height="10" rx="3" fill="#0A0A0A" stroke="rgba(0,200,83,0.12)" strokeWidth="0.6"/>
            <text x="39" y={y} fill="rgba(0,200,83,0.6)" fontSize="5" fontFamily="monospace" textAnchor="middle">{label}</text>
          </g>
        ))}

        {/* ── RIGHT PANEL: Scoring dimensions ───────────────── */}
        <text x="278" y="28" fill="rgba(0,200,83,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">REAL-TIME SCORE</text>
        {[
          { dim:'Relevance',  pct: 82, y: 42 },
          { dim:'Clarity',    pct: 75, y: 60 },
          { dim:'Depth',      pct: 68, y: 78 },
          { dim:'Confidence', pct: 80, y: 96 },
          { dim:'Structure',  pct: 71, y: 114 },
        ].map(({ dim, pct, y }) => (
          <g key={dim}>
            <text x="278" y={y} fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace">{dim}</text>
            <rect x="278" y={y+3} width="120" height="4" rx="2" fill="#0E0E0E"/>
            <rect x="278" y={y+3} width={pct * 1.2} height="4" rx="2" fill="url(#scoreGrad)">
              {a && <animate attributeName="width" values={`${pct*0.5};${pct*1.2};${pct*0.9};${pct*1.2}`} dur="3s" repeatCount="indefinite"/>}
            </rect>
            <text x="405" y={y+7} fill="#00C853" fontSize="5" fontFamily="monospace" textAnchor="end">{pct}%</text>
          </g>
        ))}

        {/* ── FCM Notification badge (bottom right) ──────────── */}
        <rect x="278" y="132" width="130" height="38" rx="6" fill="#0A0A0A" stroke="rgba(0,200,83,0.15)" strokeWidth="0.8">
          {a && <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>}
        </rect>
        <circle cx="288" cy="143" r="4" fill="rgba(0,200,83,0.2)" stroke="#00C853" strokeWidth="0.8"/>
        <text x="288" y="145.5" fill="#00C853" fontSize="5" fontFamily="monospace" textAnchor="middle">✓</text>
        <text x="296" y="142" fill="rgba(255,255,255,0.6)" fontSize="5" fontFamily="monospace" fontWeight="bold">Session Complete!</text>
        <text x="296" y="151" fill="rgba(255,255,255,0.3)" fontSize="4.5" fontFamily="monospace">Feedback report sent via FCM</text>
        <text x="296" y="161" fill="#00C853" fontSize="4" fontFamily="monospace">Claude 3 Haiku • Detailed analysis</text>

        {/* ── Gradient def ───────────────────────────────────── */}
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00C853"/>
            <stop offset="100%" stopColor="#69F0AE"/>
          </linearGradient>
        </defs>

      </svg>
    </div>
  );
};

export default ProjectQlue;
