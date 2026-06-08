import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export function Reports() {
  const { token } = useAuthStore();
  const [kpi, setKpi] = useState({ totalJobs: 0, activeJobs: 0, totalRevenue: 0 });
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kpiRes, trendRes] = await Promise.all([
        axios.get(`/api/reports/kpi`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/reports/revenue-trend`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setKpi(kpiRes.data);
      setTrend(trendRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Analytics & Reports</h1>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Jobs Logged</p>
            <p className="text-4xl font-heading font-extrabold text-slate-900">{kpi.totalJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 border-b-4 border-blue-600">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Active Jobs in Queue</p>
            <p className="text-4xl font-heading font-extrabold text-blue-600">{kpi.activeJobs}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Revenue Confirmed</p>
            <p className="text-4xl font-heading font-extrabold text-[#10B981]">${kpi.totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader><CardTitle>7-DAY REVENUE TREND</CardTitle></CardHeader>
        <CardContent className="h-96 pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E85D04" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#E85D04" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#4A5568" tick={{ fill: '#A0AEC0', fontSize: 12, fontWeight: 'bold' }} />
              <YAxis stroke="#4A5568" tick={{ fill: '#A0AEC0', fontSize: 12, fontWeight: 'bold' }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#E2E8F0', borderRadius: 0, fontWeight: 'bold' }}
                itemStyle={{ color: '#E85D04' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#E85D04" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
