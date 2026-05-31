# Week 57: Microcontroller HTTP

MQTT is for streams, but sometimes you just need to talk to a standard web API. This week, we learn how to make the ESP32 act like a web browser using **HTTP**.

## 1. The HTTP Request Anatomy

An HTTP POST looks like this over the wire:
```text
POST /api/data HTTP/1.1
Host: example.com
Content-Type: application/json
Content-Length: 25

{"temp": 25.5, "id": 101}
```

## 2. Coding: Sending a JSON POST

```cpp
#include <HTTPClient.h>
#include <ArduinoJson.h> // Best library for handling JSON

void sendData() {
  HTTPClient http;
  http.begin("http://your-api.com/update");
  http.addHeader("Content-Type", "application/json");

  // Create JSON document
  StaticJsonDocument<200> doc;
  doc["sensor"] = "living_room";
  doc["temp"] = 24.5;

  String requestBody;
  serializeJson(doc, requestBody);

  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println(httpResponseCode);
    Serial.println(response);
  }
  http.end();
}
```

## 3. HTTPS and Certificates (Senior Security)

On a tiny ESP32, we don't have room for all the world's "Root Certificates."
*   **The Pro Way:** Get the **SHA1 Fingerprint** or the **Root CA Certificate** for the website, paste it into your code, and provide it to the client. This ensures you aren't talking to a hacker.

## 4. JSON Parsing (Reading data back)

If the API sends you data back (like weather info), you must parse it.

```cpp
String json = "{\"weather\": \"sunny\", \"temp\": 30}";
StaticJsonDocument<200> doc;
deserializeJson(doc, json);

const char* weather = doc["weather"];
int temp = doc["temp"];
```

## 5. Learning Resources (The "Why")

*   **Video:** [HTTP Request Methods (GET vs POST)](https://www.youtube.com/watch?v=7M7n02O2p6Q) - The foundation of the web.
*   **Video:** [JSON in 10 Minutes](https://www.youtube.com/watch?v=iiADhChRriM) - Why we use JSON instead of plain text.
*   **Article:** [HTTPS on ESP32](https://techtutorialsx.com/2017/11/18/esp32-arduino-https-get-requests/) - Detailed certificate verification guide.

## Summary for the Assignment
In Wokwi:
1.  Set up ESP32 to connect to Wi-Fi.
2.  Use a service like `webhook.site` to generate a URL.
3.  POST your simulated sensor data to that URL every 30 seconds.
4.  **Debug:** Pay attention to the HTTP Response Codes. `200` means OK, `404` means wrong URL, `500` means server error.

---
**Senior Pro-Tip:** Web requests are slow (seconds). If your `loop()` calls a GET request every time, your whole system will freeze. Use a timer (`millis()`) to only send data occasionally. Professional code never blocks the main loop.