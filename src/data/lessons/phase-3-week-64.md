# Week 64: System Integration

This is it. The final week of Phase 3. Integration is taking all those individual parts (Sensors, Wi-Fi, MQTT, Firebase, Next.js, OTA) and making them work as one **Product**.

## 1. The "Stability" Test: Watchdogs

What if your code freezes at 3 AM? A senior engineer uses a **Hardware Watchdog**.
It's a countdown timer. Your code must "kick the dog" (reset the timer) every few seconds. If the code freezes, the timer hits zero and **forces a hard reboot**.

```cpp
#include <esp_task_wdt.h>

void setup() {
  esp_task_wdt_init(5, true); // 5 second timeout, panic on timeout
  esp_task_wdt_add(NULL);    // add current thread to WDT watch
}

void loop() {
  // Your code...
  esp_task_wdt_reset(); // Kick the dog!
}
```

## 2. User Experience (UX) for Hardware

Hardware has a different UX than software.
*   **LED Feedback:** Use different blink patterns for "Connecting," "Connected," and "Error."
*   **Input Latency:** If the user presses a button, the physical action should be instant, even if the cloud takes 2 seconds to update.

## 3. Data Integrity: Offline Logging

If the Wi-Fi is down, save your data to **SPIFFS** (internal flash). When Wi-Fi returns, "sync" the missed data to the cloud. Never lose a reading!

## 4. Learning Resources (The "Why")

*   **Video:** [What is a Watchdog Timer?](https://www.youtube.com/watch?v=L9vP-908oFk) - Why your router reboots itself.
*   **Video:** [Building a Professional IoT Product](https://www.youtube.com/watch?v=Abq6m09R-9c) - From prototype to factory.
*   **Article:** [Designing UI for Hardware](https://medium.com/swlh/ux-design-for-the-internet-of-things-iot-6d7f02d41b5) - LED colors and button feel.

## Summary for the Assignment (Final Project)
Build a **Complete IoT System**:
1.  **ESP32:** Read sensors and handle a Hardware Watchdog.
2.  **Communication:** Send data to Firebase.
3.  **Web:** A Next.js dashboard showing live data and history.
4.  **Alerts:** Telegram message on thresholds.
5.  **Bonus:** Implement a "Factory Reset" button.

---
**Congratulations!** You've moved from "Blinking an LED" to "Building a Cloud-Connected Embedded System." You are now a Hardware/Software hybrid engineer. 

**Next Phase:** We enter the virtual world of **Game Development**.