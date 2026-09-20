/*
 * Kokoro TTS worker — model load + inference OFF the main thread (so the page
 * never freezes), with two speedups over plain WASM:
 *   1. WebGPU when available (much faster than WASM); WASM fallback otherwise.
 *   2. Sentence-level streaming: each sentence is synthesized and posted as soon
 *      as it's ready, so the main thread can start playing the first sentence
 *      while the rest are still generating (short time-to-first-audio).
 *
 * kokoro-js is imported from a CDN at runtime (never bundled).
 *
 * In:  { type:'load' } | { type:'generate', id, text, voice }
 * Out: { type:'ready', backend } | { type:'chunk', id, index, buffer, mime }
 *      | { type:'done', id } | { type:'error', id?, message }
 */
const CDN = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let ttsPromise = null;
let backend = 'wasm';

async function build() {
  const { KokoroTTS } = await import(/* @vite-ignore */ CDN);
  // Always q8 (~80MB) to keep the download small. Try WebGPU first — if the
  // device can run q8 on the GPU it's free speed at the same size; a warmup
  // generate proves the backend actually infers (some load but can't), and any
  // failure falls back to CPU/WASM. The warmup also compiles kernels now, so the
  // visitor's first real answer is fast instead of paying that cost live.
  const make = async (device) => {
    const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'q8', device });
    await tts.generate('Hi.', { voice: 'af_heart' }); // validate + warm up
    return tts;
  };
  if (typeof navigator !== 'undefined' && navigator.gpu) {
    try {
      const tts = await make('webgpu');
      backend = 'webgpu';
      return tts;
    } catch { /* GPU can't run q8 here — fall back to CPU */ }
  }
  const tts = await make('wasm');
  backend = 'wasm';
  return tts;
}

function getTTS() {
  if (!ttsPromise) ttsPromise = build();
  return ttsPromise;
}

// Split into sentence-ish chunks so we can stream audio out incrementally.
// Only break on .!? that are followed by whitespace (or end), so dots inside
// emails, URLs and decimals ("gmail.com", "1.5 years") stay in one piece.
function splitSentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

self.onmessage = async (e) => {
  const { type, id, text, voice } = e.data || {};
  try {
    if (type === 'load') {
      await getTTS();
      self.postMessage({ type: 'ready', backend });
      return;
    }
    if (type === 'generate') {
      const tts = await getTTS();
      const sentences = splitSentences(text);
      for (let i = 0; i < sentences.length; i++) {
        const audio = await tts.generate(sentences[i], { voice: voice || 'af_heart' });
        const blob = audio.toBlob();
        const buffer = await blob.arrayBuffer();
        self.postMessage({ type: 'chunk', id, index: i, buffer, mime: blob.type || 'audio/wav' }, [buffer]);
      }
      self.postMessage({ type: 'done', id });
    }
  } catch (err) {
    if (type === 'load') ttsPromise = null;
    self.postMessage({ type: 'error', id, message: String(err?.message || err) });
  }
};
