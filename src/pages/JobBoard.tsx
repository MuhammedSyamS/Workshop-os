import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { X, Plus, Trash2 } from 'lucide-react';

const STATUSES = [
  'RECEIVED', 'DIAGNOSED', 'IN_PROGRESS',
  'AWAITING_PARTS', 'QUALITY_CHECK', 'READY', 'DELIVERED'
];

const STATUS_COLORS: Record<string, string> = {
  RECEIVED:       'bg-slate-100 text-slate-700',
  DIAGNOSED:      'bg-blue-100 text-blue-700',
  IN_PROGRESS:    'bg-amber-100 text-amber-700',
  AWAITING_PARTS: 'bg-orange-100 text-orange-700',
  QUALITY_CHECK:  'bg-purple-100 text-purple-700',
  READY:          'bg-green-100 text-green-700',
  DELIVERED:      'bg-emerald-100 text-emerald-700',
};

export default function JobBoard() {
  const { token } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [newJob, setNewJob] = useState({
    customer_name: '', customer_phone: '',
    vehicle_reg: '', vehicle_make: '', vehicle_model: '',
    complaint: '', assigned_to: ''
  });
  const [invoiceModal, setInvoiceModal] = useState<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    fetchJobs();
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`/api/employees`, { headers: { Authorization: `Bearer ${token}` } });
      setEmployees(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`/api/jobs`, { headers: { Authorization: `Bearer ${token}` } });
      setJobs(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`/api/jobs/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchJobs();
    } catch (e) { console.error(e); }
  };

  const handleCreateJob = async () => {
    if (!newJob.customer_name || !newJob.vehicle_reg || !newJob.complaint) {
      showToast('Please fill in Customer Name, Vehicle Reg, and Complaint.'); return;
    }
    setSaving(true);
    try {
      await axios.post(`/api/jobs`, newJob, { headers: { Authorization: `Bearer ${token}` } });
      setIsCreating(false);
      setNewJob({ customer_name: '', customer_phone: '', vehicle_reg: '', vehicle_make: '', vehicle_model: '', complaint: '', assigned_to: '' });
      fetchJobs();
      showToast('Job order created successfully!');
    } catch (e) { showToast('Failed to create job order. Please try again.'); }
    finally { setSaving(false); }
  };

  const openInvoiceModal = (type: 'INVOICE' | 'BILL') => {
    if (!selectedJob) return;
    setInvoiceModal({
      isOpen: true, type, job: selectedJob,
      lineItems: [{ description: 'Service Charge', quantity: 1, price: 0 }],
      taxRate: 5
    });
  };

  const generateDocument = async () => {
    const validItems = invoiceModal.lineItems.filter((item: any) => item.description.trim() !== '');
    if (validItems.length === 0) { showToast('Please add at least one line item with a description.'); return; }
    try {
      await axios.post(`/api/invoices`, {
        job_order_id: invoiceModal.job.id,
        type: invoiceModal.type,
        line_items: validItems,
        tax_rate: invoiceModal.type === 'INVOICE' ? invoiceModal.taxRate : 0
      }, { headers: { Authorization: `Bearer ${token}` } });
      showToast(`${invoiceModal.type === 'INVOICE' ? 'Invoice' : 'Bill'} generated successfully!`);
      setInvoiceModal(null);
    } catch (e) { showToast('Failed to generate document. Please try again.'); }
  };

  const inputCls = 'w-full bg-slate-50 border border-slate-200 text-slate-900 p-2.5 text-sm rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200';

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="text-slate-500 text-sm font-medium animate-pulse">Loading Job Orders...</div>
    </div>
  );

  return (
    <div className="flex flex-col h-full relative">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-xl animate-in slide-in-from-top-2 max-w-[90vw] text-center">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-lg sm:text-xl font-heading font-bold text-slate-900">Job Board</h1>
        <Button variant="primary" onClick={() => setIsCreating(!isCreating)} className="text-xs sm:text-sm py-2 px-3 sm:px-4 whitespace-nowrap">
          {isCreating ? 'CANCEL' : '+ NEW JOB'}
        </Button>
      </div>

      {/* Create Job Form */}
      {isCreating && (
        <div className="mb-4 sm:mb-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
          <h2 className="text-blue-600 font-bold text-sm mb-4">New Job Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <input className={inputCls} placeholder="Customer Name *" value={newJob.customer_name} onChange={e => setNewJob({...newJob, customer_name: e.target.value})} />
            <input className={inputCls} placeholder="Customer Phone" type="tel" value={newJob.customer_phone} onChange={e => setNewJob({...newJob, customer_phone: e.target.value})} />
            <input className={inputCls} placeholder="Vehicle Reg No *" value={newJob.vehicle_reg} onChange={e => setNewJob({...newJob, vehicle_reg: e.target.value})} />
            <input className={inputCls} placeholder="Make / Brand" value={newJob.vehicle_make} onChange={e => setNewJob({...newJob, vehicle_make: e.target.value})} />
            <input className={inputCls} placeholder="Model" value={newJob.vehicle_model} onChange={e => setNewJob({...newJob, vehicle_model: e.target.value})} />
            <select className={inputCls} value={newJob.assigned_to} onChange={e => setNewJob({...newJob, assigned_to: e.target.value})}>
              <option value="">— Assign Mechanic (Optional) —</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>)}
            </select>
            <textarea className={`${inputCls} col-span-1 sm:col-span-2 resize-none`} rows={2} placeholder="Complaint / Issue *" value={newJob.complaint} onChange={e => setNewJob({...newJob, complaint: e.target.value})} />
          </div>
          <Button variant="primary" onClick={handleCreateJob} isLoading={saving} className="w-full sm:w-auto">
            SAVE JOB ORDER
          </Button>
        </div>
      )}

      {/* Kanban Board — horizontal scroll on mobile */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 flex-1 items-start snap-x custom-scrollbar" style={{ minHeight: 300 }}>
        {STATUSES.map(status => {
          const columnJobs = jobs.filter(j => j.status === status);
          return (
            <div key={status} className="snap-start shrink-0 w-[280px] sm:w-[300px] bg-white border border-slate-200 rounded-xl flex flex-col max-h-[70vh]">
              <div className="px-3 py-2.5 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
                <span className="font-semibold text-xs text-slate-700 uppercase tracking-wide">{status.replace(/_/g, ' ')}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${columnJobs.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{columnJobs.length}</span>
              </div>
              <div className="p-2.5 overflow-y-auto flex-1 space-y-2.5 custom-scrollbar">
                {columnJobs.map(job => (
                  <div key={job.id} onClick={() => setSelectedJob(job)}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm cursor-pointer transition-all active:scale-[0.98]">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-sm text-slate-900">{job?.vehicle?.reg_number || 'N/A'}</span>
                      <span className="text-[10px] text-slate-400">{new Date(job.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-1">{job?.vehicle?.make} {job?.vehicle?.model}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">{job.complaint}</div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-2" onClick={e => e.stopPropagation()}>
                      <span className="text-[11px] font-semibold text-blue-600 truncate max-w-[100px]">{job?.customer?.name || 'Unknown'}</span>
                      <select
                        value={job.status}
                        onChange={(e) => updateStatus(job.id, e.target.value)}
                        className={`text-[10px] font-bold py-0.5 px-1.5 rounded border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[job.status] || 'bg-slate-100 text-slate-600'}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
                {columnJobs.length === 0 && (
                  <div className="text-center py-8 text-[10px] text-slate-400 font-medium border border-dashed border-slate-200 rounded-lg">
                    NO JOBS
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" onClick={() => setSelectedJob(null)}>
          <div className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex justify-between items-start p-4 sm:p-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                  JOB #{String(selectedJob?.id || selectedJob?._id || '').slice(-6).toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{new Date(selectedJob.created_at).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4 custom-scrollbar">
              {/* Customer + Vehicle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Customer</p>
                  <p className="font-semibold text-sm text-slate-900">{selectedJob.customer?.name || '—'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedJob.customer?.phone || '—'}</p>
                  {selectedJob.customer?.email && <p className="text-xs text-slate-500 truncate">{selectedJob.customer.email}</p>}
                </div>
                <div className="bg-slate-50 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Vehicle</p>
                  <p className="font-bold text-sm text-slate-900">{selectedJob.vehicle?.reg_number || '—'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedJob.vehicle?.make} {selectedJob.vehicle?.model}</p>
                </div>
              </div>
              {/* Complaint */}
              <div className="bg-slate-50 rounded-xl p-3.5">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">Complaint / Issue</p>
                <p className="text-sm text-slate-800 leading-relaxed">{selectedJob.complaint}</p>
              </div>
              {/* Status + Total */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-500">Status</span>
                  <select
                    value={selectedJob.status}
                    onChange={(e) => { updateStatus(selectedJob.id, e.target.value); setSelectedJob({ ...selectedJob, status: e.target.value }); }}
                    className="bg-white border border-slate-200 text-blue-600 text-sm font-bold py-1.5 px-3 rounded-lg focus:outline-none focus:border-blue-400"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                  </select>
                </div>
                <div className="text-sm text-slate-500">
                  Total: <span className="text-slate-900 font-bold text-base ml-1">₹{selectedJob.total_amount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 shrink-0">
              <Button variant="outline" className="flex-1 text-xs sm:text-sm" onClick={() => openInvoiceModal('BILL')}>GENERATE BILL</Button>
              <Button variant="primary" className="flex-1 text-xs sm:text-sm" onClick={() => openInvoiceModal('INVOICE')}>TAX INVOICE</Button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice / Bill Modal */}
      {invoiceModal?.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-[60] p-0 sm:p-4" onClick={() => setInvoiceModal(null)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">{invoiceModal.type === 'INVOICE' ? 'Tax Invoice' : 'Bill'}</h2>
                <p className="text-xs text-blue-600 font-semibold mt-0.5">Job #{String(invoiceModal?.job?.id || '').slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setInvoiceModal(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
              {/* Line Items */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Line Items</span>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700"
                  onClick={() => setInvoiceModal({ ...invoiceModal, lineItems: [...invoiceModal.lineItems, { description: '', quantity: 1, price: 0 }] })}>
                  <Plus size={13} /> Add Item
                </button>
              </div>

              <div className="space-y-2 mb-4">
                {invoiceModal.lineItems.map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input className="flex-1 min-w-0 bg-slate-50 border border-slate-200 p-2 text-sm rounded-lg focus:outline-none focus:border-blue-400"
                      placeholder="Description" value={item.description}
                      onChange={e => { const n = [...invoiceModal.lineItems]; n[idx].description = e.target.value; setInvoiceModal({...invoiceModal, lineItems: n}); }} />
                    <input className="w-14 bg-slate-50 border border-slate-200 p-2 text-sm rounded-lg text-center focus:outline-none focus:border-blue-400"
                      type="number" placeholder="Qty" min="1" value={item.quantity}
                      onChange={e => { const n = [...invoiceModal.lineItems]; n[idx].quantity = Number(e.target.value); setInvoiceModal({...invoiceModal, lineItems: n}); }} />
                    <input className="w-20 bg-slate-50 border border-slate-200 p-2 text-sm rounded-lg text-right focus:outline-none focus:border-blue-400"
                      type="number" placeholder="₹" min="0" value={item.price}
                      onChange={e => { const n = [...invoiceModal.lineItems]; n[idx].price = Number(e.target.value); setInvoiceModal({...invoiceModal, lineItems: n}); }} />
                    <button onClick={() => { const n = invoiceModal.lineItems.filter((_: any, i: number) => i !== idx); setInvoiceModal({...invoiceModal, lineItems: n}); }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="bg-slate-50 rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{invoiceModal.lineItems.reduce((s: number, i: any) => s + i.quantity * i.price, 0).toFixed(2)}</span>
                </div>
                {invoiceModal.type === 'INVOICE' && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      Tax
                      <input type="number" min="0" max="100"
                        className="w-14 bg-white border border-slate-200 p-1 text-xs rounded-md text-center focus:outline-none focus:border-blue-400"
                        value={invoiceModal.taxRate}
                        onChange={e => setInvoiceModal({...invoiceModal, taxRate: Number(e.target.value)})} />
                      %
                    </div>
                    <span className="font-semibold text-slate-900">₹{((invoiceModal.lineItems.reduce((s: number, i: any) => s + i.quantity * i.price, 0) * invoiceModal.taxRate) / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">Total Due</span>
                  <span className="text-xl font-bold text-blue-600">₹{(invoiceModal.lineItems.reduce((s: number, i: any) => s + i.quantity * i.price, 0) * (1 + (invoiceModal.type === 'INVOICE' ? invoiceModal.taxRate : 0) / 100)).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 border-t border-slate-100 shrink-0">
              <Button variant="primary" className="w-full" onClick={generateDocument}>
                GENERATE {invoiceModal.type}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
