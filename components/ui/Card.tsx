import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'solid' | 'elevated';
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, variant = 'glass', className = '' }) => {
  const baseStyles = 'rounded-xl transition-all duration-300';
  
  const variants = {
    glass: 'bg-match-component/60 backdrop-blur-xl border border-white/5 shadow-match hover:border-white/10',
    solid: 'bg-match-component border border-match-border shadow-match',
    elevated: 'bg-match-component/80 backdrop-blur-xl border border-white/5 shadow-match hover:shadow-match-glow',
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
