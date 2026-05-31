# Week 6: Build Your Own Shell (Part 1)

## Overview
For the last five weeks, you've learned about bits, memory, the terminal, and compilers. Now, it's time to bring it all together. You are going to build a **Shell**—the very program you've been using to navigate your computer. A shell is simply a loop that waits for user input, parses it, and executes it. This week, we focus on the "Frontend" of the shell: the **Read-Eval Loop** and basic command parsing.

## Core Concepts

### 1. The REPL (Read-Eval-Print Loop)
Every shell is essentially a `while(1)` loop.
- **Read**: Get a line of input from the user.
- **Eval**: Figure out what the user wants to do (Parse).
- **Print**: Show any output or error messages.
- **Loop**: Go back to the prompt and wait again.

### 2. Tokenization: Breaking Down the Input
When a user types `ls -l /home/user`, the shell sees a single string. To execute this, you must break it into "tokens":
1. `ls` (The command)
2. `-l` (The first argument)
3. `/home/user` (The second argument)
In C, we use `strtok` (String Tokenizer) to split strings based on delimiters like spaces.

### 3. Built-in Commands vs. External Commands
- **Built-ins**: Commands that the shell handles itself (e.g., `exit`, `help`, `cd`). These don't require creating a new process.
- **External**: Programs that live on the disk (e.g., `ls`, `grep`, `python`). To run these, the shell must find them and "launch" them.

### 4. The `getline()` Function
Reading input in C can be dangerous (buffer overflows!). Modern C provides `getline()`, which automatically allocates enough memory to hold whatever the user types, no matter how long it is.

## Code Examples

### Example 1: The Core Shell Loop
This is the skeleton of your project.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    char *line = NULL;
    size_t len = 0;
    ssize_t read;

    while (1) {
        printf("creative-shell> ");
        
        // Read input
        read = getline(&line, &len, stdin);
        
        // Handle Ctrl+D (EOF)
        if (read == -1) {
            printf("\nExiting...\n");
            break;
        }

        // Remove the newline character at the end
        if (line[read - 1] == '\n') line[read - 1] = '\0';

        // EVAL: Handle "exit" built-in
        if (strcmp(line, "exit") == 0) {
            break;
        }

        printf("You typed: %s\n", line);
    }

    free(line); // Clean up!
    return 0;
}
```

### Example 2: Basic Tokenization
Splitting the user's input into a command and arguments.

```c
#include <stdio.h>
#include <string.h>

void parse_input(char *line) {
    char *tokens[64];
    int i = 0;

    // Get the first token
    char *token = strtok(line, " ");
    
    while (token != NULL) {
        tokens[i++] = token;
        token = strtok(NULL, " "); // Get next token
    }
    tokens[i] = NULL; // Null-terminate the list

    if (tokens[0] != NULL) {
        printf("Command: %s\n", tokens[0]);
        for (int j = 1; j < i; j++) {
            printf("Arg %d: %s\n", j, tokens[j]);
        }
    }
}
```

## Common Mistakes
1. **The Newline Trap**: `getline` includes the `\n` character at the end of the string. If you don't remove it, `strcmp(line, "exit")` will always be false!
2. **Memory Leaks**: Calling `getline` in a loop and never freeing the pointer. `getline` reuses the buffer, but you still need to free it when the shell exits.
3. **Empty Input**: Your shell will crash if the user just hits "Enter" unless you check if the first token is `NULL`.
4. **Buffer Overflows**: Using `scanf` or `gets` instead of `getline`. Never use `gets` in production—it's the #1 source of security vulnerabilities.

## Mental Model
Imagine your shell is a **Waiter in a restaurant**.
1. **Read**: The waiter listens to your order ("I want a burger, no onions").
2. **Eval**: The waiter parses the order. They realize "Burger" is the command and "No onions" is the argument.
3. **Print**: The waiter tells the kitchen (The Kernel) what to do.
4. **Loop**: The waiter comes back and asks, "Anything else?"

## Key Takeaways
- A shell is a continuous **REPL** loop.
- **Tokenization** turns a single string into an array of commands and arguments.
- **Built-in commands** are executed directly by your code.
- Always handle the **EOF (Ctrl+D)** signal so your shell can exit gracefully.
- Use `getline()` for safe, dynamic input reading.

## What's Next
You have a shell that can talk to you, but it can't actually *do* anything yet. Next week, in **Part 2**, we dive into the heavy lifting: using `fork` and `exec` to launch real programs and using **Pipes** to make them talk to each other.
