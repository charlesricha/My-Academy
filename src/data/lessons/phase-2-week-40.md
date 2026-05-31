# Week 40: Third-party APIs

## 1. Overview (Why This Exists)
As a software engineer, your most precious resource is **Time**. You should only build things that are core to your unique product. You shouldn't spend months building a secure payment gateway or a high-performance image optimization server because companies like **Stripe** and **Cloudinary** have already spent decades perfecting them. Using **Third-party APIs** allows you to "subcontract" the hardest parts of your infrastructure to world-class specialists. This week, we learn how to integrate these heavy-duty tools, focusing on the two most common requirements for any real-world app: **File Uploads** and **Payments**.

## 2. Core Concepts

### 1. Don't Store Files in Your Database
**Rule #1 of Scale**: Databases are for structured data (text, numbers), not binary files (images, PDFs). 
- If you store a 5MB image in Postgres, your backups will become massive, your queries will slow down, and your server will run out of RAM.
- **The Fix**: Upload the file to a **Cloud Storage** provider (like Cloudinary or AWS S3). They give you a **URL** back, and you store that tiny text URL in your database.

### 2. Payment Security (PCI Compliance)
Handling credit card numbers is a massive legal and security liability. If you store a raw card number and get hacked, you are legally responsible.
- **The Solution**: Use **Stripe**. The user's card info goes directly to Stripe's servers, never touching yours. Stripe gives you a "Token" or a "Session ID" that you can use to process the charge safely.

### 3. The Webhook Pattern
API calls are usually synchronous (Request -> Wait -> Response). But some things take time (like a user finishing a payment or a video being transcoded).
- **Webhooks**: Instead of your server asking Stripe "Is it done yet?" 100 times (**Polling**), you give Stripe a URL on your server. When the payment is successful, Stripe calls *your* server to tell you: "Hey, the payment for Order #123 is finished."

### 4. SDKs vs. Raw HTTP
Most major APIs provide an **SDK (Software Development Kit)**—a library for Node.js that wraps their API in easy-to-use functions. Always use the SDK if it's available; it handles retry logic, timeouts, and security automatically.

## 3. Code Examples

### Example 1: Image Upload with Cloudinary (SDK)
Moving binary data off your server as fast as possible.

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

async function uploadProfilePicture(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "user_profiles",
            transformation: [{ width: 500, height: 500, crop: "limit" }] // Auto-resize!
        });
        
        // This 'result.secure_url' is what you save in Postgres!
        return result.secure_url;
    } catch (err) {
        console.error("Upload failed", err);
    }
}
```

### Example 2: Stripe Checkout (The "Safe" Way)
Redirecting the user to Stripe's secure page.

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            price_data: {
                currency: 'usd',
                product_data: { name: 'Creatives Academy Pro' },
                unit_amount: 2000, // $20.00
            },
            quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://mysite.com/success',
        cancel_url: 'https://mysite.com/cancel',
    });

    res.json({ id: session.id });
});
```

### Example 3: Verifying a Webhook
Ensuring the "Payment Successful" message actually came from Stripe and not a hacker.

```javascript
app.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Stripe verifies the signature using your secret "Webhook Key"
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        // Fulfill the purchase in your database...
        console.log(`Payment for ${session.amount_total} succeeded!`);
    }

    res.json({received: true});
});
```

## 4. Common Mistakes

### 1. Storing Secrets in Git (Again!)
Accidentally committing your `STRIPE_SECRET_KEY`. If this happens, **revoke the key immediately** in the Stripe dashboard. Hackers have bots that scan GitHub for keys every second.

### 2. Not Verifying Webhook Signatures
Trusting any request that hits your `/webhook` endpoint. A hacker can send a fake "Payment Success" JSON to that URL and get your product for free. **Always use the SDK to verify the signature.**

### 3. Blocking the UI during Uploads
Making the user wait for a 10MB upload to finish before showing a "Success" message. **Always show a progress bar in React** and handle the upload asynchronously.

### 4. Ignoring the "Sandbox" Environment
Testing your code with your real credit card. Every professional API has a **Test Mode** (Sandbox). Use "Test Keys" and fake card numbers (like Stripe's 4242...4242) during development.

## 5. Mental Model
Imagine you are building a **High-End Restaurant**.
- **The Core Product**: Your recipes and the dining room experience (Your React/Express logic).
- **The Third-party APIs**: These are your **Subcontractors**.
    - **Cloudinary** is the **Produce Supplier**. You don't grow the tomatoes yourself; you just order them and they deliver them cleaned and ready to use.
    - **Stripe** is the **Security and Armored Truck Service**. You don't want to keep cash in the building. The armored truck takes the payments directly from the customers and just tells you when the money is safely in the bank.
- **Webhooks** are the **Delivery Notifications**. When the supplier drops off the tomatoes, they leave a note on the back door (The Webhook URL) to tell the chef they've arrived.

## 6. Key Takeaways
- Use **Cloud Storage** for files; store only the URLs in SQL.
- Use **Stripe** to avoid the massive risk of handling card data.
- **Webhooks** allow APIs to talk back to your server (Event-driven).
- **Always verify signatures** on incoming webhooks.
- Use **SDKs** over raw fetch/HTTP whenever possible.
- **Test Mode** is for development; **Live Mode** is only for production.

## 7. What's Next
Your app is now a real business. It can handle media and it can make money. But as you add more features and integrations, your app might start to feel "heavy" and slow. Next week, we move into **Web Performance**. We’ll learn how to audit our site, optimize our images, minify our code, and use advanced caching to ensure our users get a "lightning-fast" experience, no matter how complex our app becomes.
