const fs = require('fs');
const path = require('path');

const files = {
  'src/components/agriculture/AgricultureCards.tsx': `'use client';
import { Card } from '@/components/ui/Card';
import { Droplet, Thermometer, Wind, Sun } from 'lucide-react';

export function SoilMoistureCard({ value, unit, bedName }: any) {
  const isLow = value < 60;
  return (
    <Card className={\`p-4 border-l-4 \${isLow ? 'border-l-amber' : 'border-l-emerald'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Droplet size={14}/> {bedName}</span>
      <div className="flex items-baseline gap-1">
        <span className={\`text-3xl \${isLow ? 'text-amber' : 'text-emerald'}\`}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}

export function TemperatureCard({ value, unit }: any) {
  const isHigh = value > 30;
  return (
    <Card className={\`p-4 border-l-4 \${isHigh ? 'border-l-coral' : 'border-l-emerald'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> Ambient Temp</span>
      <div className="flex items-baseline gap-1">
        <span className={\`text-3xl \${isHigh ? 'text-coral' : 'text-emerald'}\`}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}

export function HumidityCard({ value, unit }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-azure">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Wind size={14}/> Humidity</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-azure">{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}

export function LightIntensityCard({ value, unit }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-amber">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Sun size={14}/> Light DLI</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-amber">{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}`,

  'src/app/dashboard/agriculture/page.tsx': `import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { SoilMoistureCard, TemperatureCard, HumidityCard, LightIntensityCard } from '@/components/agriculture/AgricultureCards';
import { ActuatorCard } from '@/components/ui/ActuatorCard';

export default async function AgriculturePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const { data: readings } = await supabase.from('sensor_readings').select('*').eq('farm_id', farmId).order('recorded_at', { ascending: false }).limit(20);
  
  // Extract latest values (mocking some if missing)
  const soil = readings?.find(r => r.unit === '%')?.value || 58;
  const temp = readings?.find(r => r.unit === '°C')?.value || 24.5;
  const hum = readings?.find(r => r.unit === '%RH')?.value || 65;

  const mockPump = { id: 'act-1', name: 'Main Irrigation Pump', state: 'off', mode: 'auto', runtime: '2h 15m' };
  const mockSolenoid = { id: 'act-2', name: 'Bed 1 Solenoid', state: 'on', mode: 'manual', current_draw: '0.8A' };
  const mockLight = { id: 'act-3', name: 'Grow Light Array A', state: 'on', mode: 'auto', current_draw: '12A' };

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
    <PageContainer title="AGRICULTURE CONTROL">
      <div className="flex flex-col gap-6">
        <h2 className="text-ink font-semibold">Live Environment</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SoilMoistureCard value={soil} unit="%" bedName="Bed 1 Soil" />
          <TemperatureCard value={temp} unit="°C" />
          <HumidityCard value={hum} unit="%RH" />
          <LightIntensityCard value={18.4} unit="mol/m²/d" />
        </div>

        <h2 className="text-ink font-semibold mt-4">Irrigation & Climate Actuators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActuatorCard actuator={mockPump} onCommand={handleCommand} />
          <ActuatorCard actuator={mockSolenoid} onCommand={handleCommand} />
          <ActuatorCard actuator={mockLight} onCommand={handleCommand} />
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
