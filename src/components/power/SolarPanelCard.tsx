'use client';
import { Card } from '@/components/ui/Card';
import { Sun } from 'lucide-react';
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