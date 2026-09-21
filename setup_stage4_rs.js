const fs = require('fs');
const path = require('path');

const files = {
  'src/components/roof/RoofCards.tsx': `'use client';
import { Card } from '@/components/ui/Card';
import { CloudRain, Sun, ArrowUpCircle } from 'lucide-react';

export function RoofStatusCard({ isOpen, mode }: any) {
  return (
    <Card className={\`p-4 border-l-4 \${isOpen ? 'border-l-azure' : 'border-l-ink'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><ArrowUpCircle size={14}/> Roof Vents</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl text-ink">{isOpen ? 'OPEN' : 'CLOSED'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Mode</span>
        <span>{mode}</span>
      </div>
    </Card>
  );
}

export function RainSensorCard({ isRaining, mmPerHour }: any) {
  return (
    <Card className={\`p-4 border-l-4 \${isRaining ? 'border-l-azure' : 'border-l-emerald'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><CloudRain size={14}/> Rain Sensor</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={\`text-3xl \${isRaining ? 'text-azure' : 'text-emerald'}\`}>{isRaining ? 'DETECTED' : 'CLEAR'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Rate</span>
        <span>{mmPerHour} mm/h</span>
      </div>
    </Card>
  );
}`,

  'src/app/dashboard/roof-tracker/page.tsx': `import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { RoofStatusCard, RainSensorCard } from '@/components/roof/RoofCards';
import { ActuatorCard } from '@/components/ui/ActuatorCard';

export default async function RoofPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const mockRoofMotor = { id: 'act-r1', name: 'Greenhouse Roof Motor', state: 'off', mode: 'auto', current_draw: '0.0A' };
  const mockTracker = { id: 'act-r2', name: 'Solar Tracker Axis', state: 'on', mode: 'auto', current_draw: '1.2A', runtime: 'Tracking' };

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
    <PageContainer title="ROOF & SOLAR TRACKER">
      <div className="flex flex-col gap-6">
        <h2 className="text-ink font-semibold">Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoofStatusCard isOpen={false} mode="Automatic (Rain Lock)" />
          <RainSensorCard isRaining={false} mmPerHour={0} />
        </div>

        <h2 className="text-ink font-semibold mt-4">Actuators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActuatorCard actuator={mockRoofMotor} onCommand={handleCommand} />
          <ActuatorCard actuator={mockTracker} onCommand={handleCommand} />
        </div>
      </div>
    </PageContainer>
  );
}`,

  'src/components/security/SecurityCards.tsx': `'use client';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, Video, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PerimeterStatusCard({ status }: any) {
  const isSecure = status === 'secure';
  return (
    <Card className={\`p-4 border-l-4 \${isSecure ? 'border-l-emerald' : 'border-l-coral'}\`}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><ShieldAlert size={14}/> Perimeter</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={\`text-3xl \${isSecure ? 'text-emerald' : 'text-coral'}\`}>{isSecure ? 'SECURE' : 'BREACH'}</span>
      </div>
    </Card>
  );
}

export function SecurityCameraStream({ cameraId, name, streamUrl, failbackImg }: any) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="bg-ink p-2 text-bg text-xs font-mono flex items-center justify-between">
        <span className="flex items-center gap-2"><Video size={12}/> {name}</span>
        <span className="text-emerald animate-pulse">● LIVE</span>
      </div>
      <div className="relative aspect-video bg-panel-recessed flex items-center justify-center border-b border-border">
        {/* We use an img tag for MJPEG streams, fallback if it fails */}
        {streamUrl ? (
          <img src={streamUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = failbackImg; }} />
        ) : (
          <span className="text-ink-faint text-sm">Stream Unavailable</span>
        )}
      </div>
    </Card>
  );
}`,

  'src/app/dashboard/security/page.tsx': `import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { PerimeterStatusCard, SecurityCameraStream } from '@/components/security/SecurityCards';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function SecurityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PageContainer title="SECURITY & CAMERAS">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-ink font-semibold">Perimeter Overview</h2>
          <Link href="/dashboard/crop-camera">
            <Button variant="outline">View Crop Intelligence Camera</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <PerimeterStatusCard status="secure" />
        </div>

        <h2 className="text-ink font-semibold mt-4">Live Camera Feeds</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityCameraStream name="CAM-01 Main Gate" streamUrl="http://agricore.local/cam1/stream" failbackImg="/placeholder.jpg" />
          <SecurityCameraStream name="CAM-02 Greenhouse Rear" streamUrl="" failbackImg="/placeholder.jpg" />
        </div>
      </div>
    </PageContainer>
  );
}`,

  'src/app/dashboard/crop-camera/page.tsx': `import { PageContainer } from '@/components/layout/PageContainer';
import { SecurityCameraStream } from '@/components/security/SecurityCards';
import { Card } from '@/components/ui/Card';

export default function CropCameraPage() {
  return (
    <PageContainer title="CROP INTELLIGENCE CAMERA">
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityCameraStream name="CAM-03 Crop Canopy (ESP32-CAM)" streamUrl="http://agricore.local/cam3/stream" failbackImg="/placeholder.jpg" />
          </div>
          <div className="flex flex-col gap-4">
            <Card className="p-4">
              <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-2">AI Analysis Status</h3>
              <p className="text-ink text-sm">Last analyzed: 14 mins ago</p>
              <p className="text-emerald text-sm font-medium mt-2">Health Score: 92/100</p>
            </Card>
          </div>
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
