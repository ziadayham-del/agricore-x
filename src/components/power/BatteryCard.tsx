'use client';
import { Card } from '@/components/ui/Card';
import { Battery } from 'lucide-react';
export function BatteryCard({ soc, voltage, draw }: any) {
  const isLow = soc < 30;
  return (
    <Card className={'p-4 border-l-4 ' + (isLow ? 'border-l-amber' : 'border-l-emerald')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Battery size={14}/> Battery Bank</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-3xl ' + (isLow ? 'text-amber' : 'text-emerald')}>{soc}</span>
        <span className="text-ink-faint text-sm">%</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>{voltage}V</span>
        <span>{draw}A draw</span>
      </div>
    </Card>
  );
}