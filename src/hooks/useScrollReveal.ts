import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  yOffset?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      const children = el.querySelectorAll('.reveal-child');
      if (children.length > 0) {
        gsap.set(children, { opacity: 1, y: 0 });
      }
      return;
    }

    const {
      threshold = 0.12,
      rootMargin = '0px 0px -60px 0px',
      yOffset = 28,
      duration = 0.85,
      stagger = 0.1,
      delay = 0,
    } = options;

    const children = el.querySelectorAll('.reveal-child');

    // Initial state: subtle opacity and small y offset
    if (children.length > 0) {
      gsap.set(children, { opacity: 0, y: yOffset });
    } else {
      gsap.set(el, { opacity: 0, y: yOffset });
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;

            if (children.length > 0) {
              gsap.to(children, {
                opacity: 1,
                y: 0,
                duration,
                stagger,
                delay,
                ease: 'power3.out',
                clearProps: 'transform', // Keeps DOM clean after completion
              });
            } else {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration,
                delay,
                ease: 'power3.out',
                clearProps: 'transform',
              });
            }

            observer.unobserve(el);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [options.threshold, options.rootMargin, options.yOffset, options.duration, options.stagger, options.delay]);

  return containerRef;
}
