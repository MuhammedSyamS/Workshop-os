export function Avatar({ fallback, className = '' }: { fallback: string; className?: string }) {
  return (
    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-medium text-sm shadow-md shadow-blue-500/20 ${className}`}>
      {fallback}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 ${className}`} />
  );
}
