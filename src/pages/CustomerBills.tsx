import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function CustomerBills() {
  const { token } = useAuthStore();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invoices?type=BILL', { headers: { Authorization: `Bearer ${token}` }});
      setBills(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Customer Bills</h1>
      </div>
      
      <Card>
        <CardHeader><CardTitle>BILL REGISTRY</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : bills.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Bills Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Bill #</th>
                    <th className="p-3 font-bold">Job Card</th>
                    <th className="p-3 font-bold">Customer</th>
                    <th className="p-3 font-bold text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{bill.invoice_number || bill.id?.slice(-6).toUpperCase()}</td>
                      <td className="p-3 text-slate-500">#{bill.job_order?.id?.slice(-6).toUpperCase() || bill.job_order_id?.slice(-6).toUpperCase() || 'N/A'}</td>
                      <td className="p-3 font-medium">{bill.job_order?.customer?.name || 'Unknown'}</td>
                      <td className="p-3 text-right">
                        <span className="font-bold text-blue-600">₹{(bill.total_amount || bill.total || 0).toFixed(2)}</span>
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
