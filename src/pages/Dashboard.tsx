
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Active Jobs', val: '24' },
          { label: 'Today Revenue', val: '₹3,450' },
          { label: 'Mechanics on Duty', val: '8/10' },
          { label: 'Pending Invoices', val: '12' }
        ].map((kpi, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{kpi.label}</p>
              <p className="text-3xl font-heading font-extrabold text-slate-900">{kpi.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[400px]">
          <CardHeader>
            <CardTitle>ACTIVE JOB ORDERS</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">
              [ Data Table Integration Pending Phase 3 ]
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle>RECENT ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">
              [ Activity Feed Pending ]
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
