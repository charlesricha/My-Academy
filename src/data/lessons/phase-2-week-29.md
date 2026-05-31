# Week 29: SQL Fundamentals

## 1. Overview (Why This Exists)
Up to this point, your data has lived in RAM or in simple text files. RAM is volatile (it vanishes on restart), and text files are unsearchable once they grow beyond a few thousand lines. **SQL (Structured Query Language)** is the universal language of professional data storage. It allows you to store millions of rows of data and find exactly what you need in milliseconds. Unlike JavaScript or C++, SQL is a **Declarative** language—you don't tell the computer *how* to find the data; you describe *what* data you want, and the database engine (the RDBMS) figures out the fastest way to get it. This is the bedrock of every banking system, social network, and e-commerce site on Earth.

## 2. Core Concepts

### 1. The Relational Model
A relational database organizes data into **Tables**. 
- **Columns (Fields)**: Define the type of data (e.g., `username` is a string, `age` is an integer).
- **Rows (Records)**: A single entry in the table.
- **Primary Key**: A unique identifier for every row (usually an `id`). It ensures no two rows are identical and allows you to reference a specific record.

### 2. SQL: The Three Sub-languages
SQL is divided into three main parts:
- **DDL (Data Definition)**: Creating and changing the structure (e.g., `CREATE TABLE`, `ALTER TABLE`).
- **DML (Data Manipulation)**: Working with the actual data (e.g., `INSERT`, `UPDATE`, `DELETE`).
- **DQL (Data Querying)**: Asking questions (e.g., `SELECT`).

### 3. The Power of `SELECT`
The `SELECT` statement is where you'll spend 90% of your time. 
- **`WHERE`**: Filters the results.
- **`ORDER BY`**: Sorts the results.
- **`LIMIT`**: Restricts the number of results (crucial for pagination, Week 26).

### 4. Data Integrity: Types and Constraints
Unlike JavaScript, SQL is **Strictly Typed**. If a column is an `INTEGER`, you cannot put a string in it.
- **`NOT NULL`**: Ensures a field is never empty.
- **`UNIQUE`**: Ensures no duplicates (like emails).
- **`DEFAULT`**: Provides a value if none is given.

## 3. Code Examples

### Example 1: Creating a Table (DDL)
Defining the "Skeleton" of our data.

```sql
-- Create a users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,        -- Auto-incrementing unique ID
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER CHECK (age >= 18), -- Validation constraint
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Example 2: Managing Data (DML)
Adding, updating, and removing records.

```sql
-- 1. Create (Insert)
INSERT INTO users (username, email, age) 
VALUES ('creative_coder', 'alice@example.com', 25);

-- 2. Update
UPDATE users 
SET age = 26 
WHERE username = 'creative_coder'; -- NEVER forget the WHERE clause!

-- 3. Delete
DELETE FROM users 
WHERE id = 1;
```

### Example 3: Querying Data (DQL)
Finding exactly what you need.

```sql
-- Find the 5 oldest users who have an @example.com email
SELECT username, age, email 
FROM users 
WHERE email LIKE '%@example.com' 
  AND age IS NOT NULL
ORDER BY age DESC 
LIMIT 5;
```

## 4. Common Mistakes

### 1. The "WHERE-less" Update/Delete
Running `DELETE FROM users` without a `WHERE` clause. This will delete **EVERY** user in your database. This is a legendary way to lose your job. **Always run a `SELECT` with your `WHERE` clause first to verify what you are about to delete.**

### 2. SQL Injection
Using string concatenation in your Node.js code to build queries: `query = "SELECT * FROM users WHERE id = " + userInput`. A hacker can enter `1; DROP TABLE users;` and destroy your database. **Always use "Parameterized Queries" (Week 31).**

### 3. Using `SELECT *` in Production
Asking for every column when you only need the `username`. This wastes memory and network bandwidth, especially as your tables grow. **Be specific: `SELECT username, email...`**

### 4. Thinking ID 1 is the same as ID 1.0
SQL is very strict about types. Comparing a string `'1'` to an integer `1` might work in some databases but fail in others. Be consistent.

## 5. Mental Model
Imagine a SQL Database is a **World-Class Filing Cabinet**.
- **The Table** is a **Drawer** labeled "Users."
- **The Schema** is the **Form** that every person must fill out before they can be put in the drawer. It ensures every file has a "Name," "Date of Birth," and "ID."
- **The SQL Query** is a **Super-Powered Intern**. You don't tell the intern to "Open the drawer, look at every folder, check the age, and write down the names." You just say: "Give me the names of everyone over 30." The intern (The Database Engine) is incredibly fast and knows exactly where every folder is indexed.

## 6. Key Takeaways
- SQL is **Declarative**: Describe *what* you want, not *how* to get it.
- **Tables** are the fundamental unit of storage.
- **Primary Keys** are the unique fingerprints of your data.
- **Constraints** (`NOT NULL`, `UNIQUE`) are your first line of defense against bad data.
- **`WHERE`** clauses are non-negotiable for `UPDATE` and `DELETE`.
- **`SELECT *`** is for debugging; specific column names are for production.

## 7. What's Next
You can store data in tables. But in the real world, data is messy and repetitive. If a user has 50 posts, do you store their username and email 50 times? No. Next week, we move into **DB Normalization**. We’ll learn how to split our data into multiple tables and use **Relationships** and **Joins** to connect them, ensuring our database is efficient, consistent, and "DRY" (Don't Repeat Yourself).
