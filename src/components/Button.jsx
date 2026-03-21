import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#1E3A8A] text-white hover:bg-blue-900 focus:ring-[#1E3A8A]',
    secondary: 'bg-[#FF9933] text-white hover:bg-orange-600 focus:ring-[#FF9933]',
    accent: 'bg-[#138808] text-white hover:bg-green-700 focus:ring-[#138808]',
    outline: 'border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 focus:ring-[#1E3A8A]',
    ghost: 'text-[#1E3A8A] hover:bg-blue-50 focus:ring-[#1E3A8A]',
  };

  const szStyles = 'px-4 py-2.5 text-sm sm:text-base';

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${szStyles} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
