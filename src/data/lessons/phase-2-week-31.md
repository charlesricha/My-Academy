# Week 31: PostgreSQL & Node.js

## 1. Overview (Why This Exists)
In the previous weeks, we learned how to design databases (SQL) and how to build servers (Node.js). But they are currently two islands that cannot talk to each other. **PostgreSQL & Node.js** integration is where the "Fullstack" magic happens. This week, we learn how to use the `pg` driver to send SQL commands from our JavaScript code to the database. We will focus on building the plumbing of a modern app: establishing connections, handling query results, and most importantly, using **Parameterized Queries** to ensure our system is safe from the SQL injection attacks we discussed in Week 29.

## 2. Core Concepts

### 1. The PostgreSQL Driver (`pg`)
Node.js doesn't speak SQL natively. We use a "Driver"—a library that acts as a translator. The `pg` library is the industry standard for PostgreSQL. It takes your JavaScript strings, sends them over a TCP socket to the Postgres server, and returns the result as a JavaScript array of objects.

### 2. Connection Pooling
Opening a new connection to a database is expensive and slow. In a production app with 1,000 users, you can't open 1,000 connections.
- **The Pool**: A cache of open connections that are reused. When a request comes in, it "borrows" a connection from the pool, uses it, and "returns" it when finished. This is crucial for performance.

### 3. Parameterized Queries (The Shield)
This is the most important concept in backend security. You should **never** use template literals or string concatenation to build a query.
- **The Wrong Way**: `` `SELECT * FROM users WHERE id = ${userId}` ``
- **The Right Way**: `client.query('SELECT * FROM users WHERE id = $1', [userId])`
- **Why?**: By using `$1`, you tell Postgres: "This is a placeholder for data, not part of the command." Postgres will then treat the input as a literal string, making it impossible for a hacker to inject a `DROP TABLE` command.

### 4. Async/Await with Queries
Database operations take time (Disk I/O). We use `async/await` to handle these operations without blocking the Event Loop.

## 3. Code Examples

### Example 1: Setting up the Connection Pool
The boilerplate every backend dev needs.

```javascript
const { Pool } = require('pg');

// Configuration usually comes from .env (Week 16)
const pool = new Pool({
    user: 'creative_user',
    host: 'localhost',
    database: 'academy_db',
    password: 'secret_password',
    port: 5432,
});

// A helper function to run queries
async function query(text, params) {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
}

module.exports = { query };
```

### Example 2: A Secure User Fetch (GET)
Using parameterized queries to fetch data safely.

```javascript
const db = require('./db');

async function getUserById(userId) {
    try {
        // $1 is the placeholder. [userId] is the data.
        const result = await db.query(
            'SELECT username, email FROM users WHERE id = $1', 
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0]; // Returns { username: '...', email: '...' }
    } catch (err) {
        console.error('Database Error:', err);
        throw err;
    }
}
```

### Example 3: Inserting Data (POST)
Returning data from an insert using the `RETURNING` clause.

```javascript
async function createProduct(name, price) {
    const sql = `
        INSERT INTO products (name, price) 
        VALUES ($1, $2) 
        RETURNING id, created_at;
    `;
    
    // Postgres handles the auto-incrementing ID for us
    const result = await db.query(sql, [name, price]);
    
    return result.rows[0]; // Returns the new ID and timestamp
}
```

## 4. Common Mistakes

### 1. String Interpolation (The Job-Killer)
Using `` `... WHERE email = '${email}'` ``. I will repeat this every week because it is the #1 cause of major data breaches. **Always use `$1, $2` placeholders.**

### 2. Leaking the Pool
Creating a `new Pool()` inside a function that is called on every request. This will quickly exceed the maximum number of connections allowed by Postgres, and your server will crash. **Create one pool and export it.**

### 3. Forgetting to Handle Errors
Database queries *will* fail (connection timeout, constraint violation, etc.). If you don't wrap your `pool.query` in a `try/catch`, your entire Node.js process might crash.

### 4. Not Closing the Pool
When your server shuts down, you should call `pool.end()`. Otherwise, the connections will hang open on the database server for a while, potentially preventing a quick restart.

## 5. Mental Model
Imagine your Database is a **Highly Restricted Vault**.
- **Postgres** is the Vault.
- **Node.js** is you, standing outside the vault.
- **The Driver (`pg`)** is the **Security Guard** who stands at the slot in the door.
- You don't get to go inside. You write your request on a piece of paper (SQL) and hand it to the guard.
- **Parameterized Queries** are like putting the sensitive parts of your request (like your name) into a **Separate Envelope**. The guard checks the paper to make sure you didn't write "Please set the vault to self-destruct" before they open the envelope and process your data.

## 6. Key Takeaways
- Use the **`pg`** library to connect Node.js to PostgreSQL.
- **Connection Pooling** is mandatory for performance and stability.
- **Parameterized Queries** ($1, $2) are the only way to prevent SQL Injection.
- The **`RETURNING`** clause in SQL is the best way to get the ID of a newly created row.
- Database results are returned in **`result.rows`** as an array of objects.
- Always use **`try/catch`** around database calls.

## 7. What's Next
You have built the bridge. You can move data from a professional database to a JavaScript server. But as you build more complex apps, you'll find yourself repeating the same SQL patterns. Next week, we’ll do a deep-dive into **Database Design**, where we’ll practice architecting a real-world system (a School Management System) from scratch, ensuring our schemas are scalable and our relationships are perfect.
