# Week 36: Fullstack Integration

## 1. Overview (Why This Exists)
Up to this point, you've been a specialist—sometimes building frontends, sometimes building backends. But a real product is a unified system. **Fullstack Integration** is the process of connecting your React "User Interface" to your Node.js "Business Logic" and your PostgreSQL "Permanent Memory." This is where the true power of an engineer lies: the ability to build a feature end-to-end, from the pixel the user clicks to the row saved on a disk in a data center. This week, we learn to wire the "Nervous System" of our application.

## 2. Core Concepts

### 1. The Fullstack Data Loop
Every fullstack feature follows a predictable cycle:
1. **Trigger**: User performs an action in React (e.g., clicks "Save Note").
2. **Request**: React sends a `fetch` request (POST/GET/PUT) to an Express route.
3. **Process**: Express validates the request and runs a SQL query against Postgres.
4. **Response**: Postgres returns the data to Express, which sends a JSON response to React.
5. **Update**: React receives the JSON and updates its **State**, which triggers a re-render to show the new data to the user.

### 2. Development Proxying and CORS
In production, your frontend and backend usually live on the same domain. In development, they live on different ports (e.g., React on 3000, Express on 5000).
- **CORS**: As we learned in Week 20, the browser blocks this "cross-port" talk.
- **Proxy**: In React development, we set a "Proxy" in `package.json`. This tells the React server: "If you don't recognize a URL, send it to the Express server." This bypasses CORS and lets us use relative URLs like `/api/notes`.

### 3. Handling Asynchronous States
Because talking to a database takes time, your UI must handle three states for every integration:
- **Loading**: Showing a spinner or "Saving..." message.
- **Success**: Updating the UI with the fresh data.
- **Error**: Telling the user what went wrong (e.g., "Network Error").

### 4. Environmental Consistency
Your backend needs to know where the database is; your frontend needs to know where the API is. We use `.env` files on both sides to keep these configurations separate from our source code.

## 3. Code Examples

### Example 1: The Backend Route (Express + Postgres)
A professional route that returns the newly created item.

```javascript
// routes/notes.js
router.post('/api/notes', async (req, res) => {
    const { title, content } = req.body;
    
    try {
        const result = await db.query(
            'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
            [title, content]
        );
        // Always return 201 for a successful creation
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Failed to save note" });
    }
});
```

### Example 2: The Frontend Logic (React + Fetch)
Handling the state transition after the API call.

```jsx
function NoteApp() {
    const [notes, setNotes] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const addNote = async (newNote) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNote)
            });

            if (!response.ok) throw new Error("Server error");

            const savedNote = await response.json();
            
            // CRITICAL: Update the state so the UI reflects the DB!
            setNotes((prevNotes) => [...prevNotes, savedNote]);
        } catch (error) {
            alert("Could not save note: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };
    
    // ... render logic ...
}
```

## 4. Common Mistakes

### 1. "Optimistic UI" vs. "Real-Time Sync"
Updating the React state *before* the API call finishes. If the API fails, your UI is now out of sync with reality ("Lying to the user"). **Wait for the response before updating state, or implement a "rollback" strategy.**

### 2. Forgetting JSON Headers
Sending a `POST` request from React but forgetting `headers: { 'Content-Type': 'application/json' }`. Express will see an empty `req.body` and your database will error out.

### 3. Not Handling the 404/500 in React
As we learned in Week 20, `fetch` only rejects on network failure. If the backend returns a `500 Internal Server Error`, React's `catch` block won't run unless you manually `throw` an error after checking `response.ok`.

### 4. Hardcoding API URLs
Using `fetch('http://localhost:5000/api/notes')` in your React components. When you deploy to the web, this will break. **Use relative paths (`/api/notes`) and a proxy.**

## 5. Mental Model
Imagine Fullstack Integration as a **Trans-Atlantic Telegraph Cable**.
- **React** is the **Operator in London**. They type a message on the keyboard (User Action).
- **The Cable** is the **API Request**. It carries the message across the ocean (The Network).
- **Express** is the **Operator in New York**. They receive the message, check if it's valid, and go into the **Postgres Archive (The Vault)** to find or save information.
- **The Success Message** travels back across the cable.
- **React** receives the pulse and updates the **Status Board (The UI)** in London.
- If the cable snaps or the New York operator is asleep (Server Error), London needs to show a "Disconnected" sign.

## 6. Key Takeaways
- **Integration** is about syncing the UI (State) with the Database (Reality).
- Use **Development Proxies** to solve CORS during local work.
- Every API call needs **Loading** and **Error** handling in the UI.
- The backend should always return the **Created/Updated object** to help the frontend stay in sync.
- Use **Relative Paths** in `fetch` for portability.
- **`.env`** is the bridge for configuration.

## 7. What's Next
You have built a fully functional, connected application. Users can save data and see it on their screen. But right now, *anybody* can see and delete *anybody's* data. Your app is wide open. Next week, we start the most critical security phase of the curriculum: **JWT Auth**. We’ll learn how to issue "Digital ID Cards" to users so our server knows exactly who is making a request and can protect their private information.
