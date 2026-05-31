# Week 12: C++: File I/O & Errors

## 1. Overview (Why This Exists)
Up until now, your programs have been "amnesiacs." Every time you closed the terminal, your variables, scores, and objects vanished into the void of cleared RAM. In the real world, data must persist. Whether it's a save-game file, a configuration setting, or a massive database, you need to know how to talk to the **File System**. Furthermore, the real world is messy—files go missing, disks get full, and users provide bad data. This week is about **Persistence** and **Resilience**: learning how to save your work and how to handle errors gracefully so your program doesn't just crash when the "unhappy path" occurs.

## 2. Core Concepts

### 1. Streams: The Unified Interface
In C++, we use the same "stream" concept for files that we use for the terminal (`cout`/`cin`).
- **`ifstream`**: Input File Stream (Reading).
- **`ofstream`**: Output File Stream (Writing).
- **`fstream`**: Both Reading and Writing.
A file is just a sequence of bytes. C++ abstracts this so you can use the `<<` and `>>` operators you already know.

### 2. Text vs. Binary Files
- **Text Files**: Human-readable. Numbers are stored as strings (e.g., the number `123` is stored as characters '1', '2', '3'). Great for configuration and logs.
- **Binary Files**: Machine-readable. Data is dumped directly from RAM to the disk exactly as it is (the bits we studied in Week 1). Smaller, faster, and more secure, but you can't open them in Notepad.

### 3. RAII and File Handles
When you open a file, the OS gives you a "File Handle." This is a limited resource. C++ uses **RAII** (Resource Acquisition Is Initialization) to manage this. When your `fstream` object goes out of scope, its destructor automatically closes the file. No more "File already in use" bugs!

### 4. Error Handling: Exceptions
C++ uses `try`, `throw`, and `catch` to handle errors.
- **`throw`**: Signals that something went wrong (e.g., "File not found").
- **`try`**: A block of code where you expect something *might* go wrong.
- **`catch`**: The "safety net" that catches the thrown error and handles it without crashing the entire program.

## 3. Code Examples

### Example 1: Basic Text File Writing and Reading
The simplest way to save and load state.

```cpp
#include <iostream>
#include <fstream>
#include <string>

int main() {
    // 1. Writing to a file
    std::ofstream outFile("savegame.txt");
    if (outFile.is_open()) {
        outFile << "PlayerName: Slayer" << std::endl;
        outFile << "Score: 5000" << std::endl;
        outFile.close(); // Optional, destructor will also do this
    }

    // 2. Reading from a file
    std::ifstream inFile("savegame.txt");
    std::string line;
    if (inFile.is_open()) {
        while (std::getline(inFile, line)) {
            std::cout << "Read from file: " << line << std::endl;
        }
    } else {
        std::cerr << "Error: Could not open file for reading." << std::endl;
    }

    return 0;
}
```

### Example 2: Robust Error Handling with Exceptions
How to handle the "unhappy path" properly.

```cpp
#include <iostream>
#include <fstream>
#include <stdexcept>

float divide(float a, float b) {
    if (b == 0) {
        throw std::runtime_error("Division by zero is forbidden!");
    }
    return a / b;
}

int main() {
    try {
        float result = divide(10.0f, 0.0f);
        std::cout << "Result: " << result << std::endl;
    } catch (const std::exception& e) {
        // This catches the error and prints a friendly message
        std::cerr << "CRITICAL ERROR: " << e.what() << std::endl;
    }

    std::cout << "The program continues running safely..." << std::endl;
    return 0;
}
```

### Example 3: Binary I/O (The Pro Way)
Dumping a struct directly to a file. This is how high-performance save-files work.

```cpp
#include <iostream>
#include <fstream>

struct GameState {
    int level;
    float posX, posY;
};

int main() {
    GameState state = {5, 120.5f, 450.2f};

    // Write binary
    std::ofstream out("save.bin", std::ios::binary);
    out.write(reinterpret_cast<char*>(&state), sizeof(GameState));
    out.close();

    // Read binary
    GameState loadedState;
    std::ifstream in("save.bin", std::ios::binary);
    in.read(reinterpret_cast<char*>(&loadedState), sizeof(GameState));

    std::cout << "Loaded Level: " << loadedState.level << std::endl;
    return 0;
}
```

## 4. Common Mistakes

### 1. The "Off-by-One" Newline
When reading a file with `>>`, the newline character `\n` is often left in the buffer. If your next call is `std::getline()`, it will read that empty newline and return immediately, making it look like your file is empty. Use `file.ignore()` to clear the buffer.

### 2. Not Checking `is_open()`
Assuming the file exists and you have permission to read it. If you don't check `is_open()`, your program will silently fail to do anything, leading to hours of "Why isn't my file saving?" debugging.

### 3. Catching by Value
`catch (std::exception e)` makes a copy of the error. `catch (const std::exception& e)` (by reference) is faster and prevents "slicing" (where you lose specific error details).

### 4. Swallowing Exceptions
Having an empty `catch` block: `catch(...) {}`. This is a sin. It hides bugs rather than fixing them. Always at least log the error.

## 5. Mental Model
Imagine a file is a **VHS Tape**.
- **The Stream** is the **VCR**. It’s the device that reads and writes the tape.
- **`ofstream`** is the **Record Button**.
- **`ifstream`** is the **Play Button**.
- **`std::ios::binary`** is like recording in raw magnetic pulses rather than a standard format—faster and more precise, but you need the exact same VCR settings to play it back.
- **Exceptions** are the **Safety Sensors**. If the tape tangles or the VCR overheats, the sensor "trips" and stops the machine before it catches fire, allowing you to fix it and try again.

## 6. Key Takeaways
- Use **`fstream`** for persistent data storage.
- **Text files** are for humans; **Binary files** are for performance and complex data structures.
- Always check if a file is **actually open** before performing operations.
- **Exceptions** (`try`/`catch`) separate your "business logic" from your "error handling logic."
- **RAII** ensures files are closed automatically, even if an error occurs.

## 7. What's Next
You have now mastered the core of C++: memory, objects, templates, and persistence. You understand how a low-level, high-performance language works. But C++ is "strict" and slow to write. Next week, we begin our journey into **Python**, a language designed for developer speed and flexibility. We’ll see how Python abstracts away the memory management you’ve spent weeks mastering, allowing you to build complex automation and data tools in minutes instead of hours.
