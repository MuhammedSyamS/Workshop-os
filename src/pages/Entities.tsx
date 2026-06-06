import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Customers() {
  const { token } = useAuthStore();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [jobsModal, setJobsModal] = useState<{ isOpen: boolean; customer: any; jobs: any[] } | null>(null);
  const [billModal, setBillModal] = useState<{ isOpen: boolean; customer: any; jobs: any[]; selectedJobId: string; lineItems: any[]; taxRate: number } | null>(null);
  const [addCustomerModal, setAddCustomerModal] = useState(false);

  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers', {
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
      await axios.post('http://localhost:5000/api/customers', newCustomer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddCustomerModal(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '' });
      fetchCustomers();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to add customer');
    }
  };

  const openJobsModal = async (customer: any) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobsModal({ isOpen: true, customer, jobs: res.data.job_orders || [] });
    } catch (e) {
      console.error(e);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (jobsModal) {
        setJobsModal({
          ...jobsModal,
          jobs: jobsModal.jobs.filter((j: any) => j.id !== jobId)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openBillModal = async (customer: any) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${customer.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const jobs = res.data.job_orders || [];
      setBillModal({ 
        isOpen: true, 
        customer, 
        jobs, 
        selectedJobId: jobs.length > 0 ? jobs[0].id : '', 
        lineItems: [{ description: 'Service Charge', quantity: 1, price: 0 }],
        taxRate: 5 
      });
    } catch (e) {
      console.error(e);
    }
  };

  const generateInvoice = async () => {
    if (!billModal || !billModal.selectedJobId) return alert('Select a Job Order first');
    try {
      await axios.post('http://localhost:5000/api/invoices', {
        job_order_id: billModal.selectedJobId,
        line_items: billModal.lineItems,
        tax_rate: billModal.taxRate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Invoice Generated Successfully!');
      setBillModal(null);
    } catch (e) {
      console.error(e);
      alert('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Customer Directory</h1>
        <Button variant="primary" onClick={() => setAddCustomerModal(true)}>ADD CUSTOMER</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>ALL CUSTOMERS</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : customers.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Customers Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Name</th>
                    <th className="p-3 font-bold">Phone</th>
                    <th className="p-3 font-bold">Vehicles</th>
                    <th className="p-3 font-bold">Joined</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{c.name}</td>
                      <td className="p-3 text-slate-500">{c.phone}</td>
                      <td className="p-3">{c.vehicles?.map((v:any) => v.reg_number).join(', ') || 'None'}</td>
                      <td className="p-3 text-slate-500">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="p-3 text-right space-x-2">
                        <Button variant="outline" onClick={() => openJobsModal(c)} className="text-xs py-1 px-3">JOBS</Button>
                        <Button variant="outline" onClick={() => openBillModal(c)} className="text-xs py-1 px-3">CREATE BILL</Button>
                      </td>
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
              <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-6">Add New Customer</h2>
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

      {/* Jobs Viewer Modal */}
      {jobsModal && jobsModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[80vh] flex flex-col">
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-1">Job History</h2>
                  <p className="text-sm font-bold text-blue-600">{jobsModal.customer.name}</p>
                </div>
                <Button variant="outline" onClick={() => setJobsModal(null)}>CLOSE</Button>
              </div>

              {jobsModal.jobs.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No jobs found for this customer.</p>
              ) : (
                <div className="space-y-4">
                  {jobsModal.jobs.map((job: any) => (
                    <div key={job.id} className="border border-slate-200 p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm">Job #{job.id.slice(-6).toUpperCase()}</span>
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded">{job.status}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{job.complaint}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">{new Date(job.created_at).toLocaleDateString()}</span>
                        <div className="space-x-2">
                          <Button variant="danger" onClick={() => deleteJob(job.id)} className="py-1 px-3">DELETE</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Bill Modal */}
      {billModal && billModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[90vh] flex flex-col">
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-1">Invoice Generator</h2>
                  <p className="text-sm font-bold text-blue-600">Billing for {billModal.customer.name}</p>
                </div>
                <Button variant="outline" onClick={() => setBillModal(null)}>CLOSE</Button>
              </div>
              
              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Job Order</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-sm text-slate-900"
                  value={billModal.selectedJobId}
                  onChange={e => setBillModal({ ...billModal, selectedJobId: e.target.value })}
                >
                  <option value="">-- Select a Job --</option>
                  {billModal.jobs.map(job => (
                    <option key={job.id} value={job.id}>Job #{job.id.slice(-6).toUpperCase()} - {new Date(job.created_at).toLocaleDateString()}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">Line Items (Parts, Labor)</label>
                  <Button variant="outline" className="text-xs py-1" onClick={() => {
                    setBillModal({
                      ...billModal,
                      lineItems: [...billModal.lineItems, { description: '', quantity: 1, price: 0 }]
                    });
                  }}>+ ADD ITEM</Button>
                </div>

                <div className="space-y-3">
                  {billModal.lineItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        className="flex-1 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        placeholder="Description"
                        value={item.description}
                        onChange={e => {
                          const newItems = [...billModal.lineItems];
                          newItems[idx].description = e.target.value;
                          setBillModal({...billModal, lineItems: newItems});
                        }}
                      />
                      <input 
                        className="w-20 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        type="number" 
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={e => {
                          const newItems = [...billModal.lineItems];
                          newItems[idx].quantity = Number(e.target.value);
                          setBillModal({...billModal, lineItems: newItems});
                        }}
                      />
                      <input 
                        className="w-24 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        type="number" 
                        placeholder="Price"
                        value={item.price}
                        onChange={e => {
                          const newItems = [...billModal.lineItems];
                          newItems[idx].price = Number(e.target.value);
                          setBillModal({...billModal, lineItems: newItems});
                        }}
                      />
                      <Button variant="danger" className="px-3" onClick={() => {
                        const newItems = billModal.lineItems.filter((_, i) => i !== idx);
                        setBillModal({...billModal, lineItems: newItems});
                      }}>X</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500">Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    ${billModal.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    Tax Rate (%):
                    <input 
                      type="number" 
                      className="w-16 bg-slate-50 border border-slate-200 p-1 text-xs" 
                      value={billModal.taxRate}
                      onChange={e => setBillModal({...billModal, taxRate: Number(e.target.value)})}
                    />
                  </span>
                  <span className="font-bold text-slate-900">
                    ${((billModal.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) * billModal.taxRate) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
                  <span className="text-lg font-extrabold text-slate-900 uppercase">Total Due:</span>
                  <span className="text-2xl font-black text-blue-600">
                    ${(
                      billModal.lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0) * 
                      (1 + billModal.taxRate / 100)
                    ).toFixed(2)}
                  </span>
                </div>

                <Button variant="primary" className="w-full py-3" onClick={generateInvoice}>GENERATE OFFICIAL INVOICE</Button>
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
      const vRes = await axios.get('http://localhost:5000/api/vehicles', { headers: { Authorization: `Bearer ${token}` }});
      const cRes = await axios.get('http://localhost:5000/api/customers', { headers: { Authorization: `Bearer ${token}` }});
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
      await axios.post('http://localhost:5000/api/vehicles', newVeh, { headers: { Authorization: `Bearer ${token}` }});
      setAddModal(false);
      setNewVeh({ customer_id: '', reg_number: '', make: '', model: '', year: '', color: '' });
      fetchData();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to add vehicle');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Vehicle Directory</h1>
        <Button variant="primary" onClick={() => setAddModal(true)}>ADD VEHICLE</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>ALL VEHICLES</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : vehicles.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Vehicles Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
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
              <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-6">Register Vehicle</h2>
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
                       value={newVeh.reg_number} onChange={e => setNewVeh({...newVeh, reg_number: e.target.value})} />
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
