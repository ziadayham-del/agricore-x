import { describe, it, expect } from 'vitest';
import { sensorReadingSchema } from '@/lib/validation/sensorSchema';
import { commandSchema } from '@/lib/validation/commandSchema';
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
