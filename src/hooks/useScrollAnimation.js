import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Destructure to primitive values. Depending on `options` (an object) meant a
  // caller passing an inline literal rebuilt the ScrollTrigger on every render;
  // depending on the primitives it actually uses makes the effect stable.
  const {
    start = 'top 80%',
    end = 'top 20%',
    toggleActions = 'play none none reverse',
    opacity = 0,
    y = 60,
    x = 0,
    scale = 1,
    duration = 0.8,
    ease = 'power3.out',
    stagger = 0.15,
    scrub = false,
  } = options;

  useEffect(() => {
    if (prefersReducedMotion) {
      // Set to final state immediately without animation
      gsap.set(ref.current, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const element = ref.current;
    if (!element) return;

    const anim = gsap.fromTo(
      element.children.length > 0 && stagger > 0 ? element.children : element,
      { opacity, y, x, scale },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration,
        ease,
        stagger,
        scrollTrigger: {
          trigger: element,
          start,
          end,
          toggleActions,
          scrub,
          markers: false,
        },
      }
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [prefersReducedMotion, start, end, toggleActions, opacity, y, x, scale, duration, ease, stagger, scrub]);

  return ref;
}
