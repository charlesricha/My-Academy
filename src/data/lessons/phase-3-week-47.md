# Week 47: Actuators (Servos)

We've learned to feel the world (Sensors). Now, we learn to **move** it. Enter the **Servo Motor**. 

Unlike a standard DC motor that just spins until you cut the power, a servo is "smart." It knows exactly what position it's in.

## 1. How a Servo Works

A servo is actually three components in one:
1.  **A DC Motor:** The muscles.
2.  **A Gearbox:** The strength (converts speed into torque).
3.  **A Potentiometer & Control Circuit:** The brain (feedback loop).

Inside the servo, the potentiometer tracks the position of the output shaft. When you tell it to go to 90 degrees, the control circuit sees it's at, say, 10 degrees, and turns the motor until the potentiometer reads 90.

## 2. PWM: Pulse Width Modulation

This is one of the most important concepts in all of embedded systems. How do we send a "number" (like 90 degrees) over a single digital wire?

We use **PWM**. 
Imagine flicking a light switch on and off very fast. 
*   If it's on 50% of the time, the average light is half-brightness.
*   For servos, the **width** of the pulse tells it the position.

### The Servo Standard:
*   A pulse of **1.0ms** usually means 0 degrees.
*   A pulse of **1.5ms** usually means 90 degrees (center).
*   A pulse of **2.0ms** usually means 180 degrees.
These pulses repeat every 20ms (50Hz frequency).

## 3. Wiring and Power

**Warning:** This is where most beginners kill their microcontrollers.
Motors are "noisy" and "thirsty." 
*   **Noisy:** They create electrical spikes when they move (Inductive Kickback).
*   **Thirsty:** They draw a lot of current, especially when starting or stalled.

**Rule:** Never power a large servo directly from your Arduino's 5V pin. It might work for a tiny SG90 micro-servo, but for anything bigger, use an external power supply and **connect the grounds (GND)** of the supply and the Arduino.

## 4. Control Code: Mapping Potentiometer to Servo

As an engineer, you often need to translate one range (0 to 1023 from a knob) to another (0 to 180 for a motor). We use the `map()` function for this.

```cpp
#include <Servo.h>

Servo myservo;  // create servo object to control a servo

int potpin = 0;  // analog pin used to connect the potentiometer
int val;    // variable to read the value from the analog pin

void setup() {
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
}

void loop() {
  val = analogRead(potpin);            // reads the value of the potentiometer (value between 0 and 1023)
  val = map(val, 0, 1023, 0, 180);     // scale it to use it with the servo (value between 0 and 180)
  myservo.write(val);                  // sets the servo position according to the scaled value
  delay(15);                           // waits for the servo to get there
}
```

## 5. Learning Resources (The "Why")

*   **Video:** [How Servo Motors Work](https://www.youtube.com/watch?v=jitvS_Zf_A8) - A great breakdown of the internal gears and circuit.
*   **Video:** [Pulse Width Modulation (PWM) Explained](https://www.youtube.com/watch?v=YmP5988alAs) - Crucial for understanding how digital pins can mimic analog behavior.
*   **Article:** [The Importance of Common Ground](https://www.arduino.cc/en/Tutorial/libraryExamples/GndLoop) - Why you must connect the GND pins of different power supplies.

## Summary for the Assignment
In Wokwi:
1.  Connect a Potentiometer to an Analog pin.
2.  Connect a Servo to a Digital (PWM) pin.
3.  Write code to read the pot value, map it, and move the servo.

---
**Senior Note:** In the real world, servos have "dead bands." If you try to move a servo to 180.5 degrees, it might just vibrate and heat up. Always constrain your inputs using `constrain(val, 0, 180)` to protect the hardware.