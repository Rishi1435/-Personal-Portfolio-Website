import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useReducedMotion } from '../hooks/useReducedMotion';

const ScrollReveal = ({ children, delay = 0, direction = 'up', duration = 0.5, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const variants = {
    hidden: {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : (direction === 'up' ? 20 : direction === 'down' ? -20 : 0),
      x: prefersReducedMotion ? 0 : (direction === 'left' ? 20 : direction === 'right' ? -20 : 0),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: prefersReducedMotion ? { duration: 0 } : {
        duration,
        delay,
        ease: 'easeOut',
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
