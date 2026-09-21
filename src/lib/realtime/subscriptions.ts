import { SupabaseClient } from '@supabase/supabase-js';

export function createSubscriptionManager(supabase: SupabaseClient) {
  const activeChannels = new Map<string, ReturnType<typeof supabase.channel>>();

  return {
    subscribe: (channelName: string, config: any, onMessage: (payload: any) => void) => {
      if (activeChannels.has(channelName)) return; // No duplicates

      const channel = supabase.channel(channelName)
        .on('postgres_changes', config, onMessage)
        .subscribe((status) => {
          if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            // Basic backoff could be implemented here
            setTimeout(() => channel.subscribe(), 5000);
          }
        });
      
      activeChannels.set(channelName, channel);
      return channel;
    },
    unsubscribe: async (channelName: string) => {
      const channel = activeChannels.get(channelName);
      if (channel) {
        await supabase.removeChannel(channel);
        activeChannels.delete(channelName);
      }
    },
    unsubscribeAll: async () => {
      for (const [name, channel] of activeChannels.entries()) {
        await supabase.removeChannel(channel);
      }
      activeChannels.clear();
    }
  };
}
