export interface JobCard {
  _id: string;
  vehicle: { make: string; model: string; licensePlate: string };
  customer: { name: string; phone: string };
  mechanic: string;
  status: string;
  issuesReported: string;
  laborCharges: number;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  itemName: string;
  sku: string;
  stockLevel: number;
  unitPrice: number;
  reorderLevel: number;
  category: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalJobs: number;
  totalSpent: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  user: string;
  timestamp: string;
  type: 'create' | 'update' | 'invoice' | 'inventory' | 'notification';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'success' | 'warning' | 'info' | 'error';
}
