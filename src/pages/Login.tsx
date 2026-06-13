import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Wrench, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const LOADING_MESSAGES = [
  { after: 0,     text: 'Connecting to server...' },
  { after: 4000,  text: 'Establishing database link...' },
  { after: 9000,  text: 'Waking up server (first login may take ~30s)...' },
  { after: 16000, text: 'Almost there, please wait...' },
];

export default function Login() {
  const [loginType, setLoginType] = useState<'ADMIN' | 'EMPLOYEE'>('ADMIN');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  // Pre-warm the server as soon as the login page opens
  useEffect(() => {
    axios.get('/api/health', { timeout: 35000 }).catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setLoadingMsg(LOADING_MESSAGES[0].text);

    // Cycle through progress messages while waiting
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_MESSAGES.slice(1).forEach(({ after, text }) => {
      timers.push(setTimeout(() => setLoadingMsg(text), after));
    });

    const clearTimers = () => timers.forEach(clearTimeout);

    try {
      const res = await axios.post(`/api/auth/login`, { userId, password }, { timeout: 40000 });
      clearTimers();
      const user = res.data.user;

      if (loginType === 'ADMIN' && user.role !== 'OWNER' && user.role !== 'ADMIN') {
        setError('Access Denied: Your account is an Employee. Please click the "Employee" tab to log in.');
        setIsLoading(false);
        setLoadingMsg('');
        return;
      }
      if (loginType === 'EMPLOYEE' && (user.role === 'OWNER' || user.role === 'ADMIN')) {
        setError('Access Denied: Your account is an Admin. Please click the "Admin" tab to log in.');
        setIsLoading(false);
        setLoadingMsg('');
        return;
      }

      setAuth(res.data.token, user);
      const dest = (user.role === 'OWNER' || user.role === 'ADMIN') ? '/dashboard' : '/profile';
      navigate(`/splash?to=${dest}`);

    } catch (err: any) {
      clearTimers();
      if (!err.response) {
        setError('Server is unreachable. If this is your first login today, the server may still be waking up — please wait 30 seconds and try again.');
      } else {
        setError(err.response?.data?.error || 'Authentication failed. Check your credentials.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMsg('');
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
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-blue-600 focus:outline-none">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {/* Loading status message */}
                {isLoading && loadingMsg && (
                  <div className="flex items-center gap-2.5 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Wifi size={15} className="text-blue-500 shrink-0 animate-pulse" />
                    <p className="text-xs text-blue-700 font-medium leading-snug">{loadingMsg}</p>
                  </div>
                )}

                {/* Error message */}
                {error && !isLoading && (
                  <div className="flex items-start gap-2.5 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <WifiOff size={15} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-600 font-medium leading-snug">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full mt-1" isLoading={isLoading}>
                  {isLoading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
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
