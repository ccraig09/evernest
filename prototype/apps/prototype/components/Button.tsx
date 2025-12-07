import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3 px-6 rounded-full font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-sage-600 hover:bg-sage-700 text-white shadow-lg shadow-sage-200 dark:shadow-none",
    secondary: "bg-warm-200 hover:bg-warm-300 text-stone-800 dark:bg-stone-700 dark:text-stone-200",
    outline: "border-2 border-sage-600 text-sage-600 hover:bg-sage-50 dark:border-sage-500 dark:text-sage-400 dark:hover:bg-stone-800",
    ghost: "text-stone-500 hover:text-stone-700 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;