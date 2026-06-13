import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={17} className="text-emerald-500 shrink-0" />,
  error:   <XCircle    size={17} className="text-red-500    shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-500 shrink-0" />,
  info:    <Info       size={17} className="text-blue-500   shrink-0" />,
};

const BORDER: Record<ToastType, string> = {
  success: 'border-emerald-200',
  error:   'border-red-200',
  warning: 'border-amber-200',
  info:    'border-blue-200',
};

const BG: Record<ToastType, string> = {
  success: 'bg-emerald-50',
  error:   'bg-red-50',
  warning: 'bg-amber-50',
  info:    'bg-blue-50',
};

const TEXT: Record<ToastType, string> = {
  success: 'text-emerald-800',
  error:   'text-red-800',
  warning: 'text-amber-800',
  info:    'text-blue-800',
};

// ─── Toast Item ───────────────────────────────────────────────────────────────
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div
      className={`
        flex items-start gap-3 w-full max-w-sm px-4 py-3 rounded-xl shadow-lg
        border ${BORDER[toast.type]} ${BG[toast.type]}
        animate-in slide-in-from-top-3 fade-in duration-300
      `}
      role="alert"
    >
      <span className="mt-0.5">{ICONS[toast.type]}</span>
      <p className={`flex-1 text-sm font-medium leading-snug ${TEXT[toast.type]}`}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className={`ml-1 p-0.5 rounded-md hover:bg-black/10 transition-colors ${TEXT[toast.type]}`}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-dismiss after 4s
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const value: ToastContextValue = {
    toast:   show,
    success: (m) => show(m, 'success'),
    error:   (m) => show(m, 'error'),
    warning: (m) => show(m, 'warning'),
    info:    (m) => show(m, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container — fixed top-right on desktop, top-center on mobile */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 z-[9999] flex flex-col gap-2.5 items-center sm:items-end w-[calc(100vw-2rem)] sm:w-auto pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto w-full sm:w-auto">
            <ToastItem toast={t} onClose={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
