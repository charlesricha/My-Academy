# Week 13: Python: Functions & Comprehensions

## 1. Overview (Why This Exists)
Welcome to the "Speed" phase of the curriculum. After weeks of managing pointers and manual memory in C++, Python will feel like taking off a heavy backpack and starting to run. Python is a **High-Level** language that prioritizes developer time over CPU time. It hides the complexity of memory management and hardware interaction so you can focus entirely on logic. This week is about mastering the Pythonic way of writing functions and using **Comprehensions**—a powerful syntax that allows you to transform data in a single, readable line of code.

## 2. Core Concepts

### 1. Dynamic Typing and "Duck Typing"
In C++, you had to tell the compiler exactly what type every variable was. In Python, variables are labels, not boxes.
- **Dynamic Typing**: You can reassign a variable from an `int` to a `string` without the compiler complaining.
- **Duck Typing**: "If it walks like a duck and quacks like a duck, it's a duck." Python doesn't care about the *type* of an object; it only cares if the object has the *methods* or *attributes* you are trying to use.

### 2. Flexible Function Arguments
Python functions are incredibly expressive:
- **Default Arguments**: `def greet(name="User"):` allows you to call the function without providing a name.
- **`*args`**: Allows a function to take any number of positional arguments (collected into a tuple).
- **`**kwargs`**: Allows any number of keyword arguments (collected into a dictionary).

### 3. List, Set, and Dict Comprehensions
Comprehensions are the hallmark of an intermediate Python developer. They allow you to replace multi-line `for` loops and `if` statements with a concise, declarative syntax.
- `[expression for item in iterable if condition]`
- They are not just "shorter"; they are often faster because they are optimized at the C level within the Python interpreter.

### 4. First-Class Functions
In Python, functions are objects. You can pass them as arguments to other functions, return them from functions, and store them in lists. This is the foundation of **Functional Programming** and **Decorators**.

## 3. Code Examples

### Example 1: The Power of `*args` and `**kwargs`
Building a flexible logging function.

```python
def log_event(level, message, *metadata, **tags):
    print(f"[{level.upper()}] {message}")
    
    if metadata:
        print(f"  Additional Info: {metadata}")
        
    if tags:
        print(f"  Tags: {tags}")

# Usage:
log_event("info", "User logged in", "IP: 192.168.1.1", "Browser: Chrome", user_id=42, source="web")
# metadata becomes a tuple: ("IP: 192.168.1.1", "Browser: Chrome")
# tags becomes a dict: {"user_id": 42, "source": "web"}
```

### Example 2: Comprehensions vs. Loops
Transforming data the "Pythonic" way.

```python
# The "Old Way" (C-style)
numbers = [1, 2, 3, 4, 5, 6]
squares = []
for n in numbers:
    if n % 2 == 0:
        squares.append(n * n)

# The "Pythonic Way" (List Comprehension)
# Read as: "I want n*n for every n in numbers, but only if n is even"
pythonic_squares = [n * n for n in numbers if n % 2 == 0]

print(pythonic_squares) # [4, 16, 36]

# Dictionary Comprehension
user_ids = ["alice", "bob", "charlie"]
user_map = {name: len(name) for name in user_ids}
print(user_map) # {'alice': 5, 'bob': 3, 'charlie': 7}
```

### Example 3: Function as an Argument
Creating a simple "Plugin" system.

```python
def process_data(data, strategy_func):
    return [strategy_func(item) for item in data]

def double(x): return x * 2
def shout(s): return s.upper()

# We pass the function object itself, NOT the result of calling it
print(process_data([1, 2, 3], double))   # [2, 4, 6]
print(process_data(["hi", "bye"], shout)) # ["HI", "BYE"]
```

## 4. Common Mistakes

### 1. Mutable Default Arguments
Never use a mutable object (like a list) as a default argument.
```python
def add_item(item, my_list=[]): # WRONG
    my_list.append(item)
    return my_list

print(add_item(1)) # [1]
print(add_item(2)) # [1, 2] <- The list persists between calls!
# Fix: use my_list=None and then my_list = [] inside the function.
```

### 2. Over-Complicating Comprehensions
List comprehensions are great for readability, but once you start nesting them or adding 3+ conditions, they become a nightmare to debug. If it's hard to read, go back to a standard `for` loop.

### 3. Confusing `is` and `==`
- `==` checks for **Value** (Are these two things the same?)
- `is` checks for **Identity** (Are these two things the *exact same object* in memory?)
In C terms: `is` compares pointers; `==` compares the data they point to.

### 4. Not Understanding Scope (LEGB)
Python looks for variables in this order: **L**ocal, **E**nclosing, **G**lobal, **B**uilt-in. If you define a variable inside a function with the same name as a global one, you "shadow" it. Use the `global` keyword only as a last resort.

## 5. Mental Model
Imagine Python is a **High-End Concierge Service**.
- In **C++**, you are the contractor. You have to buy the bricks, mix the cement, and personally lay every stone (Manage memory, types, and headers).
- In **Python**, you just tell the Concierge: "I want a wall here." You don't care how they get the bricks or who they hire. You pay for this convenience with a little bit of money (CPU speed), but the wall gets built 10x faster.
- **Comprehensions** are like **Bulk Orders**. Instead of telling the concierge "Get me a brick, now another, now another," you say "Give me a stack of every red brick you can find."

## 6. Key Takeaways
- Python is **Dynamically Typed**; types are checked at runtime, not compile-time.
- **Comprehensions** are the preferred way to filter and transform sequences.
- **`*args`** and **`**kwargs`** make functions extremely flexible for future changes.
- Functions are **First-Class Objects**; they can be passed around like any other data.
- Readability is a feature. "Beautiful is better than ugly" is the first line of the Zen of Python.

## 7. What's Next
You've seen how Python handles logic and data flow with elegance. But as your scripts grow into applications, you'll need to organize that logic into reusable blueprints. Next week, we’ll dive into **Python: OOP & Modules**. We'll see how Python’s version of Classes differs from C++, and how to use Python's massive ecosystem of modules to avoid reinventing the wheel.
