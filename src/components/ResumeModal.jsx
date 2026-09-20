import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileDownload, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { RESUME_URL, RESUME_OPEN_EVENT, downloadResume } from '../lib/resume';

/*
 * Résumé preview modal. Mounted once (globally, in App) and opened from anywhere
 * — the Hero "View Résumé" button, the command palette, the mobile action bar,
 * the terminal `resume` command — by calling openResume() (see lib/resume.js),
 * which fires a window event this component listens for. That keeps every entry
 * point decoupled: they just request the preview, they don't own it.
 *
 * The card shows an inline PDF preview and a Download button; downloading is a
 * deliberate second step, not the default, so visitors can read first. Rendered
 * through a portal to <body> with the usual escape / focus-trap / scroll-lock.
 */
const ResumeModal = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(RESUME_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(RESUME_OPEN_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    const focusTimer = setTimeout(() => panelRef.current?.focus(), 0);

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const list = [...focusables];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(focusTimer);
      if (prevFocus instanceof HTMLElement) prevFocus.focus();
    };
  }, [open]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" onClick={() => setOpen(false)} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Résumé preview"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card-featured relative z-10 w-[min(94vw,880px)] max-h-[94vh] flex flex-col p-4 md:p-5 outline-none"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-3 px-1">
              <div>
                <h3 className="font-display font-black text-white text-base md:text-lg leading-tight">Résumé</h3>
                <p className="font-mono text-[11px] text-[var(--color-accent)]">Rishi Pediredla · Software Developer</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close résumé"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors cursor-pointer flex-shrink-0"
              >
                <FaTimes size={13} />
              </button>
            </div>

            {/* Inline PDF preview */}
            <div className="rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a]">
              <iframe
                src={`${RESUME_URL}#view=FitH&toolbar=0&navpanes=0`}
                title="Résumé preview"
                className="w-full h-[62vh] md:h-[68vh]"
              />
            </div>

            {/* Actions — download is the deliberate second step */}
            <div className="flex items-center justify-end gap-3 mt-4">
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/30 font-body text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <FaExternalLinkAlt size={11} /> Open in new tab
              </a>
              <button
                type="button"
                onClick={downloadResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-glow)] font-body text-xs font-bold tracking-wider uppercase shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent)_35%,transparent)] transition-colors cursor-pointer"
              >
                <FaFileDownload size={13} /> Download Résumé
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ResumeModal;
