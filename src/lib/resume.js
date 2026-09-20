/*
 * Résumé helpers, shared by <ResumeModal> and every entry point that opens or
 * downloads it (Hero button, command palette, mobile action bar, terminal).
 * Kept in its own module so the component file only exports a component (React
 * Fast Refresh requirement).
 */
export const RESUME_URL = '/Rishi_Pediredla_Resume.pdf';
export const RESUME_FILE = 'Rishi_Pediredla_Resume.pdf';
export const RESUME_OPEN_EVENT = 'resume:open';

// Pop the résumé preview from anywhere. <ResumeModal>, mounted once globally,
// listens for this event.
export const openResume = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(RESUME_OPEN_EVENT));
  }
};

// Trigger a direct download of the résumé PDF.
export const downloadResume = () => {
  const a = document.createElement('a');
  a.href = RESUME_URL;
  a.download = RESUME_FILE;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
