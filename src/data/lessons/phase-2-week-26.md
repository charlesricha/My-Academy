# Week 26: REST API Design

## 1. Overview (Why This Exists)
An API is a contract between a server and its clients. If that contract is messy, your frontend developers will hate you, your mobile app will be buggy, and your system will be impossible to scale. **REST (REpresentational State Transfer)** is the industry-standard architectural style for building APIs. It uses the HTTP protocol (from Week 25) to its fullest potential. Instead of creating a hundred random URLs like `/get-all-users` or `/deleteUser123`, REST teaches you to treat your data as **Resources**. This week, we learn how to design an API that is predictable, self-documenting, and elegant.

## 2. Core Concepts

### 1. Resources, Not Actions
In REST, the URL should always be a **Noun**, never a Verb. 
- **Wrong**: `GET /getAllBooks`, `POST /createNewUser`
- **Right**: `GET /books`, `POST /users`
The "Action" is defined by the **HTTP Method** (GET, POST, etc.), not by the URL text.

### 2. The Four Pillars (CRUD)
REST maps perfectly to the four basic operations of any database:
- **CREATE**: `POST /books` (Send the new book in the Body).
- **READ**: `GET /books` (List all) or `GET /books/123` (Get one specific book).
- **UPDATE**: `PUT /books/123` (Replace the book) or `PATCH /books/123` (Update just one field).
- **DELETE**: `DELETE /books/123`.

### 3. Collection vs. Instance
- **Collection**: `/users` represents the entire list of users.
- **Instance**: `/users/42` represents one specific user with the ID 42.
- **Sub-resources**: `/users/42/posts` represents all posts belonging to user 42.

### 4. Meaningful Status Codes
A professional REST API uses the correct HTTP status codes to communicate:
- `200 OK`: Success (GET/PUT).
- `201 Created`: Success (POST).
- `204 No Content`: Success (DELETE).
- `400 Bad Request`: Client sent bad data (e.g., missing a required field).
- `401 Unauthorized`: Client forgot their token.
- `404 Not Found`: That ID doesn't exist.

## 3. Code Examples

### Example 1: The Anatomy of a RESTful Resource
How to map a "Task List" to a REST API.

| Task | HTTP Method | URL | Status Code |
| :--- | :--- | :--- | :--- |
| Fetch all tasks | `GET` | `/tasks` | `200` |
| Create a new task | `POST` | `/tasks` | `201` |
| Get a single task | `GET` | `/tasks/1` | `200` |
| Update task status | `PATCH` | `/tasks/1` | `200` |
| Delete a task | `DELETE` | `/tasks/1` | `204` |

### Example 2: Designing the JSON Body
When sending data to a REST API, keep the structure flat and consistent.

```json
// POST /users
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}

// Response: 201 Created
{
  "id": 101,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin",
  "created_at": "2026-07-27T12:00:00Z"
}
```

### Example 3: Filtering and Pagination
Don't return 10,000 items at once. Use Query Parameters.

```text
GET /products?category=electronics&sort=price_desc&page=2&limit=20
```
- **`category`**: Filtering.
- **`sort`**: Ordering.
- **`page/limit`**: Pagination. This is crucial for performance and preventing your server from crashing.

## 4. Common Mistakes

### 1. "Verby" URLs
Building URLs like `/users/edit/1` or `/delete-post`. This makes your API unpredictable. A developer should be able to guess your URLs once they know your resource names.

### 2. Always Returning 200 OK
Returning a `200 OK` but putting an error message in the JSON body: `{ "status": "error", "message": "Not Found" }`. This is a massive "Anti-pattern." **Use the HTTP status code (404) for the error.** It allows automated tools and proxies to understand what happened.

### 3. Inconsistent Naming
Using `/user` (singular) for one resource and `/products` (plural) for another. **Always use Plural Nouns** for resources. It’s the standard.

### 4. Versioning in the Path
Forgetting to version your API. If you change your JSON structure 6 months from now, you will break everyone's app. **Start with `/api/v1/users`**.

## 5. Mental Model
Imagine a REST API is a **Self-Service Library**.
- **The Library** is the **Server**.
- **The Books** are the **Resources**.
- **The Dewey Decimal Number** is the **URL (ID)**.
- **GET**: You take a book to the copier and make a copy (Read).
- **POST**: You donate a new book to the library (Create).
- **PUT**: You replace a damaged book with a new copy (Update).
- **DELETE**: You remove a book from the shelves (Delete).
- The library is organized. You don't have to ask the librarian for "the function to find a book." You just walk to the "Biography" section (The Resource) and look for the ID.

## 6. Key Takeaways
- **Resources** are nouns in the URL (`/orders`).
- **Methods** define the action (GET, POST, PUT, PATCH, DELETE).
- **Status Codes** communicate the result (200, 201, 400, 404).
- Use **Nesting** for relationships (`/users/1/posts`).
- Use **Query Params** for filtering and pagination.
- **JSON** is the standard body format.
- **Versioning** (`/v1`) protects your future self.

## 7. What's Next
You can now design a professional interface. You know how the contract should look. But right now, there's nobody on the other end of the line to fulfill the contract. Next week, we begin building the "Brain" of the operation with **Node.js from Scratch**. We’ll learn how to use JavaScript outside of the browser to create a real server that can listen to these REST requests and respond with real data.
