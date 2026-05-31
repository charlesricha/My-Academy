# Week 1: Binary, Hex, and Logic Gates

## Overview
Computers are, at their heart, incredibly fast but incredibly simple machines. They don't understand text, images, or "if" statements; they only understand electricity—specifically, whether a circuit is open or closed. Every abstraction you will ever use, from React components to Machine Learning models, is built upon this binary foundation. Understanding how we map human logic to physical bits is the first step in becoming a developer who truly knows how their tools work under the hood.

## Core Concepts

### 1. The Binary System (Base-2)
In our daily lives, we use **Decimal** (Base-10), likely because we have ten fingers. In a computer, we use **Binary** (Base-2) because transistors have two states: **On** (1) or **Off** (0).
- Each 1 or 0 is a **Bit** (Binary Digit).
- To represent numbers larger than 1, we use positional notation. In decimal, the positions are $10^0, 10^1, 10^2$. In binary, they are $2^0, 2^1, 2^2, 2^3$ (1, 2, 4, 8, 16, 32...).
- For example, `1011` in binary is $(1 \times 8) + (0 \times 4) + (1 \times 2) + (1 \times 1) = 11$ in decimal.

### 2. Hexadecimal (Base-16): The Developer's Shorthand
Binary is hard for humans to read. A 32-bit address like `11001010111111101011101010111110` is a nightmare to debug. **Hexadecimal** (Hex) solves this by grouping bits into sets of four.
- Hex uses 0-9 and then A-F ($A=10, F=15$).
- One Hex digit represents exactly **4 bits** (a nibble). Two Hex digits represent **8 bits** (a Byte).
- The binary `1100 1010` becomes `CA` in Hex ($1100=12/C$, $1010=10/A$). Developers use `0x` as a prefix (e.g., `0xCAFE`) to signal that a number is in Hex.

### 3. Logic Gates: The Physics of Thinking
Logic gates are physical arrangements of transistors that perform boolean logic. They are the "neurons" of the CPU.
- **AND**: Only outputs 1 if both inputs are 1. Think of it as a series circuit with two switches.
- **OR**: Outputs 1 if either (or both) inputs are 1. Think of it as a parallel circuit.
- **NOT**: Inverts the signal (0 becomes 1).
- **XOR (Exclusive OR)**: Outputs 1 if the inputs are *different*. This is crucial for arithmetic circuits like adders.

## Code Examples

### Example 1: Basic Bitwise Operations in C
In C, we can manipulate bits directly using bitwise operators. This is how you interact with hardware or optimize performance-critical code.

```c
#include <stdio.h>

int main() {
    unsigned char a = 5;      // Binary: 0000 0101
    unsigned char b = 3;      // Binary: 0000 0011

    // Bitwise AND (&)
    // 0101 & 0011 = 0001 (Decimal 1)
    printf("AND: %d\n", a & b);

    // Bitwise OR (|)
    // 0101 | 0011 = 0111 (Decimal 7)
    printf("OR: %d\n", a | b);

    // Bitwise XOR (^)
    // 0101 ^ 0011 = 0110 (Decimal 6)
    printf("XOR: %d\n", a ^ b);

    return 0;
}
```

### Example 2: Bit Shifting and Masks
Bit shifting moves bits left or right. A "mask" is a value used to extract specific bits from a larger number.

```c
#include <stdio.h>

int main() {
    // 0xAB is 1010 1011 in binary
    unsigned char val = 0xAB;

    // Extract the high nibble (1010)
    // Shift right by 4: 1010 1011 >> 4 = 0000 1010
    unsigned char high = val >> 4;
    printf("High nibble (Hex): %X\n", high); // Outputs: A

    // Extract the low nibble (1011) using a mask (0x0F = 0000 1111)
    // 1010 1011 & 0000 1111 = 0000 1011
    unsigned char low = val & 0x0F;
    printf("Low nibble (Hex): %X\n", low);  // Outputs: B

    return 0;
}
```

## Common Mistakes
1. **Confusing Logical vs. Bitwise Operators**: Using `&&` (Logical AND) instead of `&` (Bitwise AND). `5 && 3` is `true` (1), but `5 & 3` is `1`. This causes bugs that are notoriously hard to track down.
2. **Signedness Issues**: Shifting signed integers (like `int`) can behave unexpectedly because the leftmost bit (the sign bit) might be preserved or duplicated (Arithmetic vs. Logical shift). Always use `unsigned` types for bit manipulation.
3. **Miscounting Bits**: Forgetting that bits are almost always 0-indexed. The "first" bit is bit 0, not bit 1.
4. **Hex-Decimal Confusion**: Thinking `0x10` is 10. It's actually 16. Always double-check your prefixes.

## Mental Model
Imagine a **panel of light switches**.
- **Binary** is the state of the switches (Up/Down).
- **Hex** is just a way to group those switches into "zones" so you can describe the whole panel without listing every single switch.
- **Logic Gates** are the "wiring" behind the panel that makes one light turn on only if two specific switches are flipped.

## Key Takeaways
- **Binary** is the language of hardware; **Hex** is the shorthand for developers.
- A **Byte** is 8 bits, and its maximum value is 255 (`0xFF`).
- **Bitwise operators** (`&`, `|`, `^`, `~`, `<<`, `>>`) allow you to manipulate data at the most granular level.
- **XOR** is a "difference detector"—it's only 1 when inputs don't match.
- Always use `unsigned` types when you are "thinking in bits."

## What's Next
Now that you understand how a single program represents its data, we need to look at the "office space" where that data lives. Next week, we’ll dive into **Memory, Storage, and OS Basics**, where you'll learn how the Operating System manages millions of these bits across your RAM and Hard Drive without them crashing into each other.
