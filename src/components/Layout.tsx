import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Wrench, LayoutDashboard, Users, CarFront, FileText, 
  Package, Calendar, BarChart3, Settings, LogOut, UserCircle, Receipt,
  Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MENU_ITEMS = [
  { path: '/profile', label: 'Profile', icon: UserCircle },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs', label: 'Job Orders', icon: Wrench },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/vehicles', label: 'Vehicles', icon: CarFront },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/invoices', label: 'Invoices', icon: FileText },
  { path: '/customer-bills', label: 'Cust. Bills', icon: Receipt },
  { path: '/bills', label: 'Expenses', icon: Receipt },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Layout() {
  const { user, token, logout } = useAuthStore();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const mainTabs = [
    { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { path: '/jobs', label: 'Jobs', icon: Wrench },
    { path: '/schedule', label: 'Schedule', icon: Calendar },
  ].filter(tab => visibleMenuItems.some(v => v.path === tab.path));

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-body">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r border-slate-200 flex-col shadow-lg">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center mr-3 rounded-lg shadow-sm">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-heading font-bold tracking-tight text-slate-900">Workshop OS</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <ul className="space-y-1 px-3">
            {visibleMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900' }`}
                  >
                    <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 truncate max-w-[150px]">{user.name}</p>
              <p className="text-xs text-blue-600 font-medium">{user.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative lg:ml-64">
        
        {/* Top Header (Mobile & Desktop) */}
        <header className="sticky top-0 h-16 shrink-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 lg:bg-none lg:bg-white lg:border-b lg:border-slate-200 flex items-center justify-between px-4 lg:px-8 shadow-md lg:shadow-sm z-30 transition-all">
          <div className="flex items-center gap-3 lg:hidden text-white">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-sm flex items-center justify-center rounded-xl shadow-inner border border-white/10">
              <Wrench size={18} className="text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight drop-shadow-sm">Workshop OS</span>
          </div>
          
          <div className="hidden lg:block font-heading font-semibold text-lg text-slate-800 capitalize">
            {location.pathname.substring(1).replace('-', ' ') || 'Dashboard'}
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-green-400/20 lg:bg-green-50 text-green-100 lg:text-green-700 rounded-full border border-green-400/30 lg:border-green-200 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 lg:bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
              <span className="hidden sm:inline font-bold tracking-wide">ONLINE</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 bg-slate-50 pb-24 lg:pb-8 max-w-[100vw]">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 pb-2">
        {mainTabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);
          return (
            <Link 
              key={tab.path} 
              to={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 pt-1 ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} className="mb-0.5" />
              <span className="text-[10px] font-bold tracking-wide">{tab.label.toUpperCase()}</span>
            </Link>
          );
        })}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 pt-1 text-slate-500 hover:text-slate-900"
        >
          <Menu size={20} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Mobile "More" Menu Full Screen Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-2 duration-200">
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <span className="font-heading font-bold text-lg text-slate-900 tracking-tight">Menu</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                {user.name[0].toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-base">{user.name}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{user.role}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              {visibleMenuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 font-medium active:bg-slate-50'}`}
                  >
                    <item.icon size={20} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 border-t border-slate-100 pb-8">
            <button
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-3.5 text-red-600 font-semibold bg-red-50 rounded-xl active:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
