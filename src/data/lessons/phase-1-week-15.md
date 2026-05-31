# Week 15: Python: JSON & Errors

## 1. Overview (Why This Exists)
In the modern world, programs rarely work in isolation. They talk to other programs, mobile apps, and web servers. **JSON (JavaScript Object Notation)** is the universal language of this communication. If you want to fetch weather data, post to a database, or save a complex configuration, you will use JSON. But external data is untrustworthy—it can be missing, malformed, or plain wrong. This week is about **Data Interchange** and **Resilience**: learning how to map Python objects to JSON and how to use Python's "Exception" system to catch errors before they crash your application.

## 2. Core Concepts

### 1. JSON: The Universal Data Format
JSON is basically a text-based version of a Python Dictionary.
- **Serialization (Dumping)**: Turning a Python object (list, dict) into a JSON string.
- **Deserialization (Loading)**: Turning a JSON string back into a Python object.
- **Rules**: JSON only supports specific types (strings, numbers, booleans, null, arrays, and objects). It does *not* support custom Python objects like our `Point` class from last week.

### 2. The `try-except` Block: Your Safety Net
In C++, error handling was often about checking return codes. In Python, we use **Exceptions**.
- **`try`**: Run the code that might fail.
- **`except`**: If a specific error happens (e.g., `FileNotFoundError`), run this code instead of crashing.
- **`else`**: Run this only if the `try` block succeeded.
- **`finally`**: Run this **no matter what** (perfect for closing files or database connections).

### 3. "EAFP" vs. "LBYL"
Python follows the **EAFP** (Easier to Ask for Forgiveness than Permission) philosophy.
- **LBYL (C++ style)**: Check if the file exists, check if you have permission, then open it.
- **EAFP (Python style)**: Just try to open it. If it fails, catch the exception. This is cleaner and avoids "race conditions" where the file is deleted between your check and your attempt to open it.

### 4. Custom Exceptions
As an engineer, you should create your own error types (e.g., `InsufficientFundsError`) that represent specific failures in your business logic. This makes your code much easier to debug for other developers.

## 3. Code Examples

### Example 1: Working with the `json` Module
Saving and loading data the standard way.

```python
import json

data = {
    "user_id": 42,
    "name": "Alice",
    "skills": ["Python", "C++", "Linux"],
    "is_active": True
}

# 1. Serialize (Python Dict -> JSON String)
json_string = json.dumps(data, indent=4)
print(json_string)

# 2. Save to a file
with open("user.json", "w") as f:
    json.dump(data, f)

# 3. Deserialize (JSON File -> Python Dict)
with open("user.json", "r") as f:
    loaded_data = json.load(f)
    print(f"Welcome back, {loaded_data['name']}")
```

### Example 2: Robust Error Handling
Handling multiple error types gracefully.

```python
def get_user_age(user_data):
    try:
        age_str = user_data["age"] # Might raise KeyError
        age = int(age_str)         # Might raise ValueError
        return age
    except KeyError:
        print("Error: 'age' field is missing!")
    except ValueError:
        print("Error: 'age' must be a valid number!")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
    finally:
        print("Completed age verification attempt.")

# Usage:
get_user_age({"name": "Bob"})             # KeyError
get_user_age({"name": "Bob", "age": "abc"}) # ValueError
```

### Example 3: Creating and Raising Custom Exceptions
Enforcing rules in your own application logic.

```python
class SecurityError(Exception):
    """Raised when an unauthorized action is detected."""
    pass

def access_secret_vault(password):
    if password != "1234":
        raise SecurityError("Unauthorized access attempt!")
    print("Vault Opened.")

try:
    access_secret_vault("wrong-pass")
except SecurityError as e:
    print(f"SECURITY ALERT: {e}")
```

## 4. Common Mistakes

### 1. The "Catch-All" Exception
Using `except: ` or `except Exception: ` without a specific error type. This catches *everything*, including `KeyboardInterrupt` (Ctrl+C), making it impossible to stop your script. Always catch the most specific error possible.

### 2. Not Closing Resources
Opening a file or a network connection in a `try` block but not closing it in a `finally` block. If an error happens, the connection stays open forever. **Pro Tip**: Use `with` statements (context managers) whenever possible; they handle the "finally" for you.

### 3. Misunderstanding `json.loads` vs `json.load`
- `loads` (with an 's') is for **Strings**.
- `load` (no 's') is for **Files**.
Getting these mixed up is a classic source of "AttributeError" bugs.

### 4. Shadowing Built-in Exception Names
Don't name your own variables `ValueError` or `TypeError`. It will break Python's ability to raise those errors properly.

## 5. Mental Model
Imagine JSON is a **Passport**.
- No matter what country (language) you come from, the Passport (JSON) is the standard document that everyone can read.
- **Serialization** is you filling out your info in the passport format.
- **Deserialization** is the border agent reading that info back into their own system.

Imagine Exceptions are **Circuit Breakers**.
- If your house (program) has a power surge (error), the circuit breaker (exception) "trips" and cuts the power to that room. This prevents the whole house from burning down.
- A `try-except` block is like having a specific breaker for the kitchen. If the toaster shorts out, the lights in the living room stay on.

## 6. Key Takeaways
- Use **JSON** for light, readable data interchange.
- **`json.dumps`** for strings; **`json.dump`** for files.
- Python logic is **EAFP**: "Easier to Ask for Forgiveness than Permission."
- Use **`try-except-finally`** to handle external failures (network, files, user input).
- **Custom Exceptions** make your code a professional "Black Box" that other devs can rely on.
- Always catch **Specific Exceptions**, never "naked" exceptions.

## 7. What's Next
You can now handle data and handle errors. You have the tools to build "Bulletproof" Python applications. Next week, we’ll put these tools to work in the real world with **Python: APIs & Automation**. We’ll learn how to write Python scripts that talk to the web, fetch live data from real APIs, and automate the boring parts of your digital life.
