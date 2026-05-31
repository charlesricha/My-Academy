# Week 20: JS: Fetch & Storage

## 1. Overview (Why This Exists)
This is the finale of Phase 1. You've mastered C++, Python, and the internal engine of JavaScript. Now, we bring it all together to build applications that are truly "alive." A modern web app is useless if it can't talk to a server and "amnesiac" if it can't remember who you are. This week, we learn the **`fetch`** API—the browser's version of the Python `requests` library—to pull live data into our UI, and **Web Storage**, which allows us to save data directly in the user's browser so their preferences and progress survive a page refresh.

## 2. Core Concepts

### 1. The `fetch()` API: The Browser's Postman
`fetch()` is a global function used to make network requests.
- It is **Asynchronous**: It returns a **Promise** (from Week 18).
- **Two-Step Process**: 
    1. Wait for the server to respond (The "headers" arrive).
    2. Wait for the data (the "body") to be parsed (usually as `.json()`).
- It does **not** throw an error on `404` or `500`. You must manually check `response.ok`.

### 2. HTTP in the Browser: Security and Headers
Unlike a Python script, the browser has strict security rules:
- **CORS (Cross-Origin Resource Sharing)**: Browsers block scripts from talking to a different domain unless that domain explicitly gives permission.
- **Request Headers**: We use these to tell the server "I'm sending JSON" (`Content-Type: application/json`) or "Here is my API Key" (`Authorization: Bearer ...`).

### 3. LocalStorage: The Browser's Hard Drive
**`localStorage`** is a simple key-value store that persists even after the browser is closed.
- **Rules**: It only stores **Strings**. To store a Python-style dictionary or list, you must use `JSON.stringify()` to turn it into a string first.
- **Size**: Usually limited to ~5MB per domain.

### 4. SessionStorage: The Short-term Memory
Identical to `localStorage`, but the data is wiped as soon as the tab is closed. Perfect for sensitive data or "one-time" session info.

## 3. Code Examples

### Example 1: Fetching and Displaying Live Data
Combining `async/await`, `fetch`, and the `DOM`.

```javascript
async function loadUserData(userId) {
    const list = document.querySelector("#profile-list");
    
    try {
        const response = await fetch(`https://api.example.com/users/${userId}`);
        
        // Manual check for 404/500 errors
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        const user = await response.json();
        
        // Update the UI
        list.innerHTML = `
            <li>Name: ${user.name}</li>
            <li>Email: ${user.email}</li>
        `;
    } catch (error) {
        console.error("Fetch failed:", error);
        list.textContent = "Failed to load user data.";
    }
}
```

### Example 2: Sending Data (POST Request)
How to submit a form to an API.

```javascript
async function createPost(title, body) {
    const url = "https://jsonplaceholder.typicode.com/posts";
    
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, body, userId: 1 })
    });

    const result = await response.json();
    console.log("Post Created:", result);
}
```

### Example 3: Saving State with LocalStorage
Making sure the user's "Dark Mode" preference stays set.

```javascript
function savePreference(theme) {
    // We can only store strings!
    localStorage.setItem("theme_preference", theme);
}

function loadPreference() {
    const savedTheme = localStorage.getItem("theme_preference");
    
    if (savedTheme) {
        document.body.className = savedTheme;
        console.log("Loaded theme:", savedTheme);
    }
}

// Complex data? Serialize it first.
const userSettings = { volume: 80, language: "en" };
localStorage.setItem("settings", JSON.stringify(userSettings));

const loadedSettings = JSON.parse(localStorage.getItem("settings"));
```

## 4. Common Mistakes

### 1. Thinking `fetch` Fails on 404
If a server returns a `404 Not Found`, `fetch` still considers it a "successful" connection. It will not trigger the `catch` block. You **must** check `if (!response.ok)` manually.

### 2. Storing Objects Directly in LocalStorage
If you run `localStorage.setItem("user", {name: "Alice"})`, the value will be stored as the string `"[object Object]"`. You lose all your data. Always use **`JSON.stringify`**.

### 3. The "CORS" Wall
Trying to fetch data from a site that hasn't enabled CORS. This error is frustrating because you can see the data in your browser's "Network" tab, but your JS code isn't allowed to touch it. Solution: Use a proxy or ensure your backend has the correct headers.

### 4. Blocking the UI with `alert()` or `confirm()`
Using these old methods for debugging. They block the Event Loop (Week 17) and provide a terrible user experience. Use `console.log` or build a real modal with the DOM.

## 5. Mental Model
Imagine your web app is a **Remote Satellite**.
- **The Browser (DOM)** is the **Dashboard** inside the satellite.
- **`fetch()`** is the **Radio Antenna**. It reaches across space to talk to **Ground Control (The Server)**. 
- **The JSON Body** is the **Encrypted Message** sent over the radio.
- **LocalStorage** is the **Black Box Recorder**. If the satellite loses power (The browser closes), the data in the Black Box survives, and Ground Control can read it when power is restored.

## 6. Key Takeaways
- **`fetch()`** is the modern way to talk to APIs in the browser.
- Always check **`response.ok`** before parsing JSON.
- **Headers** tell the server what kind of data you are sending.
- **`localStorage`** is for persistent, small, non-sensitive data.
- **`JSON.stringify`** and **`JSON.parse`** are the "Translators" between JS objects and Web Storage strings.
- **CORS** is a browser security feature that protects users, not a bug you should just "disable."

## 7. What's Next
Congratulations! You have finished **Phase 1**. You are now "Fluent" in the three pillar languages of modern engineering. You can manage memory in C++, automate logic in Python, and build interactive logic in JavaScript. You are no longer just a coder—you are a multilingual engineer. Next month, we move into **Phase 2: Fullstack Web Development**. This is where we stop building "scripts" and start building "products." We’ll learn how to build production-grade web applications from first principles, starting with the absolute mastery of **HTML & SEO**.
