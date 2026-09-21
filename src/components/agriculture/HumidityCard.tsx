'use client';
import { Card } from '@/components/ui/Card';
import { Wind } from 'lucide-react';

export function HumidityCard({ value, unit }: any) {
  return (
    <Card className="p-4 border-l-4 border-l-azure">
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Wind size={14}/> Humidity</span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl text-azure">{value}</span>
        <span className="text-ink-faint text-sm">{unit}</span>
      </div>
    </Card>
  );
}