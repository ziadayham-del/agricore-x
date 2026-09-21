#include <Arduino.h>
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
}\n