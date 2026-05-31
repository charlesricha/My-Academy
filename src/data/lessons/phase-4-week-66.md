# Week 66: 2D Collision (AABB)

In a game, objects need to interact. The most fundamental technique is **AABB** (Axis-Aligned Bounding Box).

## 1. The AABB Algorithm

Imagine two rectangles. They are colliding if:
1.  A's right > B's left
2.  A's left < B's right
3.  A's bottom > B's top
4.  A's top < B's bottom

## 2. Coding: The Collision Check

```javascript
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// In your update loop
if (checkCollision(player, enemy)) {
  player.health -= 10;
  // Resolve collision (e.g. bounce back)
  player.x -= player.vx; 
}
```

## 3. Circle-to-Circle Collision

Rectangles aren't great for round objects like balls. For circles, use the **Distance Formula**.
`dist = sqrt((x2-x1)^2 + (y2-y1)^2)`
If `dist < (radius1 + radius2)`, they hit!

**Senior Move:** `sqrt` is very slow. Instead, compare `dist^2` to `(r1+r2)^2`. It's the same result but 10x faster for the CPU.

## 4. Learning Resources (The "Why")

*   **Video:** [2D Collision Detection - MDN](https://www.youtube.com/watch?v=pM_nS52Wp8E) - Practical examples.
*   **Video:** [Simple AABB Collision](https://www.youtube.com/watch?v=ghqD3e37r7E) - Visualizing the boxes.
*   **Article:** [Collision Detection Reference](https://jeffreythompson.org/collision-detection/) - The bible of 2D collision math.

## Summary for the Assignment
1.  Build a "Pong" clone.
2.  Implement AABB collision between the ball and the paddles.
3.  Implement collision between the ball and the top/bottom walls.
4.  **Note:** Collision detection happens *after* you move the object but *before* you draw the frame.

---
**Senior Pro-Tip:** Don't check every object against every other object (O(N^2)). Divide your screen into a **Grid** (Spatial Partitioning). Only check objects that are in the same or adjacent grid squares. This is how games handle thousands of bullets at once.