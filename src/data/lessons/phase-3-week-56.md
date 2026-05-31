# Week 56: MQTT Protocol

We've mastered talking between chips. Now, let's talk between **systems**. **MQTT** is the standard language of the Internet of Things. 

## 1. Publish / Subscribe Model

In MQTT, we have:
1.  **The Broker:** The central "Post Office" (e.g., HiveMQ).
2.  **Clients:** The devices (ESP32, Phone, Dashboard).

Clients don't talk to each other. They talk to **Topics**.
*   **Publish:** ESP32 sends "25C" to topic `home/room/temp`.
*   **Subscribe:** Phone app listens to `home/room/temp`.

## 2. Topics are Hierarchical

`building_A / floor_1 / room_101 / light_status`
You can use **Wildcards**:
*   `building_A/floor_1/+/temp` -> Every room on floor 1.
*   `building_A/#` -> Everything in Building A.

## 3. Coding: Publishing Sensor Data

```cpp
#include <WiFi.h>
#include <PubSubClient.h> // You'll need to install this library

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  setup_wifi();
  client.setServer("broker.hivemq.com", 1883);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop(); // Handle incoming messages

  // Publish every 5 seconds
  static unsigned long lastMsg = 0;
  if (millis() - lastMsg > 5000) {
    lastMsg = millis();
    String temp = String(random(20, 30));
    client.publish("creatives-academy/test/temp", temp.c_str());
  }
}
```

## 4. Retained Messages and Last Will (LWT)

*   **Retained Messages:** The broker saves the last value. When a new client joins, they get it immediately.
*   **Last Will:** If your ESP32 loses power, the broker automatically sends a message (e.g., "Offline") to a specific topic so everyone knows the device died.

## 5. Learning Resources (The "Why")

*   **Video:** [MQTT Essentials](https://www.youtube.com/watch?v=f9n9-U_G_wA) - A series by HiveMQ that explains everything.
*   **Video:** [MQTT vs HTTP](https://www.youtube.com/watch?v=S-N_v_06HTo) - Why MQTT is 10x more efficient for batteries.
*   **Tool:** [MQTT Explorer](http://mqtt-explorer.com/) - **MANDATORY.** Install this on your PC to see every message on the broker.

## Summary for the Assignment
In Wokwi:
1.  Connect ESP32 to Wi-Fi.
2.  Publish your DHT22 data to a unique topic.
3.  Use a phone app (like "MQTT Dash") or MQTT Explorer to see your data live.
4.  **Experiment:** Try publishing with the "Retain" flag and see what happens when you restart your app.

---
**Senior Pro-Tip:** Don't put logic in topics like `home/light/set_on`. Use `home/light/command` with a JSON payload `{"state": "ON"}`. Keeping topics clean and payloads as JSON is the professional way to architect IoT systems.