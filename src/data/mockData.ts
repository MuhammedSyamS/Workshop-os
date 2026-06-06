import type { JobCard, InventoryItem, Customer, ActivityLog } from './types';

/* ─── Job Cards ─────────────────────────────────────────────── */
export const mockJobCards: JobCard[] = [
  {
    _id: '1',
    vehicle: { make: 'Toyota', model: 'Camry', licensePlate: 'ABC-1234' },
    customer: { name: 'Alice Smith', phone: '555-1234' },
    mechanic: 'Mike Chen',
    status: 'Pending Inspection',
    issuesReported: 'Needs regular maintenance and full synthetic oil change.',
    laborCharges: 120,
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    _id: '2',
    vehicle: { make: 'Honda', model: 'Civic', licensePlate: 'XYZ-9876' },
    customer: { name: 'Bob Jones', phone: '555-5678' },
    mechanic: 'Sarah Kim',
    status: 'In Progress',
    issuesReported: 'Brakes squeaking loudly when coming to a halt.',
    laborCharges: 250,
    createdAt: '2024-01-10T10:30:00Z',
  },
  {
    _id: '3',
    vehicle: { make: 'Ford', model: 'F-150', licensePlate: 'TRK-555' },
    customer: { name: 'Charlie Brown', phone: '555-9999' },
    mechanic: 'Mike Chen',
    status: 'Ready for Pickup',
    issuesReported: 'Engine misfire fixed. Spark plugs replaced on all cylinders.',
    laborCharges: 380,
    createdAt: '2024-01-09T14:00:00Z',
  },
  {
    _id: '4',
    vehicle: { make: 'BMW', model: '3 Series', licensePlate: 'BWM-007' },
    customer: { name: 'Diana Prince', phone: '555-4321' },
    mechanic: 'Sarah Kim',
    status: 'Parts Awaiting',
    issuesReported: 'Transmission slipping between 2nd and 3rd gear.',
    laborCharges: 600,
    createdAt: '2024-01-10T08:00:00Z',
  },
  {
    _id: '5',
    vehicle: { make: 'Tesla', model: 'Model 3', licensePlate: 'EV-2024' },
    customer: { name: 'Evan Green', phone: '555-7890' },
    mechanic: 'Mike Chen',
    status: 'Quality Check',
    issuesReported: 'Software update needed. Charging port intermittently failing.',
    laborCharges: 200,
    createdAt: '2024-01-10T11:00:00Z',
  },
  {
    _id: '6',
    vehicle: { make: 'Audi', model: 'A4', licensePlate: 'AUD-777' },
    customer: { name: 'Fiona Blue', phone: '555-3333' },
    mechanic: 'Sarah Kim',
    status: 'Completed',
    issuesReported: 'AC compressor replaced. Coolant flushed and refilled.',
    laborCharges: 450,
    createdAt: '2024-01-08T13:00:00Z',
  },
];

/* ─── KPI Data ──────────────────────────────────────────────── */
export const kpiData = [
  {
    id: 'revenue',
    label: 'Monthly Revenue',
    value: '$48,320',
    change: '+12.5%',
    trend: 'up' as const,
    color: 'indigo',
    description: 'vs last month',
  },
  {
    id: 'jobs',
    label: 'Jobs This Month',
    value: '142',
    change: '+8.2%',
    trend: 'up' as const,
    color: 'blue',
    description: 'completed jobs',
  },
  {
    id: 'active',
    label: 'Active Jobs',
    value: '23',
    change: '-3.1%',
    trend: 'down' as const,
    color: 'amber',
    description: 'currently in workshop',
  },
  {
    id: 'satisfaction',
    label: 'Satisfaction Score',
    value: '4.9 / 5',
    change: '+0.3',
    trend: 'up' as const,
    color: 'emerald',
    description: 'from 118 reviews',
  },
];

/* ─── Chart Data ─────────────────────────────────────────────── */
export const revenueChartData = [
  { month: 'Jan', revenue: 32000, jobs: 98 },
  { month: 'Feb', revenue: 38500, jobs: 115 },
  { month: 'Mar', revenue: 35200, jobs: 107 },
  { month: 'Apr', revenue: 42100, jobs: 129 },
  { month: 'May', revenue: 45800, jobs: 138 },
  { month: 'Jun', revenue: 48320, jobs: 142 },
];

