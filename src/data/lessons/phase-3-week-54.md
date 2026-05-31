# Week 54: I2C Protocol

UART is great for two devices, but what if you have 10 sensors? Wiring 10 pairs of TX/RX wires is a nightmare. 
Enter **I2C** (Inter-Integrated Circuit).

## 1. The "Bus" Concept

I2C is a **Bus** protocol. Multiple devices share the same two wires:
1.  **SDA (Serial Data):** The data line.
2.  **SCL (Serial Clock):** The timing line.

Imagine a room full of people. I2C is like a teacher (the Controller) talking to students (the Targets). Each student has a unique **Address** (e.g., 0x3C). 

## 2. How it works (The Handshake)

1.  **The Start:** The Controller pulls SDA low while SCL is high.
2.  **The Address:** The Controller sends 7 bits (the address) + 1 bit (Read or Write).
3.  **The ACK (Acknowledge):** If a device has that address, it pulls the SDA line low for one clock pulse to say "I'm here!"

## 3. Coding: The I2C Scanner

One of the first things a senior engineer does when a sensor isn't working is run an **I2C Scanner**. It tries to talk to every address from 1 to 127 and reports which ones respond.

```cpp
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("\nI2C Scanner");
}

void loop() {
  byte error, address;
  int nDevices = 0;

  Serial.println("Scanning...");

  for(address = 1; address < 127; address++ ) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      Serial.print("I2C device found at address 0x");
      if (address<16) Serial.print("0");
      Serial.print(address,HEX);
      Serial.println("  !");
      nDevices++;
    }
  }
  if (nDevices == 0) Serial.println("No I2C devices found\n");
  delay(5000); 
}
```

## 4. Pull-up Resistors (Hardware)

I2C lines are "Open-Drain." This means devices can only pull the lines **LOW**. They cannot push them **HIGH**. You **must** have "Pull-up Resistors" connected to VCC to bring the lines back to HIGH when no one is talking. 
*   **Pro Tip:** Most pre-made sensor modules (Adafruit, Sparkfun) have these resistors built-in. If you connect too many modules, the total resistance might become too low, causing data corruption.

## 5. Learning Resources (The "Why")

*   **Video:** [I2C Communication Protocol Clearly Explained](https://www.youtube.com/watch?v=6IAkYpmA1DQ) - Best visual explanation.
*   **Video:** [How I2C Works - SparkFun](https://www.youtube.com/watch?v=LjS8Nskp-y4) - A deep dive into the electronics.
*   **Article:** [I2C Multi-device addressing](https://learn.adafruit.com/i2c-addresses/overview) - A huge list of common sensor addresses.

## Summary for the Assignment
In Wokwi:
1.  Connect an ESP32 to an I2C OLED display and an I2C sensor (like the BMP280).
2.  Run the scanner code above to find their addresses.
3.  **Critical Thinking:** What happens if two sensors have the same address? (Answer: You need an I2C Multiplexer!).

---
**Senior Pro-Tip:** I2C is designed for short distances (inches, not feet). If you try to run an I2C sensor over a 2-meter cable, it will likely fail due to capacitance. For long distances, use RS485 or CAN bus.