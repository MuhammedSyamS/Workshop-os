import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Wrench, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Login() {
  const [loginType, setLoginType] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Attempt to create default admin account (silently ignored if already exists)
      if (userId === 'admin' && password === 'admin123') {
        try { await axios.post(`/api/auth/setup`); } catch { /* ignore */ }
      }

      const res = await axios.post(`/api/auth/login`, { userId, password }, { timeout: 10000 });
      const user = res.data.user;

      if (loginType === 'ADMIN' && user.role !== 'OWNER' && user.role !== 'ADMIN') {
        setError('Access Denied: You are trying to log into the Admin portal, but your account is registered as an Employee. Please click the "Employee" tab above to log in.');
        setIsLoading(false);
        return;
      }
      if (loginType === 'EMPLOYEE' && (user.role === 'OWNER' || user.role === 'ADMIN')) {
        setError('Access Denied: You are trying to log into the Employee portal, but you are an Admin. Please click the "Admin" tab above to log in.');
        setIsLoading(false);
        return;
      }

      setAuth(res.data.token, user);
      const dest = (user.role === 'OWNER' || user.role === 'ADMIN') ? '/dashboard' : '/profile';
      navigate(`/splash?to=${dest}`);

    } catch (err: any) {
      if (!err.response) {
        setError('Cannot connect to server. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.error || 'Authentication failed. Check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-[80px] sm:blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-[80px] sm:blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      <div className="w-full max-w-[380px] sm:max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-2xl border border-white/20 relative overflow-hidden">

          {/* Brand Header */}
          <div className="flex flex-col items-center mb-5 sm:mb-7 text-center">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-3 rounded-xl sm:rounded-2xl shadow-lg border border-white/10">
              <Wrench size={20} className="text-white sm:hidden" />
              <Wrench size={26} className="text-white hidden sm:block" />
            </div>
            <h1 className="text-base sm:text-xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight">
              Akhil Two Wheelers
            </h1>
            <p className="text-[9px] sm:text-[11px] font-bold tracking-[3px] sm:tracking-widest text-blue-600/80 mt-1 uppercase">
              Workshop Management
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AUTHORIZED ACCESS ONLY</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Login Type Toggle */}
              <div className="flex bg-slate-100 p-1 mb-5 rounded-md">
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold transition-colors rounded ${loginType === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setLoginType('ADMIN')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold transition-colors rounded ${loginType === 'EMPLOYEE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setLoginType('EMPLOYEE')}
                >
                  Employee
                </button>
              </div>

              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <Input
                  label={loginType === 'ADMIN' ? 'Admin User ID' : 'Employee User ID'}
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                />

                <Input
                  label="Security Key"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="hover:text-blue-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium rounded-lg leading-snug">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full mt-1" isLoading={isLoading}>
                  AUTHENTICATE
                </Button>

                <div className="flex justify-between items-center mt-3 text-xs sm:text-sm text-slate-500">
                  <Link to="/forgot-password" className="hover:text-blue-600 transition-colors">
                    Forgot Password?
                  </Link>
                  <div className="flex gap-1.5">
                    <span>New?</span>
                    <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-5 font-bold tracking-widest uppercase">
          CONFIDENTIAL SYSTEM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
