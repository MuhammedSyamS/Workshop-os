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

  const markAsPaid = async (id: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/invoices/${id}/status`, { status: 'PAID' }, { headers: { Authorization: `Bearer ${token}` }});
      fetchInvoices();
    } catch (e) {
      console.error(e);
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
                    <th className="p-3 font-bold text-right">Total Amount</th>
                    <th className="p-3 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{inv.invoice_number}</td>
                      <td className="p-3 text-slate-500">#{inv.job_order_id?.slice(-6).toUpperCase() || 'N/A'}</td>
                      <td className="p-3 font-medium">{inv.customer_id?.name || 'Unknown'}</td>
                      <td className="p-3 text-center">
                        <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'}>{inv.status}</Badge>
                      </td>
                      <td className="p-3 text-right font-bold text-blue-600">${inv.total_amount?.toFixed(2) || '0.00'}</td>
                      <td className="p-3 text-center">
                        {inv.status !== 'PAID' && (
                          <Button variant="primary" className="text-xs px-3 py-1" onClick={() => markAsPaid(inv.id)}>MARK PAID</Button>
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
    </div>
  );
}
