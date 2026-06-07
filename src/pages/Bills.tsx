import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Bills() {
  const { token } = useAuthStore();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newBill, setNewBill] = useState({ title: '', category: '', amount: '', description: '' });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await axios.get(`http://${window.location.hostname}:5000/api/bills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBills(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async () => {
    try {
      await axios.post(`http://${window.location.hostname}:5000/api/bills`, newBill, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAdding(false);
      setNewBill({ title: '', category: '', amount: '', description: '' });
      fetchBills();
    } catch (e) {
      console.error(e);
      alert('Failed to add bill');
    }
  };

  const payBill = async (id: string) => {
    try {
      await axios.patch(`http://${window.location.hostname}:5000/api/bills/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBills();
    } catch (e) {
      console.error(e);
      alert('Failed to pay bill');
    }
  };

  const deleteBill = async (id: string) => {
    if(!confirm('Are you sure you want to delete this bill record?')) return;
    try {
      await axios.delete(`http://${window.location.hostname}:5000/api/bills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBills();
    } catch (e) {
      console.error(e);
      alert('Failed to delete bill');
    }
  };

  const totalUnpaid = bills.filter(b => b.status === 'UNPAID').reduce((sum, b) => sum + b.amount, 0);
  const totalPaid = bills.filter(b => b.status === 'PAID').reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Bills & Expenses</h1>
        <Button variant="primary" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'CANCEL' : 'RECORD NEW BILL'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 flex flex-col justify-center items-center">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-1">Total Unpaid Bills</p>
            <p className="text-3xl font-black text-red-700">₹{totalUnpaid.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 flex flex-col justify-center items-center">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Total Paid Expenses</p>
            <p className="text-3xl font-black text-green-700">₹{totalPaid.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {isAdding && (
        <Card className="mb-6 bg-white border-slate-200 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-blue-600 font-bold text-sm uppercase mb-4">Expense Details</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input placeholder="Bill Title (e.g., June Electricity)" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                     value={newBill.title} onChange={e => setNewBill({...newBill, title: e.target.value})} />
              
              <select className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                      value={newBill.category} onChange={e => setNewBill({...newBill, category: e.target.value})}>
                <option value="">Select Category...</option>
                <option value="RENT">Rent</option>
                <option value="UTILITIES">Utilities (Electricity, Water)</option>
                <option value="SUPPLIES">Workshop Supplies</option>
                <option value="SOFTWARE">Software & IT</option>
                <option value="MARKETING">Marketing & Advertising</option>
                <option value="OTHER">Other Expense</option>
              </select>

              <input placeholder="Amount (₹)" type="number" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newBill.amount} onChange={e => setNewBill({...newBill, amount: e.target.value})} />
              
              <input placeholder="Optional Description/Notes" className="bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                     value={newBill.description} onChange={e => setNewBill({...newBill, description: e.target.value})} />
            </div>
            <Button variant="primary" onClick={handleAddBill}>SAVE BILL RECORD</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>EXPENSE HISTORY</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : bills.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Expense Records Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Date</th>
                    <th className="p-3 font-bold">Title & Category</th>
                    <th className="p-3 font-bold text-right">Amount</th>
                    <th className="p-3 font-bold text-center">Status</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold text-slate-500">{new Date(bill.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{bill.title}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{bill.category}</div>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900">₹{bill.amount.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-widest ${
                          bill.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {bill.status === 'UNPAID' && (
                          <Button variant="outline" onClick={() => payBill(bill.id)} className="text-xs py-1 px-3 text-green-700 border-green-200 hover:bg-green-50">MARK PAID</Button>
                        )}
                        <Button variant="danger" onClick={() => deleteBill(bill.id)} className="text-xs py-1 px-3">DELETE</Button>
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
