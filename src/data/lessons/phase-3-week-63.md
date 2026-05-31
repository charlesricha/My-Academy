# Week 63: IoT System Design

System Design is about choosing the right tools for the job. You don't use a sledgehammer to hang a picture, and you don't use Wi-Fi to monitor a forest.

## 1. Choosing the right Radio

*   **Wi-Fi:** High speed, high power, short range. (Home).
*   **Bluetooth (BLE):** Low power, short range. (Wearables).
*   **LoRa (Long Range):** Extremely low power, miles of range, but very slow. (Farms).
*   **Cellular (NB-IoT):** Works everywhere, but has a monthly fee. (Tracking).

## 2. The "Edge Intelligence" Philosophy

A junior engineer sends raw data to the cloud. A senior engineer processes it at the **Edge** (on the device).
*   **Junior:** Send 1,000 temperature readings a second.
*   **Senior:** Calculate the average on the ESP32 and only send a message if it changes by more than 1 degree.

## 3. Scalability: Provisioning

How do you get Wi-Fi credentials onto 1,000 devices without plugging them in?
*   **The "Captive Portal" Pattern:** If the device can't find Wi-Fi, it becomes its own Access Point. You connect with your phone, go to `192.168.4.1`, enter your home Wi-Fi password, and the device saves it and reboots.

## 4. Learning Resources (The "Why")

*   **Video:** [IoT Protocols: MQTT, CoAP, HTTP, AMQP](https://www.youtube.com/watch?v=m767L71yXfA) - Choosing the right language.
*   **Video:** [System Design for IoT](https://www.youtube.com/watch?v=pAnUv9Lp6X4) - Architecture at scale.
*   **Article:** [OWASP IoT Top 10](https://owasp.org/www-project-iot-top-10/) - The most common security mistakes in IoT.

## 5. Security: The "Hardware Root of Trust"

Don't store API keys in plain text in your code.
*   **The Pro Move:** Use a dedicated crypto-chip (like the ATECC608) to store your keys. They are physically impossible to read back out, even if someone steals the device.

## Summary for the Assignment
Your task is to **Design an Architecture** for a fictional project: "Smart Vineyard."
*   Thousands of acres, no Wi-Fi.
*   Soil moisture sensors every 100 meters.
*   **Deliverable:** A diagram or document choosing the Radio, Database, and Power Strategy. Explain *why* you chose them.

---
**Senior Pro-Tip:** Keep it simple. Every extra line of code and every extra component is a "Failure Point." A simple system that works 99.9% of the time is better than a complex one that works 90% of the time.