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
   Toast Context
───────────────────────────────────────────── */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: ToastType, title: string, message?: string) => {
    const id = crypto.randomUUID();
    setToasts(t => [...t, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(t => t.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
