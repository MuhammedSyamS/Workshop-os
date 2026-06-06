import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const STATUSES = [
  'RECEIVED', 'DIAGNOSED', 'IN_PROGRESS', 
  'AWAITING_PARTS', 'QUALITY_CHECK', 'READY', 'DELIVERED'
];

export default function JobBoard() {
  const { token } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const [employees, setEmployees] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({
    customer_name: '', customer_phone: '',
    vehicle_reg: '', vehicle_make: '', vehicle_model: '',
    complaint: '', assigned_to: ''
  });

  useEffect(() => {
    fetchJobs();
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
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/jobs/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateJob = async () => {
    try {
      await axios.post('http://localhost:5000/api/jobs', newJob, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsCreating(false);
      setNewJob({ customer_name: '', customer_phone: '', vehicle_reg: '', vehicle_make: '', vehicle_model: '', complaint: '', assigned_to: '' });
      fetchJobs();
    } catch (e) {
      console.error(e);
      alert('Failed to create job order');
    }
  };

  const [invoiceModal, setInvoiceModal] = useState<any>(null);

  const openInvoiceModal = (type: 'INVOICE' | 'BILL') => {
    if (!selectedJob) return;
    setInvoiceModal({
      isOpen: true,
      type,
      job: selectedJob,
      lineItems: [{ description: 'Service Charge', quantity: 1, price: 0 }],
      taxRate: 5
    });
  };

  const generateDocument = async () => {
    try {
      await axios.post('http://localhost:5000/api/invoices', {
        job_order_id: invoiceModal.job.id,
        type: invoiceModal.type,
        line_items: invoiceModal.lineItems,
        tax_rate: invoiceModal.type === 'INVOICE' ? invoiceModal.taxRate : 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`${invoiceModal.type === 'INVOICE' ? 'Invoice' : 'Bill'} Generated Successfully!`);
      setInvoiceModal(null);
    } catch (e) {
      console.error(e);
      alert('Failed to generate document');
    }
  };

  if (loading) return <div className="p-4 text-slate-500 uppercase font-bold text-sm">Loading Job Orders...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Job Board</h1>
        <Button variant="primary" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'CANCEL' : 'CREATE JOB ORDER'}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-6 bg-white">
          <CardContent className="p-4">
            <h2 className="text-blue-600 font-bold text-sm uppercase mb-4">New Job Order</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Customer Name" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                     value={newJob.customer_name} onChange={e => setNewJob({...newJob, customer_name: e.target.value})} />
              <input placeholder="Customer Phone" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newJob.customer_phone} onChange={e => setNewJob({...newJob, customer_phone: e.target.value})} />
              <input placeholder="Vehicle Reg No" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newJob.vehicle_reg} onChange={e => setNewJob({...newJob, vehicle_reg: e.target.value})} />
              <input placeholder="Company" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newJob.vehicle_make} onChange={e => setNewJob({...newJob, vehicle_make: e.target.value})} />
              <input placeholder="Model" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newJob.vehicle_model} onChange={e => setNewJob({...newJob, vehicle_model: e.target.value})} />
              <input placeholder="Complaint / Issue" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newJob.complaint} onChange={e => setNewJob({...newJob, complaint: e.target.value})} />
              <select className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                      value={newJob.assigned_to} onChange={e => setNewJob({...newJob, assigned_to: e.target.value})}>
                <option value="">-- Assign Mechanic (Optional) --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>
            <Button variant="primary" onClick={handleCreateJob}>SAVE JOB ORDER</Button>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 items-start snap-x hide-scrollbar">
        {STATUSES.map(status => {
          const columnJobs = jobs.filter(j => j.status === status);
          
          return (
            <div key={status} className="snap-start min-w-[320px] w-[320px] shrink-0 bg-white border border-slate-200 flex flex-col max-h-full">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <span className="font-heading font-bold text-xs uppercase tracking-widest text-slate-900">{status.replace('_', ' ')}</span>
                <span className="text-slate-500 text-[10px] font-bold bg-slate-50 px-2 py-0.5">{columnJobs.length}</span>
              </div>
              
              <div className="p-3 overflow-y-auto flex-1 space-y-3">
                {columnJobs.map(job => (
                  <Card key={job.id} onClick={() => setSelectedJob(job)} className="hover:border-blue-600 transition-colors cursor-pointer bg-slate-50">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-heading font-bold text-sm text-slate-900 uppercase">
                          {job.vehicle.reg_number}
                          <span className="text-[10px] text-slate-500 ml-2">#{job.id.slice(-6).toUpperCase()}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase">{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase mb-1">
                        {job.vehicle.make} {job.vehicle.model}
                      </div>
                      <div className="text-[11px] text-slate-500 mb-3 line-clamp-2 leading-relaxed">
                        {job.complaint}
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center" onClick={e => e.stopPropagation()}>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">{job.customer.name}</span>
                        <select 
                          value={job.status}
                          onChange={(e) => updateStatus(job.id, e.target.value)}
                          className="bg-white border border-slate-200 text-slate-900 text-[10px] uppercase font-bold py-1 px-2 focus:outline-none focus:border-blue-600"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnJobs.length === 0 && (
                  <div className="text-center py-8 text-[10px] text-slate-400 uppercase font-bold tracking-widest border border-dashed border-slate-200">
                    NO JOBS IN QUEUE
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-slate-50 border-slate-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-extrabold text-slate-900 uppercase tracking-widest">
                    JOB #{selectedJob.id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="text-sm text-slate-500 uppercase mt-1">
                    Created on {new Date(selectedJob.created_at).toLocaleString()}
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSelectedJob(null)}>CLOSE</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Customer Details</h3>
                  <div className="text-sm text-slate-900 space-y-2">
                    <p><span className="text-slate-500">Name:</span> {selectedJob.customer?.name}</p>
                    <p><span className="text-slate-500">Phone:</span> {selectedJob.customer?.phone}</p>
                    {selectedJob.customer?.email && <p><span className="text-slate-500">Email:</span> {selectedJob.customer.email}</p>}
                  </div>
                </div>
                <div>
                  <h3 className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Vehicle Details</h3>
                  <div className="text-sm text-slate-900 space-y-2">
                    <p><span className="text-slate-500">Registration:</span> <span className="font-bold">{selectedJob.vehicle?.reg_number}</span></p>
                    <p><span className="text-slate-500">Make & Model:</span> {selectedJob.vehicle?.make} {selectedJob.vehicle?.model}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Complaint / Issue</h3>
                <p className="text-sm text-slate-900 bg-white p-4 rounded-sm border border-slate-200">
                  {selectedJob.complaint}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-200 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Status:</span>
                  <select 
                    value={selectedJob.status}
                    onChange={(e) => {
                      updateStatus(selectedJob.id, e.target.value);
                      setSelectedJob({ ...selectedJob, status: e.target.value });
                    }}
                    className="bg-white border border-slate-200 text-blue-600 text-sm uppercase font-bold py-1.5 px-3 focus:outline-none focus:border-blue-600"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="text-slate-500 text-xs font-bold uppercase">
                  Current Total: <span className="text-slate-900 text-lg ml-1">₹{selectedJob.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => openInvoiceModal('BILL')}>GENERATE BILL (NON-TAX)</Button>
                <Button variant="primary" className="flex-1" onClick={() => openInvoiceModal('INVOICE')}>GENERATE TAX INVOICE</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Invoice/Bill Generator Modal */}
      {invoiceModal && invoiceModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[90vh] flex flex-col">
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-1">
                    {invoiceModal.type === 'INVOICE' ? 'Generate Tax Invoice' : 'Generate Bill'}
                  </h2>
                  <p className="text-sm font-bold text-blue-600">Job #{invoiceModal.job.id.slice(-6).toUpperCase()}</p>
                </div>
                <Button variant="outline" onClick={() => setInvoiceModal(null)}>CLOSE</Button>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">Line Items (Parts, Labor)</label>
                  <Button variant="outline" className="text-xs py-1" onClick={() => {
                    setInvoiceModal({
                      ...invoiceModal,
                      lineItems: [...invoiceModal.lineItems, { description: '', quantity: 1, price: 0 }]
                    });
                  }}>+ ADD ITEM</Button>
                </div>

                <div className="space-y-3">
                  {invoiceModal.lineItems.map((item: any, idx: number) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        className="flex-1 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        placeholder="Description"
                        value={item.description}
                        onChange={e => {
                          const newItems = [...invoiceModal.lineItems];
                          newItems[idx].description = e.target.value;
                          setInvoiceModal({...invoiceModal, lineItems: newItems});
                        }}
                      />
                      <input 
                        className="w-20 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        type="number" 
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={e => {
                          const newItems = [...invoiceModal.lineItems];
                          newItems[idx].quantity = Number(e.target.value);
                          setInvoiceModal({...invoiceModal, lineItems: newItems});
                        }}
                      />
                      <input 
                        className="w-24 bg-slate-50 border border-slate-200 p-2 text-sm" 
                        type="number" 
                        placeholder="Price"
                        value={item.price}
                        onChange={e => {
                          const newItems = [...invoiceModal.lineItems];
                          newItems[idx].price = Number(e.target.value);
                          setInvoiceModal({...invoiceModal, lineItems: newItems});
                        }}
                      />
                      <Button variant="danger" className="px-3" onClick={() => {
                        const newItems = invoiceModal.lineItems.filter((_: any, i: number) => i !== idx);
                        setInvoiceModal({...invoiceModal, lineItems: newItems});
                      }}>X</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500">Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    ₹{invoiceModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0).toFixed(2)}
                  </span>
                </div>
                {invoiceModal.type === 'INVOICE' && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                      Tax Rate (%):
                      <input 
                        type="number" 
                        className="w-16 bg-slate-50 border border-slate-200 p-1 text-xs" 
                        value={invoiceModal.taxRate}
                        onChange={e => setInvoiceModal({...invoiceModal, taxRate: Number(e.target.value)})}
                      />
                    </span>
                    <span className="font-bold text-slate-900">
                      ₹{((invoiceModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) * invoiceModal.taxRate) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
                  <span className="text-lg font-extrabold text-slate-900 uppercase">Total Due:</span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{(
                      invoiceModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) * 
                      (1 + (invoiceModal.type === 'INVOICE' ? invoiceModal.taxRate : 0) / 100)
                    ).toFixed(2)}
                  </span>
                </div>

                <Button variant="primary" className="w-full py-3" onClick={generateDocument}>
                  GENERATE {invoiceModal.type === 'INVOICE' ? 'INVOICE' : 'BILL'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
