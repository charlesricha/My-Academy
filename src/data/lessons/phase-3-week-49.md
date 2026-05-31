# Week 49: Arduino Basics

We've been talking about the components, now let's talk about the conductor of the orchestra: the **Microcontroller**. 

Specifically, we're using the "Arduino" platform.

## 1. What is an Arduino?

"Arduino" is actually three things:
1.  **Hardware:** The physical boards (Uno, Nano, Mega).
2.  **Software (IDE):** The program you use to write code.
3.  **Language/Framework:** A simplified set of C++ functions (like `digitalWrite()`).

Underneath the hood of an Arduino Uno is an **ATmega328P** chip. It's an 8-bit processor running at 16MHz. Compare that to your phone (64-bit, 3GHz)—the Arduino is "stupid" and "slow," but it's **deterministic**.

### Determinism: The Embedded Advantage
In Windows or Linux, if you tell the CPU to wait 1ms, it might wait 1.1ms or 2ms because it's busy doing background updates. In a microcontroller, there is no OS. Your code is the only thing running. If you tell it to wait, it waits exactly that long. This is why we use them for things like timing an engine's fuel injection.

## 2. The Anatomy of a Sketch

An Arduino program is called a "Sketch." It has two mandatory functions:

```cpp
void setup() {
  // This runs ONCE at startup.
  // Use it to initialize pins and communication.
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  // This runs FOREVER, over and over.
  digitalWrite(LED_BUILTIN, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(1000);                       // wait for a second
  digitalWrite(LED_BUILTIN, LOW);    // turn the LED off by making the voltage LOW
  delay(1000);                       // wait for a second
}
```

## 3. The "Serial Monitor" - Your Debugging Window

Since an Arduino doesn't have a screen, we use **UART Serial Communication** to talk to our computer.

```cpp
void setup() {
  Serial.begin(9600); // Set the communication speed (Baud rate)
}

void loop() {
  int sensorValue = analogRead(A0);
  Serial.print("Sensor reading is: ");
  Serial.println(sensorValue);
  delay(500);
}
```

## 4. The "Delay" Trap (Senior Insight)

`delay(1000)` stops the CPU for 1 second. It can do **nothing else** during that time.
If you are waiting for a button press while in a `delay()`, you will miss it. This is why professional code rarely uses `delay()`. We use `millis()` instead, which we'll cover in Week 51.

## 5. Learning Resources (The "Why")

*   **Video:** [What is a Microcontroller?](https://www.youtube.com/watch?v=rtP_6Xid0zI) - A deep dive into the silicon.
*   **Video:** [Arduino Programming Tutorial for Beginners](https://www.youtube.com/watch?v=zJ-LqeX_jzQ) - A full walkthrough of the IDE.
*   **Article:** [Why C++ for Arduino?](https://www.arduino.cc/en/main/software) - Understanding the language choice.

## Summary for the Assignment
In Wokwi, you'll use `analogWrite` to control the brightness of an LED (fading it in and out).
*   **Note:** `analogWrite` doesn't output an analog voltage; it uses **PWM** to "fake" it.
*   Practice using the Serial Monitor to debug your values. If you don't see anything, check if your Baud rate (9600) matches in both the code and the monitor.

---
**Senior Insight:** Always specify your data types accurately. Use `uint8_t` for numbers 0-255 instead of `int`. On a chip with only 2KB of RAM, every byte counts!