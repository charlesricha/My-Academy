# Week 27: Node.js from Scratch

## 1. Overview (Why This Exists)
For years, JavaScript lived only inside the browser, restricted to making buttons click and menus slide. **Node.js** changed everything. It took the V8 engine (the heart of Chrome) and put it on the server. This allowed JavaScript to talk directly to the operating system, the file system, and the network. This week, we learn how to use JavaScript to build a **Server**. We aren't using frameworks yet. We are going to build a raw HTTP server from first principles so you understand exactly how request/response streams work under the hood.

## 2. Core Concepts

### 1. The V8 Engine and libuv
Node.js isn't a language; it's a **Runtime**.
- **V8**: The engine that compiles your JS into machine code (Week 5) for incredible speed.
- **libuv**: A C library that handles the "Magic." It provides the Event Loop (Week 17) and handles all the asynchronous I/O (Input/Output) with the OS.

### 2. Browser JS vs. Node.js
- **In the Browser**: You have `window`, `document`, and `fetch`. You have access to the UI but not the hardware.
- **In Node.js**: You have `process`, `global`, and `require`. You have access to the hard drive and the network but **no** UI. There is no "button" to click in Node.js.

### 3. The `http` Module
Node.js comes with a built-in module for networking. It allows you to create a "Listener" that waits for a TCP connection, parses the incoming HTTP text (Week 25), and gives you two objects:
- **`req` (Request)**: A readable stream containing the client's data.
- **`res` (Response)**: A writable stream where you send your data back.

### 4. Streams and Buffers
In C++ (Week 9), we managed memory manually. Node.js uses **Streams** to handle large data without crashing the server.
- **Buffer**: A small chunk of raw memory.
- **Stream**: A series of buffers being processed one by one. Think of it like watching a YouTube video (streaming) vs. downloading the whole file before watching.

## 3. Code Examples

### Example 1: The Simplest Node.js Server
Building a server with zero dependencies.

```javascript
// Import the built-in HTTP module
const http = require('http');

// Create the server
const server = http.createServer((req, res) => {
    // req: Information about the incoming request
    // res: Tools to send back a response
    
    console.log(`Incoming request: ${req.method} ${req.url}`);

    // Set the response headers
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;

    // Send the body and end the connection
    res.end('Hello from the Node.js Server!');
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});
```

### Example 2: Basic Routing from Scratch
Before "Express," we had to do this manually.

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
    const path = req.url;

    if (path === '/') {
        res.end('Welcome to the Home Page');
    } else if (path === '/about') {
        res.end('This is the About Page');
    } else {
        res.statusCode = 404;
        res.end('Page Not Found');
    }
});

server.listen(3000);
```

### Example 3: Serving a File (The Stream Way)
Reading an HTML file from the disk and piping it to the browser.

```javascript
const http = require('http');
const fs = require('fs'); // File System module
const path = require('path');

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    
    // Create a READ stream from the file system
    const readStream = fs.createReadStream(filePath);
    
    // PIPE the file data directly into the response stream
    // This is memory efficient even for 1GB files!
    readStream.pipe(res);
});

server.listen(3000);
```

## 4. Common Mistakes

### 1. Blocking the Event Loop
Running a heavy C-style loop (like `while(true)`) inside your request handler. This will stop the server from responding to *any* other users. Node.js is single-threaded; if you block it, you kill it.

### 2. Forgetting to call `res.end()`
If you forget to end the response, the browser will just hang forever waiting for more data, eventually timing out.

### 3. Mixing up `require` and `import`
Node.js historically used `require()` (CommonJS). Modern Node uses `import` (ES Modules). Mixing them in the same project without the right `package.json` settings causes errors. **Stick to `require` for now as you learn the core.**

### 4. Global Variable Pollution
Creating a variable outside the request handler and modifying it inside. Since all users share the same Node.js process, User A can accidentally change a variable meant for User B.

## 5. Mental Model
Imagine a Node.js server is a **Busy Receptionist**.
- The Receptionist (The Event Loop) sits at the desk.
- A call comes in (Request).
- The caller asks for a file from the basement (Disk I/O).
- The Receptionist doesn't go to the basement himself. He hands the task to a **Runner (libuv)** and immediately picks up the next ringing phone.
- When the Runner returns with the file, the Receptionist picks the phone back up and gives the caller the info (Response).
- This is why Node.js can handle 10,000 users at once with just one thread—he's never stuck in the basement!

## 6. Key Takeaways
- **Node.js** is a JavaScript runtime built on **V8** and **libuv**.
- It allows for **Asynchronous, Non-blocking I/O**.
- The **`http`** module is the foundation of all Node.js web frameworks.
- **`req`** is a readable stream; **`res`** is a writable stream.
- **Piping** streams is the professional way to move data efficiently.
- **Don't block the Event Loop.**

## 7. What's Next
You've built a raw server. You've seen the "dirty" reality of manual routing and stream management. It's powerful, but it's slow to write. Next week, we move into **Middleware & Routing**. We’ll learn how to organize our server logic using patterns that lead us toward **Express.js**, making our code modular, reusable, and much easier to read.
