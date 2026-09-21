#pragma once
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
};\n