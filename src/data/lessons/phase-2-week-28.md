# Week 28: Middleware & Routing

## 1. Overview (Why This Exists)
Building a raw server with a giant `if/else` block for routing (as we did last week) is a recipe for disaster. As your app grows to 50 or 100 routes, your code becomes an unreadable "God File." **Middleware** and structured **Routing** are the patterns that solve this. Middleware allows you to break your request-handling logic into small, reusable "plugins" (like logging, authentication, or parsing JSON). Routing allows you to map specific URLs to specific functions. This week, we learn the "Assembly Line" architecture that powers Express.js and every other major web framework in the world.

## 2. Core Concepts

### 1. The Assembly Line: Middleware
Middleware is just a function that has access to the `req` and `res` objects. It sits between the raw request coming in and the final response going out.
- **The Chain**: You can "pipe" a request through multiple middleware functions.
- **`next()`**: The most important concept. Each middleware must call `next()` to pass the request to the next person in line. If you don't call `next()`, the request stops right there.

### 2. Common Middleware Tasks
- **Logging**: Printing every request to the terminal.
- **Auth**: Checking if the user has a valid cookie *before* they reach the private dashboard.
- **Parsing**: Taking the raw string from the request body and turning it into a JavaScript object.

### 3. Routing: The Dispatcher
Routing is the process of defining how an application responds to a client request to a particular endpoint (a URI) and a specific HTTP request method (GET, POST, etc.).
- **Static Routes**: `/about`, `/contact`.
- **Dynamic Routes**: `/users/:id`. The `:id` acts as a variable that you can extract from the URL.

### 4. Separation of Concerns
By using Middleware and Routing, you separate your **Infrastructure** (logging, security) from your **Business Logic** (fetching a user from a database). This makes your code testable and easy to change.

## 3. Code Examples

### Example 1: Creating a Custom Middleware
A simple logger that tracks every request.

```javascript
const http = require('http');

// This is our Middleware function
function logger(req, res, next) {
    const time = new Date().toISOString();
    console.log(`[${time}] ${req.method} ${req.url}`);
    next(); // Pass control to the next function
}

const server = http.createServer((req, res) => {
    // Manually executing the middleware
    logger(req, res, () => {
        // This is the "next" function
        res.end('Request Logged and Handled!');
    });
});

server.listen(3000);
```

### Example 2: The "Middleware Pipe" Pattern
Simulating how Express handles multiple plugins.

```javascript
const stack = [];

// Add functions to our "pipe"
stack.push((req, res, next) => {
    console.log("1. Authenticating...");
    next();
});

stack.push((req, res, next) => {
    console.log("2. Authorizing...");
    next();
});

function handleRequest(req, res) {
    let index = 0;

    function next() {
        if (index < stack.length) {
            const middleware = stack[index++];
            middleware(req, res, next);
        } else {
            res.end("Final Response!");
        }
    }

    next(); // Start the chain
}

// Every request now goes through the whole assembly line!
```

### Example 3: Extracting Route Parameters
How to handle dynamic URLs like `/users/42`.

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url; // e.g. "/users/42"

    if (url.startsWith('/users/')) {
        // Extract the ID from the end of the string
        const id = url.split('/')[2];
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            message: `Fetching data for user ${id}`,
            userId: id
        }));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(3000);
```

## 4. Common Mistakes

### 1. Forgetting `next()`
The most common bug in Express/Node. Your browser will just spin forever. If your middleware doesn't send a response (`res.end()`), it **must** call `next()`.

### 2. Calling `next()` AFTER sending a response
Once you call `res.end()`, the conversation is over. If you call `next()` afterward, the next middleware might try to send its own headers, causing an "Error: Cannot set headers after they are sent to the client" crash.

### 3. Middleware Order Matters
If you put your "Logger" middleware *after* your "Response" handler, it will never run. **Always put global infrastructure (logging, parsing) at the top of the stack.**

### 4. Over-complicating Middleware
Putting heavy database logic inside a middleware. Middleware should be "light" and "generic." Keep your "heavy" code in your route handlers or controllers.

## 5. Mental Model
Imagine a Node.js request is a **Car on an Assembly Line**.
- **The Raw Request**: The frame of the car enters the factory.
- **Middleware 1 (Logger)**: A worker stamps the entry time on the frame. (`next()`)
- **Middleware 2 (Auth)**: A security guard checks the worker's badge. If it's invalid, he pushes the car off the line. (`res.end()`)
- **Middleware 3 (Body Parser)**: A worker puts the engine (the data) into the car. (`next()`)
- **The Route Handler**: The car is painted and finished. (`res.end()`)
- **The Response**: The finished car is driven out of the factory to the customer.

## 6. Key Takeaways
- **Middleware** functions are the "Plugins" of a server.
- Every middleware has access to `req`, `res`, and **`next`**.
- **Routing** maps URLs to specific logic.
- **Dynamic Routes** (`/users/:id`) allow one function to handle thousands of unique URLs.
- **Order is everything**: Global middleware goes first.
- If you don't call `next()`, the request is "hung."

## 7. What's Next
You’ve mastered the architecture of a server. You can route requests and process them through a pipeline. But so far, our server has no memory. If we restart it, all our "users" and "posts" vanish. Next week, we enter the world of **Persistence** with **SQL Fundamentals**. We’ll learn how to store data in a way that is structured, searchable, and permanent, moving beyond simple text files and into professional relational databases.
