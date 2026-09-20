/*
 * Kokoro TTS worker — model load + inference OFF the main thread (so the page
 * never freezes during synthesis).
 *
 * Backend: q8 quantized (~88MB) on WASM. This is the only *correct* small-model
 * pairing — q8 on WebGPU loads and runs but produces garbled audio, and the
 * WebGPU-native fp32 weights are ~326MB (too big). So: q8 + WASM. The one-time
 * download is browser-cached; the main thread stays responsive either way.
 *
 * We synthesize the whole answer in a single generate() call (answers are only
 * 1-3 short sentences) so prosody is natural and there are no gaps between
 * sentences. kokoro-js is imported from a CDN at runtime (never bundled).
 *
 * In:  { type:'load' } | { type:'generate', id, text, voice }
 * Out: { type:'ready' } | { type:'audio', id, buffer, mime } | { type:'error', id?, message }
 */
const CDN = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let ttsPromise = null;

async function build() {
  const { KokoroTTS } = await import(/* @vite-ignore */ CDN);
  const tts = await KokoroTTS.from_pretrained(MODEL, { dtype: 'q8', device: 'wasm' });
  // Warm up: run one tiny inference now so kernels are compiled and the visitor's
  // first real answer is fast instead of paying that cost live.
  try { await tts.generate('Hi.', { voice: 'af_heart' }); } catch { /* warmup is best-effort */ }
  return tts;
}

function getTTS() {
  if (!ttsPromise) ttsPromise = build();
  return ttsPromise;
}

self.onmessage = async (e) => {
  const { type, id, text, voice } = e.data || {};
  try {
    if (type === 'load') {
      await getTTS();
      self.postMessage({ type: 'ready' });
      return;
    }
    if (type === 'generate') {
      const tts = await getTTS();
      const audio = await tts.generate(String(text), { voice: voice || 'af_heart' });
      const blob = audio.toBlob();
      const buffer = await blob.arrayBuffer();
      self.postMessage({ type: 'audio', id, buffer, mime: blob.type || 'audio/wav' }, [buffer]);
    }
  } catch (err) {
    if (type === 'load') ttsPromise = null; // let a later load retry
    self.postMessage({ type: 'error', id, message: String(err?.message || err) });
  }
};
