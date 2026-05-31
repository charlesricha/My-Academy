# Week 55: SPI Protocol

If UART is a conversation and I2C is a classroom, **SPI** (Serial Peripheral Interface) is a high-speed data highway. When you need to send a lot of data quickly—like to an SD card or a screen—SPI is the only choice.

## 1. The Four-Wire Protocol

SPI uses four wires:
1.  **SCLK (Serial Clock):** Provided by the Controller.
2.  **MOSI (Main Out, Sub In):** Controller to device.
3.  **MISO (Main In, Sub Out):** Device to Controller.
4.  **CS / SS (Chip Select):** Tells a specific device "I am talking to YOU."

## 2. Why is SPI so fast?

1.  **Full Duplex:** It can send and receive data at the same time.
2.  **No Addressing Overhead:** In I2C, you have to send an address before every byte. In SPI, you just pull the **CS** pin low and start blasting data.
3.  **High Clock Speeds:** SPI can easily run at 10MHz, 20MHz, or even 80MHz.

## 3. Coding: Writing to an SD Card

```cpp
#include <SPI.h>
#include <SD.h>

File myFile;
const int chipSelect = 4;

void setup() {
  Serial.begin(9600);
  if (!SD.begin(chipSelect)) {
    Serial.println("Initialization failed!");
    return;
  }
  
  myFile = SD.open("test.txt", FILE_WRITE);
  if (myFile) {
    myFile.println("Logged data: 25.5C");
    myFile.close();
    Serial.println("Done.");
  } else {
    Serial.println("Error opening test.txt");
  }
}

void loop() {}
```

## 4. SPI Modes (The Confusion)

There are 4 "SPI Modes" based on:
1.  **Clock Polarity (CPOL):** Is the clock naturally HIGH or LOW?
2.  **Clock Phase (CPHA):** Does data change on the "rising edge" or "falling edge"?
**Senior Rule:** You **must** check the datasheet of your sensor. If you use Mode 0 when it expects Mode 3, you'll get garbage data.

## 5. Learning Resources (The "Why")

*   **Video:** [SPI Communication Protocol Explained](https://www.youtube.com/watch?v=fvObeREKpwE) - Great visuals of the "Circular Buffer" logic.
*   **Video:** [SD Cards on Arduino](https://www.youtube.com/watch?v=sS_oW81N0Hw) - A practical wiring guide.
*   **Article:** [What is SPI?](https://learn.sparkfun.com/tutorials/serial-peripheral-interface-spi/all) - Comprehensive guide by SparkFun.

## Summary for the Assignment
In Wokwi:
1.  Connect an SD card module using the SPI pins.
2.  Write a script that creates a file and writes "Hello World."
3.  **Observe:** Identify which pins are MISO, MOSI, and SCLK on your specific board. They are usually dedicated hardware pins.

---
**Senior Insight:** SPI doesn't have an "ACK" bit like I2C. If the device is unplugged, the microcontroller will keep sending data and have no idea that no one is listening. Always verify communication by reading a "WHO_AM_I" register on the sensor at startup.