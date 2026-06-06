import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Inventory() {
  const { token } = useAuthStore();
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  
  const [newPart, setNewPart] = useState({ name: '', sku: '', stock_qty: '', unit_cost: '', reorder_level: '' });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/parts', { headers: { Authorization: `Bearer ${token}` }});
      setParts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPart = async () => {
    try {
      await axios.post('http://localhost:5000/api/parts', newPart, { headers: { Authorization: `Bearer ${token}` }});
      setAddModal(false);
      setNewPart({ name: '', sku: '', stock_qty: '', unit_cost: '', reorder_level: '' });
      fetchParts();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Failed to add part');
    }
  };

  const updateStock = async (id: string, change: number) => {
    try {
      await axios.patch(`http://localhost:5000/api/parts/${id}/stock`, { change }, { headers: { Authorization: `Bearer ${token}` }});
      fetchParts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Parts Inventory</h1>
        <Button variant="primary" onClick={() => setAddModal(true)}>ADD PART</Button>
      </div>
      
      <Card>
        <CardHeader><CardTitle>STOCK CATALOGUE</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">Loading...</div>
          ) : parts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">No Parts Found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-blue-600 text-xs uppercase tracking-widest">
                    <th className="p-3 font-bold">Item Name</th>
                    <th className="p-3 font-bold">SKU</th>
                    <th className="p-3 font-bold text-center">In Stock</th>
                    <th className="p-3 font-bold text-right">Unit Cost</th>
                    <th className="p-3 font-bold text-center">Stock Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map(p => (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-blue-50 transition-colors text-sm text-slate-900">
                      <td className="p-3 font-bold">{p.name}</td>
                      <td className="p-3 text-slate-500">{p.sku}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded font-bold text-xs ${p.stock_qty <= p.reorder_level ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                          {p.stock_qty}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">₹{p.unit_cost.toFixed(2)}</td>
                      <td className="p-3 text-center space-x-2">
                        <Button variant="outline" className="px-2 py-0.5 text-xs" onClick={() => updateStock(p.id, -1)}>-</Button>
                        <Button variant="outline" className="px-2 py-0.5 text-xs" onClick={() => updateStock(p.id, 1)}>+</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Part Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-extrabold text-slate-900 mb-6">Add Inventory Item</h2>
              <div className="space-y-4">
                <input placeholder="Part Name" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm" 
                       value={newPart.name} onChange={e => setNewPart({...newPart, name: e.target.value})} />
                <input placeholder="SKU Number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newPart.sku} onChange={e => setNewPart({...newPart, sku: e.target.value})} />
                <div className="flex gap-4">
                  <input placeholder="Initial Stock Qty" type="number" className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                         value={newPart.stock_qty} onChange={e => setNewPart({...newPart, stock_qty: e.target.value})} />
                  <input placeholder="Unit Cost (₹)" type="number" step="0.01" className="flex-1 bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                         value={newPart.unit_cost} onChange={e => setNewPart({...newPart, unit_cost: e.target.value})} />
                </div>
                <input placeholder="Low Stock Reorder Level" type="number" className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-2 text-sm"
                       value={newPart.reorder_level} onChange={e => setNewPart({...newPart, reorder_level: e.target.value})} />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <Button variant="outline" onClick={() => setAddModal(false)}>CANCEL</Button>
                <Button variant="primary" onClick={handleAddPart}>ADD ITEM</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
