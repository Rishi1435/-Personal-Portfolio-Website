import { useState, useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/*
 * Interactive architecture diagram for Qlue's real voice pipeline.
 * Nodes are real <button>s (keyboard-operable, tappable); the connecting flow
 * is decorative SVG/CSS. "Trace request" lights each hop in sequence with a
 * running latency total that sums to the "<2s" stat shown elsewhere. Under
 * reduced motion the trace resolves instantly with every hop timing shown.
 */

// Main request path for a single interview turn, left → right, then back to the
// client. Mirrors the README's "Data Flow — Interview Session": STT runs
// on-device in the Flutter client, the transcript goes up over the WebSocket, an
// async Lambda worker scores + generates via Bedrock, Polly synthesizes, and the
// audio + live score are pushed back down the same socket.
const PIPELINE = [
  {
    id: 'client', label: 'Flutter Client', sub: 'On-device STT',
    chosen: 'One Dart codebase (iOS/Android/web) with on-device speech_to_text, so the transcript is ready the instant the turn ends.',
    rejected: 'Server-side transcription — adds a whole network + STT round trip after every answer.',
    ms: 120, hop: 'Capture + transcribe',
  },
  {
    id: 'gateway', label: 'API Gateway', sub: 'WebSocket',
    chosen: 'API Gateway WebSocket for full-duplex streaming of turn text + state events.',
    rejected: 'REST polling — too laggy for a live spoken conversation.',
    ms: 60, hop: 'Duplex transport',
  },
  {
    id: 'worker', label: 'Async Worker', sub: 'Lambda',
    chosen: 'sendTextHandler → asyncWorker.processUserTurn: saves the transcript, manages a rolling 20-turn context window, then invokes the model.',
    rejected: 'One synchronous handler — would hit the API Gateway timeout on longer turns.',
    ms: 120, hop: 'Orchestrate turn',
  },
  {
    id: 'bedrock', label: 'Bedrock', sub: 'Nemotron-super',
    chosen: 'Nemotron-super-3-120b both scores the answer (per-dimension) and streams the next question via ConverseStream.',
    rejected: 'A generic model — weaker at structured scoring and adaptive interviewing.',
    ms: 900, hop: 'Reason + score',
  },
  {
    id: 'polly', label: 'Amazon Polly', sub: 'Text → speech',
    chosen: 'Neural voices for a natural interviewer; 5 selectable personas (Tiffany, Ruth, Joanna, Matthew, Stephen). Audio lands in S3.',
    rejected: 'On-device TTS — robotic, inconsistent across platforms.',
    ms: 260, hop: 'Synthesize',
  },
  {
    id: 'return', label: 'Client Playback', sub: 'Audio + score',
    chosen: 'Presigned S3 audio URL + live scoring pushed back over the same socket, played via just_audio.',
    rejected: 'Polling for the result — extra round-trips, visible lag.',
    ms: 60, hop: 'Downstream',
  },
];

// Services that sit alongside the main turn path (auth, storage, and the async
// post-session feedback pipeline).
const SUPPORTING = [
  { id: 'firebase', label: 'Firebase Auth', where: 'Email/password + Google sign-in; JWTs validated server-side via Firebase Admin.' },
  { id: 'textract', label: 'Textract', where: 'OCR-parses the uploaded résumé PDF into structured question context.' },
  { id: 's3', label: 'S3', where: 'Stores résumés, Polly audio, and scraped WEBSITE-mode content.' },
  { id: 'dynamodb', label: 'DynamoDB', where: '8 tables: sessions, transcripts, feedback, users, concept states, and more.' },
  { id: 'feedback', label: 'SNS → Claude 3 Haiku', where: 'On session end, an SNS-triggered pipeline has Claude 3 Haiku write the qualitative feedback report.' },
  { id: 'fcm', label: 'FCM', where: 'Delivers the finished feedback report to the phone as a push notification.' },
];

const TOTAL_MS = PIPELINE.reduce((a, n) => a + n.ms, 0); // 1520ms ≈ 1.5s

const QlueArchitecture = () => {
  const prefersReducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(null);
  const [litCount, setLitCount] = useState(0); // how many hops the trace has reached
  const [tracing, setTracing] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timersRef = useRef([]);
  const containerRef = useRef(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const trace = useCallback(() => {
    clearTimers();
    setSelected(null);

    if (prefersReducedMotion) {
      // Instant: everything lit, full timing shown at once.
      setLitCount(PIPELINE.length);
      setElapsed(TOTAL_MS);
      setTracing(false);
      return;
    }

    setTracing(true);
    setLitCount(0);
    setElapsed(0);
    // Step through hops on a fixed watchable cadence; the label shows the real
    // cumulative latency budget, not the animation timing.
    let acc = 0;
    PIPELINE.forEach((node, i) => {
      acc += node.ms;
      const cumulative = acc;
      timersRef.current.push(
        setTimeout(() => {
          setLitCount(i + 1);
          setElapsed(cumulative);
          if (i === PIPELINE.length - 1) setTracing(false);
        }, 200 + i * 340)
      );
    });
  }, [clearTimers, prefersReducedMotion]);

  const reset = useCallback(() => {
    clearTimers();
    setTracing(false);
    setLitCount(0);
    setElapsed(0);
    setSelected(null);
  }, [clearTimers]);

  // Escape closes the open node panel.
  const onKeyDown = (e) => {
    if (e.key === 'Escape' && selected) {
      setSelected(null);
      e.stopPropagation();
    }
  };

  const selectedNode =
    PIPELINE.find((n) => n.id === selected) || SUPPORTING.find((n) => n.id === selected);

  return (
    <div className="glass-card-featured p-5 md:p-7" ref={containerRef} onKeyDown={onKeyDown}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <span className="font-body text-xs text-[var(--color-accent)] font-semibold tracking-widest uppercase">
          // QLUE PIPELINE ARCHITECTURE
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={tracing ? reset : trace}
            className="px-4 py-2 rounded-lg text-xs font-body font-bold uppercase tracking-wider bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-glow)] transition-colors cursor-pointer"
          >
            {tracing ? 'Tracing…' : 'Trace request'}
          </button>
          {(litCount > 0 && !tracing) && (
            <button
              type="button"
              onClick={reset}
              className="px-3 py-2 rounded-lg text-xs font-body font-semibold uppercase tracking-wider border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="font-body text-[#a0a0b8] text-xs md:text-sm leading-relaxed mb-5">
        Tap any hop for what was chosen, what was rejected, and its latency budget.
        Hit <span className="text-white font-semibold">Trace request</span> to watch a
        turn travel the pipeline — the hop timings sum to the sub-2s round trip.
      </p>

      {/* Pipeline nodes */}
      <ul className="flex flex-wrap items-stretch gap-2 md:gap-1.5 list-none">
        {PIPELINE.map((node, i) => {
          const lit = i < litCount;
          const isSel = selected === node.id;
          return (
            <li key={node.id} className="flex items-stretch">
              <button
                type="button"
                onClick={() => setSelected(isSel ? null : node.id)}
                aria-pressed={isSel}
                aria-label={`${node.label}: ${node.hop}, ${node.ms} milliseconds. ${isSel ? 'Selected.' : ''}`}
                className={`relative flex flex-col justify-center min-w-[92px] px-3 py-2.5 rounded-xl border text-left transition-all duration-300 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] ${
                  isSel
                    ? 'border-[var(--color-accent-glow)] bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]'
                    : lit
                    ? 'border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25'
                }`}
              >
                <span className={`font-body text-xs font-bold ${lit || isSel ? 'text-[var(--color-accent-glow)]' : 'text-white'}`}>
                  {node.label}
                </span>
                <span className="font-mono text-[9px] text-white/40 uppercase tracking-wide">{node.sub}</span>
                <span className={`font-mono text-[10px] mt-1 ${lit || isSel ? 'text-[var(--color-accent)]' : 'text-white/30'}`}>
                  {node.ms}ms
                </span>
              </button>
              {i < PIPELINE.length - 1 && (
                <span aria-hidden="true" className={`self-center px-0.5 text-lg ${i < litCount - 1 ? 'text-[var(--color-accent-glow)]' : 'text-white/20'}`}>›</span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Running latency total */}
      <div className="mt-4 flex items-center gap-3 flex-wrap" aria-live="polite">
        <div className="h-1.5 flex-1 min-w-[120px] rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)]"
            style={{
              width: `${(elapsed / TOTAL_MS) * 100}%`,
              transition: prefersReducedMotion ? 'none' : 'width 300ms ease',
            }}
          />
        </div>
        <span className="font-mono text-xs text-white/70">
          {elapsed > 0 ? `${(elapsed / 1000).toFixed(2)}s` : '0.00s'}
          <span className="text-white/30"> / ≈{(TOTAL_MS / 1000).toFixed(1)}s round trip</span>
          {litCount === PIPELINE.length && <span className="text-[var(--color-accent-glow)] font-bold"> ✓ under 2s</span>}
        </span>
      </div>

      {/* Supporting services */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Supporting services</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUPPORTING.map((s) => {
            const isSel = selected === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(isSel ? null : s.id)}
                aria-pressed={isSel}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono border transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] ${
                  isSel
                    ? 'border-[var(--color-accent-glow)] text-[var(--color-accent-glow)] bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]'
                    : 'border-white/10 text-white/60 hover:text-white hover:border-white/25'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedNode && (
        <div role="region" aria-label={`${selectedNode.label} details`} className="mt-5 rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] bg-black/40 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display font-bold text-white text-base">{selectedNode.label}</h4>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close details"
              className="text-white/40 hover:text-white text-lg leading-none cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-glow)] rounded"
            >
              ×
            </button>
          </div>
          {'ms' in selectedNode ? (
            <dl className="space-y-2 font-body text-xs md:text-sm">
              <div><dt className="text-[var(--color-accent)] font-semibold inline">Chosen: </dt><dd className="text-[#a0a0b8] inline">{selectedNode.chosen}</dd></div>
              <div><dt className="text-white/50 font-semibold inline">Rejected: </dt><dd className="text-[#a0a0b8] inline">{selectedNode.rejected}</dd></div>
              <div><dt className="text-[var(--color-accent)] font-semibold inline">Latency budget: </dt><dd className="text-[#a0a0b8] inline">{selectedNode.ms}ms · {selectedNode.hop}</dd></div>
            </dl>
          ) : (
            <p className="font-body text-xs md:text-sm text-[#a0a0b8]">{selectedNode.where}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QlueArchitecture;
