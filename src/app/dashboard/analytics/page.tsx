import { PageContainer } from '@/components/layout/PageContainer';
import { createClient } from '@/lib/supabase/server';
import { AIChat } from '@/components/ai/AIChat';
import { Card } from '@/components/ui/Card';
import { BarChart, Activity, Zap, TrendingUp } from 'lucide-react';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: members } = await supabase.from('farm_members').select('farm_id').eq('user_id', user.id).limit(1);
  const farmId = members?.[0]?.farm_id;

  return (
    <PageContainer title="ANALYTICS & AI">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-azure/10 text-azure rounded"><Zap size={20}/></div>
          <div><p className="text-xs text-ink-dim uppercase">Energy Efficiency</p><p className="text-2xl font-bold text-ink">94%</p></div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald/10 text-emerald rounded"><TrendingUp size={20}/></div>
          <div><p className="text-xs text-ink-dim uppercase">Crop Performance Index</p><p className="text-2xl font-bold text-ink">A-</p></div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="p-4 h-64 flex flex-col items-center justify-center border-l-4 border-l-azure">
          <BarChart size={32} className="text-ink-faint mb-2" />
          <span className="text-ink-dim text-sm">Historical Temperature & Moisture</span>
          <span className="text-ink-faint text-xs">Waiting for rollup data...</span>
        </Card>
        <Card className="p-4 h-64 flex flex-col items-center justify-center border-l-4 border-l-emerald">
          <Activity size={32} className="text-ink-faint mb-2" />
          <span className="text-ink-dim text-sm">Period Comparisons (Week/Month)</span>
          <span className="text-ink-faint text-xs">Waiting for rollup data...</span>
        </Card>
      </div>
      
      <AIChat farmId={farmId} />
    </PageContainer>
  );
}
