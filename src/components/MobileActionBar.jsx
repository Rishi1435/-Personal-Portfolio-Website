import { FaRegEye, FaEnvelope } from 'react-icons/fa';
import { openResume } from '../lib/resume';

/*
 * Slim sticky action bar, mobile only. The Hero's persistent action card only
 * exists at lg+, so on phones the two primary actions (résumé, contact) would
 * otherwise require scrolling back to the top. Sits above the footer via the
 * page's bottom padding; the scroll-progress bar is at the top, so no overlap.
 */
const MobileActionBar = () => {
  const goContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      aria-label="Quick actions"
      className="md:hidden fixed bottom-0 inset-x-0 z-[9990] flex items-stretch gap-2 px-3 py-2.5 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10"
    >
      <button
        type="button"
        onClick={openResume}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--color-accent)] text-[var(--color-accent)] font-body text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform"
      >
        <FaRegEye size={14} />
        Résumé
      </button>
      <a
        href="#contact"
        onClick={goContact}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-glow)] text-black font-body text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform"
      >
        <FaEnvelope size={13} />
        Contact
      </a>
    </nav>
  );
};

export default MobileActionBar;
