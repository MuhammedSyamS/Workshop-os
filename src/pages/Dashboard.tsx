import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      
      {/* KPI Row - Compact Grid for Mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'ACTIVE JOBS', val: '24', color: 'from-blue-500 to-blue-600', text: 'text-blue-100' },
          { label: 'REVENUE', val: '₹3,450', color: 'from-emerald-500 to-emerald-600', text: 'text-emerald-100' },
          { label: 'MECHANICS', val: '8/10', color: 'from-violet-500 to-violet-600', text: 'text-violet-100' },
          { label: 'INVOICES', val: '12', color: 'from-amber-500 to-amber-600', text: 'text-amber-100' }
        ].map((kpi, i) => (
          <Card key={i} className={`border-0 shadow-lg bg-gradient-to-br ${kpi.color} text-white transform transition-transform active:scale-95`}>
            <CardContent className="p-5 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <p className={`text-[10px] font-bold tracking-widest ${kpi.text} mb-1 uppercase`}>{kpi.label}</p>
              <p className="text-3xl font-heading font-extrabold tracking-tight text-white drop-shadow-sm">{kpi.val}</p>
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
