'use client';
import { Badge } from '@/components/ui/Badge';
export function AIRecommendation({ recommendation }: any) {
  const { action, priority } = recommendation;
  const pColor = priority === 'high' ? 'danger' : priority === 'medium' ? 'warning' : 'neutral';
  return (
    <div className="flex items-center justify-between p-2 border border-border bg-panel-recessed rounded mt-2">
      <span className="text-ink text-sm">{action}</span>
      <Badge variant={pColor}>{priority.toUpperCase()}</Badge>
    </div>
  );
}