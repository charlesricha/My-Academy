# Week 8: Phase 0 Final Project

## Overview
You’ve reached the summit of Phase 0. You've gone from understanding single bits to managing entire processes. The **Final Project** is not just an assignment; it is a rite of passage. You are going to build **The Creative Shell**—a stable, feature-rich command-line interface. This project will prove that you don't just "use" a computer; you understand how it works at its most fundamental level.

## Core Concepts

### 1. Robustness and Error Handling
A real tool doesn't crash. If a user enters a command that doesn't exist, your shell should print a helpful error and return to the prompt—not segfault. You must check every return value and handle edge cases (like empty input or multiple spaces).

### 2. Signal Handling
Ever wondered why `Ctrl+C` stops a program? That's a **Signal**. A professional shell needs to handle signals properly. For example, if a user hits `Ctrl+C` while a child process is running, only the *child* should stop, not your shell!

### 3. I/O Redirection (The "Extra Mile")
In Week 3, we used `>`. To implement this in your shell, you'll need to use the `dup2()` system call, which allows you to "redirect" a process's output stream into a file. This is the difference between a "toy" shell and a "tool" shell.

### 4. Memory Management
Your shell will likely run for hours. If you "leak" even a few bytes every time a user hits enter, the shell will eventually crash. Use tools like **Valgrind** to ensure your memory management is perfect.

## Code Examples

### Example 1: Handling Signals
Stop your shell from dying when the user hits `Ctrl+C`.

```c
#include <signal.h>
#include <stdio.h>

void handle_sigint(int sig) {
    // Just print a newline and a new prompt
    printf("\nCaught signal %d. Use 'exit' to quit.\ncreative-shell> ", sig);
    fflush(stdout);
}

int main() {
    // Register the signal handler
    signal(SIGINT, handle_sigint);
    
    // ... rest of your shell loop ...
}
```

### Example 2: Implementing Output Redirection (`>`)
A glimpse into how to handle `ls > files.txt`.

```c
#include <fcntl.h>
#include <unistd.h>

void redirect_output(char *filename) {
    // Open the file for writing (create if doesn't exist, truncate if it does)
    int fd = open(filename, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (fd == -1) {
        perror("open");
        return;
    }

    // Replace Standard Output (1) with our file descriptor
    dup2(fd, STDOUT_FILENO);
    close(fd);
}
```

## Common Mistakes
1. **The "Hardcoded" Limit**: Limiting user input to 100 characters. Use `getline`! Real commands (like those with many paths) can be very long.
2. **Ignoring `wait` Status**: Not checking *how* a child died. Did it exit normally? Did it crash? A good shell reports this.
3. **Leaking File Descriptors**: Opening files for redirection but forgetting to `close()` them. This will eventually hit the system's "open files" limit.
4. **Poor Prompt UX**: Not showing the current working directory in the prompt. Users get lost easily! Use `getcwd()` to make your prompt helpful.

## Mental Model
Think of your shell as a **Micro-Operating System**.
It is the middleman between the user's messy, unpredictable input and the Kernel's strict, logical interface. Your job is to be the **Perfect Translator**: taking human intent and turning it into successful system calls, while protecting the user from the "scary" parts of the hardware.

## Key Takeaways
- **User Experience** matters: Provide a clean prompt and helpful error messages.
- **Graceful Failure**: Never crash. Report the error and move on.
- **Resource Management**: Every `malloc` needs a `free`; every `open` needs a `close`.
- **Signals**: Manage how your shell reacts to the outside world (`Ctrl+C`, `Ctrl+D`).
- **The Shell is a Bridge**: You are connecting the User Space to the Kernel.

## What's Next
You've conquered the foundations. You understand the "How" and "Why" of computing. But to build the massive, complex systems of the future, you need more powerful tools. Next month, we move into **Phase 1: Core Programming Languages**, where we take the C logic you've mastered and apply it to the object-oriented worlds of **C++**, the automation power of **Python**, and the interactive engine of **JavaScript**.
