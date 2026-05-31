# Week 7: Build Your Own Shell (Part 2)

## Overview
Last week, we built the "brain" of our shell: the loop that reads and parses input. This week, we build the "muscles." You will learn how to use **System Calls** to create new processes and execute external programs like `ls`, `grep`, or `gcc`. This is where you see the "Wall" between User Space and the Kernel (from Week 2) in action. By the end of this lesson, your shell will be a fully functional tool.

## Core Concepts

### 1. The `fork()` System Call
In Unix, you don't just "start" a new program. You **fork** an existing one. `fork()` creates an exact clone of your shell.
- The **Parent** gets the PID (Process ID) of the child.
- The **Child** gets `0`.
This allows the two processes to know who is who and perform different tasks.

### 2. The `execvp()` System Call
Once you have a child process, you use `execvp()` to "transform" that child into a different program. `execvp` wipes the child's memory and loads a new program (like `ls`) into it. If `execvp` succeeds, it *never returns* because the original code is gone!

### 3. The `wait()` System Call
The parent shell shouldn't just keep going while the child is running; it needs to **wait** for the child to finish so it can print the next prompt. `wait()` puts the parent to sleep until the child exits.

### 4. Environment and the PATH
How does the OS know where `ls` lives? It looks in a variable called `PATH`. `execvp` is smart—it automatically searches the directories in your `PATH` (like `/bin` or `/usr/bin`) to find the executable for you.

## Code Examples

### Example 1: The Fork-Exec-Wait Pattern
This is the "Holy Trinity" of Unix process management.

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

void execute_command(char **args) {
    pid_t pid = fork();

    if (pid < 0) {
        // Fork failed
        perror("fork");
    } else if (pid == 0) {
        // I am the CHILD
        // Try to execute the command
        if (execvp(args[0], args) == -1) {
            perror("shell"); // Error if command not found
        }
        exit(EXIT_FAILURE); // Kill the child if exec fails
    } else {
        // I am the PARENT
        int status;
        waitpid(pid, &status, 0); // Wait for the specific child
    }
}
```

### Example 2: Implementing `cd` (A Built-in)
External programs cannot change the directory of your shell. To change directories, the shell must do it itself using the `chdir()` system call.

```c
void builtin_cd(char **args) {
    if (args[1] == NULL) {
        fprintf(stderr, "shell: expected argument to \"cd\"\n");
    } else {
        if (chdir(args[1]) != 0) {
            perror("shell");
        }
    }
}
```

## Common Mistakes
1. **The Fork Bomb**: Calling `fork()` in an infinite loop without a way to exit. This will create thousands of processes and crash your computer. **Save your work before testing fork!**
2. **Forgetting to `exit()` in the Child**: If `execvp` fails and you don't call `exit()`, you will have two identical shells running at the same time, both trying to read from the terminal. Chaos ensues.
3. **Trying to `exec` a Built-in**: You cannot use `execvp` for `cd`. `cd` changes the process's current working directory. If a child process runs `cd`, it changes *its* directory, then dies, and the parent shell is still in the old directory.
4. **Zombies**: Not calling `wait()`. When a child dies, it stays in a "Zombie" state until the parent acknowledges its death. Too many zombies will eventually hit the process limit.

## Mental Model
Imagine **Cell Division (Mitosis)**.
- **Fork**: Your shell cell splits into two identical cells.
- **Exec**: One of those cells suddenly transforms into a completely different organism (a "ls" organism).
- **Wait**: The original cell stays still until the new organism finishes its job and disappears.

## Key Takeaways
- `fork()` creates a clone; `execvp()` replaces that clone with a new program.
- The Parent must `wait()` for the Child to prevent zombies and overlapping input.
- **Built-in commands** (like `cd` and `exit`) must be handled directly by the parent.
- `execvp` uses the `PATH` environment variable to find programs.
- Always check the return value of `fork()` and `execvp()`.

## What's Next
Congratulations! You now have the knowledge to build a real, working CLI. Next week is your **Phase 0 Final Project**. You will take everything from the last 7 weeks—bits, memory, bash, and C—and deliver a polished, robust shell that you could actually use in your day-to-day work.
