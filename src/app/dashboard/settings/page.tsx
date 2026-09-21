import { PageContainer } from '@/components/layout/PageContainer';
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
