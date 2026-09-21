'use client';
import { Card } from '@/components/ui/Card';
import { Thermometer } from 'lucide-react';

export function TemperatureCard({ value, unit }: any) {
  const isHigh = value > 30;
  return (
    <Card className={'p-4 border-l-4 ' + (isHigh ? 'border-l-coral' : 'border-l-emerald')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Thermometer size={14}/> Ambient Temp</span>
      <div className="flex items-baseline gap-1">
        <span className={'text-3xl ' + (isHigh ? 'text-coral' : 'text-emerald')}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}