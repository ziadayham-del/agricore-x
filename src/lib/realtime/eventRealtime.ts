import { createSubscriptionManager } from './subscriptions';
import { SupabaseClient } from '@supabase/supabase-js';

export function subscribeToEvents(supabase: SupabaseClient, farmId: string, manager: ReturnType<typeof createSubscriptionManager>, callback: (payload: any) => void) {
  manager.subscribe(
    `events_${farmId}`,
    { event: 'INSERT', schema: 'public', table: 'events', filter: `farm_id=eq.${farmId}` },
    callback
  );
}
