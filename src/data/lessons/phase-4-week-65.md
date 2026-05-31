# Week 65: Game Loops

Games aren't "Event-Driven" like web apps; they are **Simulations**. They run even if the user does nothing.

## 1. The Heartbeat: The Game Loop

Every game has a loop that runs 60 times a second (60 FPS).
1.  **Input:** What did the user press?
2.  **Update:** Move characters, check collisions.
3.  **Render:** Draw everything.

## 2. Coding: The Loop in Javascript

```javascript
let lastTime = 0;

function gameLoop(currentTime) {
  // Calculate Delta Time (dt)
  const dt = (currentTime - lastTime) / 1000; // in seconds
  lastTime = currentTime;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

function update(dt) {
  player.x += player.speed * dt; // Frame-rate independent movement!
}

requestAnimationFrame(gameLoop);
```

## 3. Delta Time (dt): Why it's Critical

If you move `x += 5` every frame:
*   On a 60Hz monitor, you move 300 pixels/sec.
*   On a 144Hz monitor, you move 720 pixels/sec!
By multiplying by `dt`, the character moves at the **exact same speed** regardless of the frame rate.

## 4. Learning Resources (The "Why")

*   **Video:** [The Game Loop - Game Programming Patterns](https://www.youtube.com/watch?v=t_fXfO026-w) - Theory by Robert Nystrom.
*   **Video:** [Understanding Delta Time](https://www.youtube.com/watch?v=yGhfUcPjXuE) - Why your game feels different on different PCs.
*   **Article:** [Anatomy of a Game Loop](https://developer.mozilla.org/en-US/docs/Games/Anatomy) - Detailed guide by MDN.

## Summary for the Assignment
In an HTML5 Canvas:
1.  Set up a basic game loop.
2.  Calculate Delta Time.
3.  Draw a ball that moves at a constant speed across the screen.
4.  **Experiment:** Try artificially slowing down your loop with a `while` loop and see if the ball still covers the same distance in 5 seconds.

---
**Senior Insight:** Game dev is about managing your "Time Budget." You have exactly 16.6 milliseconds to finish your update and render if you want to stay at 60 FPS. Optimize your math first!