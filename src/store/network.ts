import { create } from 'zustand';
import { NetworkMode } from '@/types';

export interface NetworkState {
  active_network: NetworkMode;
  lan: boolean;
  wifi: boolean;
  cellular: boolean;
  internet: boolean;
  offline_queue: number;
  last_sync: string | null;
  setNetworkState: (partial: Partial<NetworkState>) => void;
  incrementQueue: () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  active_network: 'Offline',
  lan: false,
  wifi: false,
  cellular: false,
  internet: true, // Assuming true for cloud API fallback in tests
  offline_queue: 0,
  last_sync: new Date().toISOString(),
  setNetworkState: (partial) => set((state) => ({ ...state, ...partial })),
  incrementQueue: () => set((state) => ({ offline_queue: state.offline_queue + 1 }))
}));