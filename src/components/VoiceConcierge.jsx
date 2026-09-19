import { useState, useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/*
 * AI voice concierge — an overlay (never a route) that answers questions about
 * Rishi. Turn-based (press-to-talk), not real-time.
 *
 * STT is two-tier so it works on every browser, free:
 *   1. Native SpeechRecognition (Chrome/Edge, most Android) — no download.
 *   2. Fallback: client-side Whisper via transformers.js (WASM), loaded on demand
 *      from a CDN so it never enters our bundle; the model is cached by the
 *      browser after first use. Works in Firefox/Safari/iOS.
 *   3. A typed input is always visible as the last-resort fallback.
 * TTS uses the native SpeechSynthesis API. The answer + optional section come
 * from /api/ask (the model never runs client-side).
 */

const SECTION_TARGETS = {
  hero: '#home', about: '#about', experience: '#about',
  skills: '#skills', qlue: '#qlue-card', xpensia: '#xpensia-card',
  projects: '#projects', contact: '#contact',
};

const TRANSFORMERS_CDN = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.6';
const WHISPER_MODEL = 'Xenova/whisper-tiny.en';

// Optional HD voice: Kokoro (the most natural open TTS right now), loaded on
// demand from a CDN (never bundled), q8 quantized (~80MB one-time, browser-cached).
// Opt-in only — default TTS stays the free, zero-download native voice.
const KOKORO_CDN = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
const KOKORO_MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';
const KOKORO_VOICE = 'af_heart'; // top-graded natural American voice

// Rank the browser's available voices so we pick the most natural one instead of
// whatever robotic default the OS hands out. Prefers neural/cloud voices
// (Microsoft "…Online (Natural)" on Edge, "Google …" on Chrome, Apple premium)
// and demotes the old SAPI voices (David/Zira/Mark/Hazel).
const scoreVoice = (v) => {
  const lang = (v.lang || '').toLowerCase();
  if (!lang.startsWith('en')) return -1;
  const n = (v.name || '').toLowerCase();
  let s = lang === 'en-us' ? 3 : lang === 'en-gb' ? 2 : 1;
  if (/natural|online/.test(n)) s += 20;                 // MS neural (Edge)
  if (/premium|enhanced|siri/.test(n)) s += 16;          // Apple premium
  if (/\bgoogle\b/.test(n)) s += 12;                     // Chrome
  if (/aria|jenny|guy|libby|emma|michelle|ava|zoe|samantha|serena|allison|nicky|sonia|ryan/.test(n)) s += 8;
  if (v.localService === false) s += 4;                  // network voices are usually better
  if (/david|zira|mark|hazel|susan|george/.test(n)) s -= 6; // legacy robotic SAPI
  return s;
};
const pickBestVoice = (voices) => {
  const en = (voices || []).filter((v) => (v.lang || '').toLowerCase().startsWith('en'));
  if (!en.length) return null;
  return en.map((v) => [scoreVoice(v), v]).sort((a, b) => b[0] - a[0])[0][1];
};

const getNativeSR = () =>
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

// Decode a recorded blob to mono 16 kHz Float32 for Whisper.
async function blobToMono16k(blob) {
  const buf = await blob.arrayBuffer();
  const Ctx = window.AudioContext || window.webkitAudioContext;
  const ctx = new Ctx();
  const audio = await ctx.decodeAudioData(buf);
  const data = audio.getChannelData(0);
  const rate = audio.sampleRate;
  await ctx.close();
  if (rate === 16000) return data;
  const ratio = rate / 16000;
  const out = new Float32Array(Math.round(data.length / ratio));
  for (let i = 0; i < out.length; i++) out[i] = data[Math.floor(i * ratio)];
  return out;
}

const VoiceConcierge = () => {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle | listening | thinking | speaking
  const [engine, setEngine] = useState(() => (getNativeSR() ? 'native' : 'wasm'));
  const [modelStatus, setModelStatus] = useState('unloaded'); // unloaded | loading | ready
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [notice, setNotice] = useState('');
  const [typed, setTyped] = useState('');
  const [hdVoice, setHdVoice] = useState(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('hdVoice') === '1'
  );
  const [ttsStatus, setTtsStatus] = useState('idle'); // idle | loading | ready

  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const recognitionRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const transcriberRef = useRef(null);
  const lastHighlight = useRef(null);
  const voicesRef = useRef([]);
  const bestVoiceRef = useRef(null);
  const kokoroRef = useRef(null);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);

  // Voices load asynchronously; cache them and keep the best pick fresh.
  useEffect(() => {
    if (typeof speechSynthesis === 'undefined') return;
    const load = () => {
      voicesRef.current = speechSynthesis.getVoices();
      bestVoiceRef.current = pickBestVoice(voicesRef.current);
    };
    load();
    speechSynthesis.addEventListener?.('voiceschanged', load);
    return () => speechSynthesis.removeEventListener?.('voiceschanged', load);
  }, []);

  const speakNative = useCallback((text) => {
    if (typeof speechSynthesis === 'undefined') { setPhase('idle'); return; }
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      // Voices may not have been ready at mount — re-pick if needed.
      const voice = bestVoiceRef.current || pickBestVoice(speechSynthesis.getVoices());
      if (voice) u.voice = voice;
      u.lang = voice?.lang || 'en-US';
      u.rate = 1; u.pitch = 1; u.volume = 1;
      u.onend = () => setPhase('idle');
      u.onerror = () => setPhase('idle');
      setPhase('speaking');
      speechSynthesis.speak(u);
    } catch { setPhase('idle'); }
  }, []);

  // Load Kokoro on demand (from CDN, cached by the browser after first use).
  const loadKokoro = useCallback(async () => {
    if (kokoroRef.current) return kokoroRef.current;
    setTtsStatus('loading');
    const mod = await import(/* @vite-ignore */ KOKORO_CDN);
    const tts = await mod.KokoroTTS.from_pretrained(KOKORO_MODEL, { dtype: 'q8', device: 'wasm' });
    kokoroRef.current = tts;
    setTtsStatus('ready');
    return tts;
  }, []);

  const speakHD = useCallback(async (text) => {
    setPhase('speaking');
    try {
      const tts = await loadKokoro();
      const audio = await tts.generate(text, { voice: KOKORO_VOICE });
      const url = URL.createObjectURL(audio.toBlob());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = url;
      if (!audioRef.current) audioRef.current = new Audio();
      const el = audioRef.current;
      el.src = url;
      el.onended = () => setPhase('idle');
      el.onerror = () => setPhase('idle');
      await el.play();
    } catch {
      // Any failure (CDN/model/inference) → fall back to the free native voice.
      setTtsStatus('idle');
      speakNative(text);
    }
  }, [loadKokoro, speakNative]);

  const speak = useCallback((text) => {
    if (hdVoice) speakHD(text);
    else speakNative(text);
  }, [hdVoice, speakHD, speakNative]);

  const highlightSection = useCallback((section) => {
    const sel = SECTION_TARGETS[section];
    const el = sel && document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (lastHighlight.current) lastHighlight.current.classList.remove('section-highlight');
    // restart the animation
    void el.offsetWidth;
    el.classList.add('section-highlight');
    lastHighlight.current = el;
    setTimeout(() => el.classList.remove('section-highlight'), 2000);
  }, [prefersReducedMotion]);

  const ask = useCallback(async (q) => {
    const text = (q || '').trim();
    if (!text) return;
    setQuestion(text);
    setAnswer('');
    setNotice('');
    setPhase('thinking');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 70000);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAnswer(data.error || 'The assistant is unavailable right now. Please email pediredlarishi2005@gmail.com.');
        setPhase('idle');
        return;
      }
      setAnswer(data.answer || '');
      if (data.section) highlightSection(data.section);
      if (data.answer) speak(data.answer);
      else setPhase('idle');
    } catch (err) {
      setAnswer(
        err?.name === 'AbortError'
          ? 'That took too long — please try again, or email pediredlarishi2005@gmail.com.'
          : 'The assistant is unavailable right now. Please email pediredlarishi2005@gmail.com.'
      );
      setPhase('idle');
    } finally {
      clearTimeout(timer);
    }
  }, [highlightSection, speak]);

  // ── Native SpeechRecognition ──────────────────────────────
  const stopEverything = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch { /* noop */ }
    try { mediaRef.current?.state === 'recording' && mediaRef.current.stop(); } catch { /* noop */ }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    try { audioRef.current?.pause(); } catch { /* noop */ }
  }, []);

  const startNative = useCallback(() => {
    const SR = getNativeSR();
    if (!SR) { setEngine('wasm'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => { ask(e.results[0][0].transcript); };
    rec.onerror = (e) => {
      setPhase('idle');
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        setNotice('Microphone blocked — type your question below instead.');
      }
    };
    rec.onend = () => setPhase((p) => (p === 'listening' ? 'idle' : p));
    recognitionRef.current = rec;
    try { rec.start(); setPhase('listening'); }
    catch { setPhase('idle'); }
  }, [ask]);

  // ── WASM Whisper fallback ─────────────────────────────────
  const loadTranscriber = useCallback(async () => {
    if (transcriberRef.current) return transcriberRef.current;
    setModelStatus('loading');
    try {
      const mod = await import(/* @vite-ignore */ TRANSFORMERS_CDN);
      const t = await mod.pipeline('automatic-speech-recognition', WHISPER_MODEL);
      transcriberRef.current = t;
      setModelStatus('ready');
      return t;
    } catch {
      setModelStatus('unloaded');
      setNotice('Voice model failed to load — type your question below instead.');
      return null;
    }
  }, []);

  const startWasm = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setNotice('Voice input isn’t supported here — type your question below.');
      return;
    }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setNotice('Microphone blocked — type your question below instead.'); return; }
    streamRef.current = stream;
    // Kick off model load in parallel with recording.
    loadTranscriber();
    chunksRef.current = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
    rec.onstop = async () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
      const transcriber = await loadTranscriber();
      if (!transcriber) { setPhase('idle'); return; }
      setPhase('thinking');
      try {
        const audio = await blobToMono16k(blob);
        const out = await transcriber(audio);
        const t = (out?.text || '').trim();
        if (t) ask(t);
        else { setNotice('Didn’t catch that — try again or type below.'); setPhase('idle'); }
      } catch {
        setNotice('Transcription failed — type your question below instead.');
        setPhase('idle');
      }
    };
    mediaRef.current = rec;
    rec.start();
    setPhase('listening');
  }, [ask, loadTranscriber]);

  const toggleListening = useCallback(() => {
    if (phase === 'speaking') { try { speechSynthesis.cancel(); } catch { /* noop */ } try { audioRef.current?.pause(); } catch { /* noop */ } setPhase('idle'); return; }
    if (phase === 'listening') {
      if (engine === 'native') { try { recognitionRef.current?.stop(); } catch { /* noop */ } }
      else { try { mediaRef.current?.stop(); } catch { /* noop */ } }
      return;
    }
    if (phase === 'thinking') return;
    if (engine === 'native') startNative();
    else startWasm();
  }, [phase, engine, startNative, startWasm]);

  const submitTyped = (e) => {
    e.preventDefault();
    if (!typed.trim()) return;
    ask(typed);
    setTyped('');
  };

  const toggleHd = (on) => {
    setHdVoice(on);
    try { localStorage.setItem('hdVoice', on ? '1' : '0'); } catch { /* private mode */ }
    setNotice('');
    // Start the one-time model download immediately for feedback.
    if (on && !kokoroRef.current) loadKokoro().catch(() => { setTtsStatus('idle'); setNotice('HD voice failed to load — using the standard voice.'); });
  };

  const closePanel = useCallback(() => {
    stopEverything();
    try { speechSynthesis?.cancel(); } catch { /* noop */ }
    setPhase('idle');
    setOpen(false);
  }, [stopEverything]);

  // Escape closes; focus moves into the panel on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('keydown', onKey);
    requestAnimationFrame(() => panelRef.current?.querySelector('button, input')?.focus());
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closePanel]);

  // Stop any live audio/mic when the panel is not open (no state writes here).
  useEffect(() => {
    if (!open) {
      stopEverything();
      try { speechSynthesis?.cancel(); } catch { /* noop */ }
    }
  }, [open, stopEverything]);

  useEffect(() => () => { stopEverything(); try { speechSynthesis?.cancel(); } catch { /* noop */ } }, [stopEverything]);

  const phaseLabel = {
    idle: 'Tap the mic and ask about Rishi',
    listening: 'Listening…',
    thinking: 'Thinking…',
    speaking: 'Speaking…',
  }[phase];

  const listening = phase === 'listening';

  return (
    <>
      {/* Floating trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Ask about Rishi — voice Q&A"
        className={`fixed right-4 bottom-[4.75rem] md:bottom-6 md:right-6 z-[9995] w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-glow)] text-black shadow-[0_8px_30px_color-mix(in_srgb,var(--color-accent)_50%,transparent)] transition-transform active:scale-95 ${open ? 'scale-0 pointer-events-none' : 'scale-100'} ${prefersReducedMotion ? '' : 'hover:scale-105'}`}
      >
        {!prefersReducedMotion && <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] animate-ping opacity-30" />}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 01-14 0M12 19v3" />
        </svg>
      </button>

      {/* Anchored panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="false"
          aria-label="Ask about Rishi"
          className="fixed right-3 left-3 sm:left-auto bottom-3 sm:bottom-6 sm:right-6 z-[9996] sm:w-[380px] rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${listening ? 'bg-[var(--color-accent-glow)]' : 'bg-[var(--color-accent)]'} ${listening && !prefersReducedMotion ? 'animate-pulse' : ''}`} />
              <span className="font-body text-sm font-semibold text-white">Ask about Rishi</span>
              <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">voice Q&amp;A</span>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="text-white/40 hover:text-white text-xl leading-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] rounded"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4">
            {/* Mic + status */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? 'Stop listening' : 'Start voice question'}
                aria-pressed={listening}
                disabled={phase === 'thinking'}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all cursor-pointer disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] ${
                  listening ? 'bg-[var(--color-accent)] text-black' : 'bg-white/[0.06] text-[var(--color-accent)] border border-[var(--color-accent)]'
                }`}
              >
                {listening && !prefersReducedMotion && <span className="absolute inset-0 rounded-full border border-[var(--color-accent)] animate-ping" />}
                {phase === 'thinking' ? (
                  <svg className={prefersReducedMotion ? '' : 'animate-spin'} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeDasharray="42" opacity="0.7" /></svg>
                ) : listening ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19 12a7 7 0 01-14 0M12 19v3" /></svg>
                )}
              </button>
              <div className="min-w-0" role="status" aria-live="polite">
                <p className="font-body text-sm text-white truncate">{phaseLabel}</p>
                {modelStatus === 'loading' && <p className="font-mono text-[10px] text-[var(--color-accent-glow)]">loading voice model…</p>}
                {engine === 'wasm' && modelStatus !== 'loading' && phase === 'idle' && (
                  <p className="font-mono text-[10px] text-white/40">on-device speech · or type below</p>
                )}
              </div>
            </div>

            {/* Conversation */}
            <div aria-live="polite" className="min-h-[1px]">
              {question && (
                <p className="font-body text-xs text-white/50 mb-1">
                  <span className="text-[var(--color-accent)]">You:</span> {question}
                </p>
              )}
              {answer && (
                <p className="font-body text-sm text-white leading-relaxed bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
                  {answer}
                </p>
              )}
              {notice && <p className="font-body text-xs text-[var(--color-accent-glow)] mt-2">{notice}</p>}
            </div>

            {/* Typed fallback — always available */}
            <form onSubmit={submitTyped} className="flex items-center gap-2">
              <input
                type="text"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                placeholder="…or type a question and press Enter"
                aria-label="Type your question about Rishi"
                maxLength={500}
                className="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button
                type="submit"
                aria-label="Send question"
                className="px-3 py-2 rounded-lg bg-[var(--color-accent)] text-black text-sm font-bold cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)]"
              >
                Ask
              </button>
            </form>

            {/* HD voice — opt-in neural TTS (one-time ~80MB download, cached) */}
            <div className="flex items-center justify-between gap-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hdVoice}
                  onChange={(e) => toggleHd(e.target.checked)}
                  className="accent-[var(--color-accent)] w-3.5 h-3.5"
                />
                <span className="font-mono text-[10px] text-white/60">
                  HD voice{' '}
                  <span className="text-white/30">
                    {ttsStatus === 'loading' ? '· downloading…' : ttsStatus === 'ready' ? '· ready' : '· ~80MB once'}
                  </span>
                </span>
              </label>
            </div>

            <p className="font-mono text-[9px] text-white/25 text-center">
              Turn-based Q&amp;A · answers only about Rishi &amp; his work
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceConcierge;
