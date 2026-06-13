import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Signup() {
  const [signupType, setSignupType] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const roleMap = { 'ADMIN': 'ADMIN', 'EMPLOYEE': 'MECHANIC' };
      await axios.post(`/api/auth/signup`, {
        userId, name, email, phone,
        password, role: roleMap[signupType]
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 font-body relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="w-full max-w-[380px] sm:max-w-md mx-auto relative z-10">
        <div className="bg-white/95 backdrop-blur-xl p-5 sm:p-8 rounded-2xl shadow-2xl border border-white/20 overflow-hidden">

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
              <CardTitle>NEW PERSONNEL REGISTRATION</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Type Toggle */}
              <div className="flex bg-slate-100 p-1 mb-5 rounded-md">
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold transition-colors rounded ${signupType === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setSignupType('ADMIN')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 text-xs sm:text-sm font-bold transition-colors rounded ${signupType === 'EMPLOYEE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setSignupType('EMPLOYEE')}
                >
                  Employee
                </button>
              </div>

              <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                />

                <Input
                  label="User ID"
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. EMP-123"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />

                <Input
                  label="Security Key"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a password"
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs sm:text-sm font-medium rounded-lg leading-snug">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full mt-1" isLoading={isLoading}>
                  REGISTER
                </Button>

                <div className="flex justify-center items-center mt-3 text-xs sm:text-sm text-slate-500 gap-1.5">
                  <span>Already registered?</span>
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Log In
                  </Link>
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
