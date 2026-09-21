import { getGroqClient, requireServerContext } from './client';
import { ROLES, RESPONSE_SCHEMA } from './prompts';

export async function analyzeCrop(cropData: any, recentReadings: any) {
  requireServerContext();
  const groq = getGroqClient();
  const prompt = `${ROLES.AGRONOMIST}
Crop: ${JSON.stringify(cropData)}
Readings: ${JSON.stringify(recentReadings)}

${RESPONSE_SCHEMA}`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama3-8b-8192',
    response_format: { type: 'json_object' }
  });
  return JSON.parse(chatCompletion.choices[0]?.message?.content || '{}');
}