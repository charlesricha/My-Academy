# Week 35: React Hooks

## 1. Overview (Why This Exists)
In the previous week, our components were "pure"—they took data in (props) and spat UI out. But real apps need to **remember** things: Is this menu open? Is the user logged in? What did the API return? Before 2019, you had to use complex "Class Components" to handle this. **React Hooks** changed the game by allowing functional components to hook into React's internal state and lifecycle engines. They are the tools that turn a "stateless template" into a "stateful application." This week, we learn to manage the "Brain" of our components.

## 2. Core Concepts

### 1. `useState`: The Component's Memory
`useState` allows a component to keep track of data that changes over time.
- It returns an array with two items: the **Current Value** and a **Setter Function**.
- When you call the setter function, React re-renders the component with the new data.
- **State is Private**: Unlike props, state is owned and managed entirely within the component.

### 2. `useEffect`: Managing Side Effects
Your component’s primary job is to return JSX. Anything else—fetching data from an API, manually changing the DOM, or setting a timer—is a "Side Effect."
- `useEffect` takes a function (the effect) and a **Dependency Array**.
- **The Array**: If empty `[]`, the effect runs once when the component mounts. If it contains variables `[id]`, the effect runs every time those variables change.

### 3. The Rules of Hooks
Hooks are powerful but have strict rules to ensure React can track them correctly:
1. **Top Level Only**: Never call hooks inside loops, conditions, or nested functions.
2. **React Functions Only**: Only call hooks from React function components or custom hooks.

### 4. Custom Hooks: Reusable Logic
This is the "Senior Level" skill. If you find yourself writing the same `useState` and `useEffect` logic in three different components (e.g., for fetching data or tracking window size), you can extract that logic into a **Custom Hook**. This follows the "DRY" (Don't Repeat Yourself) principle at a high architectural level.

## 3. Code Examples

### Example 1: `useState` (A Simple Counter)
Notice how we never touch the DOM; we only update the state.

```jsx
import { useState } from 'react';

function Counter() {
    // Initial state is 0
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            {/* The setter function triggers a re-render */}
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

### Example 2: `useEffect` (Fetching Data)
The standard pattern for talking to an API in React.

```jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This runs whenever 'userId' changes
        async function fetchData() {
            setLoading(true);
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();
            setUser(data);
            setLoading(false);
        }

        fetchData();
    }, [userId]); // Dependency Array

    if (loading) return <p>Loading...</p>;
    return <h1>{user.name}</h1>;
}
```

### Example 3: A Custom Hook for Window Width
Extracting reusable logic.

```jsx
import { useState, useEffect } from 'react';

// Custom hooks must start with "use"
function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        
        // CLEANUP: Return a function to remove the listener
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}

// Usage in any component:
function MyComponent() {
    const width = useWindowWidth();
    return <p>Window width is: {width}</p>;
}
```

## 4. Common Mistakes

### 1. The Infinite Loop
Calling a setter function inside `useEffect` without a dependency array (or including the state variable in the array).
```jsx
useEffect(() => {
    setCount(count + 1); // BUG: This triggers a re-render, which runs the effect again...
});
```

### 2. Missing Dependencies
Using a variable inside `useEffect` but forgetting to list it in the dependency array. This leads to **Stale Closures**, where the effect uses an old version of the variable from a previous render.

### 3. Forgetting the Cleanup Function
Setting a `setInterval` or an Event Listener in `useEffect` but not removing it. When the component "unmounts" (is removed from the screen), the timer keeps running in the background, causing memory leaks and crashes.

### 4. Over-using State
Putting every single variable in `useState`. If a value can be calculated from props or other state variables (e.g., `fullName = firstName + lastName`), **do not put it in state.** Keep your state "minimal."

## 5. Mental Model
Imagine your component is a **Field Researcher**.
- **Props** are the **Equipment** the researcher is given before heading out.
- **State (`useState`)** is the **Notebook** the researcher carries. They write down observations (e.g., "The user clicked the button"). When they write in the notebook, they take a fresh look at the field (Re-render).
- **`useEffect`** is the **Mission Brief**. "Once you arrive (Mount), check the weather. If the weather changes (Dependency), check it again. Before you leave (Unmount), pack up your gear (Cleanup)."

## 6. Key Takeaways
- **`useState`** is for data that changes; **`useEffect`** is for everything else.
- Re-renders happen whenever **State** or **Props** change.
- The **Dependency Array** controls when an effect runs.
- **Cleanup functions** prevent memory leaks.
- **Custom Hooks** are the best way to share logic between components.
- Never call hooks inside conditionals—React relies on the **Order** of hook calls.

## 7. What's Next
You have the "Brain" and the "Skeleton" of the modern web. You can build complex, stateful components that talk to APIs. But right now, your Frontend and Backend are separate projects. Next week, we move into **Fullstack Integration**. We’ll learn how to connect your React dashboard to your Node/Express/Postgres backend, creating a cohesive, production-grade application that manages data from the database all the way to the user's screen.
