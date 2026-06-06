import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'slate' | 'amber' | 'orange' | 'indigo' | 'purple' | 'emerald';
}

const variantStyles = {
  slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  amber: 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border-orange-200 dark:from-amber-500/10 dark:to-orange-500/10 dark:text-orange-400 dark:border-orange-500/30',
  orange: 'bg-gradient-to-r from-orange-50 to-red-50 text-red-700 border-red-200 dark:from-orange-500/10 dark:to-red-500/10 dark:text-red-400 dark:border-red-500/30',
  indigo: 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border-indigo-200 dark:from-blue-500/10 dark:to-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30',
  purple: 'bg-gradient-to-r from-purple-50 to-pink-50 text-pink-700 border-pink-200 dark:from-purple-500/10 dark:to-pink-500/10 dark:text-pink-400 dark:border-pink-500/30',
  emerald: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-teal-700 border-teal-200 dark:from-emerald-500/10 dark:to-teal-500/10 dark:text-teal-400 dark:border-teal-500/30',
};

export function Badge({ className = '', variant = 'slate', children, ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border shrink-0 shadow-sm
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}
