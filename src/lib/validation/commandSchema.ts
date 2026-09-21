import { z } from 'zod';
export const commandSchema = z.object({
  actuatorId: z.string(),
  command: z.string(),
  farmId: z.string().uuid(),
  safetyCheck: z.boolean().refine(val => val === true, { message: "Safety check must be acknowledged" }),
  parameters: z.record(z.string(), z.any()).optional()
});
export type CommandPayload = z.infer<typeof commandSchema>;
