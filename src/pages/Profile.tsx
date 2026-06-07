import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Profile() {
  const { user, token } = useAuthStore();
  const [history, setHistory] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);

  useEffect(() => {
    if (user?.avatar) setAvatar(user.avatar);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 150;
        const MAX_HEIGHT = 150;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        uploadAvatar(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (base64: string) => {
    try {
      await axios.patch(`http://${window.location.hostname}:5000/api/employees/${user?.id}/avatar`, { avatar: base64 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvatar(base64);
    } catch(e) {
      alert('Failed to upload avatar');
    }
  };


  useEffect(() => {
    fetchHistory();
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`http://${window.location.hostname}:5000/api/attendance/my-attendance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodayAttendance(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchHistory = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`http://${window.location.hostname}:5000/api/employees/${user.id}/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (action: 'MARK_IN' | 'MARK_OUT') => {
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/attendance/mark`, { action }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTodayAttendance();
      fetchHistory();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to mark attendance');
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
          <CardContent className="space-y-6 pt-2">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-3 border-4 border-white shadow-sm flex items-center justify-center">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-slate-400">{user?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <label className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Upload Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            
            <div className="space-y-4">
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
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-slate-200">
          <CardHeader><CardTitle>TODAY'S ATTENDANCE</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-sm border border-slate-200 bg-slate-50 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                  <p className={`font-black text-lg ${
                    !todayAttendance ? 'text-slate-400' :
                    todayAttendance.status === 'PENDING_VERIFICATION' ? 'text-orange-500' :
                    todayAttendance.status === 'PRESENT' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {!todayAttendance ? 'NOT MARKED IN' : todayAttendance.status.replace('_', ' ')}
                  </p>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => markAttendance('MARK_IN')}
                    disabled={!!todayAttendance?.mark_in_time}
                    className={`w-full py-3 font-bold uppercase tracking-widest rounded-sm transition-all ${
                      todayAttendance?.mark_in_time 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                    }`}
                  >
                    {todayAttendance?.mark_in_time 
                      ? `Marked In at ${new Date(todayAttendance.mark_in_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                      : 'MARK IN NOW'
                    }
                  </button>

                  <button 
                    onClick={() => markAttendance('MARK_OUT')}
                    disabled={!todayAttendance?.mark_in_time || !!todayAttendance?.mark_out_time}
                    className={`w-full py-3 font-bold uppercase tracking-widest rounded-sm transition-all ${
                      !todayAttendance?.mark_in_time || todayAttendance?.mark_out_time
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md'
                    }`}
                  >
                    {todayAttendance?.mark_out_time 
                      ? `Marked Out at ${new Date(todayAttendance.mark_out_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` 
                      : 'MARK OUT NOW'
                    }
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="col-span-3 border-slate-200">
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
