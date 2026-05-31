# Week 3: The Terminal & Bash Scripting

## Overview
The Graphical User Interface (GUI) was built for consumers; the **Command Line Interface (CLI)** was built for creators. As a software engineer, the terminal is your primary interface for interacting with the operating system, managing servers, and automating your workflow. If you can't use the terminal, you are effectively working with one hand tied behind your back. This week is about moving beyond "clicking" and starting to "command."

## Core Concepts

### 1. The Shell vs. The Terminal
New devs often use these terms interchangeably, but they are distinct:
- **The Terminal**: The application that handles the window, the text rendering, and the keyboard input (e.g., Windows Terminal, iTerm2, Alacritty).
- **The Shell**: The program running *inside* the terminal that reads your commands and executes them (e.g., Bash, Zsh, Fish).

### 2. Streams: Everything is a File
In Unix-like systems (Linux/macOS), almost everything is treated as a file. Every command has three default "streams":
- **Standard Input (stdin)**: Where the command gets its data (usually the keyboard).
- **Standard Output (stdout)**: Where the command sends its results (usually the screen).
- **Standard Error (stderr)**: Where the command sends error messages.

### 3. Piping and Redirection: The Power of Composition
The real power of the CLI is **Piping (`|`)**. It allows you to take the `stdout` of one command and plug it directly into the `stdin` of another.
- `cat data.txt | grep "Error" | wc -l`: This reads a file, finds lines with "Error", and counts them.
- **Redirection (`>`, `>>`)**: Sends output to a file instead of the screen. `>` overwrites, `>>` appends.

### 4. Bash Scripting: The Glue of Engineering
A Bash script is just a file containing a sequence of commands. It's used to automate anything that takes more than 30 seconds to do manually.
- **Variables**: No spaces around the `=`! `NAME="Creative"` is correct; `NAME = "Creative"` will fail.
- **Conditionals**: Syntax is picky. Use `[[ ... ]]` for modern Bash tests.
- **Loops**: Perfect for batch-processing files.

## Code Examples

### Example 1: Basic Redirection and Piping
This is a "one-liner" that a dev might use to audit a log file.

```bash
# 1. Create a dummy log file
echo "ERROR: Database timeout" > app.log
echo "INFO: User logged in" >> app.log
echo "ERROR: Null pointer exception" >> app.log

# 2. Find all errors and save them to a new file
# 'grep' searches, 'sort' organizes, '>' saves
grep "ERROR" app.log | sort > errors_only.txt

# 3. View the result
cat errors_only.txt
```

### Example 2: A Practical Automation Script
This script automates the creation of a new project folder structure.

```bash
#!/bin/bash

# Check if a project name was provided
if [ -z "$1" ]; then
    echo "Usage: ./new_project.sh [project_name]"
    exit 1
fi

PROJECT_NAME=$1

echo "Creating project: $PROJECT_NAME..."

# Create folders
mkdir -p "$PROJECT_NAME"/{src,docs,tests}

# Create a boilerplate README
echo "# $PROJECT_NAME" > "$PROJECT_NAME/README.md"
echo "Project created on $(date)" >> "$PROJECT_NAME/README.md"

# Success message
echo "Done! Run 'cd $PROJECT_NAME' to start."
```

## Common Mistakes
1. **Space Sensitivity**: Putting spaces around the equals sign in variable assignments (`VAR = 10` is an error; it tries to run a command named `VAR`).
2. **Permissions**: Trying to run a script and getting "Permission Denied." You must make it executable first: `chmod +x script.sh`.
3. **The "rm -rf" Disaster**: Running `rm -rf /` or `rm -rf ./*` (with a space between `.` and `/`). The CLI does not have an "Undo" or a "Recycle Bin." When it's gone, it's gone.
4. **Not Quoting Variables**: If a variable contains a space (like a filename), using `$FILE` will break. Always use `"$FILE"`.

## Mental Model
Imagine the terminal as **Lego bricks**.
Each command (`ls`, `grep`, `mkdir`) is a single, specialized brick that does one thing perfectly. By using **Piping**, you are snapping these bricks together to build a complex machine. You don't need one giant "Do Everything" command; you just need to know how to connect the small ones.

## Key Takeaways
- **The Shell** is your interface to the OS Kernel.
- **Piping (`|`)** is the secret to CLI efficiency; it chains inputs and outputs.
- **Redirection (`>`)** is for saving output to files.
- **Bash Scripts** are for automating repetitive tasks.
- Always use **Tab Completion**—if you're typing every character, you're doing it wrong.

## What's Next
You can now navigate the computer and automate tasks. But as you write more scripts and code, you'll need a way to track changes and collaborate with others without overwriting each other's work. Next week, we dive into **Git From Scratch**, the industry standard for "time travel" in your codebase.
