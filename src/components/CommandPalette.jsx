import { useState, useEffect, useRef, useCallback } from 'react';

/*
 * Command palette — Cmd/Ctrl+K (and a visible button on mobile).
 * A single native <dialog> with a filtered, arrow-navigable action list.
 * No new dependencies.
 */

const RESUME_URL = '/Rishi_Pediredla_Resume.pdf';
const EMAIL = 'pediredlarishi2005@gmail.com';
const GITHUB = 'https://github.com/Rishi1435';
const LINKEDIN = 'https://linkedin.com/in/rishi-pediredla-2305nov';

const scrollTo = (hash) => {
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
  else window.location.hash = hash;
};

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const [note, setNote] = useState('');
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(false);
  }, []);

  const actions = [
    { id: 'home', label: 'Go to Home', hint: 'Section', icon: '⌂', run: () => scrollTo('#home') },
    { id: 'about', label: 'Go to About', hint: 'Section', icon: '§', run: () => scrollTo('#about') },
    { id: 'skills', label: 'Go to Skills', hint: 'Section', icon: '§', run: () => scrollTo('#skills') },
    { id: 'projects', label: 'Go to Projects', hint: 'Section', icon: '§', run: () => scrollTo('#projects') },
    { id: 'contact', label: 'Go to Contact', hint: 'Section', icon: '§', run: () => scrollTo('#contact') },
    {
      id: 'resume',
      label: 'Download résumé',
      hint: 'Action',
      icon: '↓',
      run: () => {
        const a = document.createElement('a');
        a.href = RESUME_URL;
        a.download = 'Rishi_Pediredla_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      },
    },
    {
      id: 'email',
      label: 'Copy email address',
      hint: 'Action',
      icon: '@',
      keepOpen: true,
      run: async () => {
        try {
          await navigator.clipboard.writeText(EMAIL);
          setNote(`Copied ${EMAIL}`);
        } catch {
          setNote(EMAIL);
        }
      },
    },
    { id: 'github', label: 'Open GitHub', hint: 'External', icon: '↗', run: () => window.open(GITHUB, '_blank', 'noopener') },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'External', icon: '↗', run: () => window.open(LINKEDIN, '_blank', 'noopener') },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  // Global Cmd/Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Sync the native <dialog> modal state with `open`, and reset on open.
  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (open && !dlg.open) {
      setQuery('');
      setSelected(0);
      setNote('');
      dlg.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dlg.open) {
      dlg.close();
    }
  }, [open]);

  const runAction = (action) => {
    if (!action) return;
    action.run();
    if (!action.keepOpen) close();
  };

  const onListKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAction(filtered[selected]);
    }
  };

  return (
    <>
      {/* Mobile trigger — visible only on small screens */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
        className="md:hidden fixed bottom-5 right-5 z-[9998] w-12 h-12 rounded-full bg-[var(--color-accent)] text-black flex items-center justify-center shadow-[0_6px_24px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] active:scale-95 transition-transform"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Command palette"
        onClose={() => setOpen(false)}
        onClick={(e) => { if (e.target === dialogRef.current) close(); }}
        className="backdrop:bg-black/70 backdrop:backdrop-blur-sm bg-transparent p-0 m-0 max-w-none w-full h-full"
      >
        <div className="min-h-full flex items-start justify-center p-4 pt-[15vh]" onClick={(e) => { if (e.currentTarget === e.target) close(); }}>
          <div
            role="combobox"
            aria-expanded="true"
            aria-haspopup="listbox"
            aria-controls="command-palette-list"
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden"
            onKeyDown={onListKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
              <span className="text-[var(--color-accent)] font-mono text-sm select-none" aria-hidden="true">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                aria-autocomplete="list"
                className="flex-1 bg-transparent text-white text-sm font-body placeholder-white/30 focus:outline-none"
              />
              <kbd className="hidden sm:block text-[10px] font-mono text-white/30 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            {/* Results */}
            <ul id="command-palette-list" role="listbox" ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-6 text-center text-white/40 text-sm font-body">No matching commands</li>
              )}
              {filtered.map((a, i) => (
                <li key={a.id} role="option" aria-selected={i === selected}>
                  <button
                    type="button"
                    onClick={() => runAction(a)}
                    onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      i === selected ? 'bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={`w-6 text-center font-mono text-sm ${i === selected ? 'text-[var(--color-accent)]' : 'text-white/40'}`} aria-hidden="true">{a.icon}</span>
                    <span className="flex-1 text-sm font-body text-white">{a.label}</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">{a.hint}</span>
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer / note */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] text-[11px] font-mono text-white/40">
              <span aria-live="polite" className="text-[var(--color-accent-glow)]">{note}</span>
              <span className="hidden sm:flex items-center gap-2">
                <kbd className="border border-white/10 rounded px-1">↑↓</kbd> navigate
                <kbd className="border border-white/10 rounded px-1">↵</kbd> run
              </span>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default CommandPalette;
