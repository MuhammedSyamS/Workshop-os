
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import { Customers, Vehicles } from './pages/Entities';
import Employees from './pages/Employees';
import { Inventory } from './pages/Inventory';
import { Schedule } from './pages/Schedule';
import { Invoices } from './pages/Invoices';
import { CustomerBills } from './pages/CustomerBills';
import Bills from './pages/Bills';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';
import PrintInvoice from './pages/PrintInvoice';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Print Route without Sidebar Layout */}
        <Route path="/print/invoice/:id" element={<PrintInvoice />} />

        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/customer-bills" element={<CustomerBills />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<div className="text-slate-500 uppercase font-bold text-center mt-20">Settings Module</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
