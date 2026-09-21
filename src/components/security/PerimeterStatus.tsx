'use client';
import { Card } from '@/components/ui/Card';
import { ShieldAlert } from 'lucide-react';

export function PerimeterStatus({ status }: any) {
  const isSecure = status === 'secure';
  return (
    <Card className={'p-4 border-l-4 ' + (isSecure ? 'border-l-emerald' : 'border-l-coral')}>
      <span className="text-ink-dim text-xs uppercase mb-2 flex items-center gap-2"><ShieldAlert size={14}/> Perimeter</span>
      <div className="flex items-baseline gap-1 mb-2">
        <span className={'text-3xl ' + (isSecure ? 'text-emerald' : 'text-coral')}>{isSecure ? 'SECURE' : 'BREACH'}</span>
      </div>
    </Card>
  );
}