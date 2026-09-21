'use client';
import { Card } from '@/components/ui/Card';
import { Lightbulb } from 'lucide-react';
import { AIRecommendation } from './AIRecommendation';
export function AIInsightCard({ insight }: any) {
  return (
    <Card className="p-5 border-l-4 border-l-azure relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3 text-azure">
        <Lightbulb size={18} />
        <h3 className="font-semibold text-ink uppercase tracking-wide text-sm">Automated Insight</h3>
      </div>
      <p className="text-ink text-sm mb-4 leading-relaxed">{insight.summary}</p>
      
      {insight.observations?.length > 0 && (
        <div className="mb-4">
          <span className="text-ink-dim text-xs uppercase mb-2 block">Key Observations:</span>
          <ul className="list-disc pl-4 text-sm text-ink-faint space-y-1">
            {insight.observations.map((obs: string, i: number) => <li key={i}>{obs}</li>)}
          </ul>
        </div>
      )}

      {insight.recommended_actions?.map((rec: any, i: number) => (
        <AIRecommendation key={i} recommendation={rec} />
      ))}
      
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex flex-col w-1/2">
          <span className="text-ink-faint text-xs uppercase mb-1">Confidence</span>
          <div className="w-full h-1.5 bg-panel-recessed rounded overflow-hidden">
            <div className="h-full bg-azure" style={{ width: `${(insight.confidence || 0) * 100}%` }} />
          </div>
        </div>
        <span className="text-ink-faint text-[10px] italic max-w-[40%] text-right">Advisory only. Not a guaranteed agronomic diagnosis.</span>
      </div>
    </Card>
  );
}