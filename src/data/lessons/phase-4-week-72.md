# Week 72: Game Polish

The final 10% of work makes 90% of the difference. This is **Polish**.

## 1. Juiciness: Screen Shake and Particles

*   **Juice:** Adding feedback for every action.
*   **Particles:** Use small cubes or planes to simulate dust, fire, or explosions.
*   **Camera Shake:** Randomly offset the `camera.position` for a few frames when the player takes damage.

## 2. Sound Effects (Web Audio API)

A jump is nothing without a "Boing!"
```javascript
const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load('jump.mp3', (buffer) => {
  sound.setBuffer(buffer);
  sound.setVolume(0.5);
});

// Trigger
if (keys['Space']) sound.play();
```

## 3. UI (The 2D Overlay)

Don't build your UI (Buttons, Health bars) in 3D. It's too hard.
*   **The Pro Way:** Use standard HTML and CSS. Position it `absolute` on top of your 3D canvas. Use React/Next.js to update the UI based on your 3D game state.

## 4. Learning Resources (The "Why")

*   **Video:** [Juice it or Lose it](https://www.youtube.com/watch?v=Fy0aCDmgnxg) - The most famous talk in game dev history.
*   **Video:** [Post-Processing in Three.js](https://www.youtube.com/watch?v=kYJ_tE6_mks) - Adding bloom and glow.
*   **Article:** [Performance Tips for Three.js](https://discoverthreejs.com/tips-and-tricks/) - How to stay at 60 FPS.

## Summary for the Assignment
1.  Take your 3D game.
2.  Add sound effects for jumping.
3.  Add a 2D HUD (HTML) showing "Health."
4.  Add a simple particle effect when you click on an object.
5.  **Observe:** Does the game feel more "alive" now? That's the power of polish.

---
**Congratulations!** You have built a 3D game from scratch. You are now part of the small percentage of developers who understand the math and art of 3D. 

**Next Phase:** We move to the **Business**. How to get paid!

---
*Note: This concludes the technical portion of the curriculum. Great job!*