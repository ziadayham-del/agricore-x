'use client';
import { Card } from '@/components/ui/Card';
import { Video } from 'lucide-react';

export function SecurityCamera({ cameraId, name, streamUrl, failbackImg }: any) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="bg-ink p-2 text-bg text-xs font-mono flex items-center justify-between">
        <span className="flex items-center gap-2"><Video size={12}/> {name}</span>
        <span className="text-emerald animate-pulse">● LIVE</span>
      </div>
      <div className="relative aspect-video bg-panel-recessed flex items-center justify-center border-b border-border">
        {streamUrl ? (
          <img src={streamUrl} alt={name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = failbackImg; }} />
        ) : (
          <span className="text-ink-faint text-sm">Stream Unavailable</span>
        )}
      </div>
    </Card>
  );
}