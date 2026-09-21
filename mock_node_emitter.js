const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api/telemetry';
const FARM_ID = '00000000-0000-0000-0000-000000000001';
const NODE_AGRI = '00000000-0000-0000-0000-000000000012';
const SENSOR_SOIL = '00000000-0000-0000-0000-000000000031';
const SENSOR_TANK = '00000000-0000-0000-0000-000000000032';

async function sendTelemetry() {
  const payload = [
    {
      farm_id: FARM_ID,
      node_id: NODE_AGRI,
      sensor_id: SENSOR_SOIL,
      value: (50 + Math.random() * 20).toFixed(1),
      unit: '%',
      recorded_at: new Date().toISOString()
    },
    {
      farm_id: FARM_ID,
      node_id: NODE_AGRI,
      sensor_id: SENSOR_TANK,
      value: (70 + Math.random() * 5).toFixed(1),
      unit: '%',
      recorded_at: new Date().toISOString()
    }
  ];

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'sensor_readings', payload })
    });
    console.log(\`Sent telemetry: \${res.status} \${res.statusText}\`);
  } catch (err) {
    console.error('Failed to send telemetry:', err.message);
  }
}

async function sendHeartbeat() {
  const NODE_URL = 'http://localhost:3000/api/nodes/' + NODE_AGRI;
  try {
    const res = await fetch(NODE_URL, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'online', last_seen: new Date().toISOString() })
    });
    console.log(\`Sent heartbeat: \${res.status} \${res.statusText}\`);
  } catch (err) {
    console.error('Failed to send heartbeat:', err.message);
  }
}

console.log('AgriCore X - Mock Node Emitter Started');
setInterval(sendHeartbeat, 5000); // 5s heartbeat
setInterval(sendTelemetry, 15000); // 15s telemetry
