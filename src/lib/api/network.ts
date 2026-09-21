import { useNetworkStore } from '@/store/network';

export class TransportLayer {
  static async request(endpoint: string, options: RequestInit = {}) {
    const store = useNetworkStore.getState();
    
    // 1. Try ESP32 Local Server (LAN/WiFi)
    if (store.lan || store.wifi) {
      try {
        const res = await fetch(`http://agricore.local${endpoint}`, { ...options, signal: AbortSignal.timeout(2000) });
        if (res.ok) {
           store.setNetworkState({ active_network: store.lan ? 'LAN' : 'Wi-Fi', last_sync: new Date().toISOString() });
           return await res.json();
        }
      } catch (e) {
        // Timeout or failed - gracefully fall through to cloud
      }
    }
    
    // 2. Try Supabase Cloud via Next.js API Gateway
    if (store.internet) {
      try {
        const res = await fetch(endpoint, { ...options, signal: AbortSignal.timeout(5000) });
        if (res.ok) {
           store.setNetworkState({ active_network: '4G', last_sync: new Date().toISOString() });
           return await res.json();
        }
      } catch (e) {
        // Fallthrough to offline
      }
    }
    
    // 3. Offline Fallback
    store.setNetworkState({ active_network: 'Offline' });
    if (options.method && options.method !== 'GET') {
      store.incrementQueue();
      // IndexedDB persistence would occur here
    }
    
    return { data: null, error: 'Network unavailable, operating offline' };
  }
}