import { NextResponse } from 'next/server';
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
}