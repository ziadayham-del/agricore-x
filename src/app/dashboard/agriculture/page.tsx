import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { SoilMoistureCard } from '@/components/agriculture/SoilMoistureCard';
import { TemperatureCard } from '@/components/agriculture/TemperatureCard';
import { HumidityCard } from '@/components/agriculture/HumidityCard';
import { LightIntensityCard } from '@/components/agriculture/LightIntensityCard';
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

  const mockPump     = { id: 'act-1', name: 'Main Irrigation Pump', state: 'off', mode: 'auto',   runtime: '2h 15m' };
  const mockSolenoid = { id: 'act-2', name: 'Bed 1 Solenoid',       state: 'on',  mode: 'manual', current_draw: '0.8A' };
  const mockLight    = { id: 'act-3', name: 'Grow Light Array A',   state: 'on',  mode: 'auto',   current_draw: '12A' };

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

        <h2 className="text-ink font-semibold mt-4">Irrigation &amp; Climate Actuators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ActuatorCard actuator={mockPump}     farmId={farmId} />
          <ActuatorCard actuator={mockSolenoid} farmId={farmId} />
          <ActuatorCard actuator={mockLight}    farmId={farmId} />
        </div>
      </div>
    </PageContainer>
  );
}