'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Card } from '@/components/ui/Card';
import { TaskList } from '@/components/dashboard/TaskList';
import { SensorGauge } from '@/components/dashboard/SensorGauge';
import { PowerFlow } from '@/components/dashboard/PowerFlow';
import { useNetworkStore } from '@/store/network';

export function DashboardRealtime({ initialNodes, initialTasks, initialEvents, initialHealth, initialSoil, farmId }: any) {
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [soilValue, setSoilValue] = useState(initialSoil);
  const { active_network, setNetworkState } = useNetworkStore();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Subscribe to nodes
    const nodesSub = supabase
      .channel('public:nodes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'nodes', filter: `farm_id=eq.${farmId}` }, (payload) => {
        setNodes((prev) => prev.map(n => n.id === payload.new.id ? { ...n, ...payload.new } : n));
        setNetworkState({ active_network: '4G', last_sync: new Date().toISOString() });
      })
      .subscribe();

    // Subscribe to sensor readings
    const sensorSub = supabase
      .channel('public:sensor_readings')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_readings', filter: `farm_id=eq.${farmId}` }, (payload) => {
        // Assume soil sensor for demo update
        if (payload.new.unit === '%') {
          setSoilValue(payload.new.value);
        }
        setNetworkState({ active_network: '4G', last_sync: new Date().toISOString() });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(nodesSub);
      supabase.removeChannel(sensorSub);
    };
  }, [farmId, setNetworkState]);

  // Local Offline Detection for Nodes based on last_seen
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      setNodes((prev) => prev.map(n => {
        if (!n.last_seen) return n;
        const lastSeen = new Date(n.last_seen).getTime();
        if (now - lastSeen > 15000 && n.status !== 'offline') {
          return { ...n, status: 'offline' };
        }
        return n;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nodesOnline = nodes.filter(n => n.status === 'online').length;
  
  const systemStatus = {
    health: initialHealth?.[0]?.score || 0,
    activeNetwork: active_network,
    uptime: '4d 07h', 
    nodesOnline,
    totalNodes: nodes.length,
    activePower: 'Solar + Battery'
  };

  const cropHealth = { label: 'Crop Health', value: initialHealth?.[0]?.score || '--', unit: '/ 100' };
  const soilAvg = { label: 'Soil Average', value: soilValue ? Math.round(Number(soilValue)) : '--', unit: '%' };
  const tankLevel = { label: 'Tank Level', value: 84, unit: '%' }; 
  const battery = { label: 'Battery', value: 82, unit: '%' }; 

  const mappedTasks = (initialTasks || []).map((t: any) => ({ id: t.id, title: t.title, subtitle: t.description || '' }));
  const mappedEvents = events.map((e: any) => ({ 
    id: e.id, 
    timestamp: new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
    message: e.message || e.event_type 
  }));

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">System Health</div>
            <div className="text-2xl text-emerald">{systemStatus.health}%</div>
          </div>
          <div>
            <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Network</div>
            <div className="text-2xl text-ink">{systemStatus.activeNetwork}</div>
          </div>
          <div>
            <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Uptime</div>
            <div className="text-2xl text-ink">{systemStatus.uptime}</div>
          </div>
          <div>
            <div className="text-ink-dim text-xs uppercase tracking-wider mb-1">Nodes Online</div>
            <div className="text-2xl text-ink">{systemStatus.nodesOnline}/{systemStatus.totalNodes}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col">
          <span className="text-ink-dim text-xs uppercase tracking-wider mb-2">{cropHealth.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-emerald">{cropHealth.value}</span>
            <span className="text-ink-faint text-sm">{cropHealth.unit}</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <span className="text-ink-dim text-xs uppercase tracking-wider mb-2">{soilAvg.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-ink">{soilAvg.value}</span>
            <span className="text-ink-faint text-sm">{soilAvg.unit}</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <span className="text-ink-dim text-xs uppercase tracking-wider mb-2">{tankLevel.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-azure">{tankLevel.value}</span>
            <span className="text-ink-faint text-sm">{tankLevel.unit}</span>
          </div>
        </Card>
        <Card className="p-4 flex flex-col">
          <span className="text-ink-dim text-xs uppercase tracking-wider mb-2">{battery.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl text-emerald">{battery.value}</span>
            <span className="text-ink-faint text-sm">{battery.unit}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TaskList tasks={mappedTasks} />
        <Card className="p-5 flex flex-col">
          <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">LIVE SYSTEM ALERTS</h3>
          <div className="flex flex-col gap-3">
            {soilAvg.value !== '--' && Number(soilAvg.value) < 60 && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber" />
                <span className="text-amber">Soil moisture low — Bed 1</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SensorGauge />
        <PowerFlow />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 flex flex-col">
          <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">NODE HEALTH</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {nodes.length === 0 ? (
              <span className="text-ink-faint text-sm col-span-5">No nodes connected</span>
            ) : nodes.map(node => (
              <div key={node.id} className="flex flex-col items-center justify-center p-3 border border-border bg-panel-recessed rounded">
                <span className="text-ink-dim text-sm font-mono mb-2">{node.node_code}</span>
                <div className={`w-3 h-3 rounded-full mb-2 ${node.status === 'online' ? 'bg-emerald shadow-[0_0_8px_var(--emerald-soft)]' : 'bg-coral shadow-[0_0_8px_var(--coral-soft)]'}`} />
                <span className="text-ink-faint text-xs">{node.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 flex flex-col">
          <h3 className="text-ink-dim text-xs uppercase tracking-wider mb-4">RECENT EVENTS</h3>
          <div className="flex flex-col gap-2">
            {mappedEvents.length === 0 ? (
              <span className="text-ink-faint text-sm">No recent events</span>
            ) : mappedEvents.map((ev: any) => (
              <div key={ev.id} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                <span className="text-ink-faint text-sm shrink-0">{ev.timestamp}</span>
                <span className="text-ink text-sm truncate">{ev.message}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
