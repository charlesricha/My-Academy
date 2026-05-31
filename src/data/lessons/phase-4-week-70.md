# Week 70: 3D Raycasting

In 3D, "Collision" is often done with **Raycasting**—firing an invisible laser and seeing what it hits.

## 1. What is a Ray?

A Ray has an **Origin** and a **Direction**.
`raycaster.set(origin, direction);`

## 2. Coding: Clicking on Objects

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseDown(event) {
  // Translate screen clicks (-1 to +1) to 3D space
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    console.log("Clicked on:", intersects[0].object.name);
    intersects[0].object.material.color.set(0xff0000);
  }
}
```

## 3. Uses of Raycasting

1.  **Mouse Interaction:** "Which enemy did I click?"
2.  **Floor Detection:** Fire a ray down. If `dist > 1`, player is falling.
3.  **Wall Collision:** Fire rays in the direction of movement.

## 4. Learning Resources (The "Why")

*   **Video:** [Raycasting in Three.js Explained](https://www.youtube.com/watch?v=CqYf-Uv36vE) - Visual guide.
*   **Video:** [3D Collision Detection Basics](https://www.youtube.com/watch?v=ENXvSCoXmS4) - Theoretical concepts.
*   **Article:** [Interacting with the 3D Scene](https://threejs.org/docs/#api/en/core/Raycaster) - Official documentation.

## Summary for the Assignment
1.  Extend your 3D cube game.
2.  Implement Raycasting to prevent walking through walls.
3.  **Debug:** Add a `THREE.ArrowHelper` to your ray so you can physically see the "laser" in your game while debugging.

---
**Senior Pro-Tip:** Raycasting every frame against 10,000 objects is slow. Keep a separate array called `targets` and only check against those. Never check against your entire scene if you don't have to. Performance is the difference between a game and a slideshow.