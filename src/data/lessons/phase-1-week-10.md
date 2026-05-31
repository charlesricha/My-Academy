# Week 10: C++: OOP Fundamentals

## 1. Overview (Why This Exists)
If pointers are the "atoms" of C++, **Object-Oriented Programming (OOP)** is how we build "molecules" and "machines." In complex systems—like a physics engine or a banking backend—managing thousands of independent variables is impossible. OOP allows us to group data and the functions that operate on that data into a single unit called a **Class**. This isn't just about organization; it’s about **Encapsulation**. By hiding the messy inner workings of a component, we create "Black Boxes" that are easier to test, harder to break, and much simpler to reason about. Every professional C++ codebase you ever encounter will be built on these principles.

## 2. Core Concepts

### 1. Classes and Objects: The Blueprint vs. The Building
- **Class**: A user-defined type that acts as a blueprint. It defines what data an object will hold (**Attributes**) and what it can do (**Methods**).
- **Object**: A specific instance of a class. If `Car` is the class, "My Red 2024 Mustang" is the object. It occupies actual memory.

### 2. Access Specifiers: Public vs. Private
This is the core of Encapsulation. 
- **`private`**: Data and methods that can only be accessed from *inside* the class. We hide raw data here to prevent external code from corrupting it.
- **`public`**: The interface. This is what the rest of the world uses to interact with your object.
- **Rule of Thumb**: Always make your data members `private` and provide `public` "Getter" and "Setter" functions if necessary.

### 3. Constructors and Destructors
- **Constructor**: A special function that runs automatically when an object is created. Its job is to initialize the object's state.
- **Destructor**: Runs automatically when an object is destroyed (e.g., goes out of scope). This is where you clean up resources like open files or heap memory.

### 4. The `this` Pointer
Inside every non-static class method, there is a hidden pointer called `this`. It points to the specific object that called the method. This is how the CPU knows *which* instance's data it should be modifying when multiple objects of the same class exist.

## 3. Code Examples

### Example 1: Defining a Basic Class
Notice how we use the constructor to ensure our object starts in a valid state.

```cpp
#include <iostream>
#include <string>

class Player {
private:
    std::string name;
    int health;

public:
    // Constructor
    Player(std::string playerName, int initialHealth) {
        name = playerName;
        // Logic check: ensure health isn't negative
        health = (initialHealth > 0) ? initialHealth : 100;
        std::cout << name << " has entered the game." << std::endl;
    }

    // A method to modify private data safely
    void takeDamage(int amount) {
        health -= amount;
        if (health < 0) health = 0;
        std::cout << name << " took " << amount << " damage. Health: " << health << std::endl;
    }

    // Getter (Read-only access)
    int getHealth() const { return health; }
};

int main() {
    // Creating an object (Instance)
    Player p1("Slayer", 150);
    p1.takeDamage(30);
    
    return 0;
}
```

### Example 2: The `this` Pointer and Method Chaining
We use `this` to resolve ambiguity between parameter names and member variables.

```cpp
#include <iostream>

class Vector3 {
public:
    float x, y, z;

    // Use 'this' when parameter names match member names
    Vector3(float x, float y, float z) {
        this->x = x;
        this->y = y;
        this->z = z;
    }

    // Method chaining: return a reference to *this
    Vector3& add(float val) {
        this->x += val;
        this->y += val;
        this->z += val;
        return *this; 
    }

    void print() {
        std::cout << "(" << x << ", " << y << ", " << z << ")" << std::endl;
    }
};

int main() {
    Vector3 pos(0, 0, 0);
    // Because add() returns *this, we can chain calls
    pos.add(5.0f).add(10.0f);
    pos.print(); // Outputs: (15, 15, 15)
    
    return 0;
}
```

### Example 3: Resource Management with Destructors (RAII)
This shows the heart of C++ memory safety: the object cleans up after itself.

```cpp
#include <iostream>

class SimpleBuffer {
private:
    int* data;
    int size;

public:
    SimpleBuffer(int s) : size(s) {
        data = new int[size]; // Allocate heap memory
        std::cout << "Buffer of size " << size << " allocated." << std::endl;
    }

    // Destructor: This runs automatically when the object dies
    ~SimpleBuffer() {
        delete[] data; // Free the heap memory!
        std::cout << "Buffer cleaned up. No memory leaks." << std::endl;
    }
};

void createTemporaryBuffer() {
    SimpleBuffer temp(1024);
} // 'temp' goes out of scope here, and the DESTRUCTOR is called.

int main() {
    createTemporaryBuffer();
    std::cout << "Back in main." << std::endl;
    return 0;
}
```

## 4. Common Mistakes

### 1. The "God Class"
Creating one massive class that does everything. This violates the **Single Responsibility Principle**. A class should represent one clear concept (e.g., `InputHandler`, not `GameEngineAndInputAndPhysics`).

### 2. Public Data Members
Making all variables `public` just because it's "easier." This allows any part of the program to set a `Player`'s health to `-9999` or a `Date`'s month to `13`. **Always protect your state.**

### 3. Forgetting the Destructor
Allocating memory with `new` in a constructor but failing to `delete` it in a destructor. This is how memory leaks happen in C++. If your class "owns" a resource, it must clean it up.

### 4. Shadowing Members
Declaring a local variable in a method with the same name as a class member without using `this->`.
```cpp
void setHealth(int health) {
    health = health; // This just sets the parameter to itself!
    // Correct: this->health = health;
}
```

## 5. Mental Model
Imagine a class is like a **Modern Smartphone**.
- **The Public Interface**: The screen and buttons. You don't need to know how the battery or the processor works to make a call. You just interact with the "public" surface.
- **The Private Internals**: The wires, the chips, and the software logic inside the casing. You can't touch them directly, which is good, because if you poked a wire with a screwdriver, the phone would break.
- **The Constructor**: The first time you turn it on. It sets up your language, Wi-Fi, and account.
- **The `this` Pointer**: Each phone knows it is "this" phone. When you press the volume button, it changes its *own* volume, not the volume of every other phone in the world.

## 6. Key Takeaways
- **Classes** are blueprints; **Objects** are instances.
- **Encapsulation** protects data by making it `private` and exposing it through `public` methods.
- **Constructors** initialize state; **Destructors** clean up resources (RAII).
- The **`this` pointer** allows an object to refer to itself within its own methods.
- **Methods** should be used to enforce logic and "invariants" (rules that must always be true for the data).

## 7. What's Next
You’ve learned how to build single objects that manage their own data. But real-world programming rarely involves writing everything from scratch. Next week, we’ll explore **C++: Templates & STL (Standard Template Library)**. We’ll see how C++ allows us to write "generic" code that works for any data type, and we'll learn how to use the high-performance data structures (like `std::vector` and `std::map`) that professional engineers use every day.
