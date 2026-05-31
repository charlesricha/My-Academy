# Week 68: 2D Physics

Real games use "Physics" (Dynamics)—where objects have **Force, Mass, Velocity, and Acceleration.**

## 1. Euler Integration

This is the standard math for games:
1.  **Forces** (Gravity, Input) create **Acceleration**.
2.  Acceleration changes **Velocity**.
3.  Velocity changes **Position**.

```javascript
// In update(dt)
player.ay = gravity; // Force
player.vy += player.ay * dt; // Velocity
player.y += player.vy * dt; // Position

// Simple Friction
player.vx *= 0.95; 
```

## 2. Jumping as an "Impulse"

A jump is a sudden change in velocity.
`if (jumpPressed) player.vy = -jumpForce;`
Gravity will naturally slow the player down until they fall back.

## 3. Learning Resources (The "Why")

*   **Video:** [Physics for Game Dev - Euler Integration](https://www.youtube.com/watch?v=mD0V_I8DOnI) - The math breakdown.
*   **Video:** [Platformer Physics Tutorial](https://www.youtube.com/watch?v=8uRYDe6D6QY) - Getting the "feel" right.
*   **Article:** [Integration Basics](https://gafferongames.com/post/integration_basics/) - A deep dive by Glenn Fiedler.

## 4. Verlet Integration (Senior Detail)

Euler math is "unstable." If the frame rate drops, objects might "tunnel" through walls. **Verlet Integration** is a different way of calculating position based on the *previous* frame's position. It's much more stable for things like ropes and cloth.

## Summary for the Assignment
1.  Build a simple "Platformer" level.
2.  Implement Gravity and Jumping.
3.  Add "Friction" so the player slides to a stop.
4.  **Note:** Try changing your `gravity` value. How does it change the "feel" of the game? (Floaty vs. Heavy).

---
**Senior Pro-Tip:** Don't write your own physics engine for a complex game. Use a library like **Matter.js** or **Rapier**. But understanding Euler math is essential for knowing how to tweak the settings of those engines. Environment feel is everything.