/* ─── Inventory ──────────────────────────────────────────────── */
export const mockInventory: InventoryItem[] = [
  { id: '1', itemName: 'Oil Filter', sku: 'OF-001', stockLevel: 48, unitPrice: 15, reorderLevel: 10, category: 'Filters' },
  { id: '2', itemName: 'Brake Pads (Front)', sku: 'BP-001', stockLevel: 22, unitPrice: 65, reorderLevel: 8, category: 'Brakes' },
  { id: '3', itemName: 'Spark Plug (Iridium)', sku: 'SP-003', stockLevel: 95, unitPrice: 12, reorderLevel: 20, category: 'Electrical' },
  { id: '4', itemName: 'Engine Coolant (5L)', sku: 'EC-001', stockLevel: 4, unitPrice: 28, reorderLevel: 5, category: 'Fluids' },
  { id: '5', itemName: 'Air Filter', sku: 'AF-002', stockLevel: 31, unitPrice: 22, reorderLevel: 10, category: 'Filters' },
  { id: '6', itemName: 'Wiper Blades', sku: 'WB-001', stockLevel: 60, unitPrice: 18, reorderLevel: 15, category: 'Accessories' },
];

/* ─── Customers ──────────────────────────────────────────────── */
export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Alice Smith', email: 'alice@email.com', phone: '555-1234', totalJobs: 8, totalSpent: '$3,240' },
  { id: 'c2', name: 'Bob Jones', email: 'bob@email.com', phone: '555-5678', totalJobs: 5, totalSpent: '$1,890' },
  { id: 'c3', name: 'Charlie Brown', email: 'charlie@email.com', phone: '555-9999', totalJobs: 12, totalSpent: '$6,120' },
  { id: 'c4', name: 'Diana Prince', email: 'diana@email.com', phone: '555-4321', totalJobs: 3, totalSpent: '$2,100' },
  { id: 'c5', name: 'Evan Green', email: 'evan@email.com', phone: '555-7890', totalJobs: 7, totalSpent: '$4,380' },
];

/* ─── Activity Log ──────────────────────────────────────────── */
export const mockActivityLog: ActivityLog[] = [
  { id: 'a1', action: 'Job card created', target: 'ABC-1234', user: 'John Doe', timestamp: '2024-01-10T09:05:00Z', type: 'create' },
  { id: 'a2', action: 'Status updated to "In Progress"', target: 'XYZ-9876', user: 'Sarah Kim', timestamp: '2024-01-10T10:45:00Z', type: 'update' },
  { id: 'a3', action: 'Invoice generated', target: 'AUD-777', user: 'John Doe', timestamp: '2024-01-10T11:30:00Z', type: 'invoice' },
  { id: 'a4', action: 'Parts ordered: Brake Pads (x2)', target: 'BWM-007', user: 'John Doe', timestamp: '2024-01-10T12:00:00Z', type: 'inventory' },
  { id: 'a5', action: 'Status updated to "Ready for Pickup"', target: 'TRK-555', user: 'Mike Chen', timestamp: '2024-01-10T13:15:00Z', type: 'update' },
  { id: 'a6', action: 'Customer notification sent', target: 'Charlie Brown', user: 'System', timestamp: '2024-01-10T13:16:00Z', type: 'notification' },
];

/* ─── Notifications ──────────────────────────────────────────── */
export const mockNotifications = [
  { id: 'n1', title: 'Vehicle Ready for Pickup', message: 'TRK-555 (Ford F-150) has been marked ready.', time: '5 min ago', read: false, type: 'success' },
  { id: 'n2', title: 'Low Stock Alert', message: 'Engine Coolant is below reorder level (4 remaining).', time: '1 hr ago', read: false, type: 'warning' },
  { id: 'n3', title: 'New Job Card Assigned', message: 'BWM-007 has been assigned to Sarah Kim.', time: '2 hrs ago', read: true, type: 'info' },
  { id: 'n4', title: 'Invoice Paid', message: 'Invoice for AUD-777 marked as Paid. Total: $730.', time: '3 hrs ago', read: true, type: 'success' },
];
