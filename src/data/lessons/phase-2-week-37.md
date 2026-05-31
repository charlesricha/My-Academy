# Week 37: JWT Auth

## 1. Overview (Why This Exists)
In a world of hackers and data breaches, **Authentication (Auth)** is the most critical part of your application. Up until now, your API was a "free-for-all"—anyone could read or delete any data. To build a real product, you need to know exactly who is making a request. **JWT (JSON Web Token)** is the industry standard for stateless authentication in modern web apps. It allows your server to issue a secure "Digital ID Card" to a user after they log in. Because this ID card is cryptographically signed, the server can trust it without having to check the database on every single request. This is how you build systems that are both secure and incredibly fast.

## 2. Core Concepts

### 1. Password Hashing with Bcrypt
**Rule #1 of Engineering**: Never store passwords in plain text. If your database is leaked, every user is compromised.
- **Hashing**: A one-way mathematical function that turns a password into a scrambled "hash." 
- **Salting**: Adding random data to the password before hashing to prevent hackers from using pre-calculated tables (Rainbow Tables).
- **Bcrypt**: The standard library used to handle hashing and salting automatically.

### 2. The Anatomy of a JWT
A JWT is a string made of three parts, separated by dots:
- **Header**: Tells the server what algorithm was used to sign it.
- **Payload**: The "ID Card" data (e.g., `userId: 42`). **Never put passwords or sensitive data here**, as it's only encoded, not encrypted.
- **Signature**: The most important part. It’s a hash of the Header + Payload + a **Secret Key** known only to your server. If a hacker changes the `userId` in the payload, the signature will no longer match, and the server will reject the token.

### 3. The Auth Flow
1. **Login**: User sends username/password to Express.
2. **Verify**: Express finds the user in Postgres and compares hashes using Bcrypt.
3. **Issue**: If correct, Express signs a JWT with its Secret Key and sends it to the client.
4. **Storage**: The client (React) saves the JWT (usually in a Cookie or State).
5. **Request**: The client sends the JWT in the `Authorization` header for every future API call.
6. **Authorize**: Express verifies the signature. If valid, it trusts the `userId` in the payload.

### 4. Authorization vs. Authentication
- **Authentication**: "Who are you?" (The ID Card).
- **Authorization**: "Are you allowed to do this?" (Checking if user #42 is allowed to delete post #99).

## 3. Code Examples

### Example 1: Password Hashing (Bcrypt)
The foundation of user security.

```javascript
const bcrypt = require('bcrypt');

async function registerUser(password) {
    const saltRounds = 10;
    // This generates a salt and hashes the password together
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Save 'hashedPassword' to your Postgres DB
    console.log("Hash to store:", hashedPassword);
}

async function loginUser(inputPassword, storedHash) {
    // Bcrypt compares the input to the hash
    const isMatch = await bcrypt.compare(inputPassword, storedHash);
    return isMatch; // true or false
}
```

### Example 2: Signing and Verifying JWTs
The handshake between the server and the client.

```javascript
const jwt = require('jsonwebtoken');

// 1. Sign a token (After successful login)
const token = jwt.sign(
    { userId: 101, role: 'admin' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' } // Security: tokens should expire!
);

// 2. The Auth Middleware (Protecting Routes)
function authenticateToken(req, res, next) {
    // Expected Header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Missing Token" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or Expired Token" });
        
        // Add the verified user data to the request object
        req.user = user;
        next();
    });
}
```

### Example 3: Protecting a Private Route
Using the middleware to enforce security.

```javascript
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    // We can trust req.user because the middleware verified the JWT
    const userId = req.user.userId;
    const userData = await db.query('SELECT * FROM stats WHERE user_id = $1', [userId]);
    res.json(userData.rows);
});
```

## 4. Common Mistakes

### 1. Storing Secrets in the Payload
Thinking the JWT is "encrypted." It is only "signed." Anyone can go to `jwt.io`, paste your token, and read the payload. **Never put credit card numbers, passwords, or emails in the JWT payload.**

### 2. Hardcoding the `JWT_SECRET`
Putting your secret key in your source code. If you push this to GitHub, your entire security system is useless. **Always use an environment variable.**

### 3. Weak Secret Keys
Using a secret like "123456" or "password." Hackers can brute-force your signature in seconds. Use a long, random string (e.g., generated by `openssl rand -base64 32`).

### 4. Not Setting Expiration
Issuing tokens that never expire. If a user's computer is compromised and the token is stolen, the hacker has access forever. **Set reasonable expirations (e.g., 1 hour or 1 day).**

## 5. Mental Model
Imagine a JWT is a **VIP Wristband** at a Music Festival.
- **Authentication**: You go to the ticket booth (Login) and show your ID (Username/Password).
- **Signing**: The staff verifies your ID and puts a high-tech wristband on you. This wristband has your name printed on it and a **Special Holographic Stamp** (The Signature) that can't be forged.
- **State**: The staff doesn't need to check your ID every time you enter a stage. They just look at the wristband.
- **Security**: If you try to write "Manager" on your wristband with a marker, the Holographic Stamp won't match the new text, and the security guard (The Auth Middleware) will throw you out.

## 6. Key Takeaways
- **Never** store plain text passwords; use Bcrypt.
- A **JWT** is a signed ID card that allows for stateless authentication.
- The **Payload** is public; the **Signature** is secure.
- Use the **Authorization Header** with the `Bearer` scheme.
- Tokens **must expire** to limit the damage of a stolen token.
- **`jwt.verify`** is the "gatekeeper" for your private routes.

## 7. What's Next
You have built a secure "In-House" auth system. You can register and log in users safely. But most modern users don't want to create *another* account; they want to "Log in with Google" or "Log in with GitHub." Next week, we move into **OAuth Basics**. We’ll learn how to allow users to authenticate using third-party providers, tapping into the massive security infrastructure of the giants of the web.
