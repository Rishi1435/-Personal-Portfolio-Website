/*
 * Kokoro TTS worker — runs model load + inference OFF the main thread so the
 * page never freezes ("Page Unresponsive") while synthesizing. kokoro-js is
 * imported from a CDN at runtime (never bundled).
 *
 * Messages in:  { type: 'load' } | { type: 'generate', id, text, voice }
 * Messages out: { type: 'ready' } | { type: 'audio', id, buffer, mime }
 *               | { type: 'error', id?, message }
 */
const CDN = 'https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/+esm';
const MODEL = 'onnx-community/Kokoro-82M-v1.0-ONNX';

let ttsPromise = null;
function getTTS() {
  if (!ttsPromise) {
    ttsPromise = import(/* @vite-ignore */ CDN).then(({ KokoroTTS }) =>
      KokoroTTS.from_pretrained(MODEL, { dtype: 'q8', device: 'wasm' })
    );
  }
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
      const audio = await tts.generate(text, { voice: voice || 'af_heart' });
      const blob = audio.toBlob();
      const buffer = await blob.arrayBuffer();
      self.postMessage({ type: 'audio', id, buffer, mime: blob.type || 'audio/wav' }, [buffer]);
    }
  } catch (err) {
    // If load failed, let it be retried next time.
    if (type === 'load') ttsPromise = null;
    self.postMessage({ type: 'error', id, message: String(err?.message || err) });
  }
};
