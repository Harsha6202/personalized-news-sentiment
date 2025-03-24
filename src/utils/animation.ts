
import { useEffect, useState } from 'react';

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progressPercent = (window.scrollY / totalHeight) * 100;
      setProgress(progressPercent);
    };

    window.addEventListener('scroll', updateHeight);
    return () => {
      window.removeEventListener('scroll', updateHeight);
    };
  }, []);

  return progress;
};

export const useInView = (ref: React.RefObject<HTMLElement>, options = {}) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isInView;
};

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

// Animation utility for staggered children animations
export const staggeredAnimation = (delay = 0, stagger = 50, count = 1) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay,
        staggerChildren: stagger / 1000,
        delayChildren: delay / 1000
      }
    },
    exit: { opacity: 0, y: 20 },
    transition: { duration: 0.4, delay: delay / 1000 }
  };
};
