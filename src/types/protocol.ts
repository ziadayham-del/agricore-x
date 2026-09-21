export interface RS485Packet {
  startByte: number; // 0xAA
  nodeId: number;    // 0x01 to 0x05
  msgType: number;   // 0x10, 0x20, 0x30, 0x40
  payloadLen: number;
  payload: Uint8Array;
  crc: number;       // 16-bit
  endByte: number;   // 0x55
}

export function parseRS485Packet(buffer: Uint8Array): RS485Packet | null {
  if (buffer.length < 7) return null;
  if (buffer[0] !== 0xAA) return null;
  
  const nodeId = buffer[1];
  const msgType = buffer[2];
  const payloadLen = buffer[3];
  
  if (buffer.length < 4 + payloadLen + 3) return null;
  
  const payload = buffer.slice(4, 4 + payloadLen);
  const crcMsb = buffer[4 + payloadLen];
  const crcLsb = buffer[4 + payloadLen + 1];
  const crc = (crcMsb << 8) | crcLsb;
  
  const endByte = buffer[4 + payloadLen + 2];
  if (endByte !== 0x55) return null;
  
  // CRC validation omitted for briefness
  
  return { startByte: 0xAA, nodeId, msgType, payloadLen, payload, crc, endByte };
}