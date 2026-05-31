# Week 61: OTA Updates

In the real world, your device is inside a sealed box or on a 50-foot pole. You **cannot** use a USB cable to fix a bug. You need **OTA (Over-The-Air)** updates.

## 1. How OTA Works (The Partition Swap)

The ESP32's flash memory is divided into "Partitions." For OTA, we use two "App" partitions.
1.  **OTA_0:** Where the current code is running.
2.  **OTA_1:** Where the new code is being downloaded.
When the download is finished and verified, the ESP32 flips a switch in the "OTA Data" partition to say "Boot from OTA_1 next time."

## 2. Coding: Basic Web Update

The ESP32 can "pull" its own update from a web server.

```cpp
#include <WiFi.h>
#include <HTTPUpdate.h>

void updateFirmware() {
  WiFiClientSecure client;
  client.setInsecure(); // For testing, in production use a certificate!

  // This one line handles the download, verification, and reboot!
  t_httpUpdate_return ret = httpUpdate.update(client, "https://your-server.com/firmware.bin");

  switch (ret) {
    case HTTP_UPDATE_FAILED:
      Serial.printf("Update failed (%d): %s\n", httpUpdate.getLastError(), httpUpdate.getLastErrorString().c_str());
      break;
    case HTTP_UPDATE_NO_UPDATES:
      Serial.println("No updates available.");
      break;
    case HTTP_UPDATE_OK:
      Serial.println("Update successful! Rebooting...");
      break;
  }
}
```

## 3. Rollback: The Safety Net (Senior Detail)

What if your new firmware has a bug that prevents it from connecting to Wi-Fi? You've just "bricked" your device. 
*   **The Rollback Pattern:** The new firmware must connect to Wi-Fi and "Confirm" the update (`esp_ota_mark_app_valid_cancel_rollback()`) within 5 minutes. If it fails, the ESP32 automatically reboots and rolls back to the previous version.

## 4. Learning Resources (The "Why")

*   **Video:** [ESP32 OTA Updates Tutorial](https://www.youtube.com/watch?v=17X2OtoXByA) - Using the Arduino IDE over the air.
*   **Video:** [How Partition Tables Work](https://www.youtube.com/watch?v=fXWCH-X0X8M) - Understanding the flash memory layout.
*   **Article:** [Advanced OTA with Versioning](https://randomnerdtutorials.com/esp32-ota-over-the-air-arduino/ ) - How to manage multiple devices.

## Summary for the Assignment
In Wokwi:
1.  Learn about the `ArduinoOTA` library.
2.  **Think:** If you have a critical security patch, how do you force 1,000 devices to update? (Answer: Use an MQTT command!).

---
**Senior Pro-Tip:** Always include a "Version Number" in your Serial output at startup. It's the first thing you'll check when a device isn't behaving as expected. "Wait, is this running v1.0 or v1.1?"