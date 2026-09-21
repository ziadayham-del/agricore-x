const fs = require('fs');
const path = require('path');

const analyticsContent = `import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { AIChat } from '@/components/ai/AIChat';
import { Card } from '@/components/ui/Card';
import { BarChart, Activity, Zap, TrendingUp } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  return (
    <PageContainer title="ANALYTICS & AI">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-azure/10 text-azure rounded"><Zap size={20}/></div>
          <div><p className="text-xs text-ink-dim uppercase">Energy Efficiency</p><p className="text-2xl font-bold text-ink">94%</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald/10 text-emerald rounded"><TrendingUp size={20}/></div>
          <div><p className="text-xs text-ink-dim uppercase">Crop Performance Index</p><p className="text-2xl font-bold text-ink">A-</p></div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4 h-64 flex flex-col items-center justify-center border-l-4 border-l-azure">
          <BarChart size={32} className="text-ink-faint mb-2" />
          <span className="text-ink-dim text-sm">Historical Temperature & Moisture</span>
          <span className="text-ink-faint text-xs">Waiting for rollup data...</span>
        </Card>
        <Card className="p-4 h-64 flex flex-col items-center justify-center border-l-4 border-l-emerald">
          <Activity size={32} className="text-ink-faint mb-2" />
          <span className="text-ink-dim text-sm">Period Comparisons (Week/Month)</span>
          <span className="text-ink-faint text-xs">Waiting for rollup data...</span>
        </Card>
      </div>
      
      <AIChat farmId={farmId} />
    </PageContainer>
  );
}
`;

const eventsContent = `import { PageContainer } from '@/components/layout/PageContainer';
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
                <td className="p-3"><span className={\`px-2 py-0.5 rounded text-xs \${ev.severity === 'high' ? 'bg-coral/20 text-coral' : 'bg-panel-recessed'}\`}>{ev.severity}</span></td>
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
`;

const cropCalendarContent = `import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';

export default function CropCalendarPage() {
  return (
    <PageContainer title="CROP CALENDAR">
      <Card className="p-6 text-center text-ink-dim">
        <p>Interactive Crop Calendar View</p>
        <p className="text-xs text-ink-faint mt-2">Coming soon in final pass.</p>
      </Card>
    </PageContainer>
  );
}
`;

const settingsContent = `import { PageContainer } from '@/components/layout/PageContainer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <PageContainer title="SYSTEM SETTINGS">
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-ink mb-4 font-medium uppercase text-sm tracking-wide border-b border-border pb-2">Farm Configuration</h3>
          <div className="space-y-4">
            <div><label className="text-xs text-ink-dim">Farm Name</label><input type="text" defaultValue="Sector 7" className="w-full bg-panel border border-border rounded px-3 py-1 text-ink mt-1" /></div>
            <Button size="sm">Save Changes</Button>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-ink mb-4 font-medium uppercase text-sm tracking-wide border-b border-border pb-2">Sensor Thresholds</h3>
          <p className="text-sm text-ink-faint">Manage alerts and limits for temperature, moisture, and grid voltage.</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-ink mb-4 font-medium uppercase text-sm tracking-wide border-b border-border pb-2">Users & Roles</h3>
          <p className="text-sm text-ink-faint">Manage team access and permissions.</p>
        </Card>
        <Card className="p-5">
          <h3 className="text-ink mb-4 font-medium uppercase text-sm tracking-wide border-b border-border pb-2">API Settings</h3>
          <p className="text-sm text-ink-faint">Webhook URLs and integration keys.</p>
        </Card>
      </div>
    </PageContainer>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/app/dashboard/analytics/page.tsx'), analyticsContent);
fs.mkdirSync(path.join(process.cwd(), 'src/app/dashboard/events'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'src/app/dashboard/events/page.tsx'), eventsContent);
fs.mkdirSync(path.join(process.cwd(), 'src/app/dashboard/crop-calendar'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'src/app/dashboard/crop-calendar/page.tsx'), cropCalendarContent);
fs.mkdirSync(path.join(process.cwd(), 'src/app/dashboard/settings'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'src/app/dashboard/settings/page.tsx'), settingsContent);

console.log('Created pages');
