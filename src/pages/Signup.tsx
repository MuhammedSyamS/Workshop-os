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
      const roleMap = {
        'ADMIN': 'ADMIN',
        'EMPLOYEE': 'MECHANIC'
      };
      await axios.post(`/api/auth/signup`, { 
        userId,
        name, 
        email, 
        phone,
        password, 
        role: roleMap[signupType] 
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to server. Signup might not be implemented.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-slate-200 shadow-xl overflow-hidden rounded-xl">
          <div className="flex flex-col items-center mb-8 p-6 pb-0">
            <div className="w-12 h-12 bg-blue-600 flex items-center justify-center mb-4">
              <Wrench size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Workshop OS</h1>
            <p className="text-sm font-body text-slate-500 mt-1">Enterprise Management System</p>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>NEW PERSONNEL REGISTRATION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex bg-slate-100 p-1 mb-6 rounded-md">
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-bold transition-colors ${signupType === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setSignupType('ADMIN')}
              >
                Admin
              </button>
              <button 
                type="button"
                className={`flex-1 py-2 text-sm font-bold transition-colors ${signupType === 'EMPLOYEE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setSignupType('EMPLOYEE')}
              >
                Employee
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-5 pt-2">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <Input
                label="User ID"
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Choose a User ID (e.g., EMP-123)"
              />
              
              <Input
                label="Employee Email"
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
                placeholder="Enter password"
              />

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                REGISTER
              </Button>
              
              <div className="flex justify-center items-center mt-4 text-sm text-slate-500">
                <div className="flex gap-2">
                  <span>Already registered?</span>
                  <Link to="/login" className="text-blue-600 hover:underline font-medium">
                    Log In
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>
        
        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          CONFIDENTIAL SYSTEM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
