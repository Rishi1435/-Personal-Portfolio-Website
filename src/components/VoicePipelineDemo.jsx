import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/*
 * Live voice-pipeline demo — the front-end half of Qlue's VAD/STT/TTS loop,
 * running entirely in the browser with no backend.
 *
 * - Tap-to-toggle mic (getUserMedia). Tap-to-toggle rather than press-and-hold
 *   so it doesn't fight touch-scrolling on mobile.
 * - A Web Audio AnalyserNode feeds a live <canvas> bar waveform.
 * - Real amplitude-threshold VAD over a rolling RMS window; a horizontal line
 *   marks the threshold and the meter flags when the signal crosses it.
 * - Once speech has been heard, dropping below threshold starts a silence
 *   countdown that ends the "turn" — mirroring VAD end-of-turn detection.
 * - On end-of-turn / manual stop we surface a SAMPLE transcript and a clearly
 *   labelled SIMULATED latency breakdown. No real STT is wired (front-end demo).
 */

const THRESHOLD = 0.045;      // normalized RMS considered "voice"
const SILENCE_MS = 1500;      // end-of-turn after this much sub-threshold audio
const ROLL = 6;               // rolling-window frames for RMS smoothing
const BARS = 48;

const SAMPLE_TRANSCRIPT =
  '"I built the real-time voice pipeline on Qlue with a WebSocket stream, ' +
  'server-side VAD for end-of-turn detection, and Amazon Polly for the reply."';

const buildSimLatency = () => {
  const r = (a, b) => Math.round(a + Math.random() * (b - a));
  const vad = r(30, 55);
  const stt = r(150, 260);
  const llm = r(420, 680);
  const tts = r(140, 240);
  return { vad, stt, llm, tts, total: vad + stt + llm + tts };
};

