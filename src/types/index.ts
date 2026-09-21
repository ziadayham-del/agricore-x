export * from './protocol';

export type NetworkMode = 'LAN' | 'Wi-Fi' | '4G' | 'Offline';

export interface SystemStatus {
  health: number;
  activeNetwork: string;
  uptime: string;
  nodesOnline: number;
  totalNodes: number;
  activePower: string;
}

export interface Metric {
  label: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'success' | 'warning' | 'danger' | 'neutral' | 'good' | 'critical' | 'offline';
}

export interface FarmNode {
  id: string;
  name: string;
  type?: string;
  status: 'online' | 'offline' | 'warning';
  battery?: number;
  lastSeen?: string;
}

export interface Task {
  id: string;
  title: string;
  subtitle: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface Alert {
  id: string;
  message: string;
  severity?: 'critical' | 'warning' | 'info' | 'danger' | 'success';
  priority?: 'high' | 'medium' | 'low';
  timestamp?: string;
}

export interface Event {
  id: string;
  timestamp: string;
  message: string;
}
