# Week 5: How Compilers Work

## Overview
As a developer, you write code in high-level languages like C, Python, or JavaScript. But as we learned in Week 1, the CPU only understands binary. The **Compiler** is the sophisticated translator that bridges this gap. It doesn't just "translate" line-by-line; it analyzes your entire program, optimizes it for performance, and ensures it follows the rules of the language before a single bit is ever executed. Understanding this process is the key to writing code that is not just correct, but performant and efficient.

## Core Concepts

### 1. The Compilation Pipeline
Compilation isn't one single step; it's a multi-stage factory line:
- **Preprocessing**: Handles directives like `#include` and `#define`. It's essentially a "find and replace" engine.
- **Lexical Analysis (Tokenizing)**: Breaks your code into "tokens" (keywords, operators, identifiers).
- **Syntax Analysis (Parsing)**: Checks if your tokens form a valid "sentence." It builds an **Abstract Syntax Tree (AST)**.
- **Semantic Analysis**: Checks if the "sentence" actually makes sense (e.g., are you trying to add a string to an integer?).
- **Optimization**: Rearranges and simplifies your code to make it faster without changing the result.
- **Code Generation**: Translates the optimized logic into **Assembly** or **Machine Code**.

### 2. Interpreters vs. Compilers
- **Compilers (e.g., C, C++, Rust)**: Translate the *entire* program into a standalone binary file before you run it. This makes the execution extremely fast.
- **Interpreters (e.g., Python, Ruby)**: Read and execute the code line-by-line. This makes development faster but execution slower.
- **JIT (Just-In-Time) Compilers (e.g., JavaScript/V8)**: A hybrid approach that compiles code *while* it's running for a balance of speed and flexibility.

### 3. The Abstract Syntax Tree (AST)
The AST is the most important concept in compilation. It is a tree representation of the structure of your code. If your code is "broken," it's usually because the compiler couldn't build a valid tree from your text.

### 4. Linking
Compiling a file only creates an "object file." **Linking** is the final step that stitches all your object files together (and connects them to external libraries) to create a single, executable file.

## Code Examples

### Example 1: The Preprocessor in Action
You can see what the preprocessor does in C by using the `-E` flag with `gcc`.

```c
// main.c
#define MAX_POWER 9000
#include <stdio.h>

int main() {
    printf("Power level: %d\n", MAX_POWER);
    return 0;
}
```

*Command:* `gcc -E main.c`
*Output (Simplified):* The preprocessor will replace `MAX_POWER` with `9000` and paste the entire contents of `stdio.h` into your file before the compiler even sees it.

### Example 2: Exploring Assembly
If you want to see the "Code Generation" step, you can ask the compiler for the Assembly code.

```bash
# Compile to assembly
gcc -S main.c
```

*Output (main.s):*
```assembly
movl    $9000, %esi    # Move 9000 into a register
leaq    L_.str(%rip), %rdi # Load the string address
callq   _printf        # Call the print function
```

## Common Mistakes
1. **Confusing Syntax vs. Semantic Errors**: A syntax error is like saying "Dog the blue is." A semantic error is like saying "The blue dog is a vegetable." Syntax errors happen during parsing; semantic errors happen during type-checking.
2. **Missing Header Files**: Forgetting to `#include <stdio.h>` but trying to use `printf`. The compiler won't know what `printf` is.
3. **Linker Errors**: Your code compiles fine, but you get a "Symbol not found" error at the end. This usually means you declared a function but never actually wrote the code for it (or didn't link the right library).
4. **Trusting "Dead" Code**: Writing code after a `return` statement. The compiler's optimization phase will often just delete this code entirely because it can never be reached.

## Mental Model
Imagine the compiler is a **Master Translator** for a foreign head of state.
- **Preprocessing**: The translator fixes typos and prepares the documents.
- **Parsing**: The translator ensures the grammar is perfect.
- **Semantic Analysis**: The translator checks that the speech doesn't have logical contradictions.
- **Optimization**: The translator makes the speech more concise and impactful.
- **Code Generation**: The translator delivers the speech in the target language (Binary).

## Key Takeaways
- Compilers turn human-readable code into **Machine Code**.
- The **AST** is the bridge between text and logic.
- **C** is a compiled language; **Python** is an interpreted one.
- **Linking** is the final "glue" that creates an executable.
- Most "magic" in your code (like constants and macros) happens in the **Preprocessor**.

## What's Next
Now that you know how a compiler turns your code into a program, it's time to build a program that *runs* other programs. Next week, we start our two-part journey into building your own **CLI Shell**, where you will apply everything you've learned about processes, memory, and system calls.
