import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/AppContext';

export function CustomerBills() {
  const { token } = useAuthStore();
  const toast = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billModal, setBillModal] = useState<any>(null);

  useEffect(() => {
    fetchBills();
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

  const fetchBills = async () => {
    try {
      const res = await axios.get(`/api/invoices?type=BILL`, { headers: { Authorization: `Bearer ${token}` }});
      setBills(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openNewBillModal = () => {
    setBillModal({
      isOpen: true,
      jobId: '',
      lineItems: [{ description: 'Service Charge', quantity: 1, price: 0 }]
    });
  };

  const generateBill = async () => {
    if (!billModal.jobId) {
      toast.warning('Please select a Job Order');
      return;
    }
    const validItems = billModal.lineItems.filter((item: any) => item.description.trim() !== '');
    if (validItems.length === 0) {
      toast.warning('Please add at least one valid line item with a description.');
      return;
    }

    try {
      await axios.post(`/api/invoices`, {
        job_order_id: billModal.jobId,
        type: 'BILL',
        line_items: validItems,
        tax_rate: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Bill Generated Successfully!');
      setBillModal(null);
      fetchBills();
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate bill');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-bold text-slate-900">Customer Bills</h1>
        <Button variant="primary" onClick={openNewBillModal}>CREATE NEW BILL</Button>
      </div>
      
      <Card>
        <CardHeader><CardTitle>BILL REGISTRY</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : bills.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm font-bold">No Bills Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs">
                    <th className="p-3 font-bold">Bill #</th>
                    <th className="p-3 font-bold">Job Card</th>
                    <th className="p-3 font-bold">Customer</th>
                    <th className="p-3 font-bold text-right">Total Amount</th>
                    <th className="p-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => {
                    const billUrl = `${window.location.origin}/print/invoice/${bill.id}`;
                    const waText = encodeURIComponent(`Hello ${bill.job_order?.customer?.name || ''},\n\nHere is your bill for Job #${String(bill.job_order?.id || bill.job_order?._id || '').slice(-6).toUpperCase()}.\n*Total Amount:* ₹${(bill.total_amount || bill.total || 0).toFixed(2)}\n\n*View & Download your Bill here:*\n${billUrl}\n\nThank you for choosing us!`);
                    let cleanPhone = (bill.job_order?.customer?.phone || '').replace(/\D/g, '');
                    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;
                    const waLink = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waText}`;

                    return (
                      <tr key={bill.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                        <td className="p-3 font-bold">{bill.invoice_number || String(bill.id || bill._id || '').slice(-6).toUpperCase()}</td>
                        <td className="p-3 text-slate-500">#{String(bill.job_order?.id || bill.job_order?._id || bill.job_order_id || 'N/A').slice(-6).toUpperCase()}</td>
                        <td className="p-3 font-medium">{bill.job_order?.customer?.name || 'Unknown'}</td>
                        <td className="p-3 text-right">
                          <span className="font-bold text-blue-600">₹{(bill.total_amount || bill.total || 0).toFixed(2)}</span>
                        </td>
                        <td className="p-3 text-center space-x-2">
                          <Button variant="outline" className="text-xs py-1 px-2" onClick={() => window.open(`/print/invoice/${bill.id}`, '_blank')}>
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

      {/* Bill Generator Modal */}
      {billModal && billModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60]">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[90vh] flex flex-col">
            <CardContent className="p-6 flex-1 overflow-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-slate-900 mb-1">Generate Customer Bill</h2>
                  <p className="text-sm font-bold text-blue-600">Create a non-tax estimate/bill</p>
                </div>
                <Button variant="outline" onClick={() => setBillModal(null)}>CLOSE</Button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-slate-500 block mb-2">Select Job Order</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 p-2 text-sm text-slate-900"
                  value={billModal.jobId}
                  onChange={e => setBillModal({ ...billModal, jobId: e.target.value })}
                >
                  <option value="">-- Select a Job --</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>
                      Job #{String(job.id || job._id || '').slice(-6).toUpperCase()} - {job.customer?.name} ({job.vehicle?.reg_number})
                    </option>
                  ))}
                </select>

                {billModal.jobId && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-sm">
                    {(() => {
                      const selectedJob = jobs.find(j => j.id === billModal.jobId);
                      if (!selectedJob) return null;
                      return (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-500 text-sm font-medium block mb-1">Customer</span>
                            <div className="font-bold text-slate-900">{selectedJob.customer?.name}</div>
                            <div className="text-slate-500">{selectedJob.customer?.phone}</div>
                          </div>
                          <div>
                            <span className="text-slate-500 text-sm font-medium block mb-1">Vehicle</span>
                            <div className="font-bold text-slate-900">{selectedJob.vehicle?.reg_number}</div>
                            <div className="text-slate-500">{selectedJob.vehicle?.make} {selectedJob.vehicle?.model}</div>
                          </div>
                          <div className="col-span-2">
                            <span className="text-slate-500 text-sm font-medium block mb-1">Complaint / Issue</span>
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
                  <label className="text-sm font-medium text-slate-500">Line Items (Parts, Labor)</label>
                  <Button variant="outline" className="text-xs py-1" onClick={() => {
                    setBillModal({
                      ...billModal,
                      lineItems: [...billModal.lineItems, { description: '', quantity: 1, price: 0 }]
                    });
                  }}>+ ADD ITEM</Button>
                </div>

                <div className="space-y-3">
                  {billModal.lineItems.map((item: any, idx: number) => (
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
                        const newItems = billModal.lineItems.filter((_: any, i: number) => i !== idx);
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
                    ₹{billModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
                  <span className="text-lg font-bold text-slate-900">Total Due:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{(
                      billModal.lineItems.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0)
                    ).toFixed(2)}
                  </span>
                </div>

                <Button variant="primary" className="w-full py-3" onClick={generateBill}>
                  GENERATE BILL
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
