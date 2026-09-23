export const runtime = 'edge';

import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { BatteryCard } from '@/components/power/BatteryCard';
import { SolarPanelCard } from '@/components/power/SolarPanelCard';
import { GridStatusCard } from '@/components/power/GridStatusCard';
import { ActuatorCard } from '@/components/ui/ActuatorCard';

export default async function PowerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  const mockRelay    = { id: 'act-p1', name: 'Grid Tie Contactor', state: 'on', mode: 'auto',   current_draw: '0.1A' };
  const mockInverter = { id: 'act-p2', name: 'Main Inverter',       state: 'on', mode: 'manual', current_draw: '45A'  };

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
          <ActuatorCard actuator={mockInverter} farmId={farmId} />
          <ActuatorCard actuator={mockRelay}    farmId={farmId} />
        </div>
      </div>
    </PageContainer>
  );
}
