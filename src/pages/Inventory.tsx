import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-heading font-extrabold tracking-widest text-slate-900 uppercase">Parts Inventory</h1>
        <Button variant="primary">ADD PART</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>STOCK CATALOGUE</CardTitle></CardHeader>
        <CardContent>
          <div className="py-12 text-center text-slate-500 text-sm uppercase tracking-widest font-bold">
            [ Inventory Table Pending ]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
