import { useReducedMotion } from '../hooks/useReducedMotion';

const ProjectXpensia = () => {
  const prefersReducedMotion = useReducedMotion();
  const a = !prefersReducedMotion;

  return (
    <div className="relative w-full h-52 flex items-center justify-center bg-[#030303] rounded-xl overflow-hidden border border-[rgba(0,200,83,0.12)] group-hover:border-[rgba(0,200,83,0.28)] transition-all duration-300">

      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(0,200,83,0.06)_0%,transparent_70%)] pointer-events-none" />

      <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">

        {/* Grid */}
        {[40,80,120,160,200,240,280,320,360,400].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="180" stroke="rgba(0,200,83,0.022)" strokeWidth="1"/>
        ))}
        {[45,90,135].map(y => (
          <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(0,200,83,0.022)" strokeWidth="1"/>
        ))}

        {/* ── PHONE FRAME (center) ───────────────────────────── */}
        <rect x="155" y="8" width="110" height="164" rx="14" fill="#0A0A0A" stroke="rgba(0,200,83,0.35)" strokeWidth="1.5"/>
        <rect x="188" y="12" width="44" height="6" rx="3" fill="#111"/>
        <rect x="159" y="22" width="102" height="148" rx="6" fill="#050505"/>

        {/* Header bar */}
        <rect x="159" y="22" width="102" height="20" rx="6" fill="#0C0C0C"/>
        <rect x="159" y="34" width="102" height="8" fill="#0C0C0C"/>
        <text x="179" y="35" fill="#00C853" fontSize="6.5" fontFamily="monospace" fontWeight="bold">xpensia</text>
        {/* Fingerprint icon (biometric) */}
        <circle cx="252" cy="32" r="5" fill="rgba(0,200,83,0.1)" stroke="rgba(0,200,83,0.4)" strokeWidth="0.8"/>
        <text x="252" y="34.5" fill="#00C853" fontSize="5.5" fontFamily="monospace" textAnchor="middle">🔒</text>

        {/* ── BALANCE CARD ───────────────────────────────────── */}
        <rect x="163" y="46" width="94" height="30" rx="5" fill="#0D0D0D" stroke="rgba(0,200,83,0.12)" strokeWidth="0.8"/>
        <text x="210" y="56" fill="rgba(255,255,255,0.3)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">TOTAL BALANCE</text>
        <text x="210" y="68" fill="#00C853" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">₹24,580</text>

        {/* ── MINI CHART (fl_chart bars) ─────────────────────── */}
        <text x="165" y="85" fill="rgba(255,255,255,0.2)" fontSize="4" fontFamily="monospace">MONTHLY TREND</text>
        {[
          { x:165, h:16, type:'C' },
          { x:175, h:10, type:'D' },
          { x:185, h:20, type:'C' },
          { x:195, h:8,  type:'D' },
          { x:205, h:18, type:'C' },
          { x:215, h:12, type:'D' },
          { x:225, h:22, type:'C' },
          { x:235, h:9,  type:'D' },
          { x:245, h:15, type:'C' },
        ].map(({ x, h, type }, i) => (
          <rect key={x} x={x} y={110-h} width="7" height={h} rx="2"
            fill={type === 'C' ? 'rgba(0,200,83,0.6)' : 'rgba(255,80,80,0.4)'}>
            {a && <animate attributeName="height" values={`${h*0.4};${h};${h*0.4}`}
              dur={`${1.8 + i*0.2}s`} repeatCount="indefinite"/>}
            {a && <animate attributeName="y" values={`${110-h*0.4};${110-h};${110-h*0.4}`}
              dur={`${1.8+i*0.2}s`} repeatCount="indefinite"/>}
          </rect>
        ))}

        {/* ── TRANSACTION LIST ───────────────────────────────── */}
        {[
          { label:'Amazon Pay',   amt:'-₹899',  cat:'Shopping', color:'rgba(255,80,80,0.7)',  y:118 },
          { label:'Salary Credit', amt:'+₹15k', cat:'Income',   color:'rgba(0,200,83,0.8)',  y:131 },
          { label:'Swiggy',       amt:'-₹340',  cat:'Food',     color:'rgba(255,80,80,0.7)',  y:144 },
        ].map(({ label, amt, color, y }) => (
          <g key={label}>
            <rect x="163" y={y-7} width="94" height="11" rx="3" fill="#0C0C0C" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            <circle cx="170" cy={y-1.5} r="3" fill={color} opacity="0.8"/>
            <text x="176" y={y+1} fill="rgba(255,255,255,0.5)" fontSize="4.5" fontFamily="monospace">{label}</text>
            <text x="254" y={y+1} fill={color} fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="end">{amt}</text>
          </g>
        ))}

        {/* SMS auto-detect badge */}
        <rect x="163" y="158" width="94" height="10" rx="3" fill="rgba(0,200,83,0.08)" stroke="rgba(0,200,83,0.2)" strokeWidth="0.6">
          {a && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>}
        </rect>
        <text x="210" y="165" fill="#00C853" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          📩 SMS auto-detected: ₹899 debited
        </text>

        {/* ── LEFT PANEL: Feature list ───────────────────────── */}
        <text x="12" y="22" fill="rgba(0,200,83,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">FEATURES</text>
        {[
          { icon:'🔥', label:'Firebase Auth',    y:36 },
          { icon:'🔍', label:'Google Sign-In',   y:51 },
          { icon:'📩', label:'SMS Auto-Import',  y:66 },
          { icon:'🔒', label:'Biometric Lock',   y:81 },
          { icon:'📊', label:'FL Charts',        y:96 },
          { icon:'📅', label:'Table Calendar',   y:111 },
          { icon:'📤', label:'CSV/PDF Export',   y:126 },
          { icon:'💎', label:'Glassmorphism UI', y:141 },
        ].map(({ icon, label, y }) => (
          <g key={label}>
            <rect x="6" y={y-9} width="70" height="11" rx="3" fill="#0A0A0A" stroke="rgba(0,200,83,0.1)" strokeWidth="0.6"/>
            <text x="12" y={y} fill="rgba(255,255,255,0.4)" fontSize="5" fontFamily="monospace">{icon} {label}</text>
          </g>
        ))}

        {/* ── RIGHT PANEL: MongoDB schema + stats ───────────── */}
        <text x="278" y="22" fill="rgba(0,200,83,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">MONGODB SCHEMA</text>
        {/* Schema box */}
        <rect x="278" y="28" width="132" height="68" rx="5" fill="#070707" stroke="rgba(0,200,83,0.12)" strokeWidth="0.8"/>
        {[
          { field:'_id',      type:'ObjectId', y:40 },
          { field:'userId',   type:'string',   y:51 },
          { field:'title',    type:'string',   y:62 },
          { field:'amount',   type:'number',   y:73 },
          { field:'category', type:'enum[5]',  y:84 },
          { field:'type',     type:'CR|DR',    y:95 },
        ].map(({ field, type, y }) => (
          <g key={field}>
            <text x="285" y={y} fill="#00C853" fontSize="5" fontFamily="monospace">{field}</text>
            <text x="318" y={y} fill="rgba(255,255,255,0.25)" fontSize="5" fontFamily="monospace">: {type}</text>
          </g>
        ))}

        {/* Stats row */}
        <text x="278" y="110" fill="rgba(0,200,83,0.5)" fontSize="5.5" fontFamily="monospace" fontWeight="bold">API ENDPOINTS</text>
        {[
          { method:'POST',   path:'/add',    color:'#00C853', y:125 },
          { method:'GET',    path:'/all',    color:'#69F0AE', y:136 },
          { method:'PUT',    path:'/update', color:'#FFB300', y:147 },
          { method:'DELETE', path:'/delete', color:'rgba(255,80,80,0.9)', y:158 },
        ].map(({ method, path, color, y }) => (
          <g key={path}>
            <rect x="278" y={y-8} width="130" height="10" rx="3" fill="#080808" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
            <rect x="278" y={y-8} width="28" height="10" rx="3" fill={color} opacity="0.15"/>
            <text x="292" y={y} fill={color} fontSize="4.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">{method}</text>
            <text x="310" y={y} fill="rgba(255,255,255,0.4)" fontSize="4.5" fontFamily="monospace">/transactions{path}</text>
          </g>
        ))}

        {/* Deploy badge */}
        <rect x="278" y="168" width="130" height="10" rx="3" fill="rgba(0,200,83,0.05)" stroke="rgba(0,200,83,0.2)" strokeWidth="0.6">
          {a && <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/>}
        </rect>
        <text x="343" y="175" fill="rgba(0,200,83,0.7)" fontSize="4.5" fontFamily="monospace" textAnchor="middle">
          Render + Firebase · Free Tier ✓
        </text>

      </svg>
    </div>
  );
};

export default ProjectXpensia;
