import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-match-accent focus:ring-offset-2 focus:ring-offset-match-bg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-match-accent text-match-bg hover:scale-105 hover:brightness-110 active:scale-95 shadow-match',
    secondary: 'bg-match-component text-match-text border border-match-border hover:bg-match-component-hover hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent text-match-accent hover:bg-match-component/50 hover:scale-[1.02] active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
