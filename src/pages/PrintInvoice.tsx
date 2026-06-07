import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export default function PrintInvoice() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await axios.get(`http://${window.location.hostname}:5000/api/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
          setTimeout(() => {
            window.print();
          }, 500);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (id) fetchDoc();
  }, [id, token]);

  if (!data) return <div className="p-8 font-bold font-heading text-xl">Loading Document...</div>;

  const isInvoice = data.type === 'INVOICE';

  return (
    <div className="bg-white text-black p-4 sm:p-8 max-w-4xl mx-auto font-sans min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-black pb-6 mb-6 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter mb-2">WORKSHOP OS</h1>
          <p className="text-sm font-medium">123 Auto Street, Motor City</p>
          <p className="text-sm font-medium">Phone: +91 9876543210 | GSTIN: 22AAAAA0000A1Z5</p>
        </div>
        <div className="text-left sm:text-right">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-800">
            {isInvoice ? 'TAX INVOICE' : 'ESTIMATE / BILL'}
          </h2>
          <p className="font-bold text-lg mt-2">#{data.invoice_number || data.id.slice(-6).toUpperCase()}</p>
          <p className="text-sm">Date: {new Date(data.created_at || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Customer & Vehicle Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mb-8">
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest border-b border-black pb-1 mb-3">Billed To</h3>
          <p className="font-bold text-lg">{data.job_order?.customer?.name || 'Walk-in Customer'}</p>
          <p>{data.job_order?.customer?.phone}</p>
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest border-b border-black pb-1 mb-3">Vehicle Details</h3>
          <p className="font-bold text-lg">{data.job_order?.vehicle?.reg_number}</p>
          <p>{data.job_order?.vehicle?.make} {data.job_order?.vehicle?.model}</p>
          <p className="text-sm mt-1">Job Card #{data.job_order?.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      {/* Line Items */}
      <table className="w-full text-left mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 font-bold uppercase text-sm">Description</th>
            <th className="py-2 font-bold uppercase text-sm text-center">Qty</th>
            <th className="py-2 font-bold uppercase text-sm text-right">Rate</th>
            <th className="py-2 font-bold uppercase text-sm text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.line_items?.map((item: any, idx: number) => (
            <tr key={idx} className="border-b border-slate-200">
              <td className="py-3">{item.description}</td>
              <td className="py-3 text-center">{item.quantity}</td>
              <td className="py-3 text-right">₹{item.price.toFixed(2)}</td>
              <td className="py-3 text-right font-bold">₹{(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold uppercase">Subtotal</span>
            <span>₹{(data.subtotal || 0).toFixed(2)}</span>
          </div>
          {isInvoice && (
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold uppercase">Tax</span>
              <span>₹{(data.tax || 0).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t-2 border-black pt-3">
            <span className="font-black uppercase text-xl">Total</span>
            <span className="font-black text-xl">₹{(data.total_amount || data.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-sm text-slate-500 border-t border-slate-200 pt-8">
        <p className="font-bold mb-1">Thank you for your business!</p>
        <p>This is a computer generated document. {isInvoice ? 'For any discrepancies, contact us within 2 days.' : 'This is not a tax invoice.'}</p>
      </div>
      
      {/* Print Button (hidden during actual print) */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="fixed bottom-8 right-8 no-print">
        <button 
          onClick={() => window.print()} 
          className="bg-black text-white px-6 py-3 font-bold uppercase tracking-widest shadow-xl rounded-full"
        >
          Print Document
        </button>
      </div>
    </div>
  );
}
