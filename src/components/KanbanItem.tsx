import { useState } from 'react';

const statuses = [
  'Pending Inspection', 'Parts Awaiting', 'In Progress', 
  'Quality Check', 'Ready for Pickup', 'Completed'
];

interface JobCard {
  _id: string;
  vehicle: { make: string; model: string; licensePlate: string };
  customer: { name: string; phone: string };
  status: string;
  issuesReported: string;
}

export default function KanbanItem({ jobCard }: { jobCard: JobCard }) {
  const [currentStatus, setCurrentStatus] = useState(jobCard.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/jobcards/${jobCard._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update');
      
      setCurrentStatus(newStatus);
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('Error updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="kanban-item card-shadow p-4 bg-white rounded-lg shadow mb-4">
      <div className="kanban-header flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-lg font-bold">{jobCard.vehicle.licensePlate}</h3>
        <span className={`status-badge status-${currentStatus.replace(/\\s+/g, '-').toLowerCase()} px-2 py-1 rounded text-sm font-semibold bg-blue-100 text-blue-800`}>
          {currentStatus}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-1">
        <strong>Vehicle:</strong> {jobCard.vehicle.make} {jobCard.vehicle.model}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <strong>Customer:</strong> {jobCard.customer.name} ({jobCard.customer.phone})
      </p>
      <p className="issues-text text-sm text-gray-800 mb-4 mt-2 bg-gray-50 p-2 rounded">
        <strong>Issues:</strong> {jobCard.issuesReported}
      </p>
      
      <div className="status-update-container flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Update Status:</label>
        <select 
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isUpdating}
          className="ml-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
