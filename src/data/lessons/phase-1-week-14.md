# Week 14: Python: OOP & Modules

## 1. Overview (Why This Exists)
In C++, OOP was about structure and manual resource management (RAII). In Python, OOP is about **Productivity** and **Extensibility**. Python uses objects for almost everything—even integers and functions are objects. This week, we learn how to create our own types using Classes, how to use "Dunder" (Double Underscore) methods to make our objects behave like built-in types, and how to use Python's **Module System** to tap into the millions of libraries that make Python the world's most popular language for data, AI, and automation.

## 2. Core Concepts

### 1. Pythonic Classes: No more `private`/`public`
Python doesn't have strict access specifiers like C++. Instead, we use conventions:
- **`self`**: The first argument to every method. It's the same as `this` in C++.
- **`__init__`**: The constructor.
- **The Underscore Convention**: We prefix "private" variables with an underscore (e.g., `_secret`). This doesn't *stop* people from accessing them, but it tells them "you shouldn't be touching this."

### 2. Dunder (Special) Methods
These are methods like `__str__`, `__len__`, and `__add__`. They allow your custom objects to hook into Python's built-in syntax. If you implement `__str__`, `print(my_obj)` works. If you implement `__add__`, `obj1 + obj2` works. This is called **Operator Overloading**.

### 3. Properties: Controlled Access
In C++, you'd write `getHealth()` and `setHealth()`. In Python, we use the `@property` decorator. This allows you to treat a method like an attribute. You can write `player.health = 50`, and behind the scenes, a function runs that can validate the data (e.g., checking if health is > 0).

### 4. Modules and Packages
- **Module**: A single `.py` file.
- **Package**: A folder containing multiple modules and an `__init__.py` file.
Python's power comes from `import`. You can import the `math` module, the `os` module, or third-party libraries like `requests` or `pandas`.

## 3. Code Examples

### Example 1: A Pythonic Class with Dunder Methods
Making a custom object feel like a native part of the language.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"Point({self.x}, {self.y})"

    def __add__(self, other):
        # Allow adding two points: p1 + p2
        return Point(self.x + other.x, self.y + other.y)

# Usage:
p1 = Point(1, 2)
p2 = Point(3, 4)
print(p1)       # Calls __str__: Point(1, 2)
print(p1 + p2)  # Calls __add__: Point(4, 6)
```

### Example 2: Using `@property` for Validation
Replacing clunky getters and setters with clean syntax.

```python
class BankAccount:
    def __init__(self, balance):
        self._balance = balance # Note the underscore (private convention)

    @property
    def balance(self):
        print("Checking balance...")
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Balance cannot be negative!")
        self._balance = value

# Usage:
account = BankAccount(100)
print(account.balance)  # Accesses it like a variable, but calls the function
account.balance = 200   # Calls the setter
# account.balance = -50 # Raises ValueError
```

### Example 3: Organization with Modules
Splitting code into separate files.

```python
# utils.py
def calculate_area(radius):
    return 3.14159 * (radius ** 2)

# main.py
import utils
from math import pi # Import just what you need

# Use the imported function
print(utils.calculate_area(5))
print(f"Precise Pi: {pi}")
```

## 4. Common Mistakes

### 1. Forgetting `self`
The #1 mistake for C++ or Java devs coming to Python. If you forget `self` in a method definition (`def my_method(arg):`), Python will throw a confusing error when you call it, because it automatically passes the instance as the first argument.

### 2. Using Global Variables instead of Attributes
Storing state in global variables instead of `self`. This makes it impossible to create more than one instance of your class without them interfering with each other.

### 3. Circular Imports
File A imports File B, and File B imports File A. This causes the Python interpreter to freeze or crash. Keep your dependency graph simple and unidirectional.

### 4. Overusing Inheritance
Intermediate devs often build massive "Tower of Babel" inheritance chains (`Animal -> Mammal -> Dog -> Labrador`). In Python, prefer **Composition** (objects containing other objects) or **Interfaces** (Duck Typing) over deep inheritance.

## 5. Mental Model
Imagine a class is a **Universal Remote**.
- **Attributes (`self.x`)** are the **Settings** (The current channel, the volume).
- **Methods** are the **Buttons**.
- **Dunder Methods** are like the **Standard Connector** on the bottom of the remote. Because it follows a standard protocol, it can "plug into" the TV (The Python Interpreter) and work automatically.
- **Modules** are **Expansion Packs**. If your remote doesn't know how to control the air conditioner, you just "import" the AC-Control module and suddenly your remote has new powers.

## 6. Key Takeaways
- Use **`self`** to refer to the current instance.
- **`__init__`** is for setup; **`__str__`** is for human-readable representation.
- **`@property`** allows you to add logic to attribute access without changing the user's syntax.
- Everything in Python is an **Object**.
- Use **Modules** to keep your code organized and reusable.
- Prefer **Composition** over deep inheritance.

## 7. What's Next
You can now build complex, organized Python systems. But in the real world, programs need to handle external data—usually in the form of JSON—and they need to handle the inevitable errors that come with it. Next week, we’ll dive into **Python: JSON & Errors**. We’ll learn how to parse data from the web and how to use Python's `try-except` blocks to make your applications "bulletproof" against bad data.
