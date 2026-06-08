import { Loader2 } from 'lucide-react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-blue-600 text-white hover:bg-[#DC5000] border border-transparent',
  secondary: 'bg-white text-white hover:bg-blue-50 border border-slate-200',
  outline: 'bg-transparent text-slate-900 hover:bg-white border border-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 border border-transparent',
  ghost: 'bg-transparent text-slate-900 hover:bg-white border border-transparent',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-bold font-heading transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-blue-600 focus:ring-offset-1 focus:ring-offset-slate-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
