# Week 30: DB Normalization

## 1. Overview (Why This Exists)
In the beginning, you might be tempted to put everything into one giant table. Why not have a `orders` table that also includes the user's address, their credit card info, and the list of items they bought? This is a "God Table," and it is the fastest way to kill a production system. As your data grows, redundancy leads to **Update Anomalies** (changing an address in one place but forgetting the other 50 rows), massive storage waste, and slow queries. **Database Normalization** is the formal process of organizing data to minimize redundancy and ensure every piece of information lives in exactly one place. This isn't academic theory; it is the difference between a database that stays fast for 10 years and one that collapses under its own weight in 6 months.

## 2. Core Concepts

### 1. The Relationship: Foreign Keys
The glue of normalization is the **Foreign Key (FK)**. A foreign key is a column in one table that points to the **Primary Key (PK)** of another.
- It creates a link between data (e.g., an `order` row points to a `user_id`).
- It enforces **Referential Integrity**: The database won't let you delete a user if they still have orders attached (unless you specifically allow it).

### 2. First Normal Form (1NF): Atomic Values
A table is in 1NF if every cell contains a single, "atomic" value.
- **The Violation**: Storing a comma-separated list of items in one column: `"Apples, Bananas, Bread"`. 
- **The Fix**: Each item gets its own row. If a user has three hobbies, you don't put three hobbies in one row; you create three rows (or a separate `hobbies` table).

### 3. Second Normal Form (2NF): No Partial Dependencies
2NF applies to tables with "Composite Keys" (keys made of two columns). It says that every column must depend on the *whole* key, not just part of it.
- **The Violation**: In a `course_students` table where the key is `(student_id, course_id)`, if you also store the `course_name`, that's a violation. The `course_name` depends only on the `course_id`, not the student.
- **The Fix**: Move the course info to a dedicated `courses` table.

### 4. Third Normal Form (3NF): No Transitive Dependencies
This is the "Gold Standard" for most web apps. It says: "Every column must depend on the key, the whole key, and nothing but the key."
- **The Violation**: In a `users` table, storing `zip_code` and `city`. `city` depends on the `zip_code`, which depends on the `user_id`. That's a transitive dependency.
- **The Fix**: Create a `zip_codes` table where the city is stored once.

### 5. Joins: Putting it Back Together
Once you've split your data into 10 tables, how do you see it as one view? You use **JOINS**.
- **INNER JOIN**: Returns only the rows where there is a match in both tables.
- **LEFT JOIN**: Returns all rows from the left table, even if there's no match in the right (useful for "Users who haven't made an order yet").

## 3. Code Examples

### Example 1: The Messy "God Table" (Denormalized)
Imagine a spreadsheet-style table where redundancy runs wild.

| id | user_name | user_email | product_name | price |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Alice | alice@me.com | Laptop | 1200 |
| 2 | Alice | alice@me.com | Mouse | 25 |
| 3 | Bob | bob@me.com | Laptop | 1200 |

*Problem*: If Alice changes her email, we have to update multiple rows. If Laptop price changes, we update multiple rows.

### Example 2: Normalizing into 3NF
Splitting the logic into focused tables.

```sql
-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- 3. Orders Table (The Glue)
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),    -- Foreign Key
    product_id INTEGER REFERENCES products(id), -- Foreign Key
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Example 3: Using JOIN to Reconstruct the Data
Querying the normalized structure to get the same view as Example 1.

```sql
SELECT 
    u.username, 
    p.name AS product, 
    p.price
FROM orders o
INNER JOIN users u ON o.user_id = u.id
INNER JOIN products p ON o.product_id = p.id
WHERE u.username = 'Alice';
```

## 4. Common Mistakes

### 1. Over-Normalization
Splitting every single possible field into its own table (e.g., putting `first_name` and `last_name` in separate tables). This leads to "Join Hell," where every query requires 15 joins, killing performance. **Normalize until it hurts, then denormalize until it works.**

### 2. Orphaned Records
Deleting a user but leaving their orders in the database with a `user_id` that points to nothing. Always use **`ON DELETE CASCADE`** or **`ON DELETE SET NULL`** to manage relationships automatically.

### 3. Missing Indexes on Foreign Keys
Foreign keys are used for Joins. If you don't add an **Index** to your foreign key columns, the database has to scan every single row every time you perform a join. A table with 1 million rows will become unusable.

### 4. Logic in the Database
Putting too much complex business logic in SQL (Triggers, Stored Procedures). This is hard to version control and hard to test. Keep the database for **Storage and Integrity**, keep the logic in your **Node.js** code.

## 5. Mental Model
Imagine you are organizing a **Massive Wardrobe**.
- **Denormalized**: You throw every outfit (Order) in a pile. The shirt, pants, and socks are all together. If you want to change all your blue shirts to red, you have to dig through every pile to find the blue ones.
- **Normalized**: You have a **Drawer for Shirts**, a **Drawer for Pants**, and a **Drawer for Socks**.
- **The Order** is just a **Post-it Note** that says: "Wear Shirt #5 with Pants #12 and Socks #2."
- If you want to change the color of Shirt #5, you do it in the Shirt Drawer **once**, and every Post-it note that references it is instantly "updated."

## 6. Key Takeaways
- **Normalization** is about removing redundancy and ensuring data integrity.
- **Foreign Keys** are the links that enforce rules between tables.
- **1NF** = No lists in cells; **2NF** = No partial keys; **3NF** = No "sideways" dependencies.
- **JOINS** allow you to query normalized data as a single cohesive unit.
- **Integrity over Storage**: Normalization makes your database smaller, but more importantly, it makes it "correct."
- Always index your Foreign Keys for performance.

## 7. What's Next
You know how to design a professional, normalized database. You can build schemas that scale. But so far, we've been writing SQL in a separate console. Next week, we bring it all together in **PostgreSQL & Node.js**. We’ll learn how to connect our JavaScript backend to a real PostgreSQL database, perform queries from our API routes, and handle the "Live" data that powers modern fullstack applications.
