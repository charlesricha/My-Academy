# Week 9: C++: Pointers & References

## 1. Overview (Why This Exists)
In Phase 0, we learned that a computer is just a grid of memory cells. In Phase 1, we start manipulating those cells directly. **Pointers** and **References** are the tools that allow us to pass data around our programs without making expensive copies. If you are building a game engine, a high-frequency trading bot, or a database, you cannot afford to copy a 1GB object every time you call a function. You pass a pointer. Understanding these is the difference between "writing code" and "managing hardware." This is the foundational skill for all systems engineering.

## 2. Core Concepts

### 1. The Pointer: An Address in a Box
A pointer is just a variable. But unlike an `int` that holds a number like `42`, a pointer holds a **Memory Address**.
- `int* p`: The asterisk tells the compiler "p is a pointer to an integer."
- `&x`: The **address-of** operator. It retrieves the hex address where `x` lives in RAM.
- `*p`: The **dereference** operator. It tells the CPU "go to the address stored in p and read/write the value there."

### 2. The Reference: An Alias
A reference is a "nickname" for an existing variable.
- `int& ref = x;`: Once this is done, `ref` and `x` are the exact same memory location.
- Unlike pointers, references **cannot be null** and **cannot be reseated** (pointed to something else) after they are created. They are safer and cleaner than pointers for most everyday tasks.

### 3. Pass-by-Value vs. Pass-by-Reference
- **Pass-by-Value**: The default. The function gets a copy. Changes inside the function don't affect the original. Slow for big data.
- **Pass-by-Pointer/Reference**: The function gets the address. Changes *do* affect the original. Extremely fast because no data is copied.

### 4. Dynamic Memory (The Heap)
We use the `new` keyword to ask the OS for memory on the **Heap** (the "Walk-in Fridge" from Week 2). This memory persists until we manually `delete` it. If you forget to `delete`, you have a memory leak. If you `delete` twice, you crash.

## 3. Code Examples

### Example 1: Pointer Basics & Dereferencing
Understanding the relationship between the address and the value.

```cpp
#include <iostream>

int main() {
    int health = 100;
    int* pHealth = &health; // pHealth stores the address of health

    std::cout << "Address: " << pHealth << std::endl;
    std::cout << "Value via pointer: " << *pHealth << std::endl;

    // Modifying the original via the pointer
    *pHealth = 80;
    std::cout << "New health: " << health << std::endl; // Now 80

    return 0;
}
```

### Example 2: The Power of References in Functions
This is the "right way" to modify data across function boundaries in C++.

```cpp
#include <iostream>
#include <string>

// Passing by const-reference: Fast (no copy) AND safe (read-only)
void printMessage(const std::string& msg) {
    std::cout << "Log: " << msg << std::endl;
}

// Passing by reference: Fast (no copy) and allows modification
void powerUp(int& powerLevel) {
    powerLevel *= 2; 
}

int main() {
    int p = 9000;
    powerUp(p);
    std::cout << "New Power: " << p << std::endl; // 18000
    
    std::string longText = "This is a very long string that would be slow to copy.";
    printMessage(longText);

    return 0;
}
```

### Example 3: Heap Allocation & The "Manual" Responsibility
This shows the danger and necessity of manual memory management.

```cpp
#include <iostream>

struct Enemy {
    int id;
    float x, y;
};

int main() {
    // Allocate on the Heap
    Enemy* boss = new Enemy{1, 10.5f, 20.0f};

    std::cout << "Boss ID: " << boss->id << std::endl; // Use -> to access members via pointer

    // CRITICAL: You must manually free this memory
    delete boss; 
    
    // Safety: Set to nullptr so we don't accidentally use it again (Dangling Pointer)
    boss = nullptr;

    return 0;
}
```

## 4. Common Mistakes

### 1. The "Dangling Pointer"
Using a pointer after the memory it points to has been deleted or has gone out of scope.
```cpp
int* p;
{
    int x = 10;
    p = &x;
} // x is destroyed here
std::cout << *p; // CRASH or GIBBERISH: p points to garbage now.
```

### 2. Memory Leaks
Allocating memory with `new` inside a loop and never calling `delete`.
```cpp
while(true) {
    int* leak = new int[1000]; // OS will eventually kill your program
}
```

### 3. Dereferencing NULL
Trying to read the value of a pointer that points to `nullptr` (address 0). This is the #1 cause of crashes in C++ applications. Always check `if (p != nullptr)` if you aren't sure.

### 4. Returning References to Local Variables
Never return a reference or pointer to a variable created *inside* a function. When the function ends, that variable is wiped from the stack, and your reference becomes a ticking time bomb.

## 5. Mental Model
Imagine a pointer is a **GPS Coordinate**.
- The `int` is the **House** itself.
- The `int*` is a **Piece of Paper** with the house's address written on it.
- **Dereferencing (`*`)** is the act of actually driving to that coordinate to see who lives there.
- **A Reference** is like a **Nickname** for the house (e.g., "The Blue House"). You don't need to drive anywhere; you're already talking about the same physical building.
- **The Heap (`new`)** is like building a house on a **Vacant Lot**. It stays there until you personally hire a demolition crew (`delete`) to tear it down.

## 6. Key Takeaways
- A **Pointer** is a variable that stores a memory address; a **Reference** is an alias for an existing variable.
- Use **References** whenever possible; they are safer and cannot be null.
- Use **Pointers** when you need to change what you are pointing to, or when you need to represent "nothing" (`nullptr`).
- **Pass-by-Reference** avoids expensive copies of large objects.
- Every `new` must have a corresponding `delete` to avoid memory leaks.

## 7. What's Next
Pointers and references allow us to navigate memory, but they are "primitive" tools. To build truly scalable software, we need to group these variables and pointers into meaningful structures. Next week, we’ll move into **C++: OOP Fundamentals**, where we’ll learn how to wrap our data and logic into **Classes**, creating the high-level abstractions that power modern software architecture.
