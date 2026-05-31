# Week 45: Electronics Basics

Welcome to the world of hardware. If you've spent all your time in code, this is where things get real—and where you can actually let the "magic smoke" out of a component if you aren't careful. As a senior engineer, I've seen many brilliant coders struggle here because they treat hardware like software. Hardware doesn't have "undo" buttons.

## 1. The Big Three: Voltage, Current, and Resistance

Think of electricity like water flowing through a pipe.

### Voltage (V) - Measured in Volts
Voltage is the **pressure**. It's the potential energy that wants to push electrons through a circuit. In our IoT world, we usually work with 3.3V or 5V. 
*   **Pro Tip:** High voltage isn't always what kills components; it's the pressure that forces too much current through them.

### Current (I) - Measured in Amperes (Amps)
Current is the **flow rate**. It's the actual number of electrons moving past a point. Most small sensors use milliamperes (mA). 1A = 1000mA.
*   **The Trap:** A power supply might say "5V 2A". This doesn't mean it *pushes* 2A into your circuit. It means it *can provide up to* 2A. The circuit *draws* what it needs.

### Resistance (R) - Measured in Ohms (Ω)
Resistance is the **restriction**. It's the narrowness of the pipe. Components like resistors are used specifically to limit current.

## 2. Ohm's Law: The Only Equation You *Must* Know

**V = I × R**

This is the bedrock of electronics. If you know two, you can find the third.
*   If you have a 5V source and a 220Ω resistor, the current is $I = V / R = 5 / 220 \approx 22mA$.
*   This is crucial for not blowing up LEDs.

### Deep Dive: Why do we need resistors?
Imagine an LED is a delicate glass ornament. If you throw a high-pressure firehose (direct 5V battery) at it without a "restriction" (resistor), it will shatter. The resistor "absorbs" the extra pressure so only a gentle stream reaches the LED.

## 3. Basic Components

### Resistors
They limit current. They have color bands that tell you their value. 
*   **Pull-up/Pull-down resistors:** You'll use these constantly with buttons to ensure a pin isn't "floating" (stuck in an unknown state between 0 and 1).

### LEDs (Light Emitting Diodes)
Diodes only allow current to flow in **one direction**. 
*   **Anode (Long leg):** Positive (+)
*   **Cathode (Short leg):** Negative (-)
*   **Never** connect an LED directly to power without a resistor. It will try to draw infinite current and burn out instantly.

### Breadboards
These are for prototyping without soldering.
*   **Power Rails:** The long lines on the sides (usually marked + and -). They run vertically.
*   **Terminal Strips:** The holes in the middle. They are connected horizontally in rows of 5.

## 4. Safety and Best Practices

1.  **Check your polarity:** Connecting VCC (power) to GND (ground) is a "short circuit." It can kill your USB port or your microcontroller.
2.  **Power down before changing wires:** Don't move components while the board is plugged in.
3.  **The "One Hand" Rule:** When working with higher voltages (not applicable to our 5V stuff yet, but good habit), keep one hand in your pocket so current doesn't travel through your heart if you get shocked.

## 5. Learning Resources (The "Why")

*   **Video:** [Voltage, Current, Resistance & Ohm's Law](https://www.youtube.com/watch?v=J4Vq-xHqUo8) - A visual explanation of the water pipe analogy.
*   **Video:** [How to use a Breadboard](https://www.youtube.com/watch?v=6WReFkfrUIk) - Essential for physically building your circuits.
*   **Interactive:** [EveryCircuit](http://everycircuit.com/) - A simulator that shows "moving dots" representing electrons. Great for building a mental model.

## Summary for the Assignment
For your Wokwi assignment, you'll be building a simple circuit with an LED and a button.
*   **Logic:** When the button is pressed, it completes the circuit (closes the switch), allowing current to flow from the power source, through the resistor, through the LED, and into the ground.
*   **Goal:** Understand how the physical connection enables the flow of electrons.

---
**Next Step:** Once you're comfortable with the flow of electricity, we'll start adding "brains" (microcontrollers) to read these signals.