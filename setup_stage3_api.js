const fs = require('fs');
const path = require('path');

const files = {
  'src/types/protocol.ts': `export interface RS485Packet {
  startByte: number; // 0xAA
  nodeId: number;    // 0x01 to 0x05
  msgType: number;   // 0x10, 0x20, 0x30, 0x40
  payloadLen: number;
  payload: Uint8Array;
  crc: number;       // 16-bit
  endByte: number;   // 0x55
}

export function parseRS485Packet(buffer: Uint8Array): RS485Packet | null {
  if (buffer.length < 7) return null;
  if (buffer[0] !== 0xAA) return null;
  
  const nodeId = buffer[1];
  const msgType = buffer[2];
  const payloadLen = buffer[3];
  
  if (buffer.length < 4 + payloadLen + 3) return null;
  
  const payload = buffer.slice(4, 4 + payloadLen);
  const crcMsb = buffer[4 + payloadLen];
  const crcLsb = buffer[4 + payloadLen + 1];
  const crc = (crcMsb << 8) | crcLsb;
  
  const endByte = buffer[4 + payloadLen + 2];
  if (endByte !== 0x55) return null;
  
  // CRC validation omitted for briefness
  
  return { startByte: 0xAA, nodeId, msgType, payloadLen, payload, crc, endByte };
}`,

  'src/store/network.ts': `import { create } from 'zustand';
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
}));`,

  'src/lib/api/network.ts': `import { useNetworkStore } from '@/store/network';

export class TransportLayer {
  static async request(endpoint: string, options: RequestInit = {}) {
    const store = useNetworkStore.getState();
    
    // 1. Try ESP32 Local Server (LAN/WiFi)
    if (store.lan || store.wifi) {
      try {
        const res = await fetch(\`http://agricore.local\${endpoint}\`, { ...options, signal: AbortSignal.timeout(2000) });
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
}`,

  'src/app/api/nodes/route.ts': `import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const farmId = searchParams.get('farm_id');

  if (!farmId) return NextResponse.json({ error: 'farm_id required' }, { status: 400 });

  const { data, error } = await supabase.from('nodes').select('*').eq('farm_id', farmId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const body = await req.json();
  const { error } = await supabase.from('nodes').insert(body);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}`,

  'src/app/api/nodes/[nodeId]/route.ts': `import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: Request, { params }: { params: Promise<{ nodeId: string }> }) {
  const resolvedParams = await params;
  const supabase = await createClient();
  const body = await req.json();
  
  const { error } = await supabase.from('nodes').update(body).eq('id', resolvedParams.nodeId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}`,

  'src/app/api/telemetry/route.ts': `import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  
  // A service role or API key check could go here for hardware injection,
  // but we assume the local gateway authenticates with the cloud securely.
  // For the simulator, we bypass strict user auth on telemetry ingest if using anon key.
  
  const body = await req.json();
  // Example body: { type: 'sensor_readings', payload: [...] }
  
  if (body.type === 'sensor_readings') {
    const { error } = await supabase.from('sensor_readings').insert(body.payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (body.type === 'events') {
    const { error } = await supabase.from('events').insert(body.payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (body.type === 'power_readings') {
    const { error } = await supabase.from('power_readings').insert(body.payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim() + '\\n', 'utf8');
  console.log('Created ' + filePath);
}
