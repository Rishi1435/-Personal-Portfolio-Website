import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ScrollReveal = ({ children, delay = 0, direction = 'up', duration = 0.6, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : (direction === 'up' ? 30 : direction === 'down' ? -30 : 0),
      x: prefersReducedMotion ? 0 : (direction === 'left' ? 30 : direction === 'right' ? -30 : 0),
      scale: prefersReducedMotion ? 1 : 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: prefersReducedMotion ? { duration: 0 } : {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
