# Week 52: Multi-sensor Dashboard

This week is the "Midterm" for Phase 3. We're going to combine everything: multiple sensors, logical processing, and a visual interface. 

In the real world, this is how a smart home hub or an industrial control panel works.

## 1. System Integration: The "Task" Mindset

When you have 3 sensors and a display, you can't just list them one by one. You need to think in "Tasks."
*   **Task 1:** Sample sensors (Fast - every 100ms).
*   **Task 2:** Update display (Slow - every 500ms).
*   **Task 3:** Send to Serial/Cloud (Very Slow - every 5s).

## 2. Data Structuring with `struct`

Don't use loose variables. Use a **struct** to keep your data organized. This is what professional C++ developers do.

```cpp
struct EnvironmentalData {
  float temp;
  float humidity;
  int lightLevel;
  bool isAlarm;
};

EnvironmentalData currentData;

void updateDisplay(EnvironmentalData data) {
  // Clear screen and show data...
}
```

## 3. Smoothing Sensor Noise (Moving Average)

Sensors "jitter." If you display raw data, the numbers will flicker (25.1, 25.2, 25.1...). To solve this, we use a **Moving Average Filter**.
1.  Read the sensor 10 times.
2.  Add them up.
3.  Divide by 10.
This makes your dashboard feel much more professional and "stable."

## 4. I2C Displays (The 2-Wire Screen)

We'll use an OLED screen (like the SSD1306). It uses **I2C**, meaning it only needs two signal wires: **SDA** and **SCL**.

```cpp
#include <Adafruit_SSD1306.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

void setup() {
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) { 
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }
  display.display();
}
```

## 5. Learning Resources (The "Why")

*   **Video:** [How to use an I2C OLED Display](https://www.youtube.com/watch?v=PrN7Pr_yT0g) - Setup and basic shapes.
*   **Video:** [Simple Moving Average for Sensors](https://www.youtube.com/watch?v=f-K8m9Pq914) - Why math makes your hardware better.
*   **Article:** [What is I2C?](https://learn.sparkfun.com/tutorials/i2c) - Understanding the communication bus.

## Summary for the Assignment
In Wokwi:
1.  Connect a DHT22 (Temp/Hum) and a Potentiometer (Light).
2.  Connect an OLED display.
3.  Write a non-blocking `loop()` (using `millis()`) that updates the sensors and the screen at different rates.
4.  **Error Handling:** If the DHT22 fails, display "SENSOR ERROR" instead of `0.00`.

---
**Senior Pro-Tip:** This is where you should start thinking about **Object-Oriented Programming (OOP)**. Can you make a `Sensor` class that handles the reading and error checking? It will make your code much more reusable and clean. Organizing your code now prevents "spaghetti code" later.