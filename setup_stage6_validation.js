const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'lib', 'validation');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, 'nodeSchema.ts'), `import { z } from 'zod';
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
`);

fs.writeFileSync(path.join(dir, 'sensorSchema.ts'), `import { z } from 'zod';
export const sensorReadingSchema = z.object({
  node_id: z.string(),
  temperature: z.number().min(-50).max(100).optional(),
  humidity: z.number().min(0).max(100).optional(),
  soil_moisture: z.number().min(0).max(100).optional(),
  light_intensity: z.number().min(0).max(100000).optional(),
  voltage: z.number().min(0).max(400).optional(),
  current: z.number().min(0).max(100).optional()
});
export type SensorPayload = z.infer<typeof sensorReadingSchema>;
`);

fs.writeFileSync(path.join(dir, 'commandSchema.ts'), `import { z } from 'zod';
export const commandSchema = z.object({
  actuatorId: z.string(),
  command: z.string(),
  farmId: z.string().uuid(),
  safetyCheck: z.boolean().refine(val => val === true, { message: "Safety check must be acknowledged" }),
  parameters: z.record(z.any()).optional()
});
export type CommandPayload = z.infer<typeof commandSchema>;
`);

console.log('Created validation schemas');
