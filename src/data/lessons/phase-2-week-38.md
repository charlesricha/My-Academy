# Week 38: OAuth Basics

## 1. Overview (Why This Exists)
If you've ever clicked "Log in with Google" or "Log in with GitHub," you've used **OAuth**. Most users are tired of creating new passwords for every small app they use. As an engineer, you don't want the liability of storing thousands of passwords if you don't have to. OAuth is a protocol that allows a user to "delegate" their authority. It tells your app: "I trust Google to tell you who I am, so you don't need a password from me." This week, we learn how to tap into the massive identity infrastructure of the web giants to make our apps more user-friendly and secure.

## 2. Core Concepts

### 1. The Four Players
OAuth is a dance between four parties:
1. **The Resource Owner**: The User (They own their Google profile).
2. **The Client**: Your App (The one asking for permission).
3. **The Authorization Server**: Google/GitHub (The one who verifies the user).
4. **The Resource Server**: Google/GitHub (The one holding the data, like email or avatar).

### 2. Scopes: Limited Power
When a user logs in via OAuth, your app asks for specific **Scopes** (permissions).
- `profile`: Can see name and picture.
- `email`: Can see the email address.
- `contacts.readonly`: Can see (but not change) contacts.
**Key Rule**: Always request the *minimum* possible scope. Users will abandon your app if you ask for permission to "Read and Write their Private Messages."

### 3. The Auth Code Flow (The Secure Way)
1. **Redirect**: Your app sends the user to Google.
2. **Consent**: User says "Yes, I allow Creatives Academy to see my email."
3. **The Code**: Google sends the user back to your app with a temporary "Auth Code" in the URL.
4. **The Exchange**: Your server (Node.js) sends that Code + your **Client Secret** back to Google.
5. **The Token**: Google verifies the secret and sends you an **Access Token**. 
6. **The Data**: You use that token to fetch the user's name and email.

### 4. Client ID vs. Client Secret
- **Client ID**: Public identifier for your app. Safe to put in React.
- **Client Secret**: Private password for your app. **MUST** stay on your server (Node.js).

## 3. Code Examples

### Example 1: Starting the OAuth Dance (The Redirect)
Constructing the URL to send the user to GitHub.

```javascript
app.get('/auth/github', (req, res) => {
    const rootUrl = "https://github.com/login/oauth/authorize";
    
    const options = {
        client_id: process.env.GITHUB_CLIENT_ID,
        redirect_uri: "http://localhost:3000/auth/github/callback",
        scope: "user:email",
        state: "some_random_string_for_security" // Prevents CSRF attacks
    };

    const qs = new URLSearchParams(options).toString();
    res.redirect(`${rootUrl}?${qs}`);
});
```

### Example 2: Handling the Callback (The Exchange)
Exchanging the temporary code for a permanent access token.

```javascript
app.get('/auth/github/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange code for Access Token
        const response = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json" 
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code
            })
        });

        const { access_token } = await response.json();

        // Use the token to get User Profile
        const userResponse = await fetch("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        
        const userData = await userResponse.json();
        
        // Log them into YOUR system
        // (Usually by creating a user in Postgres and issuing a JWT)
        res.json({ message: "Success!", user: userData.login });
    } catch (err) {
        res.status(500).json({ error: "Auth Exchange Failed" });
    }
});
```

## 4. Common Mistakes

### 1. Leaking the Client Secret
Putting the `GITHUB_CLIENT_SECRET` in your React frontend code. A hacker can steal it, pretend to be your app, and trick your users. **The exchange must happen on the backend.**

### 2. Forgetting the `state` Parameter
The `state` parameter is a random string you send to the provider. They send it back to you. If the `state` you get back doesn't match the one you sent, someone is trying to hijack the session.

### 3. Requesting "Master" Scopes
Asking for `repo` or `write` access when you only need an email. This is a security risk for the user and a trust-killer for your brand.

### 4. Hardcoding Redirect URIs
Using `http://localhost:3000` in your production settings. You must register separate redirect URIs for your "Dev" environment and your "Production" (Live) environment.

## 5. Mental Model
Imagine OAuth is a **Valet Key** for a high-end car.
- **The Owner** is the User.
- **The House (Full Data)** is Google/GitHub.
- **The Valet Key** is the Access Token.
- When you give a valet your key, you aren't giving them your house keys or your wallet. You are giving them a **Specific Key** that only works for the car, and only for a short time. 
- You (The User) are the one who grants the valet (The App) the key. Google (The Locksmith) makes the key only after seeing your ID.

## 6. Key Takeaways
- **OAuth** is for Authorization (Giving permissions), not just Authentication.
- Use **Scopes** to limit the power your app has over user data.
- The **Auth Code Flow** is the standard for web apps because it keeps secrets off the client.
- **Client Secret** = Backend only. **Client ID** = Frontend safe.
- Social login increases user conversion and reduces your security liability.
- Always use a **JWT** (Week 37) to maintain the session *after* the OAuth dance is done.

## 7. What's Next
You can now securely identify users using their own passwords or their social accounts. Your app is open for business! But security is an ongoing war. Next week, we move into **Web Security**. We’ll learn about the "Top 5" attacks (like XSS and CSRF) that take down real companies every day and how to harden your Node and React code against them.
