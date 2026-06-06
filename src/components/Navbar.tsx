import { Search, Sun, Moon, Wrench } from 'lucide-react';
import { useTheme, useUser } from '../context/AppContext';
import { Avatar } from './ui/Misc';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();

  return (
    <div className="flex justify-center px-6 pt-6 pb-2 w-full fixed top-0 z-50">
      <header className="h-16 w-full max-w-[1800px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-slate-700/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-between px-5 transition-all">
        
        {/* Brand */}
        <div className="flex items-center gap-4 hover:opacity-80 transition-opacity cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench size={18} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-extrabold text-slate-900 leading-tight tracking-tight">Akhil Two Wheels</h1>
            <p className="text-[11px] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 font-bold uppercase tracking-widest">Job Board</p>
          </div>
        </div>

        {/* Center Search */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by license plate or customer..."
              className="w-full bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 focus:bg-white dark:focus:bg-slate-900 focus:border-purple-400 dark:focus:border-purple-500 rounded-2xl py-2.5 pl-12 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 border border-transparent dark:border-slate-700/50 transition-all"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} className="text-orange-400" /> : <Moon size={18} className="text-indigo-500" />}
          </button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center gap-3 bg-slate-100/50 dark:bg-slate-800/50 pl-2 pr-5 py-1.5 rounded-full border border-transparent dark:border-slate-700/50 cursor-pointer hover:bg-white dark:hover:bg-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <Avatar fallback={user.avatar} className="w-8 h-8 shadow-sm" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
          </div>
        </div>

      </header>
    </div>
  );
}
