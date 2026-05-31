# Week 2: Memory, Storage, and OS Basics

## Overview
Writing code is only half the battle; knowing where that code lives while it's running is what separates a coder from an engineer. Every variable you declare and every function you call consumes a piece of physical hardware. The **Operating System (OS)** is the master conductor that manages this hardware, ensuring your program has the resources it needs while preventing it from destroying others. This week is about understanding the "landscape" your code inhabits.

## Core Concepts

### 1. The Volatility Gap: RAM vs. Storage
Think of **RAM (Memory)** as your desk and **Storage (SSD/HDD)** as a filing cabinet in the basement.
- **RAM** is extremely fast but "volatile"—if the power cuts, the data vanishes. The CPU can only work with data that is currently in RAM.
- **Storage** is slow but persistent. When you "run" a program, the OS copies it from the filing cabinet (Storage) onto your desk (RAM) so the CPU can start reading the instructions.

### 2. The Program Memory Layout
When the OS loads your program into RAM, it doesn't just throw it in a pile. It organizes it into a very specific structure:
- **Text Segment**: The actual machine code (the 1s and 0s from Week 1). Usually read-only to prevent a program from accidentally overwriting its own logic.
- **Data Segment**: Holds global and static variables that exist for the entire life of the program.
- **The Stack**: A fast, "Last-In, First-Out" (LIFO) structure used for local variables and function calls. Every time you call a function, a "frame" is pushed onto the stack. When the function returns, the frame is popped off.
- **The Heap**: A large pool of memory used for **Dynamic Allocation**. If you don't know how much memory you'll need until the program is actually running (like loading a user's profile picture), you ask for it on the Heap.

### 3. The Kernel: The God Program
The **Kernel** is the core of the OS. It has absolute power over the hardware. Your code (User Space) cannot talk to the hard drive or the screen directly; it must ask the Kernel for permission via a **System Call**. This "wall" protects the system from buggy or malicious code.

### 4. Processes vs. Threads
- A **Process** is an instance of a running program. It has its own isolated memory space. If Chrome crashes, it doesn't take Spotify with it because they are separate processes.
- A **Thread** is a unit of execution *inside* a process. Threads share the same memory. This makes them "lightweight" and fast to communicate, but dangerous—if one thread messes up a variable, it messes it up for all threads in that process.

## Code Examples

### Example 1: Stack vs. Heap in C
Understanding which memory you are using is critical for preventing crashes and memory leaks.

```c
#include <stdio.h>
#include <stdlib.h>

void stack_example() {
    // This variable is on the STACK.
    // It is automatically destroyed when this function ends.
    int local_var = 10;
    printf("Stack var: %d\n", local_var);
}

int main() {
    stack_example();

    // This variable is on the HEAP.
    // We must manually ask for memory using malloc().
    int *heap_var = (int*)malloc(sizeof(int));
    
    if (heap_var == NULL) return 1; // Always check if allocation failed!

    *heap_var = 42;
    printf("Heap var: %d\n", *heap_var);

    // CRITICAL: We must manually free heap memory!
    free(heap_var);

    return 0;
}
```

### Example 2: The Cost of Context Switching
Processes are isolated, which is safe but expensive. Moving data between them requires the OS to step in.

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    int x = 100;

    // fork() creates a new PROCESS.
    // The child gets a COPY of the parent's memory.
    pid_t pid = fork();

    if (pid == 0) {
        // I am the Child Process
        x = 200; // This only changes the child's copy!
        printf("Child x: %d\n", x);
    } else {
        // I am the Parent Process
        wait(NULL); // Wait for child to finish
        printf("Parent x: %d\n", x); // x is still 100!
    }

    return 0;
}
```

## Common Mistakes
1. **The "Dangling Pointer"**: Freeing memory on the heap and then trying to use it again. This is like trying to enter a house after you've handed back the keys.
2. **Stack Overflow**: Creating an array that's too big (e.g., `int arr[10000000]`) or having an infinite recursion. The stack is small; the heap is big.
3. **Memory Leaks**: Calling `malloc` but never calling `free`. Over time, your program will eat all the available RAM and the OS will eventually kill it.
4. **Ignoring Return Values**: Assuming `malloc` or `fork` always worked. In a busy system, they can fail. Always check.

## Mental Model
Imagine the computer as a **Professional Kitchen**.
- **RAM** is the **Countertop**. It's where the chef actually chops the vegetables. Space is limited, but everything is within reach.
- **Storage** is the **Pantry**. It holds everything, but it takes time to go get it.
- **The OS Kernel** is the **Head Chef**. He decides who gets which burner and ensures no one spills soup on someone else's station.
- **The Stack** is the **Order Spindle**. Orders come in, get finished, and get tossed.
- **The Heap** is the **Walk-in Fridge**. You go there for big, custom items that don't fit on the counter.

## Key Takeaways
- **Memory (RAM)** is for active data; **Storage** is for long-term data.
- **The Stack** is for small, short-lived variables; **The Heap** is for large, dynamic data.
- **Processes** are isolated; **Threads** share memory.
- **System Calls** are how your program asks the OS for hardware resources.
- Manual memory management in C requires you to `free` what you `malloc`.

## What's Next
Now that you know how the OS manages memory and processes, it's time to learn how to talk to that OS directly. Next week, we’ll move into **The Terminal & Bash Scripting**, where you'll stop using a mouse and start using the command line to command the Kernel like a pro.
