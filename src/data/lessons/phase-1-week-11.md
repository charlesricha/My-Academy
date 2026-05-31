# Week 11: C++: Templates & STL

## 1. Overview (Why This Exists)
In the previous weeks, we built specific classes for specific data—like a `Player` or a `Vector3`. But what if you need a list that can hold `int`s, `string`s, and `Player` objects? In a primitive language, you’d have to write three different lists. In C++, we use **Templates**. Templates allow us to write **Generic Code**—logic that works for *any* data type. This is the foundation of the **Standard Template Library (STL)**, a collection of battle-tested, high-performance data structures and algorithms that every professional C++ engineer uses. If you aren't using the STL, you aren't writing modern C++.

## 2. Core Concepts

### 1. Function Templates: Blueprints for Logic
A function template is a formula. You define it once using a placeholder (usually `T`), and the compiler generates a specific version of that function for every type you use it with.
- `template <typename T>`: This line tells the compiler "The following code is a template, and `T` is a generic type."
- **Compile-time Generation**: This is key. The "generic" code doesn't exist at runtime; the compiler writes a specific version for you during the build process.

### 2. Class Templates: Blueprints for Data
Just like functions, classes can be generic. This is how containers like `std::vector` (dynamic arrays) are built. You define the logic for managing memory, and the template handles whether that memory holds `float`s or `User` objects.

### 3. The STL: Containers
The STL provides a toolbox of "Containers" (data structures). The ones you'll use 90% of the time are:
- **`std::vector<T>`**: A dynamic array. It grows automatically as you add items. Use this by default.
- **`std::map<K, V>`**: A key-value store (like a dictionary). Extremely fast for lookups.
- **`std::unordered_map<K, V>`**: A hash-table version of the map. Even faster for large datasets.

### 4. The STL: Algorithms and Iterators
The STL doesn't just give you containers; it gives you the tools to manipulate them (sorting, searching, counting).
- **Iterators**: These are special objects that act like "smart pointers" to elements inside a container. They allow algorithms to work on *any* container without knowing how that container is built internally.

## 3. Code Examples

### Example 1: A Simple Function Template
Why write `swapInt`, `swapFloat`, and `swapString` when you can write one `swap`?

```cpp
#include <iostream>
#include <string>

template <typename T>
void swapValues(T& a, T& b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    swapValues(x, y); // Compiler generates an 'int' version
    std::cout << "x: " << x << ", y: " << y << std::endl;

    std::string s1 = "World", s2 = "Hello";
    swapValues(s1, s2); // Compiler generates a 'string' version
    std::cout << s1 << " " << s2 << std::endl;

    return 0;
}
```

### Example 2: Using `std::vector` and `std::sort`
This is how real-world C++ handles collections of data.

```cpp
#include <iostream>
#include <vector>
#include <algorithm> // Required for sort()

int main() {
    // A dynamic array that holds integers
    std::vector<int> scores;

    // Add elements
    scores.push_back(85);
    scores.push_back(92);
    scores.push_back(78);
    scores.push_back(99);

    // Sort the vector using an STL algorithm
    // scores.begin() and scores.end() return iterators
    std::sort(scores.begin(), scores.end());

    std::cout << "Sorted Scores: ";
    for (int s : scores) { // Modern 'range-based' for loop
        std::cout << s << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

### Example 3: The Power of `std::map`
Finding data by a "Key" instead of an index.

```cpp
#include <iostream>
#include <map>
#include <string>

int main() {
    // Map: Key (string) -> Value (int)
    std::map<std::string, int> inventory;

    inventory["Potions"] = 5;
    inventory["Arrows"] = 50;
    inventory["Gold"] = 1000;

    // Fast lookup
    std::string item = "Arrows";
    if (inventory.count(item)) {
        std::cout << "We have " << inventory[item] << " " << item << std::endl;
    }

    return 0;
}
```

## 4. Common Mistakes

### 1. Template Error "Walls of Text"
When you make a mistake in a template (e.g., trying to sort a list of objects that don't have a `<` operator), the compiler will output hundreds of lines of cryptic errors. **Don't panic.** Scroll to the very top of the error log; the real mistake is usually in the first 3 lines.

### 2. Performance Trap: `std::list`
Many beginners use `std::list` because it sounds simple. However, because of how modern CPUs and cache memory work, `std::vector` is almost always faster, even for inserting elements in the middle. **Default to `vector` unless you have a very specific reason not to.**

### 3. Forgetting `.end()` is Exclusive
In the STL, `container.end()` does **not** point to the last element. It points to the "imaginary space" *after* the last element. Accessing `*container.end()` will crash your program.

### 4. Heavy Template Bloat
Because the compiler generates a new version of the code for every type used, overusing complex templates can significantly increase your binary file size.

## 5. Mental Model
Imagine a **Cookie Cutter (The Template)**.
- The cookie cutter itself isn't a cookie; you can't eat it. It’s just a shape.
- The **Type (`int`, `string`, etc.)** is the **Dough**.
- When you press the cutter into the dough, you get an actual **Cookie (The Instance)**.
- You can use the same cutter for gingerbread, chocolate, or shortbread dough. The "logic" (the shape) stays the same, but the "data" (the taste) changes.

## 6. Key Takeaways
- **Templates** allow for "Write Once, Run for Any Type" logic.
- The **STL** is a collection of generic containers and algorithms.
- **`std::vector`** is your go-to dynamic array.
- **Iterators** are the bridge that allows algorithms to work on any container.
- Templates are resolved at **Compile-time**, meaning zero runtime performance penalty for the genericity.

## 7. What's Next
You can now build generic, high-performance systems. But so far, all our data disappears the moment the program closes. Next week, we’ll tackle **C++: File I/O & Errors**. We’ll learn how to save your data to the hard drive, read it back, and how to use C++ Exceptions to handle the "unhappy paths" where things go wrong in the real world.
