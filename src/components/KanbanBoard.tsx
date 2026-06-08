import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { CarFront, Clock, FileText, ChevronDown } from 'lucide-react';
import type { JobCard } from '../data/types';
import { mockJobCards } from '../data/mockData';
import { Card, CardContent } from './ui/Card';
import { Badge } from './ui/Badge';
import { Skeleton } from './ui/Misc';

const STATUSES = [
  'Pending Inspection', 'Parts Awaiting', 'In Progress',
  'Quality Check', 'Ready for Pickup', 'Completed'
];

const statusToGradient: Record<string, string> = {
  'Pending Inspection': 'from-amber-400 to-orange-500 shadow-orange-500/20',
  'Parts Awaiting': 'from-orange-400 to-red-500 shadow-red-500/20',
  'In Progress': 'from-blue-400 to-indigo-500 shadow-indigo-500/20',
  'Quality Check': 'from-purple-400 to-pink-500 shadow-purple-500/20',
  'Ready for Pickup': 'from-emerald-400 to-teal-500 shadow-teal-500/20',
  'Completed': 'from-slate-400 to-slate-500 shadow-slate-500/20',
};

const statusToBadgeVariant: Record<string, any> = {
  'Pending Inspection': 'amber',
  'Parts Awaiting': 'orange',
  'In Progress': 'indigo',
  'Quality Check': 'purple',
  'Ready for Pickup': 'emerald',
  'Completed': 'slate',
};

const socket = io("/");

export default function KanbanBoard() {
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobCards = async () => {
      try {
        const response = await fetch(`/api/jobcards`);
        if (response.ok) {
          const data = await response.json();
          setJobCards(data.length > 0 ? data : mockJobCards);
        } else {
          setJobCards(mockJobCards);
        }
      } catch {
        setJobCards(mockJobCards);
      } finally {
        setLoading(false);
      }
    };
    fetchJobCards();

    socket.on('jobCardUpdated', (updatedJob: JobCard) => {
      setJobCards(prev => prev.map(j => j._id === updatedJob._id ? updatedJob : j));
    });
    return () => { socket.off('jobCardUpdated'); };
  }, []);

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    setJobCards(prev => prev.map(j => j._id === jobId ? { ...j, status: newStatus } : j));
    try {
      await fetch(`/api/jobcards/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      console.error('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex gap-6 overflow-x-auto pb-8 px-2">
        {STATUSES.slice(0, 4).map(s => (
          <div key={s} className="min-w-[340px] w-[340px] flex flex-col gap-5">
            <Skeleton className="h-14 w-full rounded-2xl bg-white/50 dark:bg-slate-800/50" />
            <Skeleton className="h-44 w-full rounded-2xl bg-white/50 dark:bg-slate-800/50" />
            <Skeleton className="h-44 w-full rounded-2xl bg-white/50 dark:bg-slate-800/50" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-12 snap-x px-2 hide-scrollbar">
      {STATUSES.map(status => {
        const cards = jobCards.filter(j => j.status === status);
        const gradient = statusToGradient[status];
        
        return (
          <div key={status} className="snap-start min-w-[350px] w-[350px] flex flex-col shrink-0">
            {/* Column Header (Glass Pill with Gradient Dot) */}
            <div className="flex items-center justify-between mb-5 px-5 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-sm">
              <div className="flex items-center gap-3">
                <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${gradient} shadow-lg`} />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm tracking-tight">{status}</h3>
              </div>
              <span className={`bg-gradient-to-br ${gradient} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-inner`}>
                {cards.length}
              </span>
            </div>

            {/* Column Content */}
            <div className="flex-1 space-y-5 min-h-[200px]">
              {cards.map(job => (
                <Card 
                  key={job._id} 
                  className="group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/15 dark:hover:shadow-purple-500/10 transition-all duration-300 border-white/60 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md"
                >
                  <CardContent className="p-6">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white text-lg leading-none tracking-tight mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">{job.vehicle.licensePlate}</p>
                        <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400">{job.vehicle.make} {job.vehicle.model}</p>
                      </div>
                      <Badge variant={statusToBadgeVariant[job.status]}>{job.status}</Badge>
                    </div>

                    {/* Issue Description */}
                    <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6 line-clamp-2 font-medium">
                      {job.issuesReported}
                    </p>

                    {/* Meta Info (Customer & Mechanic) */}
                    <div className="flex items-center gap-4 text-[13px] text-slate-600 dark:text-slate-300 font-semibold mb-6 bg-slate-50/80 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText size={16} className="text-pink-500 shrink-0" />
                        <span className="truncate" title={job.customer.name}>{job.customer.name}</span>
                      </div>
                      <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <CarFront size={16} className="text-purple-500 shrink-0" />
                        <span className="truncate">{job.mechanic}</span>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-400">
                        <Clock size={14} className="text-blue-400" />
                        <span>Today</span>
                      </div>
                      <div className="relative group/select">
                        <select
                          value={job.status}
                          onChange={e => handleStatusChange(job._id, e.target.value)}
                          className="appearance-none bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 text-[12px] font-bold rounded-xl py-2 pl-3 pr-8 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/30 cursor-pointer"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-hover/select:text-purple-500 transition-colors pointer-events-none" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {cards.length === 0 && (
                <div className="h-32 rounded-2xl border-2 border-dashed border-slate-300/50 dark:border-slate-700/50 flex items-center justify-center text-sm text-slate-400 font-bold bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm">
                  Drop cards here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
