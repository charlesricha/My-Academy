# Week 58: Firebase RTDB

We've talked to generic APIs. Now, let's talk to the backend of our choice: **Firebase Realtime Database (RTDB)**. It's a "Live" database—perfect for IoT.

## 1. What is RTDB?

RTDB is just one giant **JSON tree**. 
```json
{
  "users": {
    "uid123": {
      "latest_temp": 24.5,
      "led_state": true
    }
  }
}
```
When a value changes in the cloud, your ESP32 can "hear" it instantly without asking.

## 2. Authentication

Firebase is secure. You define "Rules" that only allow certain UIDs to write to certain paths.
*   On the ESP32, we use the `Firebase-ESP-Client` library. It handles the complex authentication for us.

## 3. Coding: Reading and Writing

```cpp
#include <Firebase_ESP_Client.h>

// Define Firebase Data objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

void loop() {
  if (Firebase.ready()) {
    // Write a number
    Firebase.RTDB.setFloat(&fbdo, "/test/temp", 25.5);

    // Read a boolean (e.g. to turn on an LED)
    if (Firebase.RTDB.getBool(&fbdo, "/test/led")) {
      bool ledState = fbdo.boolData();
      digitalWrite(LED_PIN, ledState);
    }
  }
}
```

## 4. The "Stream" Pattern (Senior Detail)

Instead of asking Firebase every second, we set up a **Stream**.
`Firebase.RTDB.beginStream(&fbdo, "/test/led");`
Now, whenever someone changes the value in the Firebase console, the ESP32 receives an "Event" and runs your code. This is how "Smart Switches" work in the real world.

## 5. Learning Resources (The "Why")

*   **Video:** [What is Firebase?](https://www.youtube.com/watch?v=iosNuIdQoy8) - A high-level overview of the ecosystem.
*   **Video:** [Firebase RTDB for IoT](https://www.youtube.com/watch?v=E-V-9Oatf7A) - A step-by-step setup guide.
*   **Article:** [Firebase Security Rules](https://firebase.google.com/docs/rules) - How to lock down your data so hackers can't control your lights.

## Summary for the Assignment
In Wokwi:
1.  Create a Firebase project and an RTDB instance.
2.  Set rules to "public" for testing.
3.  Connect ESP32 using the library.
4.  **Observe:** Open the Firebase Console and watch the value change live as your ESP32 sends it. It's magic!

---
**Senior Insight:** Real-time is expensive in terms of battery. Every time you send data, the radio turns on. If you have 1,000 devices, you will hit rate limits. Only send data when a value **changes significantly** (e.g. > 0.5 degrees). Use your brain to save bandwidth!