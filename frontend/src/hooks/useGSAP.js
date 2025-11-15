import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useGSAP = (animation, dependencies = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      animation(element);
    }, element);

    return () => ctx.revert();
  }, dependencies);

  return elementRef;
};

export const useScrollAnimation = (animationConfig) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const defaultConfig = {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    };

    gsap.fromTo(element, 
      { opacity: 0, y: 50 },
      { ...defaultConfig, ...animationConfig }
    );
  }, []);

  return elementRef;
};