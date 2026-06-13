import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/AppContext';

export function Customers() {
  const { token } = useAuthStore();
  const toast = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`/api/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      await axios.post(`/api/customers`, newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddCustomerModal(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      fetchCustomers();
      toast.success('Customer added successfully!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to add customer');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold text-slate-900">Customer Directory</h1>
        <Button variant="primary" onClick={() => setAddCustomerModal(true)}>ADD CUSTOMER</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>ALL CUSTOMERS</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">No Customers Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs">
                    <th className="p-3 font-bold">Name</th>
                    <th className="p-3 font-bold">Phone</th>
                    <th className="p-3 font-bold">Vehicles</th>
                    <th className="p-3 font-bold w-1/4">Active Jobs</th>
                    <th className="p-3 font-bold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{c.name}</td>
                      <td className="p-3 text-slate-500">{c.phone}</td>
                      <td className="p-3 text-slate-500">{c.vehicles?.map((v:any) => v.reg_number).join(', ') || 'None'}</td>
                      <td className="p-3">
                        {c.active_jobs && c.active_jobs.length > 0 ? (
                           <div className="flex flex-col gap-2">
                             {c.active_jobs.map((job: any) => (
                               <div key={job._id} className="text-xs bg-slate-100 border border-slate-200 rounded-md p-2">
                                 <span className="font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded-sm">{job.status}</span>
                                 <div className="text-slate-700 mt-1.5 font-medium">
                                   {job.vehicle_id?.make} {job.vehicle_id?.model} <span className="text-slate-500">({job.vehicle_id?.reg_number})</span>
                                 </div>
                                 <div className="text-slate-500 mt-0.5">
                                   Mechanic: <span className="font-medium text-slate-700">{job.assigned_to?.name || 'Unassigned'}</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                        ) : <span className="text-slate-400 italic text-xs">No active jobs</span>}
                      </td>
                      <td className="p-3 text-slate-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Customer Modal */}
      {addCustomerModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">Add New Customer</h2>
              <div className="space-y-4">
                <input placeholder="Full Name" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                       value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                <input placeholder="Phone Number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                <input placeholder="Email Address" type="email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                <input placeholder="Physical Address" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setAddCustomerModal(false)}>CANCEL</Button>
                <Button variant="primary" onClick={handleAddCustomer}>SAVE</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

export function Vehicles() {
  const { token } = useAuthStore();
  const toast = useToast();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  
  const [newVeh, setNewVeh] = useState({ customer_id: '', reg_number: '', make: '', model: '', year: '', color: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const vRes = await axios.get(`/api/vehicles`, { headers: { Authorization: `Bearer ${token}` }});
      const cRes = await axios.get(`/api/customers`, { headers: { Authorization: `Bearer ${token}` }});
      setVehicles(vRes.data);
      setCustomers(cRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post(`/api/vehicles`, newVeh, { headers: { Authorization: `Bearer ${token}` }});
      setAddModal(false);
      setNewVeh({ customer_id: '', reg_number: '', make: '', model: '', year: '', color: '' });
      fetchData();
      toast.success('Vehicle added successfully!');
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to add vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold text-slate-900">Vehicle Directory</h1>
        <Button variant="primary" onClick={() => setAddModal(true)}>ADD VEHICLE</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>ALL VEHICLES</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : vehicles.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">No Vehicles Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs">
                    <th className="p-3 font-bold">Reg Number</th>
                    <th className="p-3 font-bold">Company / Make</th>
                    <th className="p-3 font-bold">Model</th>
                    <th className="p-3 font-bold">Owner</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map(v => (
                    <tr key={v.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{v.reg_number}</td>
                      <td className="p-3 text-slate-500">{v.make}</td>
                      <td className="p-3 text-slate-500">{v.model} {v.year ? `(${v.year})` : ''}</td>
                      <td className="p-3 text-slate-900 font-medium">{v.customer?.name || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Vehicle Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-bold text-slate-900 mb-6">Register Vehicle</h2>
              <div className="space-y-4">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                  value={newVeh.customer_id}
                  onChange={e => setNewVeh({...newVeh, customer_id: e.target.value})}
                >
                  <option value="">-- Select Owner --</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
                </select>
                <input placeholder="Registration Number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                       value={newVeh.reg_number} onChange={e => setNewVeh({...newVeh, reg_number: e.target.value.toUpperCase()})} />
                <input placeholder="Company / Make" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newVeh.make} onChange={e => setNewVeh({...newVeh, make: e.target.value})} />
                <input placeholder="Model" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newVeh.model} onChange={e => setNewVeh({...newVeh, model: e.target.value})} />
                <div className="flex gap-4">
                  <input placeholder="Year" type="number" className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                         value={newVeh.year} onChange={e => setNewVeh({...newVeh, year: e.target.value})} />
                  <input placeholder="Color" className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                         value={newVeh.color} onChange={e => setNewVeh({...newVeh, color: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setAddModal(false)}>CANCEL</Button>
                <Button variant="primary" onClick={handleAdd}>REGISTER</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
