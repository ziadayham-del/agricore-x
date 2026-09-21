const fs = require('fs');
const path = require('path');

const files = {
  'src/components/power/PowerCards.tsx': `'use client';
import { Card } from '@/components/ui/Card';
import { Battery, Sun, Plug } from 'lucide-react';

export function BatteryCard({ soc, voltage, draw }: any) {
  const isLow = soc < 30;
  return (
    <Card className={\`p-4 border-l-4 \${isLow ? 'border-l-amber' : 'border-l-emerald'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Battery size={14}/> Battery Bank</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={\`text-3xl \${isLow ? 'text-amber' : 'text-emerald'}\`}>{soc}</span>
        <span className="text-ink-faint text-sm">%</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>{voltage}V</span>
        <span>{draw}A draw</span>
      </div>
    </Card>
  );
}

export function SolarPanelCard({ power, dailyYield }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-emerald">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Sun size={14}/> Solar Array</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl text-emerald">{power}</span>
        <span className="text-ink-faint text-sm">W</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Daily Yield</span>
        <span>{dailyYield} kWh</span>
      </div>
    </Card>
  );
}

export function GridStatusCard({ status, voltage }: any) {
  const isActive = status === 'connected';
  return (
    <Card className={\`p-4 border-l-4 \${isActive ? 'border-l-azure' : 'border-l-coral'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Plug size={14}/> Grid Tie</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={\`text-xl \${isActive ? 'text-azure' : 'text-coral'}\`}>{isActive ? 'CONNECTED' : 'OFFLINE'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Voltage</span>
        <span>{voltage}V AC</span>
      </div>
    </Card>
  );
}`,

  'src/app/dashboard/power/page.tsx': `import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { BatteryCard, SolarPanelCard, GridStatusCard } from '@/components/power/PowerCards';
import { ActuatorCard } from '@/components/ui/ActuatorCard';

export default async function PowerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const mockRelay = { id: 'act-p1', name: 'Grid Tie Contactor', state: 'on', mode: 'auto', current_draw: '0.1A' };
  const mockInverter = { id: 'act-p2', name: 'Main Inverter', state: 'on', mode: 'manual', current_draw: '45A' };

  async function handleCommand(actuatorId: string, command: string) {
    'use server';
    const client = await createClient();
    await client.from('events').insert({
      farm_id: farmId,
      event_type: 'COMMAND',
      message: \`Actuator \${actuatorId} commanded to \${command}\`,
    });
  }

  return (
    <PageContainer title="POWER & ENERGY">
      <div className="flex flex-col gap-6">
        <h2 className="text-ink font-semibold">Power Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BatteryCard soc={82} voltage={48.2} draw={12.5} />
          <SolarPanelCard power={2450} dailyYield={14.2} />
          <GridStatusCard status="disconnected" voltage={0} />
        </div>

        <h2 className="text-ink font-semibold mt-4">Power Actuators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActuatorCard actuator={mockInverter} onCommand={handleCommand} />
          <ActuatorCard actuator={mockRelay} onCommand={handleCommand} />
        </div>
      </div>
    </PageContainer>
  );
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Created ' + filePath);
}
