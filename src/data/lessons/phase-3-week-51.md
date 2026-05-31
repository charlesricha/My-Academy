# Week 51: Interrupts & Timers

Up until now, we've been writing code that "polls." 
Polling is like checking your phone every 5 seconds to see if you have a message. It's exhausting and inefficient. 
**Interrupts** are like your phone's ringer—you do your work, and the phone *interrupts* you when something happens.

## 1. External Interrupts (Hardware)

An External Interrupt is triggered by a physical change on a pin (like a button press).

### The ISR (Interrupt Service Routine)
An ISR is a special function that runs when the interrupt triggers. It has strict rules:
1.  **Be Fast:** Don't do heavy math.
2.  **No Blocking:** Never use `delay()` or `Serial.print()`.
3.  **Volatile Variables:** If you change a variable in an ISR, mark it `volatile` so the compiler knows it can change at any moment.

```cpp
volatile int buttonCount = 0;
const int buttonPin = 4;

// This is the ISR
void IRAM_ATTR handleButton() {
  buttonCount++; 
}

void setup() {
  Serial.begin(115200);
  pinMode(buttonPin, INPUT_PULLUP);
  // Trigger on the "FALLING" edge (from 3.3V to 0V when pressed)
  attachInterrupt(buttonPin, handleButton, FALLING);
}

void loop() {
  Serial.print("Total presses: ");
  Serial.println(buttonCount);
  delay(1000);
}
```

## 2. Debouncing: The Engineer's Nightmare

When you press a physical button, the metal contacts "bounce" dozens of times in a millisecond. To the CPU, one press looks like 50 presses.
*   **Software Debounce:** In your ISR, check the time using `millis()`. If the last interrupt was less than 50ms ago, ignore the current one.

## 3. The `millis()` Timer Pattern

This is how we avoid the "Delay Trap." We record the "last time" something happened and compare it to the "current time."

```cpp
unsigned long lastActionTime = 0;
const long interval = 1000; // 1 second

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastActionTime >= interval) {
    lastActionTime = currentMillis;
    // This code runs every 1 second, but DOES NOT block the rest of the loop!
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); 
  }

  // You can check for buttons here, and they will be instant!
}
```

## 4. Learning Resources (The "Why")

*   **Video:** [Arduino Interrupts Tutorial](https://www.youtube.com/watch?v=Qt_f776S_uE) - Visualizing the "stopping" of the main code.
*   **Video:** [Blink Without Delay](https://www.youtube.com/watch?v=6mInO89o6mU) - The most important coding pattern in Arduino.
*   **Article:** [Guide to Debouncing](https://www.ganssle.com/debouncing.htm) - A deep dive into why buttons are messy.

## Summary for the Assignment
You will implement a "Debounced Button Interrupt."
1.  Set up a button on an interrupt-capable pin.
2.  Write an ISR that increments a counter.
3.  Implement logic (using `millis()`) to ignore "bounces."
4.  Notice how much more responsive your code feels compared to using `delay()`.

---
**Senior Insight:** Interrupts are powerful but dangerous. If you have too many interrupts firing too fast, your main code will never run. This is called "Starvation." Use them for things that MUST happen immediately (like an Emergency Stop button).