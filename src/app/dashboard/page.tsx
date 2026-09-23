export const runtime = 'edge';

import { PageContainer } from "@/components/layout/PageContainer";
import { createClient } from "@/lib/supabase/server";
import { DashboardRealtime } from "@/components/dashboard/DashboardRealtime";

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  // Get primary farm
  const { data: members, error: memberError } = await supabase
    .from('farm_members')
    .select('farm_id')
    .eq('user_id', user.id)
    .limit(1);

  if (memberError || !members || members.length === 0) {
    return (
      <PageContainer title="FARM OVERVIEW">
        <div className="p-6 bg-coral-soft text-coral border border-coral/30 rounded">
          Error: No farm associated with this account. Please contact an administrator.
        </div>
      </PageContainer>
    );
  }

  const farmId = members[0].farm_id;

  // Fetch initial state
  const [
    { data: nodes },
    { data: recentTasks },
    { data: recentEvents },
    { data: latestHealth },
    { data: latestSoil },
  ] = await Promise.all([
    supabase.from('nodes').select('*').eq('farm_id', farmId),
    supabase.from('crop_tasks').select('id, title, description').is('completed_at', null).limit(3),
    supabase.from('events').select('id, created_at, message, event_type').eq('farm_id', farmId).order('created_at', { ascending: false }).limit(5),
    supabase.from('crop_health_scores').select('score').order('recorded_at', { ascending: false }).limit(1),
    supabase.from('sensor_readings').select('value').eq('farm_id', farmId).order('recorded_at', { ascending: false }).limit(1)
  ]);

  return (
    <PageContainer title="FARM OVERVIEW">
      <DashboardRealtime 
        farmId={farmId}
        initialNodes={nodes || []}
        initialTasks={recentTasks || []}
        initialEvents={recentEvents || []}
        initialHealth={latestHealth || []}
        initialSoil={latestSoil?.[0]?.value || null}
      />
    </PageContainer>
  );
}
