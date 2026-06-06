import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Wrench, LayoutDashboard, Users, CarFront, FileText, 
  Package, Calendar, BarChart3, Settings, LogOut, UserCircle, Receipt,
  Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MENU_ITEMS = [
  { path: '/profile', label: 'My Profile', icon: UserCircle },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs', label: 'Job Orders', icon: Wrench },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/vehicles', label: 'Vehicles', icon: CarFront },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/invoices', label: 'Tax Invoices', icon: FileText },
  { path: '/customer-bills', label: 'Customer Bills', icon: Receipt },
  { path: '/bills', label: 'Workshop Expenses', icon: Receipt },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, token, logout } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'OWNER' || user.role === 'ADMIN';

  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (isAdmin) {
      return item.path !== '/profile';
    } else {
      const allowedForEmployee = ['/profile', '/jobs', '/customers', '/vehicles', '/invoices', '/customer-bills', '/schedule'];
      return allowedForEmployee.includes(item.path);
    }
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center mr-3 rounded-sm shadow-inner">
              <Wrench size={16} className="text-white" />
            </div>
            <span className="font-heading font-extrabold tracking-widest uppercase text-xs md:text-sm">Workshop OS</span>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {visibleMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-sm
                      transition-all border-l-4 
                      ${isActive 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }
                    `}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-xs font-bold uppercase text-slate-900 truncate max-w-[150px]">{user.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-600 font-extrabold">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-extrabold uppercase tracking-widest text-slate-500 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-sm transition-all"
          >
            <LogOut size={14} strokeWidth={2.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-sm relative z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-slate-500 hover:text-blue-600 p-1"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="font-heading font-extrabold text-sm tracking-widest text-slate-800 uppercase hidden sm:block">
              {location.pathname.substring(1) || 'dashboard'}
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <span className="hidden sm:inline">System Status:</span>
            <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8 bg-slate-50 custom-scrollbar">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
