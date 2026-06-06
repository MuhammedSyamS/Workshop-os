import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Invoices() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment Modal State
  const [payModal, setPayModal] = useState<{ isOpen: boolean; invoice: any } | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('CASH');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices', { headers: { Authorization: `Bearer ${token}` }});
      setInvoices(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openPayModal = (inv: any) => {
    const due = (inv.total_amount || inv.total || 0) - (inv.paid_amount || 0);
    setPaymentAmount(due > 0 ? due.toString() : '');
    setPaymentMode('CASH');
    setPayModal({ isOpen: true, invoice: inv });
  };

  const recordPayment = async () => {
    try {
      if (!payModal) return;
      await axios.post(`http://localhost:5000/api/payments`, {
        invoice_id: payModal.invoice.id,
        amount: Number(paymentAmount),
        mode: paymentMode
      }, { headers: { Authorization: `Bearer ${token}` }});
      
      setPayModal(null);
      fetchInvoices();
    } catch (e) {
      console.error(e);
      alert('Failed to record payment');
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Billing & Invoices</h1>
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
                    <th className="p-3 font-bold text-center">Status</th>
                    <th className="p-3 font-bold text-right">Paid / Total</th>
                    <th className="p-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{inv.invoice_number || inv.id?.slice(-6).toUpperCase()}</td>
                      <td className="p-3 text-slate-500">#{inv.job_order?.id?.slice(-6).toUpperCase() || inv.job_order_id?.slice(-6).toUpperCase() || 'N/A'}</td>
                      <td className="p-3 font-medium">{inv.job_order?.customer?.name || 'Unknown'}</td>
                      <td className="p-3 text-center">
                        <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>{inv.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-blue-600">${(inv.total_amount || inv.total || 0).toFixed(2)}</span>
                          {(inv.paid_amount || 0) > 0 && (
                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
                              Paid: ${(inv.paid_amount).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        {inv.status !== 'PAID' && (
                          <Button variant="primary" className="text-xs px-3 py-1" onClick={() => openPayModal(inv)}>PAY BILL</Button>
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

      {/* Payment Modal */}
      {payModal && payModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-2">Record Payment</h2>
              <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">
                Inv #{payModal.invoice.id?.slice(-6).toUpperCase()}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Amount ($)</label>
                  <input type="number" step="0.01" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm font-bold" 
                         value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Payment Mode</label>
                  <select className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm font-bold"
                          value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
                    <option value="CASH">CASH</option>
                    <option value="CARD">CARD</option>
                    <option value="UPI">UPI / ONLINE</option>
                    <option value="BANK_TRANSFER">BANK TRANSFER</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <Button variant="outline" onClick={() => setPayModal(null)}>CANCEL</Button>
                <Button variant="primary" onClick={recordPayment}>CONFIRM</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
