import { Groq } from 'groq-sdk';
export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY is not set.");
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};
export const requireServerContext = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Groq client must only be used on the server.');
  }
};