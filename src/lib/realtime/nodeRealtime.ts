import { createSubscriptionManager } from './subscriptions';
import { SupabaseClient } from '@supabase/supabase-js';

export function subscribeToNodes(supabase: SupabaseClient, farmId: string, manager: ReturnType<typeof createSubscriptionManager>, callback: (payload: any) => void) {
  manager.subscribe(
    `nodes_${farmId}`,
    { event: '*', schema: 'public', table: 'nodes', filter: `farm_id=eq.${farmId}` },
    callback
  );
}
