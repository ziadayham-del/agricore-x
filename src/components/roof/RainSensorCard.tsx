'use client';
import { Card } from '@/components/ui/Card';
import { CloudRain } from 'lucide-react';

export function RainSensorCard({ isRaining, mmPerHour }: any) {
  return (
    <Card className={'p-4 border-l-4 ' + (isRaining ? 'border-l-azure' : 'border-l-emerald')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><CloudRain size={14}/> Rain Sensor</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-3xl ' + (isRaining ? 'text-azure' : 'text-emerald')}>{isRaining ? 'DETECTED' : 'CLEAR'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Rate</span>
        <span>{mmPerHour} mm/h</span>
      </div>
    </Card>
  );
}