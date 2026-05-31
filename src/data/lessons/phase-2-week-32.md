# Week 32: Database Design

## 1. Overview (Why This Exists)
Building a database without a design is like building a house without a blueprint. You'll end up with rooms you can't reach, doors that don't open, and a foundation that won't hold the weight of your users. **Database Design** is the art of modeling the real world into a series of tables and relationships. This week, we stop writing "code" for a moment and start thinking about "Entities" and "Cardinality." We will architect a **School Management System**—a classic engineering challenge that involves students, teachers, classes, and grades. Mastering this skill is what allows you to lead high-level technical discussions and design systems that survive massive scale.

## 2. Core Concepts

### 1. The Entity Relationship Diagram (ERD)
An ERD is a visual map of your database. Before you write a single line of SQL, you draw boxes (Entities) and lines (Relationships).
- **Entity**: A "Thing" you need to store (e.g., Student, Teacher, Course).
- **Attribute**: A property of that thing (e.g., Student Name, Teacher Email).

### 2. Cardinality: The Three Relationships
This defines how many of "Entity A" relate to "Entity B."
- **One-to-One (1:1)**: A User has one Profile. (Rare, usually combined into one table).
- **One-to-Many (1:N)**: One Teacher has many Courses. (The most common type).
- **Many-to-Many (M:N)**: Many Students attend many Courses. This requires a **Join Table** (also called a Junction or Associative table).

### 3. The Junction Table
SQL cannot handle Many-to-Many relationships directly. If you have Students and Courses, you create a third table (e.g., `enrollments`) that holds two foreign keys: `student_id` and `course_id`. This table "resolves" the relationship into two One-to-Many links.

### 4. Indexing Strategy
An Index is like a "Table of Contents" for a specific column.
- **Why?**: Searching for a student by email in a table of 1 million rows takes seconds. With an index, it takes milliseconds.
- **Cost**: Indexes make `SELECT` faster but `INSERT` and `UPDATE` slower (the database has to update the index too). **Only index the columns you search by frequently.**

## 3. Code Examples

### Example 1: The School Schema (One-to-Many)
Linking teachers to courses.

```sql
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id) -- The One-to-Many link
);
```

### Example 2: The Junction Table (Many-to-Many)
Linking students to courses via enrollments.

```sql
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

CREATE TABLE enrollments (
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite Primary Key: A student can only enroll in a course ONCE
    PRIMARY KEY (student_id, course_id)
);
```

### Example 3: Adding Indexes for Speed
A professional touch for performance.

```sql
-- We often search for students by their last name
CREATE INDEX idx_students_last_name ON students(last_name);

-- We frequently filter enrollments by course
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

## 4. Common Mistakes

### 1. The "Circular" Relationship
Designing Table A to point to Table B, and Table B to point to Table A. This makes inserts and deletes a nightmare. Relationships should flow in one logical direction.

### 2. Forgetting "ON DELETE CASCADE"
If you delete a student, what happens to their 50 enrollment records? If you didn't set a "Cascade" rule, the database will block the deletion, leaving you with "Ghost data" or frustrated users.

### 3. Using Natural Keys (like SSN)
Using a user's Social Security Number or Email as the Primary Key. People change their names and emails. **Always use a "Surrogate Key" (like an auto-incrementing ID) as your Primary Key.**

### 4. Over-indexing
Adding an index to every single column in the database. This will cripple your database's performance when saving data. Be surgical with your indexes.

## 5. Mental Model
Imagine you are building a **City Map**.
- **Tables** are **Buildings** (Post Office, School, Library).
- **Foreign Keys** are the **Roads** connecting them.
- **Junction Tables** are the **Traffic Circles** where multiple roads meet.
- **Indices** are the **GPS Coordinates**. Without them, you have to drive down every single street in the city to find one specific house. With them, you drive straight to the front door.

## 6. Key Takeaways
- **ERDs** are mandatory for complex system design.
- **Many-to-Many** relationships always require a **Junction Table**.
- Use **Surrogate Keys** (IDs) for Primary Keys, never user data.
- **Referential Integrity** (Foreign Keys) prevents "broken links" in your data.
- **Indexes** are the secret to performance, but use them sparingly.
- **Cardinality** defines the "logic" of your business rules.

## 7. What's Next
You are now a Database Architect. You can model complex systems and ensure they remain performant and consistent. But a raw Node.js server (Week 27) with manual SQL calls (Week 31) is still very verbose. Next week, we move into **Express.js**, the most popular web framework in the Node ecosystem. We’ll learn how to use Express to streamline our routing, automate our middleware, and build the "Standard" backend stack used by thousands of companies.
