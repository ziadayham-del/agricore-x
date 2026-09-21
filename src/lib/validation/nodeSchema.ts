import { z } from 'zod';
export const nodeSchema = z.object({
  id: z.string().uuid(),
  farm_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  location: z.string().optional(),
  status: z.enum(['online', 'offline', 'error']),
  last_seen: z.string().datetime(),
  hardware_version: z.string().optional()
});
export type NodePayload = z.infer<typeof nodeSchema>;
