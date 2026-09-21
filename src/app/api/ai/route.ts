import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { processQuery } from '@/lib/groq/farmAssistant';

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { query, farmId } = await req.json();

  // Fetch Live Context
  const [
    { data: nodes },
    { data: events },
    { data: readings }
  ] = await Promise.all([
    supabase.from('nodes').select('*').eq('farm_id', farmId),
    supabase.from('events').select('*').eq('farm_id', farmId).order('created_at', { ascending: false }).limit(5),
    supabase.from('sensor_readings').select('*').eq('farm_id', farmId).order('recorded_at', { ascending: false }).limit(10)
  ]);

  const contextData = { nodes, events, readings };
  
  // Call AI
  const response = await processQuery(query, contextData);

  // Validate and Repair Contract
  let finalResponse = { ...response };
  if (!finalResponse.summary) finalResponse.summary = "The AI successfully processed the data but returned a malformed summary. Please try again.";
  if (!Array.isArray(finalResponse.observations)) finalResponse.observations = [];
  if (!Array.isArray(finalResponse.recommended_actions)) finalResponse.recommended_actions = [];
  if (typeof finalResponse.confidence !== 'number') finalResponse.confidence = 0.5;
  if (typeof finalResponse.requires_human_confirmation !== 'boolean') finalResponse.requires_human_confirmation = true;

  // Persist insight
  await supabase.from('ai_insights').insert({
    farm_id: farmId,
    insight_type: 'general',
    summary: finalResponse.summary,
    observations: finalResponse.observations,
    recommended_actions: finalResponse.recommended_actions,
    confidence: finalResponse.confidence
  });

  return NextResponse.json(finalResponse);
}