import { z } from 'zod';
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
