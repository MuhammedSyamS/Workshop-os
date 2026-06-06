
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Wrench, LayoutDashboard, Users, CarFront, FileText, 
  Package, Calendar, BarChart3, Settings, LogOut, UserCircle, Receipt 
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

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === 'OWNER' || user.role === 'ADMIN';

  const visibleMenuItems = MENU_ITEMS.filter(item => {
    if (isAdmin) {
      return item.path !== '/profile'; // Admins don't need the employee profile view
    } else {
      const allowedForEmployee = ['/profile', '/jobs', '/customers', '/vehicles', '/invoices', '/customer-bills', '/schedule'];
      return allowedForEmployee.includes(item.path);
    }
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center mr-3">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-heading font-extrabold tracking-widest uppercase text-sm">Akhil Two Wheeler</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {visibleMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-3 px-3 py-2 text-sm font-bold uppercase tracking-wide
                      transition-colors border-l-2 
                      ${isActive 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:bg-blue-50 hover:text-slate-900'
                      }
                    `}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-xs font-bold uppercase text-slate-900">{user.name}</p>
              <p className="text-[10px] uppercase tracking-widest text-blue-600">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wide text-slate-500 hover:text-red-500 hover:bg-blue-50 transition-colors"
          >
            <LogOut size={14} />
            Term Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="font-heading font-bold text-sm tracking-wide text-slate-500 uppercase">
            {location.pathname.substring(1) || 'dashboard'}
          </div>
          <div className="flex items-center gap-4 text-xs font-bold uppercase text-slate-500">
            <span>ENV: PRODUCTION</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
