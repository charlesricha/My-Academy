# Week 33: Express.js

## 1. Overview (Why This Exists)
In Week 27, you saw the "raw" reality of building a server: manually parsing URLs, checking `if/else` for every route, and managing response headers byte-by-byte. While powerful, it's slow and prone to errors. **Express.js** is the most popular web framework for Node.js because it provides a thin, elegant abstraction layer over the raw `http` module. It doesn't hide the protocol from you; it just gives you a professional set of tools to handle routing, middleware, and requests in a fraction of the time. If you are building a backend in JavaScript today, you are almost certainly building it with Express.

## 2. Core Concepts

### 1. The `app` Object
The `app` object is the heart of your Express application. It is where you register your routes, configure your settings, and mount your middleware.
- `app.get()`, `app.post()`, etc.: These methods allow you to define routes that match specific HTTP verbs.
- `app.use()`: This is the primary way to mount **Middleware** (the concept we mastered in Week 28).

### 2. Request and Response Enhancements
Express takes the raw `req` and `res` objects from Node.js and supercharges them with helpful methods:
- **`req.params`**: Automatically extracts dynamic segments from your URL (e.g., `/users/:id`).
- **`req.body`**: (With the right middleware) parses the incoming JSON into a JS object.
- **`res.json()`**: Automatically sets the `Content-Type` to JSON and stringifies your data.
- **`res.status()`**: A clean way to set HTTP status codes.

### 3. Modular Routing: `express.Router`
As your API grows, you don't want 100 routes in one file. `express.Router` allows you to create "Mini-apps" for specific features (like `/users` or `/products`) and mount them into the main application. This keeps your code organized and maintainable.

### 4. Error Handling Middleware
Express has a special type of middleware for errors. It takes **four** arguments instead of three: `(err, req, res, next)`. Whenever you call `next(error)` from any of your routes, Express will bypass all normal middleware and jump straight to this error handler.

## 3. Code Examples

### Example 1: The Modern Express API
Notice how much cleaner this is than the raw Node.js version.

```javascript
const express = require('express');
const app = express();

// Middleware to parse JSON bodies automatically
app.use(express.json());

const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

// GET: Fetch all users
app.get('/api/users', (req, res) => {
    res.json(users); // Auto-sets 200 OK and Content-Type: application/json
});

// POST: Create a new user
app.post('/api/users', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name // req.body is populated by express.json()
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.listen(3000, () => console.log('API listening on port 3000'));
```

### Example 2: Dynamic Routing and Status Codes
Handling specific resource requests and errors.

```javascript
app.get('/api/users/:id', (req, res) => {
    // req.params.id is always a string!
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        // Return a proper 404 for missing resources
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});
```

### Example 3: Error Handling Middleware
The professional way to catch crashes.

```javascript
// A route that simulates an error
app.get('/crash', (req, res, next) => {
    try {
        throw new Error("Something went wrong in the DB!");
    } catch (err) {
        next(err); // Jump to the Error Handler
    }
});

// GLOBAL ERROR HANDLER
// Must be at the bottom of the file!
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: "error",
        message: err.message
    });
});
```

## 4. Common Mistakes

### 1. Forgetting `express.json()`
Trying to read `req.body` and getting `undefined`. Express does not parse JSON by default for performance reasons. You **must** add `app.use(express.json())` at the top of your app.

### 2. Not returning on `res.send()` or `res.json()`
Calling `res.json()` does **not** stop the execution of your function.
```javascript
if (!user) res.status(404).json({msg: "Not found"});
res.json(user); // BUG: This will try to send a second response!
```
**Fix**: Always use `return res.json(...)` if it's inside a conditional.

### 3. Middleware Order
Placing `app.use(express.json())` *after* your routes. Routes only use the middleware that was registered *before* them.

### 4. Overloading the `app.js` file
Putting all your logic, database queries, and routing in one file. Use the **Router** to split your code by feature from day one.

## 5. Mental Model
Imagine Express as a **Post Office Sorting Facility**.
- **The App** is the entire building.
- **Middleware** are the **Conveyor Belts**. Some belts scan for hazardous items (Security), some weigh the package (Parsing), and some label the package (Logging).
- **The Router** is the **Sorting Tray**. It looks at the address (URL) and the delivery type (Method) and sends the package to the correct specialized worker.
- **The Handler** is the **Worker** who opens the box, processes the contents, and prepares the return package.

## 6. Key Takeaways
- **Express** is a "Minimalist" framework; it adds convenience without hiding the underlying HTTP logic.
- **`req.body`** and **`req.params`** are the primary ways to get data from the client.
- **`res.json()`** is the standard way to respond in a REST API.
- **`next()`** and **`next(err)`** control the flow of the application.
- Use **Middleware** for cross-cutting concerns (auth, logging, parsing).
- **Error Handling Middleware** ensures your server doesn't crash on unexpected failures.

## 7. What's Next
You have mastered the Backend. You can build professional, scalable APIs that talk to real databases. You have conquered the "Invisible Web." Now, it's time to build the "Visible Web" at the same professional level. Next week, we begin **React Fundamentals**. We’ll learn how to move beyond static HTML and manual DOM manipulation to build complex, high-performance user interfaces using a component-based architecture.
