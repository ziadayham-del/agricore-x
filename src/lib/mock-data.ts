import { SystemStatus, Metric, FarmNode, Task, Alert, Event } from '../types';

export const mockSystemStatus: SystemStatus = {
  health: 96,
  activeNetwork: 'LAN',
  uptime: '4d 07h',
  nodesOnline: 5,
  totalNodes: 5,
  activePower: 'Solar + Battery'
};

export const mockMetrics: Record<string, Metric> = {
  cropHealth: { label: 'Crop Health', value: 92, unit: '/ 100', status: 'success' },
  soilAvg: { label: 'Soil Average', value: 58, unit: '%', status: 'neutral' },
  tankLevel: { label: 'Tank Level', value: 84, unit: '%', status: 'neutral' },
  battery: { label: 'Battery', value: 82, unit: '%', status: 'success' }
};

export const mockNodes: FarmNode[] = [
  { id: 'N01', name: 'Master', status: 'online' },
  { id: 'N02', name: 'Agri', status: 'online' },
  { id: 'N03', name: 'Power', status: 'online' },
  { id: 'N04', name: 'Roof', status: 'online' },
  { id: 'N05', name: 'HMI', status: 'online' },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Apply fertilizer', subtitle: 'Next: Irrigation' }
];

export const mockAlerts: Alert[] = [
  { id: 'a1', message: 'Soil moisture low — Bed 3', priority: 'medium' },
  { id: 'a2', message: 'Battery reserve normal', priority: 'low' },
  { id: 'a3', message: 'Crop image analysis complete', priority: 'low' }
];

export const mockEvents: Event[] = [
  { id: 'e1', timestamp: '17:56', message: 'PUMP_ON' },
  { id: 'e2', timestamp: '17:54', message: 'CROP_IMAGE_ANALYZED' },
  { id: 'e3', timestamp: '17:50', message: 'NODE_HEARTBEAT' }
];
