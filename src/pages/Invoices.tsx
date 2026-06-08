import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Invoices() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [invoiceModal, setInvoiceModal] = useState<any>(null);

  useEffect(() => {
    fetchInvoices();
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`/api/jobs`, { headers: { Authorization: `Bearer ${token}` }});
      setJobs(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`/api/invoices`, { headers: { Authorization: `Bearer ${token}` }});
      setInvoices(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openNewInvoiceModal = () => {
    setInvoiceModal({
      isOpen: true,
      jobId: '',
      lineItems: [{ description: 'Service Charge', quantity: 1, price: 0 }],
      taxRate: 5
    });
  };

  const generateInvoice = async () => {
    if (!invoiceModal.jobId) return alert('Please select a Job Order');
    const validItems = invoiceModal.lineItems.filter((item: any) => item.description.trim() !== '');
    if (validItems.length === 0) return alert('Please add at least one valid line item with a description.');

    try {
      await axios.post(`/api/invoices`, {
        job_order_id: invoiceModal.jobId,
        type: 'INVOICE',
        line_items: validItems,
        tax_rate: invoiceModal.taxRate
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Invoice Generated Successfully!');
      setInvoiceModal(null);
      fetchInvoices();
    } catch (e) {
      console.error(e);
      alert('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Invoices</h1>
        <Button variant="primary" onClick={openNewInvoiceModal}>CREATE TAX INVOICE</Button>
      </div>
      
      <Card>
        <CardHeader><CardTitle>INVOICE REGISTRY</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : invoices.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Invoices Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Inv #</th>
                    <th className="p-3 font-bold">Job Card</th>
                    <th className="p-3 font-bold">Customer</th>
                    <th className="p-3 font-bold text-right">Total Amount</th>
                    <th className="p-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => {
                    const invUrl = `${window.location.origin}/print/invoice/${inv.id}`;
                    const waText = encodeURIComponent(`Hello ${inv.job_order?.customer?.name || ''},\n\nHere is your official Tax Invoice for Job #${inv.job_order?.id?.slice(-6).toUpperCase() || ''}.\n*Total Amount:* ₹${(inv.total_amount || inv.total || 0).toFixed(2)}\n\n*View & Download your Invoice here:*\n${invUrl}\n\nThank you for choosing us!`);
                    let cleanPhone = (inv.job_order?.customer?.phone || '').replace(/\D/g, '');
                    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
                    const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waText}`;

                    return (
                      <tr key={inv.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                        <td className="p-3 font-bold">{inv.invoice_number || inv.id?.slice(-6).toUpperCase()}</td>
                        <td className="p-3 text-slate-500">#{inv.job_order?.id?.slice(-6).toUpperCase() || inv.job_order_id?.slice(-6).toUpperCase() || 'N/A'}</td>
                        <td className="p-3 font-medium">{inv.job_order?.customer?.name || 'Unknown'}</td>
                        <td className="p-3 text-right">
                          <span className="font-bold text-blue-600">₹{(inv.total_amount || inv.total || 0).toFixed(2)}</span>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <Button variant="outline" className="text-xs py-1 px-2" onClick={() => window.open(`/print/invoice/${inv.id}`, '_blank')}>
                            PRINT / PDF
                          </Button>
                          <Button variant="primary" className="text-xs py-1 px-2" onClick={() => window.open(waLink, '_blank')}>
                            WHATSAPP
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Generator Modal */}
      {invoiceModal && invoiceModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[90vh] flex flex-col">
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-1">Generate Tax Invoice</h2>
                  <p className="text-sm font-bold text-blue-600">Create an official GST invoice</p>
                </div>
                <Button variant="outline" onClick={() => setInvoiceModal(null)}>CLOSE</Button>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Select Job Order</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-sm text-slate-900"
                  value={invoiceModal.jobId}
                  onChange={e => setInvoiceModal({ ...invoiceModal, jobId: e.target.value })}
                >
                  <option value="">-- Select a Job --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      Job #{job.id.slice(-6).toUpperCase()} - {job.customer?.name} ({job.vehicle?.reg_number})
                    </option>
                  ))}
                </select>

                {invoiceModal.jobId && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-sm">
                    {(() => {
                      const selectedJob = jobs.find(j => j.id === invoiceModal.jobId);
                      if (!selectedJob) return null;
                      return (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Customer</span>
                            <div className="font-bold text-slate-900">{selectedJob.customer?.name}</div>
                            <div className="text-slate-500">{selectedJob.customer?.phone}</div>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Vehicle</span>
                            <div className="font-bold text-slate-900">{selectedJob.vehicle?.reg_number}</div>
                            <div className="text-slate-500">{selectedJob.vehicle?.make} {selectedJob.vehicle?.model}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 text-xs font-bold uppercase block mb-1">Complaint / Issue</span>
                            <div className="text-slate-900">{selectedJob.complaint}</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
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
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
                  <span className="text-lg font-extrabold text-slate-900 uppercase">Total Due:</span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{(
                      invoiceModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0) * 
                      (1 + invoiceModal.taxRate / 100)
                    ).toFixed(2)}
                  </span>
                </div>

                <Button variant="primary" className="w-full py-3" onClick={generateInvoice}>
                  GENERATE TAX INVOICE
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
