import { getGroqClient, requireServerContext } from './client';
import { ROLES, RESPONSE_SCHEMA } from './prompts';

export async function processQuery(query: string, contextData: any) {
  requireServerContext();
  const groq = getGroqClient();
  const prompt = `${ROLES.ASSISTANT}
Context (Live Data):
${JSON.stringify(contextData)}

User Query: ${query}

${RESPONSE_SCHEMA}`;

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
}