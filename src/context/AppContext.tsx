import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/* ─────────────────────────────────────────────
   Theme Context
───────────────────────────────────────────── */
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('wms-theme');
    return (saved as Theme) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('wms-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

/* ─────────────────────────────────────────────
   User / Auth Context
───────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Mechanic';
  avatar: string;
}

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType>({
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@autosync.com',
    role: 'Admin',
    avatar: 'JD',
  },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@autosync.com',
    role: 'Admin',
    avatar: 'JD',
  };

  return (
    <UserContext.Provider value={{ user: mockUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

/* ─────────────────────────────────────────────
   Toast Context  (simple pop-card notifications)
───────────────────────────────────────────── */
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastCtx {
  toast:   (msg: string, variant?: ToastVariant) => void;
  success: (msg: string) => void;
  error:   (msg: string) => void;
  warning: (msg: string) => void;
  info:    (msg: string) => void;
}

const ToastContext = createContext<ToastCtx>({
  toast: () => {}, success: () => {}, error: () => {}, warning: () => {}, info: () => {}
});

const ICON: Record<ToastVariant, ReactNode> = {
  success: <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />,
  error:   <XCircle      size={16} className="text-red-500    shrink-0 mt-0.5" />,
  warning: <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" />,
  info:    <Info          size={16} className="text-blue-500  shrink-0 mt-0.5" />,
};
const CARD: Record<ToastVariant, string> = {
  success: 'bg-white border-emerald-200 shadow-emerald-100',
  error:   'bg-white border-red-200    shadow-red-100',
  warning: 'bg-white border-amber-200  shadow-amber-100',
  info:    'bg-white border-blue-200   shadow-blue-100',
};
const MSG: Record<ToastVariant, string> = {
  success: 'text-emerald-800',
  error:   'text-red-800',
  warning: 'text-amber-800',
  info:    'text-blue-800',
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = (id: string) => setItems(p => p.filter(t => t.id !== id));

  const show = (message: string, variant: ToastVariant = 'info') => {
    const id = crypto.randomUUID();
    setItems(p => [...p, { id, message, variant }]);
    setTimeout(() => dismiss(id), 4000);
  };

  const value: ToastCtx = {
    toast:   show,
    success: m => show(m, 'success'),
    error:   m => show(m, 'error'),
    warning: m => show(m, 'warning'),
    info:    m => show(m, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* ── Toast Container ── */}
      <div
        className="fixed top-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ left: '50%', transform: 'translateX(-50%)', width: 'calc(100vw - 2rem)', maxWidth: 380 }}
      >
        {items.map(t => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl
              border shadow-lg ${CARD[t.variant]}
              animate-in slide-in-from-top-2 fade-in duration-300
            `}
            role="alert"
          >
            {ICON[t.variant]}
            <p className={`flex-1 text-sm font-medium leading-snug ${MSG[t.variant]}`}>{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
