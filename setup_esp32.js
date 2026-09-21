const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'esp32-server');

const files = {
  'platformio.ini': `[env:esp32dev]
platform = espressif32
board = esp32dev
framework = arduino
monitor_speed = 115200
lib_deps =
    bblanchon/ArduinoJson@^7.0.4
    me-no-dev/AsyncTCP@^1.1.1
    me-no-dev/ESP Async WebServer@^1.2.3
    links2004/WebSockets@^2.4.1
build_flags =
    -D CORE_DEBUG_LEVEL=5
`,

  'include/config.h': `#pragma once
#include <Arduino.h>

#define MASTER_NODE_ID 0x01
#define HEARTBEAT_INTERVAL_MS 5000
#define NODE_OFFLINE_TIMEOUT_MS 15000

#define LAN_IP "192.168.1.100"
#define WIFI_SSID "Farm_Net"
#define WIFI_PASS "SecureFarm123"
`,

  'include/pins.h': `#pragma once

#define RS485_TX_PIN 17
#define RS485_RX_PIN 16
#define RS485_DE_RE_PIN 4

#define SD_CS_PIN 5
#define SD_MOSI_PIN 23
#define SD_MISO_PIN 19
#define SD_SCK_PIN 18

#define ETH_PHY_ADDR 0
#define ETH_CLK_MODE ETH_CLOCK_GPIO17_OUT
`,

  'include/protocol.h': `#pragma once
#include <Arduino.h>

/*
RS-485 Packet Format (AgriCore X Blueprint)
-------------------------------------------------------------------------
| Byte(s)  | Name           | Description                               |
-------------------------------------------------------------------------
| 0        | Start Byte     | Always 0xAA                               |
| 1        | Node ID        | 0x01 (Master) to 0x05 (HMI)               |
| 2        | Message Type   | 0x10=Heartbeat, 0x20=Telemetry, 0x30=Cmd  |
| 3        | Payload Length | L (0-250)                                 |
| 4 to 4+L-1| Payload       | Variable data                             |
| 4+L      | CRC16 MSB      | CRC16 High Byte                           |
| 4+L+1    | CRC16 LSB      | CRC16 Low Byte                            |
| 4+L+2    | End Byte       | Always 0x55                               |
-------------------------------------------------------------------------
*/

#define PKT_START_BYTE 0xAA
#define PKT_END_BYTE 0x55

enum MessageType {
    MSG_HEARTBEAT = 0x10,
    MSG_TELEMETRY = 0x20,
    MSG_COMMAND = 0x30,
    MSG_ALERT = 0x40
};
`,

  'src/main.cpp': `#include <Arduino.h>
#include "config.h"
#include "pins.h"

void setup() {
    Serial.begin(115200);
    Serial.println("AgriCore X Master Node Initializing...");
    // Initialize managers (Network, SD, RS485, Web)
}

void loop() {
    // Process RS485 tasks, flush telemetry, handle websocket clients
    delay(10);
}
`,

  'src/rs485/rs485_manager.cpp': `#include <Arduino.h>
// Manages the polling loop and node state tracking
`,

  'src/rs485/rs485_protocol.cpp': `#include <Arduino.h>
#include "protocol.h"
// Serializes and deserializes the byte protocol, checks CRC
`,

  'src/telemetry/telemetry_manager.cpp': `#include <Arduino.h>
// Enforces publishing frequencies, buffers to SD if network fails
`,

  'src/network/wifi_manager.cpp': `#include <Arduino.h>
// WiFi connection management
`,

  'src/network/gsm_manager.cpp': `#include <Arduino.h>
// 4G Fallback management
`,

  'src/network/ethernet_manager.cpp': `#include <Arduino.h>
// Primary LAN connection management
`,

  'src/storage/sd_storage.cpp': `#include <Arduino.h>
// Handles local buffering for offline telemetry replay
`,

  'src/web/web_server.cpp': `#include <Arduino.h>
// Exposes /api/status, /api/nodes, /api/sensors local endpoints
`,

  'src/web/websocket.cpp': `#include <Arduino.h>
// Push updates to browser locally
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(baseDir, filePath);
  if (!fs.existsSync(path.dirname(fullPath))) {
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim() + '\\n', 'utf8');
  console.log('Created ' + filePath);
}
