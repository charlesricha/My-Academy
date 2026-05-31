# Week 50: ESP32: Wi-Fi

The Arduino Uno is a great toy, but the **ESP32** is a professional tool. If you want to build "The Internet of Things," you need the "Internet" part. 

The ESP32 is a dual-core, 32-bit powerhouse with built-in Wi-Fi and Bluetooth. It makes the Arduino Uno look like a calculator.

## 1. Why ESP32?

*   **Speed:** 240MHz (vs 16MHz on Uno).
*   **Memory:** 520KB RAM (vs 2KB on Uno).
*   **Voltage:** It runs at **3.3V**. **Warning:** If you give it 5V on a signal pin (like from an old Arduino), you will kill it.
*   **Connectivity:** It's designed for the cloud.

## 2. Connecting to Wi-Fi (The Boilerplate)

Connecting an ESP32 to Wi-Fi is surprisingly simple, but there's a lot happening under the hood (DHCP negotiation, handshake, etc.).

```cpp
#include <WiFi.h>

const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_PASSWORD";

void setup() {
  Serial.begin(115200); // ESP32 usually uses faster baud rates
  
  // Start the connection process
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); // This is your device's address on your network
}

void loop() {
  // Your logic here
}
```

## 3. IP Addresses and Ports

Once connected, your ESP32 gets a **Local IP Address** (e.g., `192.168.1.50`). 
*   **Local vs Global:** This address is only valid inside your house. The outside world cannot see it.
*   **DHCP:** Your router "lends" this address to the ESP32. It might change tomorrow! For professional IoT, we often use "Static IPs" or "mDNS" (so you can go to `http://mysensor.local` instead of an IP).

## 4. Staying Connected (Senior Logic)

Real-world Wi-Fi is flaky. A senior engineer never assumes the connection will last. You must handle disconnections gracefully.

```cpp
void checkWifi() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Lost connection. Reconnecting...");
    WiFi.disconnect();
    WiFi.reconnect();
  }
}
```

## 5. Learning Resources (The "Why")

*   **Video:** [Introduction to the ESP32](https://www.youtube.com/watch?v=Co5p0Xun-r0) - Why it's the king of hobbyist IoT.
*   **Video:** [How Wi-Fi Works](https://www.youtube.com/watch?v=W06u7M-wL6M) - Understanding the radio waves.
*   **Article:** [ESP32 Pinout Guide](https://randomnerdtutorials.com/esp32-pinout-reference-gpios/) - Essential for knowing which pins are safe to use (some pins are for flash memory and will crash the board if you use them!).

## Summary for the Assignment
In Wokwi:
1.  Configure the ESP32 to connect to the simulated Wi-Fi (`Wokwi-GUEST`).
2.  Print the assigned IP address to the Serial Monitor.
3.  **Think:** If you have 100 of these in a building, how would you find their IP addresses? (This leads us to MQTT later!)

---
**Senior Pro-Tip:** The ESP32 is power-hungry when the Wi-Fi radio is on. If you're running on a battery, you'll need to use "Deep Sleep" modes (Week 62) to keep the project alive. Radio = Heat and Battery Drain.