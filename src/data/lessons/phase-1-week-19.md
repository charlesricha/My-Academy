# Week 19: JS: DOM Manipulation

## 1. Overview (Why This Exists)
Up to now, we've been running JavaScript in a vacuum. But JS was born for one specific purpose: to reach into a web page and change it. The **DOM (Document Object Model)** is the browser's way of turning an HTML file into a live tree of objects that your JavaScript can touch. This week is about **Interactivity**: learning how to select elements, change their text and styles, and listen for user actions like clicks and keyboard presses. This is the skill that turns a static document into an "App."

## 2. Core Concepts

### 1. The DOM Tree
When a browser loads HTML, it parses it into a tree structure.
- **Node**: Everything in the DOM is a node (Elements, Text, Comments).
- **Element**: A node that represents an HTML tag (like `<div>` or `<h1>`).
- **Hierarchy**: You can navigate the tree using `parentNode`, `children`, and `nextSibling`.

### 2. Selecting Elements: The Target
Before you can change something, you must find it.
- **`querySelector`**: The Swiss Army knife. It uses CSS selectors (e.g., `document.querySelector(".btn-active")`).
- **`querySelectorAll`**: Returns a "NodeList" of every matching element.

### 3. Modifying Elements
Once you have an element, you can change its state:
- **`textContent`**: Changes the text inside.
- **`innerHTML`**: Changes the actual HTML inside (Warning: Security risk!).
- **`style`**: Modifies CSS properties directly (e.g., `el.style.color = 'red'`).
- **`classList`**: The professional way to change styles—add/remove CSS classes instead of changing individual styles.

### 4. Events: The User's Voice
Events are how the browser tells you the user did something.
- **Event Listeners**: `element.addEventListener('click', callback)` is the standard way to listen.
- **Event Bubbling**: When you click a button, the click "bubbles" up to the parent, then the grandparent, all the way to the `window`.
- **Event Delegation**: Instead of adding a listener to 100 list items, you add **one** listener to the parent and check which item was clicked. This is a crucial optimization for performance.

## 3. Code Examples

### Example 1: Selecting and Modifying
A simple script that changes a heading when a button is clicked.

```javascript
// 1. Select the elements
const title = document.querySelector("#main-title");
const btn = document.querySelector(".action-btn");

// 2. Add an event listener
btn.addEventListener("click", () => {
    // 3. Modify the state
    title.textContent = "You clicked the button!";
    title.classList.toggle("highlighted");
    
    // Changing style directly
    btn.style.backgroundColor = "green";
});
```

### Example 2: Creating and Appending Elements
Building parts of the UI dynamically.

```javascript
const list = document.querySelector("#user-list");
const users = ["Alice", "Bob", "Charlie"];

users.forEach(name => {
    // 1. Create a new element
    const li = document.createElement("li");
    
    // 2. Configure it
    li.textContent = name;
    li.classList.add("list-item");
    
    // 3. Inject it into the DOM
    list.appendChild(li);
});
```

### Example 3: Event Delegation (The Pro Way)
Efficiently handling clicks on a large list.

```javascript
const parentList = document.querySelector("#task-list");

// Instead of adding a listener to every 'li', we add ONE to the 'ul'
parentList.addEventListener("click", (event) => {
    // Check if the thing actually clicked was a list item
    if (event.target.tagName === "LI") {
        console.log("Task clicked:", event.target.textContent);
        event.target.classList.toggle("completed");
    }
});
```

## 4. Common Mistakes

### 1. `innerHTML` Security Risk (XSS)
Using `innerHTML` to inject user-provided text. A malicious user could provide `<script>alert('hacked')</script>` and your site will run it. **Always use `textContent` for text.**

### 2. Forgetting the `#` or `.`
In `querySelector`, if you want to find an ID, you must use `#myId`. If you want a class, you must use `.myClass`. Forgetting these will result in `null` results.

### 3. The "Flash of Unstyled Content" (FOUC)
Placing your `<script>` tag at the top of the HTML file. The browser runs the JS before the HTML is even loaded, so `document.querySelector` will return `null`. **Put your scripts at the very bottom of the `<body>` or use the `defer` attribute.**

### 4. Over-manipulation
Changing styles one by one in a loop. Every time you change a style, the browser might have to "Reflow" or "Repaint" the page. **Group your changes into a single CSS class and toggle that class once.**

## 5. Mental Model
Imagine the DOM is a **Remote Controlled Puppetry Stage**.
- **HTML** is the **Puppet** sitting on the stage.
- **CSS** is the **Costume** the puppet is wearing.
- **JavaScript** is the **Strings** attached to the puppet.
- **The DOM** is the **Manual** that tells the puppeteer: "If you pull String #5, the puppet's left arm moves."
- **Events** are the **Audience Members** shouting: "Dance!" or "Jump!" The puppeteer (your event listener) hears the shout and pulls the corresponding string.

## 6. Key Takeaways
- The **DOM** is a tree representation of your HTML.
- **`querySelector`** is the standard way to find elements.
- **`classList`** is better for performance and organization than `style`.
- **Event Delegation** allows one listener to handle many elements (Efficiency).
- **`textContent`** is safe; **`innerHTML`** is dangerous.
- Scripts should load **after** the DOM is ready.

## 7. What's Next
You can now build interactive interfaces. You can react to the user. But so far, your web apps are still "local"—they don't have any data from the outside world. Next week, we finish Phase 1 with **JS: Fetch & Storage**. we’ll learn how to combine our knowledge of Promises (Week 18) with the DOM to fetch live data from APIs and how to use the browser's **Local Storage** to save user data so it’s still there when they refresh the page.
