# Week 16: Python: APIs & Automation

## 1. Overview (Why This Exists)
Up to this point, your programs have only interacted with data living on your own hard drive. But the real power of a developer is the ability to command the entire internet. An **API (Application Programming Interface)** is a set of rules that allow your Python script to talk to other services like Google Maps, OpenAI, Spotify, or your local weather station. This week is about **Connection** and **Automation**: learning how to fetch real-time data from the web and how to write scripts that perform hours of manual work in seconds. This is the skill that turns you from a "coder" into an "automated force of nature."

## 2. Core Concepts

### 1. HTTP: The Language of the Web
When your script talks to an API, it uses **HTTP (HyperText Transfer Protocol)**.
- **GET**: Ask for data (like viewing a page).
- **POST**: Send data (like submitting a form or posting a tweet).
- **Status Codes**: The server's way of telling you what happened.
    - `200`: Success.
    - `404`: Not Found.
    - `401`: Unauthorized (You forgot your API key).
    - `500`: Server Error (It's not your fault).

### 2. The `requests` Library
Python's built-in tools for HTTP are clunky. Professional developers use the **`requests`** library. It simplifies everything into a few readable lines. It handles your JSON (from Week 15), your headers, and your authentication automatically.

### 3. API Keys and Environment Variables
Most APIs require an **API Key**—a secret password that identifies you. **NEVER** put this key directly in your code (Hardcoding). If you push that code to GitHub, anyone can steal your key and spend your money. Instead, we use **Environment Variables** (stored in a `.env` file) and the `os` module to keep secrets safe.

### 4. Rate Limiting
APIs aren't infinite. They will block you if you send too many requests too fast. As an engineer, you must implement "Backoff" logic or use `time.sleep()` to ensure your scripts are "good citizens" of the web.

## 3. Code Examples

### Example 1: Fetching Live Data (GET Request)
Talking to a real API (using the JSON placeholder for testing).

```python
import requests

def get_post_titles(user_id):
    url = f"https://jsonplaceholder.typicode.com/posts?userId={user_id}"
    
    # Send the GET request
    response = requests.get(url)
    
    # Check if the request was successful
    if response.status_code == 200:
        posts = response.json() # Turn JSON into a Python list
        return [p['title'] for p in posts]
    else:
        print(f"Error: {response.status_code}")
        return []

# Usage:
titles = get_post_titles(1)
for t in titles[:3]:
    print(f"Post Title: {t}")
```

### Example 2: Security with Environment Variables
Keeping your API keys out of your source code.

```python
import os
import requests
from dotenv import load_dotenv # Use pip install python-dotenv

# Load variables from a .env file into the system environment
load_dotenv()

def fetch_private_data():
    # Retrieve the secret key from the environment
    api_key = os.getenv("MY_SECRET_API_KEY")
    
    if not api_key:
        print("Error: API Key missing from environment!")
        return

    headers = {"Authorization": f"Bearer {api_key}"}
    response = requests.get("https://api.example.com/data", headers=headers)
    
    print(response.json())

# .env file would look like:
# MY_SECRET_API_KEY=sk_test_123456789
```

### Example 3: A Simple Automation Script
A script that checks a website and alerts you if it's down.

```python
import requests
import time

SITES_TO_CHECK = ["https://google.com", "https://github.com", "https://this-will-fail-999.com"]

def monitor_sites():
    print("Starting Website Monitor...")
    for site in SITES_TO_CHECK:
        try:
            r = requests.get(site, timeout=5)
            if r.status_code == 200:
                print(f"[UP]   {site}")
            else:
                print(f"[DOWN] {site} - Status: {r.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"[ERROR] {site} - Could not connect: {e}")

# Run every minute (for demonstration, we'll just run it once)
monitor_sites()
```

## 4. Common Mistakes

### 1. Hardcoding Secrets
The #1 security mistake. Even if your repo is private, hardcoding keys is bad practice. One accidental "public" switch and your credentials are gone. Use `.env` and `.gitignore` every single time.

### 2. Forgetting Timeouts
By default, `requests` can wait forever for a server to respond. If the server is hanging, your script will hang too. Always provide a `timeout` (e.g., `requests.get(url, timeout=10)`).

### 3. Not Checking Status Codes
Assuming every request succeeds. If you try to run `.json()` on a response that returned a `404 Error` page (which is HTML, not JSON), your script will crash. Always check `response.ok` or `response.status_code`.

### 4. Overwhelming the Server
Running a `while True` loop without a `time.sleep()`. This is essentially a DDOS attack. If an API has a limit of 100 requests per minute, and you send 100 per second, you will be banned.

## 5. Mental Model
Imagine an API is a **Vending Machine**.
- **The URL** is the machine's address.
- **The HTTP Method (GET/POST)** is you either pressing a button to get an item or putting money into the slot.
- **The API Key** is your **ID Card**. The machine won't dispense certain items (like medicine or restricted data) unless you scan your ID.
- **The JSON Response** is the **Product** that drops into the tray.
- **The Status Code** is the **Screen on the Machine**. It either says "Enjoy your snack" (200), "Sold Out" (404), or "Invalid Payment" (401).

## 6. Key Takeaways
- **APIs** are the bridges between different software systems.
- Use the **`requests`** library for all HTTP communication in Python.
- **GET** is for reading; **POST** is for writing/sending data.
- **Status Codes** (200, 404, 500) are the first thing you should check.
- **Environment Variables** are the ONLY place secrets should live.
- Respect **Rate Limits** to keep your access alive.

## 7. What's Next
You have now conquered the backend logic of the world. You can write scripts that command servers and automate your life. But most of the web isn't just scripts—it's interactive user interfaces. Next week, we transition to our final core language: **JavaScript**. We’ll learn about the **Event Loop & Closures**, exploring why JavaScript is the undisputed king of the browser and how its unique "asynchronous" nature allows it to handle thousands of user interactions at once.
