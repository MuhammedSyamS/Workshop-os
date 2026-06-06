import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Schedule() {
  const { token } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  
  const [newAppt, setNewAppt] = useState({ customer_id: '', vehicle_id: '', appointment_date: '', service_type: '', notes: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const aRes = await axios.get('http://localhost:5000/api/appointments', { headers: { Authorization: `Bearer ${token}` }});
      const cRes = await axios.get('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` }});
      const vRes = await axios.get('http://localhost:5000/api/vehicles', { headers: { Authorization: `Bearer ${token}` }});
      
      setAppointments(aRes.data);
      setCustomers(cRes.data);
      setVehicles(vRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSlot = async () => {
    try {
      await axios.post('http://localhost:5000/api/appointments', newAppt, { headers: { Authorization: `Bearer ${token}` }});
      setAddModal(false);
      setNewAppt({ customer_id: '', vehicle_id: '', appointment_date: '', service_type: '', notes: '' });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to book appointment');
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}/status`, { status: 'CANCELLED' }, { headers: { Authorization: `Bearer ${token}` }});
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Appointments</h1>
        <Button variant="primary" onClick={() => setAddModal(true)}>BOOK SLOT</Button>
      </div>
      
      <Card>
        <CardHeader><CardTitle>CALENDAR SCHEDULE</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Appointments Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Date & Time</th>
                    <th className="p-3 font-bold">Customer</th>
                    <th className="p-3 font-bold">Vehicle</th>
                    <th className="p-3 font-bold">Service Type</th>
                    <th className="p-3 font-bold text-center">Status</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{new Date(a.appointment_date).toLocaleString()}</td>
                      <td className="p-3 font-medium">{a.customer_id?.name || 'Unknown'}</td>
                      <td className="p-3 text-slate-500">{a.vehicle_id?.reg_number || 'N/A'}</td>
                      <td className="p-3 text-slate-500">{a.service_type}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded font-bold text-[10px] uppercase tracking-widest ${
                          a.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-600' :
                          a.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {a.status === 'SCHEDULED' && (
                          <Button variant="danger" className="text-xs px-2 py-1" onClick={() => cancelAppointment(a.id)}>CANCEL</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Book Appointment Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-6">Book New Slot</h2>
              <div className="space-y-4">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                  value={newAppt.customer_id}
                  onChange={e => setNewAppt({...newAppt, customer_id: e.target.value})}
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                  value={newAppt.vehicle_id}
                  onChange={e => setNewAppt({...newAppt, vehicle_id: e.target.value})}
                  disabled={!newAppt.customer_id}
                >
                  <option value="">-- Select Vehicle --</option>
                  {vehicles.filter(v => v.customer?.id === newAppt.customer_id || v.customer_id === newAppt.customer_id).map(v => 
                    <option key={v.id} value={v.id}>{v.reg_number} ({v.make})</option>
                  )}
                </select>

                <input type="datetime-local" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                       value={newAppt.appointment_date} onChange={e => setNewAppt({...newAppt, appointment_date: e.target.value})} />
                
                <input placeholder="Service Type (e.g., General Service)" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newAppt.service_type} onChange={e => setNewAppt({...newAppt, service_type: e.target.value})} />
                
                <textarea placeholder="Additional Notes" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm h-24"
                          value={newAppt.notes} onChange={e => setNewAppt({...newAppt, notes: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setAddModal(false)}>CANCEL</Button>
                <Button variant="primary" onClick={handleBookSlot}>BOOK</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
