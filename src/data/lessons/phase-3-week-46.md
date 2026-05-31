# Week 46: Sensors (DHT22)

Last week we talked about moving electrons. This week, we talk about **input**. A computer that can't sense the world is just a calculator. We're going to use the **DHT22** (Digital Humidity and Temperature) sensor. 

In the industry, we call this "Data Acquisition."

## 1. Why the DHT22?

You might see the DHT11 (blue) and the DHT22 (white). 
*   **DHT11:** Cheap, but low resolution. It only reads whole numbers and has a limited range.
*   **DHT22:** More expensive, but much better. It reads to one decimal point and works in freezing/boiling temperatures. 

## 2. Digital vs. Analog Signals

This is a critical distinction for any engineer.

### Analog Signals
Analog signals are continuous. Imagine a dimmer switch. It can be 10%, 10.5%, 50.321%, etc. In microcontrollers, we use an **ADC (Analog-to-Digital Converter)** to turn a voltage (like 2.1V) into a number (like 612).

### Digital Signals
Digital signals are discrete. They are either **HIGH (1)** or **LOW (0)**. 
The DHT22 is a **digital sensor**, but it's "clever." It doesn't just send a 1 or 0. It sends a "pulse train"—a series of rapid high/low signals that represent the data.

## 3. The DHT22 Protocol (How it talks)

The DHT22 uses a single-wire serial protocol (not the same as OneWire). 
1.  **The Request:** The microcontroller pulls the data line LOW for a specific time (about 1-10ms) to "wake up" the sensor.
2.  **The Response:** The sensor sends back a sequence of 40 bits.
    *   16 bits for Humidity.
    *   16 bits for Temperature.
    *   8 bits for **Checksum**.

### What is a Checksum?
A checksum is a senior engineer's best friend. It's a simple way to verify data integrity. The sensor adds up the data bytes and sends the result. If the microcontroller adds the received data and the sum doesn't match the checksum, it knows the data was corrupted by electrical noise and ignores it.

## 4. Coding the DHT22 (The "Real" Way)

While most beginners just use a library, here is what the code actually does under the hood. Understanding this helps you debug when the library fails.

```cpp
#include "DHT.h"

#define DHTPIN 4     // What digital pin we're connected to
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  Serial.println(F("DHT22 test!"));
  dht.begin();
}

void loop() {
  // Wait a few seconds between measurements.
  delay(2000);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

  Serial.print(F("Humidity: "));
  Serial.print(h);
  Serial.print(F("%  Temperature: "));
  Serial.print(t);
  Serial.println(F("°C "));
}
```

## 5. Learning Resources (The "Why")

*   **Video:** [How DHT11/DHT22 Sensors Work](https://www.youtube.com/watch?v=S2S762B-o_E) - Explains the bit-level protocol.
*   **Article:** [Digital vs Analog Signals](https://learn.sparkfun.com/tutorials/analog-vs-digital) - A foundational guide by SparkFun.
*   **Datasheet:** [DHT22 Datasheet](https://www.sparkfun.com/datasheets/Sensors/Temperature/DHT22.pdf) - Reading this is what real engineers do to find out things like "maximum voltage" and "sample rate."

## Summary for the Assignment
In Wokwi, you'll hook up the DHT22 and write a script to print the values to the Serial Monitor. 
*   Observe how the values change when you simulate environment changes.
*   Notice the delay needed between reads.

---
**Senior Insight:** Always check for `NaN` (Not a Number) in your code. Sensors fail. Your code shouldn't crash just because a wire got loose. Use `isnan()` to safely handle these errors.