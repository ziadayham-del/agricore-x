'use client';
import { Card } from '@/components/ui/Card';
import { ArrowUpCircle } from 'lucide-react';

export function RoofStatus({ isOpen, mode }: any) {
  return (
    <Card className={'p-4 border-l-4 ' + (isOpen ? 'border-l-azure' : 'border-l-ink')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><ArrowUpCircle size={14}/> Roof Vents</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-3xl text-ink">{isOpen ? 'OPEN' : 'CLOSED'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Mode</span>
        <span>{mode}</span>
      </div>
    </Card>
  );
}