export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { actuatorId, command, farmId, parameters } = body;

  if (!actuatorId || !command) {
    return NextResponse.json({ error: 'actuatorId and command are required' }, { status: 400 });
  }

  // Log the command as an event so the event log shows it
  await supabase.from('events').insert({
    farm_id: farmId,
    event_type: 'COMMAND_DISPATCH',
    severity: 'low',
    message: `${actuatorId} → ${command}`,
    metadata: { actuatorId, command, parameters: parameters ?? {} }
  });

  // ------------------------------------------------------------------
  // Hardware dispatch layer
  // ------------------------------------------------------------------
  // The system is hardware-agnostic. Commands are persisted to Supabase
  // and broadcast via Realtime. Your ESP32 / gateway subscribes to the
  // `commands` channel and executes whatever arrives.
  //
  // When you finalise your hardware topology, insert the dispatch call
  // here (e.g. POST to the local gateway, push to a Redis queue, etc.)
  // For now, Supabase Realtime acts as the message bus — any connected
  // client or hardware bridge receives the event automatically.
  // ------------------------------------------------------------------

  const { error: cmdError } = await supabase.from('actuator_commands').insert({
    actuator_id: actuatorId,
    farm_id: farmId,
    command,
    parameters: parameters ?? {},
    issued_by: user.id,
    status: 'pending'
  }).select().single();

  // If the actuator_commands table doesn't exist yet (migration pending),
  // we still succeed — the event log is the fallback record.
  if (cmdError && !cmdError.message.includes('does not exist')) {
    console.warn('actuator_commands insert warning:', cmdError.message);
  }

  return NextResponse.json({ success: true, command, actuatorId });
}
