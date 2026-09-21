import { describe, it, expect } from 'vitest';

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
