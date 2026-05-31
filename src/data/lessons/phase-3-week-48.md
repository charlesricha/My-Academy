# Week 48: Circuit Diagrams

You can write the best code in the world, but if your wiring is a "spaghetti mess," your project will fail. This week is about **communication**—not between chips, but between humans. 

We use **Schematics** and **Circuit Diagrams**.

## 1. Why Diagrams Matter?

Imagine trying to build a house by just looking at a photo of the finished building. You'd have no idea where the pipes and wires are.
A schematic is the "blueprint" of your electronics.
*   **Documentation:** So you remember how it works 6 months later.
*   **Collaboration:** So another engineer can understand your work.
*   **Debugging:** It's much easier to find a logic error on paper than in a tangled mess of wires.

## 2. Common Symbols

You need to recognize these instantly:
*   **VCC / Power:** A line with a voltage label (e.g., +5V) or a battery symbol.
*   **GND / Ground:** A set of horizontal lines tapering down. This is the common return path.
*   **Resistor:** A zig-zag line or a rectangle.
*   **Capacitor:** Two parallel lines.
*   **LED:** A triangle hitting a line, with two small arrows pointing away (light).
*   **Switch/Button:** A break in the line with a "lever."

## 3. Schematic vs. Physical Layout

This is a major point of confusion. 
*   **Physical Layout (Wiring Diagram):** Shows where things are physically (like a picture of a breadboard). This is what Fritzing does.
*   **Schematic:** Shows logical connections. It ignores where the components sit on the desk and focuses on the "signal flow."
    *   **Senior Convention:** Inputs on the left, outputs on the right. Power at the top, Ground at the bottom.

## 4. Net Names and Buses

In complex circuits, we don't draw long lines across the whole page. That's messy.
Instead, we use **Net Names**. 
*   If two wires are both labeled `SENSOR_DATA`, they are connected, even if there's no line between them.
*   A **Bus** is a thick line representing multiple related signals (like an 8-bit data path).

## 5. Learning Resources (The "Why")

*   **Video:** [How to Read a Schematic](https://www.youtube.com/watch?v=9cps7Q_IrX0) - A beginner-friendly guide to the symbols.
*   **Video:** [EEVblog #1097 - Introduction to KiCad](https://www.youtube.com/watch?v=mD0V_I8DOnI) - A look at how professionals design real circuit boards.
*   **Reference:** [Common Schematic Symbols](https://www.sparkfun.com/datasheets/RefDesign/Schematic_Symbols.pdf) - A handy cheat sheet by SparkFun.

## 6. How to Read a Datasheet

Every component has a "Manual" called a datasheet. 
When you look at a datasheet for a chip (like an ESP32), look for the **Pinout Diagram**. It tells you:
1.  Which pin is Power (VCC).
2.  Which pin is Ground (GND).
3.  Which pins are I/O (Input/Output).
4.  **Absolute Maximum Ratings:** If it says "Max Voltage: 6V" and you give it 9V, it will die. **Real engineers always check this first.**

## Summary for the Assignment
Your task is to document the pinout of 3 components you've used (LED, Button, DHT22, or Servo).
*   Don't just draw what it looks like.
*   Identify every pin and its function.
*   Explain why it's connected where it is.

---
**Senior Pro-Tip:** When drawing, always keep your Ground (GND) lines pointing **down** and your Power (VCC) lines pointing **up**. It makes the diagram much easier to "read" at a glance. Just like reading a map—North is always up.