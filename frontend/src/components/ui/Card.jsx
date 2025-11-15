import React from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { gsap } from 'gsap';

const Card = ({ children, className = '', hover = true, ...props }) => {
  const cardRef = useGSAP((element) => {
    if (!hover) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        y: -8,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        duration: 0.3,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, {
        y: 0,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl shadow-lg transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;