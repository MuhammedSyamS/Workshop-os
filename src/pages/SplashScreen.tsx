import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const STATUS_MSGS: [number, string][] = [
  [0,  'Starting up...'],
  [25, 'Authenticating...'],
  [50, 'Loading workspace...'],
  [75, 'Preparing dashboard...'],
  [100, 'Ready']
];

export default function SplashScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const destination = params.get('to') || '/dashboard';

  const [pct, setPct] = useState(0);
  const [status, setStatus] = useState(STATUS_MSGS[0][1]);
  const [fadeout, setFadeout] = useState(false);

  useEffect(() => {
    let cur = 0;

    const getMsg = (p: number) => {
      let m = STATUS_MSGS[0][1];
      for (const [t, txt] of STATUS_MSGS) { if (p >= t) m = txt; }
      return m;
    };

    const iv = setInterval(() => {
      cur += Math.random() * 2 + 0.5;

      if (cur >= 100) {
        cur = 100;
        clearInterval(iv);
        setPct(100);
        setStatus('Ready');

        // Quick transition out
        setTimeout(() => setFadeout(true), 400);
        setTimeout(() => navigate(destination, { replace: true }), 900);
        return;
      }

      setPct(Math.floor(cur));
      setStatus(getMsg(Math.floor(cur)));
    }, 30);

    return () => clearInterval(iv);
  }, [destination, navigate]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
        fadeout ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-sm w-full px-6">
        
        {/* Logo matching the login page */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-6 rounded-2xl shadow-xl shadow-blue-900/50 border border-white/10 animate-pulse">
          <Wrench size={32} className="text-white" />
        </div>

        {/* Brand Name */}
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Akhil Two Wheelers</h1>
        <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-12">Workshop Management</p>

        {/* Minimal Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-medium text-slate-300 transition-colors duration-300">
              {status}
            </span>
            <span className="text-xs font-bold text-blue-400">{pct}%</span>
          </div>
          
          <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
