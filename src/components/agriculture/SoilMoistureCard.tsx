'use client';
import { Card } from '@/components/ui/Card';
import { Droplet } from 'lucide-react';

export function SoilMoistureCard({ value, unit, bedName }: any) {
  const isLow = value < 60;
  return (
    <Card className={'p-4 border-l-4 ' + (isLow ? 'border-l-amber' : 'border-l-emerald')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Droplet size={14}/> {bedName}</span>
      <div className="flex items-baseline gap-1">
        <span className={'text-3xl ' + (isLow ? 'text-amber' : 'text-emerald')}>{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}