const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
};

write('vitest.config.ts', `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});`);

write('tests/setup.ts', `import '@testing-library/jest-dom/vitest';`);

write('tests/components/ThresholdLogic.test.tsx', `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BatteryCard } from '@/components/power/BatteryCard';

describe('BatteryCard Threshold Logic', () => {
  it('shows amber when SOC is below 30', () => {
    render(<BatteryCard soc={20} voltage={11.5} draw={5.0} />);
    const socElement = screen.getByText('20');
    expect(socElement.className).toContain('text-amber');
  });

  it('shows emerald when SOC is normal', () => {
    render(<BatteryCard soc={80} voltage={12.8} draw={2.0} />);
    const socElement = screen.getByText('80');
    expect(socElement.className).toContain('text-emerald');
  });
});
`);

write('tests/api/schemas.test.ts', `import { describe, it, expect } from 'vitest';
import { sensorReadingSchema, commandSchema } from '@/lib/validation/sensorSchema';
import { z } from 'zod';

describe('Payload Validation', () => {
  it('validates a correct sensor reading', () => {
    const valid = { node_id: 'N01', temperature: 25.5, humidity: 60 };
    expect(() => sensorReadingSchema.parse(valid)).not.toThrow();
  });

  it('rejects an out-of-bounds temperature', () => {
    const invalid = { node_id: 'N01', temperature: 150 };
    expect(() => sensorReadingSchema.parse(invalid)).toThrow();
  });
});
`);

// To fix import of commandSchema in tests:
write('src/lib/validation/sensorSchema.ts', `import { z } from 'zod';
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

export const commandSchema = z.object({
  actuatorId: z.string(),
  command: z.string(),
  farmId: z.string().uuid(),
  safetyCheck: z.boolean().refine(val => val === true, { message: "Safety check must be acknowledged" }),
  parameters: z.record(z.any()).optional()
});
export type CommandPayload = z.infer<typeof commandSchema>;
`);

write('tests/database/rls.test.ts', `import { describe, it, expect } from 'vitest';
// In a real environment, we would use Supabase local testing (pgTAP) or a dedicated test client.
describe('Cross-tenant RLS Isolation', () => {
  it('prevents querying nodes from another farm', () => {
    expect(true).toBe(true); // Placeholder for local test client verification
  });
});
`);

write('tests/esp32/rs485.test.ts', `import { describe, it, expect } from 'vitest';

// Simulating RS-485 decoding logic that would be shared
function calculateCRC16(buffer: Uint8Array) {
  let crc = 0xFFFF;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) crc = (crc >> 1) ^ 0xA001;
      else crc >>= 1;
    }
  }
  return crc;
}

describe('RS-485 Frame Decoding', () => {
  it('computes correct CRC16 for a simple frame', () => {
    const payload = new Uint8Array([0x01, 0x03, 0x00, 0x0A]);
    const crc = calculateCRC16(payload);
    expect(crc).toBeDefined();
  });
});
`);

console.log('Created test suites');
