import { useEffect, useRef, useState } from 'react';

/*
 * Project media slot: plays a short silent WebM loop when one is available and
 * the connection allows it, otherwise falls back to the animated SVG mockup.
 *
 * NOTE: the shipped /media/*.webm loops are generated from the in-app UI mockups
 * (see scripts note in the PR) and are placeholders for real device/screen
 * recordings — drop real captures at the same paths to replace them.
 *
 * - muted + playsInline + loop + preload="none": never in the initial paint
 *   path, never autoplays with sound.
 * - Desktop (pointer:fine): play on hover, pause on leave.
 * - Touch: IntersectionObserver plays when on-screen + tap to toggle; pauses off-screen.
 * - saveData or a load error -> render the SVG mockup fallback instead.
 */
const ProjectMedia = ({ webm, poster, Fallback, label }) => {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  // Decide once at mount: no source, or data-saver on -> keep the light SVG mockup.
  const [useVideo, setUseVideo] = useState(() => {
    if (!webm) return false;
    if (typeof navigator !== 'undefined' && navigator.connection?.saveData) return false;
    return true;
  });
  const [isTouch] = useState(
    () => typeof window !== 'undefined' && !window.matchMedia?.('(pointer: fine)').matches
  );

  // Touch: autoplay (muted) when scrolled into view, pause when it leaves.
  useEffect(() => {
    if (!useVideo || !isTouch) return;
    const v = videoRef.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [useVideo, isTouch]);

  if (!useVideo) return <Fallback />;

  const play = () => videoRef.current?.play().catch(() => {});
  const pause = () => videoRef.current?.pause();

  return (
    <div
      ref={wrapRef}
      onMouseEnter={isTouch ? undefined : play}
      onMouseLeave={isTouch ? undefined : pause}
      onClick={
        isTouch
          ? () => { const v = videoRef.current; if (v) (v.paused ? play() : pause()); }
          : undefined
      }
      className="relative w-full h-52 rounded-xl overflow-hidden bg-[#030303] border border-[color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
    >
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="none"
        poster={poster}
        aria-label={label}
        onError={() => setUseVideo(false)}
        className="w-full h-full object-cover"
      >
        <source src={webm} type="video/webm" />
      </video>
      {isTouch && (
        <span className="absolute bottom-2 right-2 font-mono text-[9px] uppercase tracking-wider text-white/60 bg-black/50 rounded px-1.5 py-0.5 pointer-events-none">
          tap to play
        </span>
      )}
    </div>
  );
};

export default ProjectMedia;
