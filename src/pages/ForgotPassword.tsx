import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Wrench } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      // Assuming a forgot password route exists
      await axios.post(`/api/auth/forgot-password`, { email });
      setMessage('If this email is registered, you will receive reset instructions.');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 flex items-center justify-center mb-4">
            <Wrench size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">Akhil Two Wheelers</h1>
          <p className="text-sm font-body text-slate-500 mt-1">Enterprise Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>CREDENTIAL RECOVERY</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-5 pt-2">
              <Input
                label="Employee Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />

              {error && (
                <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-500 text-sm font-medium">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="p-3 bg-green-900/30 border border-green-500/50 text-green-500 text-sm font-medium">
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                REQUEST RESET
              </Button>
              
              <div className="flex justify-center items-center mt-4 text-sm text-slate-500">
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Return to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-slate-400 mt-8 font-medium">
          CONFIDENTIAL SYSTEM &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
