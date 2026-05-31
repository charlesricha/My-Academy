# Week 53: UART Communication

Today we're talking about the oldest and most common "language" in the embedded world: **UART** (Universal Asynchronous Receiver-Transmitter). If you've used `Serial.print()`, you've already used UART.

## 1. How it works (The Physical Layer)

UART uses two main wires:
*   **TX (Transmit):** Sends data.
*   **RX (Receive):** Receives data.

**Crucial Rule:** You must cross the wires. Your **TX** goes to the other device's **RX**, and vice versa. And you **must** connect the grounds (GND) so they have a common reference point. Without a shared ground, the devices have no way to agree on what "0 Volts" is.

## 2. "Asynchronous" - Why it's tricky

Unlike other protocols (I2C, SPI), UART has no "Clock" wire. This means the two devices aren't "synchronized" by a pulse. They have to agree on the timing beforehand.
This agreement is called the **Baud Rate**.
*   Common rates: 9600, 115200.
*   If Device A is at 9600 and Device B is at 115200, they will just receive "garbage" characters.

## 3. The Data Frame

When you send a character (like 'A'), UART wraps it in a "Frame":
1.  **Start Bit:** Pulls the line LOW to say "Hey, I'm talking!"
2.  **Data Bits:** Usually 8 bits (one byte).
3.  **Parity Bit:** (Optional) A simple error check.
4.  **Stop Bit:** Returns the line HIGH to say "I'm done."

## 4. Coding: Receiving Strings Safely

Don't use `Serial.readString()`. It's a "blocking" function that freezes your code. A senior engineer reads character by character.

```cpp
String inputString = "";
bool stringComplete = false;

void loop() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    } else {
      inputString += inChar;
    }
  }

  if (stringComplete) {
    Serial.print("Received command: ");
    Serial.println(inputString);
    
    if(inputString == "ON") digitalWrite(LED_PIN, HIGH);
    if(inputString == "OFF") digitalWrite(LED_PIN, LOW);

    // clear the string:
    inputString = "";
    stringComplete = false;
  }
}
```

## 5. Learning Resources (The "Why")

*   **Video:** [UART Explained](https://www.youtube.com/watch?v=IyGwvGzrqp8) - Excellent visual of the start/stop bits.
*   **Video:** [Serial Communication - RS232, UART, I2C, SPI](https://www.youtube.com/watch?v=n7u9Wv0Bno4) - A comparison of all major protocols.
*   **Article:** [Basics of UART Communication](https://www.circuitbasics.com/basics-uart-communication/) - A deep dive into the timing.

## Summary for the Assignment
In Wokwi, you'll have two Arduino/ESP32 boards talking to each other.
*   Board A reads a button and sends a command string (e.g., "ON\n").
*   Board B receives the string and toggles an LED.
*   **Troubleshooting:** If you see weird symbols, check your Baud rates!

---
**Senior Insight:** Never use `Serial.readString()` in a real project. It waits for a timeout (usually 1 second) and stops all your other code. Always use the character-by-character approach shown above.