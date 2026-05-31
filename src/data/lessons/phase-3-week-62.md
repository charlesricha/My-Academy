# Week 62: Power Management

If your IoT device is plugged into a wall, life is easy. But if it's running on a battery, every milliamp counts. A standard ESP32 with Wi-Fi on draws about **80mA**. A standard AA battery would die in less than a day. 

## 1. ESP32 Deep Sleep

In Deep Sleep, everything is powered off except for a tiny timer.
*   **Draw:** ~10µA (0.01mA).
*   **Wake up:** The chip reboots (starts `setup()` from the beginning).

## 2. Coding: Sleeping and Waking

```cpp
#define BUTTON_PIN_BITMASK 0x800000000 // 2^33 for GPIO 33

void setup() {
  Serial.begin(115200);
  
  // Increment boot number and print it each reboot
  static RTC_DATA_ATTR int bootCount = 0;
  bootCount++;
  Serial.println("Boot number: " + String(bootCount));

  // Set timer to wake up every 1 hour
  esp_sleep_enable_timer_wakeup(3600ULL * 1000000ULL); 

  Serial.println("Going to sleep now...");
  delay(1000);
  esp_deep_sleep_start();
}
```

## 3. RTC Memory (Senior Detail)

Since the chip reboots, all your normal variables are lost. 
*   **The Fix:** Use `RTC_DATA_ATTR` before a variable. This stores it in a tiny piece of RAM that stays powered on during sleep.

## 4. Hardware Power Gating

Some sensors draw power even when they aren't being read. 
*   **The Pro Move:** Connect the sensor's VCC to a GPIO pin on the ESP32. Turn the pin HIGH to read the sensor, then LOW before going to sleep. This "cuts the power" to the sensor entirely.

## 5. Learning Resources (The "Why")

*   **Video:** [ESP32 Deep Sleep & Wake-up Sources](https://www.youtube.com/watch?v=r75MrWIViw4) - A visual guide.
*   **Video:** [How to measure low power with a Multimeter](https://www.youtube.com/watch?v=27pWIdX_v_U) - Seeing the microamps.
*   **Article:** [ESP32 Low Power Design](https://www.espressif.com/sites/default/files/documentation/esp32_hardware_design_guidelines_en.pdf) - Official guidelines by Espressif.

## Summary for the Assignment
In Wokwi:
1.  Put the ESP32 into Deep Sleep for 10 seconds.
2.  Use RTC memory to count how many times it has woken up.
3.  **Calculate:** If an ESP32 wakes up for 5s (at 80mA) every hour (the rest at 0.01mA), how long will a 2000mAh battery last?

---
**Senior Insight:** Wi-Fi connection is the most expensive part of your power budget. If you don't need to send data *right now*, save it to RTC memory and send it in one "burst" once every 10 readings. Stay asleep as long as possible.