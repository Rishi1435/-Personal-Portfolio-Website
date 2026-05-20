import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      // Set to final state immediately without animation
      gsap.set(ref.current, { opacity: 1, y: 0, x: 0, scale: 1 });
      return;
    }

    const element = ref.current;
    
    // Default cinematic reveal setup
    const defaultOptions = {
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play none none reverse',
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      ...options
    };

    const anim = gsap.fromTo(
      element.children.length > 0 && defaultOptions.stagger > 0 ? element.children : element,
      { 
        opacity: defaultOptions.opacity, 
        y: defaultOptions.y,
        x: defaultOptions.x || 0,
        scale: defaultOptions.scale || 1
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: defaultOptions.duration,
        ease: defaultOptions.ease,
        stagger: defaultOptions.stagger,
        scrollTrigger: {
          trigger: element,
          start: defaultOptions.start,
          end: defaultOptions.end,
          toggleActions: defaultOptions.toggleActions,
          scrub: defaultOptions.scrub || false,
          markers: false
        }
      }
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [options, prefersReducedMotion]);

  return ref;
}
