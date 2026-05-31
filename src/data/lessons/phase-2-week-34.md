# Week 34: React Fundamentals

## 1. Overview (Why This Exists)
In Week 19, we learned DOM manipulation: finding an element, manually changing its text, and appending children. This is **Imperative** programming—you are giving the browser step-by-step instructions. As your app grows, this becomes a nightmare to track. If a user's name changes in the database, you have to remember to update the sidebar, the header, and the profile page manually. **React** solves this by being **Declarative**. You describe what the UI should look like for a given state, and React handles the "how" of updating the browser. This week, we learn to think in **Components**—the modular building blocks of the modern web.

## 2. Core Concepts

### 1. Declarative vs. Imperative
- **Imperative (The Old Way)**: "Go to the fridge, get the milk, pour it in the glass." (Manual DOM updates).
- **Declarative (The React Way)**: "I want a glass of milk." (You define the state, React makes it happen).
React's "Virtual DOM" compares your desired state with the actual browser state and only updates the tiny parts that actually changed. This makes it incredibly fast.

### 2. JSX: JavaScript XML
JSX looks like HTML, but it's actually JavaScript syntax. It allows you to write your UI structure right alongside your logic.
- `{ }`: Inside JSX, curly braces allow you to run any JavaScript expression (like variables or function calls).
- **Rules**: Every JSX expression must have a **Single Parent** element. You cannot return two `<div>`s side-by-side without wrapping them.

### 3. Components: The Building Blocks
A React Component is just a JavaScript function that returns JSX. 
- **Reusability**: You can write a `Button` component once and use it 100 times.
- **Composition**: You build complex UIs by nesting small, simple components inside each other.

### 4. Props: The Communication Channel
**Props** (short for Properties) are how you pass data from a parent component down to a child.
- Props are **Read-Only**. A child component should never try to change the props it receives.
- Think of them like function arguments for your UI components.

## 3. Code Examples

### Example 1: Your First Component
The simplest building block.

```jsx
// A functional component
function WelcomeBanner() {
    const siteName = "Creatives Academy";
    
    return (
        <header className="banner">
            <h1>Welcome to {siteName}</h1>
            <p>Mastering engineering, one component at a time.</p>
        </header>
    );
}
```

### Example 2: Passing Data with Props
Making components dynamic and reusable.

```jsx
// Child Component
function UserCard(props) {
    return (
        <div className="card">
            <h3>{props.name}</h3>
            <p>Role: {props.role}</p>
        </div>
    );
}

// Parent Component
function TeamList() {
    return (
        <section>
            <h2>Our Engineering Team</h2>
            <UserCard name="Alice" role="Senior Engineer" />
            <UserCard name="Bob" role="DevOps Specialist" />
            <UserCard name="Charlie" role="Frontend Lead" />
        </section>
    );
}
```

### Example 3: Rendering Lists
How to handle dynamic data arrays in React.

```jsx
function TechStack() {
    const technologies = ["React", "Node.js", "PostgreSQL", "C++"];

    return (
        <ul>
            {technologies.map((tech, index) => (
                // Every list item needs a unique 'key' for React's performance!
                <li key={tech}>{tech}</li>
            ))}
        </ul>
    );
}
```

## 4. Common Mistakes

### 1. Using `class` instead of `className`
In JSX, you are writing JavaScript. Since `class` is a reserved word in JS (for OOP), React uses `className` for CSS classes.

### 2. Mutating Props
Trying to change a prop value inside a child component. **Props are immutable.** If you need to change data, that's where "State" comes in (next week!).

### 3. Forgetting the "Single Parent" Rule
Trying to return multiple elements without a wrapper.
```jsx
// WRONG
return (
  <h1>Title</h1>
  <p>Description</p>
);

// RIGHT (Use a Fragment <> or a div)
return (
  <>
    <h1>Title</h1>
    <p>Description</p>
  </>
);
```

### 4. Not using "Keys" in Lists
React needs keys to keep track of which items in a list have changed, been added, or been removed. If you omit keys, your UI might glitch or perform poorly.

## 5. Mental Model
Imagine you are a **Lego Architect**.
- **Components** are the specific types of Lego bricks (the 2x4 red brick, the window piece, the wheel).
- **Props** are the **Customizations** you apply to a brick when you snap it in (is the window blue or clear?).
- **JSX** is the **Blueprint**. You don't have to manually glue the plastic together; you just draw the design, and the "React Factory" (the Virtual DOM) builds it perfectly for you. If you change the blueprint, the factory replaces only the bricks that moved.

## 6. Key Takeaways
- React is **Declarative**: Focus on the *result*, not the steps.
- **Components** are independent, reusable pieces of UI.
- **JSX** is a syntax extension that allows HTML-like code inside JS.
- **Props** pass data down the component tree (One-way data flow).
- **Virtual DOM** is React's performance engine—it minimizes real browser updates.
- Always use **`className`** and provide **`keys`** for list items.

## 7. What's Next
You’ve learned the structure of React. You can build a static UI with components and props. But static sites are boring. Next week, we move into **React Hooks**. We’ll learn how to add "Memory" to our components using `useState` and how to handle side-effects (like fetching data) using `useEffect`, turning our static components into dynamic, interactive applications.
