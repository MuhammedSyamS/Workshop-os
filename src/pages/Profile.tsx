import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Profile() {
  const { user, token } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`http://localhost:5000/api/employees/${user.id}/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">My Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-slate-200">
          <CardHeader><CardTitle>PERSONAL DETAILS</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</p>
              <p className="text-lg font-bold text-slate-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Role</p>
              <p className="text-sm font-bold text-blue-600 uppercase">{user?.role}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</p>
              <p className="text-sm text-slate-900">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-slate-200">
          <CardHeader><CardTitle>MY ATTENDANCE HISTORY</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
            ) : history.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Records Found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                      <th className="p-3 font-bold">Date</th>
                      <th className="p-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(record => (
                      <tr key={record.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                        <td className="p-3 font-bold">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest ${
                            record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 
                            record.status === 'ABSENT' ? 'bg-red-100 text-red-800' :
                            record.status === 'LATE' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
