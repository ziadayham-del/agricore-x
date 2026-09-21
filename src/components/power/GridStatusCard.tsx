'use client';
import { Card } from '@/components/ui/Card';
import { Plug } from 'lucide-react';
export function GridStatusCard({ status, voltage }: any) {
  const isActive = status === 'connected';
  return (
    <Card className={'p-4 border-l-4 ' + (isActive ? 'border-l-azure' : 'border-l-coral')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><Plug size={14}/> Grid Tie</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-xl ' + (isActive ? 'text-azure' : 'text-coral')}>{isActive ? 'CONNECTED' : 'OFFLINE'}</span>
      </div>
      <div className="flex justify-between text-xs text-ink-faint border-t border-border pt-2 mt-2">
        <span>Voltage</span>
        <span>{voltage}V AC</span>
      </div>
    </Card>
  );
}