const VoicePipelineDemo = () => {
  const prefersReducedMotion = useReducedMotion();
  const [status, setStatus] = useState('idle'); // idle|requesting|listening|speaking|ended|denied|unsupported
  const [energy, setEnergy] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [result, setResult] = useState(null); // { transcript, latency }

  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const rollingRef = useRef([]);
  const hasSpokenRef = useRef(false);
  const silenceStartRef = useRef(null);
  const lastUiRef = useRef(0);
  const endingRef = useRef(false);
  // Canvas can't parse var()/color-mix, so resolve the theme tokens to real
  // color strings at runtime (fallbacks are only for the impossible no-CSS case).
  const colorsRef = useRef({ accent: 'limegreen', glow: 'springgreen' });

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement);
    const accent = cs.getPropertyValue('--color-accent').trim();
    const glow = cs.getPropertyValue('--color-accent-glow').trim();
    colorsRef.current = { accent: accent || 'limegreen', glow: glow || 'springgreen' };
  }, []);

  const teardown = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    analyserRef.current = null;
    rollingRef.current = [];
    silenceStartRef.current = null;
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  const finalize = useCallback(() => {
    if (endingRef.current) return;
    endingRef.current = true;
    teardown();
    setCountdown(null);
    setEnergy(0);
    setResult({ transcript: SAMPLE_TRANSCRIPT, latency: buildSimLatency() });
    setStatus('ended');
  }, [teardown]);

  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  }, []);

  // Kicks off the per-frame analyse+draw loop. A hoisted `frame` function
  // reschedules itself cleanly (no self-referencing const).
  const startLoop = useCallback(() => {
    function frame() {
      const analyser = analyserRef.current;
      const canvas = canvasRef.current;
      if (!analyser || !canvas) return;

      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);

      // RMS over the frame, normalized to [0,1].
      let sumSq = 0;
      for (let i = 0; i < data.length; i++) {
        const n = (data[i] - 128) / 128;
        sumSq += n * n;
      }
      const rms = Math.sqrt(sumSq / data.length);

      const roll = rollingRef.current;
      roll.push(rms);
      if (roll.length > ROLL) roll.shift();
      const smooth = roll.reduce((a, b) => a + b, 0) / roll.length;
      const active = smooth > THRESHOLD;

      // --- VAD end-of-turn state machine ---
      const now = performance.now();
      if (active) {
        hasSpokenRef.current = true;
        silenceStartRef.current = null;
      } else if (hasSpokenRef.current) {
        if (silenceStartRef.current == null) silenceStartRef.current = now;
        const remaining = SILENCE_MS - (now - silenceStartRef.current);
        if (remaining <= 0) { finalize(); return; }
      }

      // --- draw bar waveform + threshold line ---
      const ctx = canvas.getContext('2d');
      const { width: w, height: h } = canvas;
      const mid = h / 2;
      ctx.clearRect(0, 0, w, h);

      const { accent, glow } = colorsRef.current;

      // threshold reference line (mirrored around centre)
      const thY = THRESHOLD * mid * 6; // visual gain so the line sits sensibly
      ctx.save();
      ctx.strokeStyle = active ? glow : 'rgba(255,255,255,0.18)';
      ctx.globalAlpha = active ? 0.7 : 1;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, mid - thY); ctx.lineTo(w, mid - thY);
      ctx.moveTo(0, mid + thY); ctx.lineTo(w, mid + thY); ctx.stroke();
      ctx.restore();

      const barW = w / BARS;
      const step = Math.floor(data.length / BARS);
      ctx.save();
      ctx.fillStyle = active ? glow : accent;
      ctx.globalAlpha = active ? 1 : 0.55;
      for (let b = 0; b < BARS; b++) {
        let peak = 0;
        for (let i = 0; i < step; i++) {
          const n = Math.abs((data[b * step + i] - 128) / 128);
          if (n > peak) peak = n;
        }
        const gain = 6; // amplify quiet mic input for a legible waveform
        const barH = Math.min(mid, peak * mid * gain);
        const x = b * barW + 1;
        ctx.fillRect(x, mid - barH, barW - 2, barH * 2 || 1);
      }
      ctx.restore();

      // Throttle React state updates (~10/s) so the canvas stays at 60fps.
      if (now - lastUiRef.current > 100) {
        lastUiRef.current = now;
        setEnergy(smooth);
        setStatus(active ? 'speaking' : 'listening');
        setCountdown(
          !active && silenceStartRef.current != null
            ? Math.max(0, (SILENCE_MS - (now - silenceStartRef.current)) / 1000)
            : null
        );
      }

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
  }, [finalize]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === 'undefined') {
      setStatus('unsupported');
      return;
    }
    setStatus('requesting');
    setResult(null);
    endingRef.current = false;
    hasSpokenRef.current = false;
    silenceStartRef.current = null;
    rollingRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      await ctx.resume();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = prefersReducedMotion ? 0 : 0.6;
      ctx.createMediaStreamSource(stream).connect(analyser);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setStatus('listening');
      startLoop();
    } catch {
      // NotAllowedError / SecurityError etc. — fail gracefully, don't crash.
      setStatus('denied');
    }
  }, [startLoop, prefersReducedMotion]);

  const stop = useCallback(() => {
    if (hasSpokenRef.current) finalize();
    else { teardown(); setStatus('idle'); setEnergy(0); setCountdown(null); }
  }, [finalize, teardown]);

  const toggle = () => {
    if (status === 'listening' || status === 'speaking' || status === 'requesting') stop();
    else start();
  };

  // Size the canvas backing store to its rendered box for crisp bars.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    if (status === 'idle' || status === 'ended') drawIdle();
  }, [status, drawIdle]);

  const isRecording = status === 'listening' || status === 'speaking';
  const active = status === 'speaking';

  const statusLabel = {
    idle: 'Tap the mic and speak',
    requesting: 'Requesting microphone…',
    listening: 'Listening — waiting for speech',
    speaking: 'Voice detected',
    ended: 'Turn complete',
    denied: 'Microphone blocked',
    unsupported: 'Mic capture unavailable',
  }[status];

  return (
    <div className="glass-card-featured p-5 md:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">
            // LIVE VOICE PIPELINE
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/40 tracking-wider uppercase">
          VAD · client-side demo
        </span>
      </div>

      <p className="font-body text-[#a0a0b8] text-xs md:text-sm leading-relaxed mb-5">
        The tech behind Qlue's &lt;2s response loop. This runs a real amplitude
        threshold over your live mic — watch the waveform cross the threshold
        line, then pause and the silence timer ends your turn.
      </p>

      {(status === 'denied' || status === 'unsupported') ? (
        /* Graceful fallback — page keeps working */
        <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-6 text-center">
          <p className="font-body text-sm text-white mb-1">
            {status === 'denied' ? 'Microphone access was blocked.' : 'Live mic capture isn’t available here.'}
          </p>
          <p className="font-body text-xs text-[#a0a0b8] leading-relaxed">
            No problem — on Qlue the same pipeline runs server-side: WebSocket audio
            streaming, energy-threshold VAD for end-of-turn detection, STT, an LLM
            interviewer, and Amazon Polly TTS — round-trip under two seconds.
          </p>
          {status === 'denied' && (
            <button
              type="button"
              onClick={() => { setStatus('idle'); }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-body font-bold uppercase tracking-wider border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black transition-colors cursor-pointer"
            >
              Try again
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Waveform */}
          <div className="relative rounded-2xl border border-white/[0.08] bg-black/50 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-32 md:h-36 block" />
            {/* threshold badge */}
            <div className="absolute top-2 right-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider">
              <span className={`w-2 h-2 rounded-full ${active ? 'bg-[var(--color-accent-glow)] animate-pulse' : 'bg-white/25'}`} />
              <span className={active ? 'text-[var(--color-accent-glow)]' : 'text-white/40'}>
                {active ? 'above threshold' : 'threshold'}
              </span>
            </div>
            {status === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-xs text-white/30">— idle —</span>
              </div>
            )}
          </div>

          {/* Controls + telemetry */}
          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={toggle}
              aria-pressed={isRecording}
              aria-label={isRecording ? 'Stop microphone' : 'Start microphone'}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${
                isRecording
                  ? 'bg-[var(--color-accent)] text-black shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_50%,transparent)]'
                  : 'bg-white/[0.06] text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_18%,transparent)]'
              }`}
            >
              {isRecording && !prefersReducedMotion && (
                <span className="absolute inset-0 rounded-full border border-[var(--color-accent)] animate-ping" />
              )}
              {isRecording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 01-14 0M12 19v3" />
                </svg>
              )}
            </button>

            <div className="flex-1 min-w-[140px]">
              <div className="font-body text-sm text-white font-semibold" role="status" aria-live="polite">
                {statusLabel}
              </div>
              {/* energy meter */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden" aria-hidden="true">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round((energy / (THRESHOLD * 3)) * 100))}%`,
                    background: active ? 'var(--color-accent-glow)' : 'var(--color-accent)',
                    transition: prefersReducedMotion ? 'none' : 'width 80ms linear',
                  }}
                />
              </div>
            </div>

            {countdown != null && (
              <div className="text-center flex-shrink-0">
                <div className="font-display font-black text-2xl text-[var(--color-accent-glow)] tabular-nums">
                  {countdown.toFixed(1)}s
                </div>
                <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">end-of-turn</div>
              </div>
            )}
          </div>

          {/* Result */}
          {status === 'ended' && result && (
            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/40 p-4 space-y-3">
              <div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Sample transcript (demo — no STT wired)</span>
                <p className="font-body text-sm text-white mt-1 italic">{result.transcript}</p>
              </div>
              <div>
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Simulated pipeline latency</span>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-[#a0a0b8]">
                  <span>VAD {result.latency.vad}ms</span>
                  <span>STT {result.latency.stt}ms</span>
                  <span>LLM {result.latency.llm}ms</span>
                  <span>TTS {result.latency.tts}ms</span>
                  <span className="text-[var(--color-accent-glow)] font-bold">→ {(result.latency.total / 1000).toFixed(2)}s total</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VoicePipelineDemo;
