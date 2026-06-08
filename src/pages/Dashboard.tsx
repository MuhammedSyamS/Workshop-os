import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* KPI Row - Compact Grid for Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Jobs', val: '24' },
          { label: 'Revenue', val: '₹3,450' },
          { label: 'Mechanics', val: '8/10' },
          { label: 'Invoices', val: '12' }
        ].map((kpi, i) => (
          <Card key={i} className="border border-slate-100 shadow-sm bg-white">
            <CardContent className="p-4 flex flex-col justify-center">
              <p className="text-xs font-medium text-slate-500 mb-0.5">{kpi.label}</p>
              <p className="text-2xl font-bold text-slate-900">{kpi.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 min-h-[300px]">
          <CardHeader>
            <CardTitle>Active Job Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-8 text-center text-slate-500 text-sm font-medium">
              Data Table Integration Pending Phase 3
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center text-slate-500 text-sm font-medium">
              Activity Feed Pending
            </div>
          </CardContent>
        </Card>
      </div>
      
    </div>
  );
}
