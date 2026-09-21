const fs = require('fs');
const path = require('path');

const files = {
  'src/lib/groq/client.ts': `import { Groq } from 'groq-sdk';
export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set.");
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};
export const requireServerContext = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Groq client must only be used on the server.');
  }
};`,

  'src/lib/groq/prompts.ts': `export const ROLES = {
  AGRONOMIST: \`You are the AI Agronomist for AgriCore X. Analyze crop conditions, soil moisture, temperature, and suggest agricultural actions. You can only observe and recommend; you cannot execute commands.\`,
  ENERGY_ANALYST: \`You are the AI Energy Analyst. Analyze solar yield, battery SOC, and grid usage.\`,
  FAULT_ANALYST: \`You are the AI Fault Analyst. Identify hardware anomalies and offline nodes.\`,
  ASSISTANT: \`You are the AI Farm Assistant. Answer user queries based strictly on the provided sensor and event context.\`
};

export const RESPONSE_SCHEMA = \`You MUST respond strictly in the following JSON format, and nothing else:
{
  "summary": "Short response paragraph",
  "observations": ["Obs1", "Obs2"],
  "recommended_actions": [{"action": "Action desc", "priority": "high|medium|low"}],
  "confidence": 0.0 to 1.0,
  "requires_human_confirmation": true
}\`;`,

  'src/lib/groq/farmAssistant.ts': `import { getGroqClient, requireServerContext } from './client';
import { ROLES, RESPONSE_SCHEMA } from './prompts';

export async function processQuery(query: string, contextData: any) {
  requireServerContext();
  const groq = getGroqClient();
  const prompt = \`\${ROLES.ASSISTANT}
Context (Live Data):
\${JSON.stringify(contextData)}

User Query: \${query}

\${RESPONSE_SCHEMA}\`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      response_format: { type: 'json_object' }
    });
    const result = JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
    return result;
  } catch (error) {
    console.error('Groq Error:', error);
    return { error: 'Failed to process AI query.' };
  }
}`,

  'src/lib/groq/cropAnalysis.ts': `import { getGroqClient, requireServerContext } from './client';
import { ROLES, RESPONSE_SCHEMA } from './prompts';

export async function analyzeCrop(cropData: any, recentReadings: any) {
  requireServerContext();
  const groq = getGroqClient();
  const prompt = \`\${ROLES.AGRONOMIST}
Crop: \${JSON.stringify(cropData)}
Readings: \${JSON.stringify(recentReadings)}

\${RESPONSE_SCHEMA}\`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
    response_format: { type: 'json_object' }
  });
  return JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
}`,

  'src/app/api/ai/route.ts': `import { NextResponse } from 'next/server';
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

  if (response.error) {
    return NextResponse.json({ error: response.error }, { status: 500 });
  }

  // Validate Contract
  if (!response.summary || !Array.isArray(response.observations)) {
    return NextResponse.json({ error: 'Malformed AI response.' }, { status: 500 });
  }

  // Persist insight
  await supabase.from('ai_insights').insert({
    farm_id: farmId,
    insight_type: 'general',
    summary: response.summary,
    observations: response.observations,
    recommended_actions: response.recommended_actions || [],
    confidence: response.confidence || 0.5
  });

  return NextResponse.json(response);
}`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Created ' + filePath);
}
