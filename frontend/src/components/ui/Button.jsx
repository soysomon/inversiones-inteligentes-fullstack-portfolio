import React from 'react';
import { useGSAP } from '../../hooks/useGSAP';
import { gsap } from 'gsap';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const buttonRef = useGSAP((element) => {
    gsap.set(element, { scale: 1 });
    
    const handleMouseEnter = () => {
      gsap.to(element, { scale: 1.05, duration: 0.3, ease: "power2.out" });
    };
    
    const handleMouseLeave = () => {
      gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  });

  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 cursor-pointer';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-800 to-blue-700 hover:from-blue-900 hover:to-blue-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-300',
    secondary: 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-xl focus:ring-green-300',
    outline: 'border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white focus:ring-blue-300',
    ghost: 'text-blue-800 hover:bg-blue-50 focus:ring-blue-300'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;