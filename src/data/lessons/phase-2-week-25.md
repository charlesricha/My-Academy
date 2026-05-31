# Week 25: HTTP Fundamentals

## 1. Overview (Why This Exists)
Everything you've built so far lives inside the browser. But the internet is not a single computer; it is a conversation between billions of them. **HTTP (HyperText Transfer Protocol)** is the language of that conversation. When you type a URL, your browser sends a "Request" across the world, and a server sends back a "Response." If you don't understand how this handshake works, you will never be able to debug a slow site, secure a user's data, or build a professional API. This week, we lift the curtain on the "Invisible Web" and learn the protocol that holds the entire internet together.

## 2. Core Concepts

### 1. The Request/Response Cycle
The web is **Stateless**. This means the server doesn't "remember" you between requests (unless we use tricks like cookies). Every interaction follows this pattern:
1. **Client (Browser)**: "Hey, give me the file `index.html`." (Request)
2. **Server**: "Okay, here it is, and it's 2000 bytes long." (Response)
3. **Connection Closes**.

### 2. Anatomy of a Request
A request consists of:
- **Method**: What do you want to do? (`GET` for reading, `POST` for writing, `PUT` for updating, `DELETE` for removing).
- **URL (Path)**: Where is the resource? (e.g., `/users/profile`).
- **Headers**: Metadata about the request (e.g., "I accept JSON", "I am using Chrome").
- **Body**: The actual data you are sending (used in `POST` and `PUT`).

### 3. Anatomy of a Response
A response consists of:
- **Status Code**: What happened? (`200 OK`, `404 Not Found`, `500 Server Error`).
- **Headers**: Metadata about the response (e.g., "This content is an image", "Don't cache this").
- **Body**: The actual content (HTML, CSS, JSON, or an Image).

### 4. Statelessness and Cookies
Because HTTP is stateless, we use **Cookies** or **Tokens** to maintain "State." When you log in, the server sends a cookie in the response header. Your browser saves it and automatically sends it back in every future request header. This is the only way the server knows "Oh, this is still Alice."

## 3. Code Examples

### Example 1: A Raw HTTP Request
This is what your browser actually sends to the server (the bits from Week 1!).

```text
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Connection: keep-alive

[Empty Body for GET]
```

### Example 2: A Raw HTTP Response
This is what comes back over the wire.

```text
HTTP/1.1 200 OK
Date: Mon, 27 Jul 2026 12:00:00 GMT
Content-Type: text/html; charset=UTF-8
Content-Length: 154
Connection: close

<html>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

### Example 3: Using the Browser's Network Tab
You don't write raw HTTP by hand, but you must know how to inspect it.
1. Open Chrome DevTools (`F12`).
2. Click the **Network** tab.
3. Refresh the page.
4. Click on any request (e.g., `main.css`).
5. Look at **Headers** -> **Request Headers** and **Response Headers**.
6. This is your primary debugging tool for the rest of your career.

## 4. Common Mistakes

### 1. Using `GET` for Sensitive Data
Putting a password in a URL (e.g., `/login?pass=123`). URLs are logged by servers, browsers, and proxies. **Always use `POST` with a Body for sensitive data.**

### 2. Ignoring Cache Headers
Not setting `Cache-Control`. This forces the user to download your 5MB JavaScript file every single time they click a link, making your site feel slow.

### 3. Misinterpreting 404 vs. 500
A `404` means the *client* asked for something that doesn't exist (Client error). A `500` means the *server* crashed while trying to find it (Server error). Knowing this immediately tells you where to start debugging.

### 4. Thinking "HTTPS" is a different protocol
HTTPS is just HTTP wrapped in an encrypted "tunnel" (TLS). The messages (methods, headers, status codes) are exactly the same; they are just scrambled so hackers can't read them in transit.

## 5. Mental Model
Imagine HTTP is a **Drive-Thru Restaurant**.
- **The Client** is the **Driver** at the speaker.
- **The Request** is the **Order**. You specify the "Method" (I want a burger) and the "Body" (No pickles).
- **The URL** is the **Menu Item Number**.
- **The Server** is the **Kitchen**. 
- **The Response** is the **Bag of Food**.
- **The Status Code** is the **Cashier's Voice**. "That'll be $5" (200), "We're out of burgers" (404), or "The grill is on fire" (500).
- **The Statelessness**: The cashier has no idea who you are. Even if you come back 5 minutes later, you have to tell them your order (or show your "Cookie" receipt) all over again.

## 6. Key Takeaways
- **HTTP** is a Request/Response protocol.
- **GET** is for fetching; **POST** is for sending.
- **Status Codes** are the "health check" of every request.
- **Headers** carry the metadata (auth, content-type, caching).
- HTTP is **Stateless**; cookies and tokens are used to remember users.
- Use the **Network Tab** to see the truth of what your app is doing.

## 7. What's Next
You've learned the protocol of the web. You know how data travels. But so far, you've only been the "Client" asking for things. Next week, we start building the "Server" that provides those things. We'll explore **REST API Design**, learning how to architect a system of URLs and methods that millions of clients can use to interact with your data in a clean, predictable way.
