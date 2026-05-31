# Week 67: Input & States

A game is a conversation. We handle the player's side (Input) and the machine's memory (States).

## 1. Input: The Polling Pattern

In a game, we want to know *right now* if a key is held down. We maintain an "Input Object."

```javascript
const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

// In your update loop
if (keys['ArrowRight']) player.x += speed;
if (keys['Space'] && player.onGround) player.jump();
```

## 2. Finite State Machines (FSM)

Your character has ONE state at a time. This prevents "impossible states" (like jumping while dying).

```javascript
const states = {
  IDLE: {
    enter: () => player.anim = 'idle',
    update: () => { if (keys['ArrowRight']) player.setState('RUN'); }
  },
  RUN: {
    enter: () => player.anim = 'run',
    update: () => { 
      player.x += 5;
      if (!keys['ArrowRight']) player.setState('IDLE');
    }
  }
}
```

## 3. Learning Resources (The "Why")

*   **Video:** [State Pattern - Game Programming Patterns](https://www.youtube.com/watch?v=N12L5D78dfA) - Essential for clean code.
*   **Video:** [Handling Keyboard Input in JS](https://www.youtube.com/watch?v=3-M797_DMcY) - The professional approach.
*   **Article:** [Finite State Machines in Games](https://www.game-developer.com/programming/finite-state-machines-and-the-state-pattern) - Real-world examples from AAA games.

## 4. Input Buffering (Senior Detail)

If a player presses "Jump" a millisecond before hitting the ground, it should still count. 
*   **The Pro Way:** Store the last keypress for 100ms. When the player hits the ground, check the buffer. This makes your game feel "responsive" and "juicy."

## Summary for the Assignment
1.  Build a "Stateful" character.
2.  Character must have `IDLE`, `RUN`, and `JUMP` states.
3.  Add a "Pause" state for the whole game.
4.  **Observe:** Notice how much easier it is to add new behaviors (like a "Dodge Roll") when you have a State Machine instead of 50 `if` statements.

---
**Senior Insight:** Clean input handling is what makes a game "feel" good. If your controls are laggy or buggy, it doesn't matter how good your graphics are. Spend extra time here!