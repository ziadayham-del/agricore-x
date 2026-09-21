'use client';
import { Card } from '@/components/ui/Card';
import { Sun } from 'lucide-react';

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
}