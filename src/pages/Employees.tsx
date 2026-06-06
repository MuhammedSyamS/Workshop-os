import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Employees() {
  const { token } = useAuthStore();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', role: '', phone: '', email: '', specialization: '', salary: '', password: '' });
  
  const [historyModal, setHistoryModal] = useState<{ isOpen: boolean; employee: any; history: any[] } | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/employees', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async () => {
    try {
      await axios.post('http://localhost:5000/api/employees', newEmp, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdding(false);
      setNewEmp({ name: '', role: '', phone: '', email: '', specialization: '', salary: '', password: '' });
      fetchEmployees();
    } catch (e) {
      console.error(e);
      alert('Failed to add employee');
    }
  };

  const markAttendance = async (id: string, status: string) => {
    try {
      await axios.post(`http://localhost:5000/api/employees/${id}/attendance`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (e) {
      console.error(e);
      alert('Failed to mark attendance');
    }
  };

  const viewHistory = async (emp: any) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/employees/${emp.id}/attendance/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryModal({ isOpen: true, employee: emp, history: res.data });
    } catch (e) {
      console.error(e);
      alert('Failed to fetch history');
    }
  };

  const approveEmployee = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/employees/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (e) {
      console.error(e);
      alert('Failed to approve employee');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Employee Management</h1>
        <Button variant="primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'CANCEL' : 'ADD EMPLOYEE'}
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-6 bg-white border-slate-200">
          <CardContent className="p-6">
            <h2 className="text-blue-600 font-bold text-sm uppercase mb-4">New Employee Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Full Name" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                     value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
              <input placeholder="Email Address" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
              
              <div className="relative">
                <input placeholder="Temporary Password" type={showPassword ? "text" : "password"} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 pr-10 text-sm"
                       value={newEmp.password || ''} onChange={e => setNewEmp({...newEmp, password: e.target.value})} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-blue-600 focus:outline-none">
                  {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>

              <input placeholder="Phone Number" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newEmp.phone} onChange={e => setNewEmp({...newEmp, phone: e.target.value})} />
              <input placeholder="Role (e.g., Mechanic, Admin)" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} />
              <input placeholder="Specialization" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newEmp.specialization} onChange={e => setNewEmp({...newEmp, specialization: e.target.value})} />
              <input placeholder="Salary" type="number" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newEmp.salary} onChange={e => setNewEmp({...newEmp, salary: e.target.value})} />
            </div>
            <Button variant="primary" onClick={handleAddEmployee}>SAVE EMPLOYEE</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>STAFF DIRECTORY & ATTENDANCE</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : employees.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Employees Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Name</th>
                    <th className="p-3 font-bold">Role</th>
                    <th className="p-3 font-bold">Phone</th>
                    <th className="p-3 font-bold text-center">Status / Attendance</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">
                        {emp.name}
                        {!emp.is_approved && <span className="ml-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-widest">Pending</span>}
                      </td>
                      <td className="p-3 text-slate-500">{emp.role}</td>
                      <td className="p-3 text-slate-500">{emp.phone}</td>
                      <td className="p-3 text-center">
                        {!emp.is_approved ? (
                          <span className="text-slate-400 italic text-xs">Waiting Approval</span>
                        ) : (
                          <select 
                            value={emp.today_attendance}
                            onChange={(e) => markAttendance(emp.id, e.target.value)}
                            className={`text-xs font-bold p-1 border uppercase ${
                              emp.today_attendance === 'PRESENT' ? 'bg-green-100 text-green-800 border-green-200' : 
                              emp.today_attendance === 'ABSENT' ? 'bg-red-100 text-red-800 border-red-200' :
                              emp.today_attendance === 'LATE' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                              emp.today_attendance === 'LEAVE' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                              'bg-slate-100 text-slate-600 border-slate-300'
                            }`}
                          >
                            <option value="UNMARKED">Unmarked</option>
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LATE">Late</option>
                            <option value="LEAVE">Leave</option>
                          </select>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {!emp.is_approved && (
                          <Button variant="primary" onClick={() => approveEmployee(emp.id)} className="text-xs py-1 px-3">APPROVE</Button>
                        )}
                        <Button variant="outline" onClick={() => viewHistory(emp)} className="text-xs py-1 px-3">HISTORY</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {historyModal && historyModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-1">Attendance History</h2>
                  <p className="text-sm font-bold text-blue-600">{historyModal.employee.name} - {historyModal.employee.role}</p>
                </div>
                <Button variant="outline" onClick={() => setHistoryModal(null)}>CLOSE</Button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {historyModal.history.length === 0 ? (
                  <p className="text-sm text-slate-500 py-4 text-center">No attendance records found.</p>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-widest">
                        <th className="py-2">Date</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyModal.history.map((record: any) => (
                        <tr key={record.id} className="border-b border-slate-100 last:border-0">
                          <td className="py-2 font-medium text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
