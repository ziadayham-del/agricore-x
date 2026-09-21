import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { RoofStatus } from '@/components/roof/RoofStatus';
import { RainSensorCard } from '@/components/roof/RainSensorCard';
import { ActuatorCard } from '@/components/ui/ActuatorCard';

export default async function RoofPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const mockRoofMotor = { id: 'act-r1', name: 'Greenhouse Roof Motor', state: 'off', mode: 'auto',  current_draw: '0.0A' };
  const mockTracker   = { id: 'act-r2', name: 'Solar Tracker Axis',    state: 'on',  mode: 'auto',  current_draw: '1.2A', runtime: 'Tracking' };

  return (
    <PageContainer title="ROOF & SOLAR TRACKER">
      <div className="flex flex-col gap-6">
        <h2 className="text-ink font-semibold">Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RoofStatus isOpen={false} mode="Automatic (Rain Lock)" />
          <RainSensorCard isRaining={false} mmPerHour={0} />
        </div>

        <h2 className="text-ink font-semibold mt-4">Actuators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActuatorCard actuator={mockRoofMotor} farmId={farmId} />
          <ActuatorCard actuator={mockTracker}   farmId={farmId} />
        </div>
      </div>
    </PageContainer>
  );
}