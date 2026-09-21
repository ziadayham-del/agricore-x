import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const { data: events } = await supabase.from('events').select('*').eq('farm_id', farmId).order('created_at', { ascending: false }).limit(50);

  return (
    <PageContainer title="EVENT LOG">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <select className="bg-panel border border-border text-ink text-sm rounded px-3 py-1"><option>All Nodes</option></select>
          <select className="bg-panel border border-border text-ink text-sm rounded px-3 py-1"><option>All Severities</option></select>
          <select className="bg-panel border border-border text-ink text-sm rounded px-3 py-1"><option>All Event Types</option></select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-2"/> CSV</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-2"/> JSON</Button>
        </div>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm text-ink">
          <thead className="bg-panel-recessed text-xs uppercase text-ink-dim border-b border-border">
            <tr><th className="p-3">Timestamp</th><th className="p-3">Severity</th><th className="p-3">Type</th><th className="p-3">Message</th></tr>
          </thead>
          <tbody>
            {events?.map(ev => (
              <tr key={ev.id} className="border-b border-border/50 hover:bg-panel-recessed">
                <td className="p-3 text-ink-faint font-mono text-xs">{new Date(ev.created_at).toLocaleString()}</td>
                <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs ${ev.severity === 'high' ? 'bg-coral/20 text-coral' : 'bg-panel-recessed'}`}>{ev.severity}</span></td>
                <td className="p-3">{ev.event_type}</td>
                <td className="p-3">{ev.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageContainer>
  );
}
