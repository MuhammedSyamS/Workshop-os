import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, rightElement, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl placeholder-[#94a3b8] transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white disabled:opacity-50 disabled:bg-white disabled:cursor-not-allowed ${icon ? 'pl-10' : 'px-4'} ${rightElement ? 'pr-10' : 'pr-4'} py-3 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
