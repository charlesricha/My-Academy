# Week 69: Three.js Game Setup

Moving from 2D to 3D means adding the **Z-Axis** and **Perspective**. We use **Three.js**.

## 1. The Three.js "Trinity"

1.  **The Scene:** The Universe.
2.  **The Camera:** The Player's Eyes.
3.  **The Renderer:** The Engine.

## 2. Coding: A Basic Scene

```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  renderer.render(scene, camera);
}
animate();
```

## 3. Lighting and Materials

*   **MeshBasicMaterial:** Doesn't need light (it just shows a color).
*   **MeshStandardMaterial:** Needs light to be seen. It looks much more realistic (shadows, reflections).

## 4. Learning Resources (The "Why")

*   **Video:** [Three.js Crash Course](https://www.youtube.com/watch?v=xJAfLdUgdc4) - The absolute basics.
*   **Video:** [The Coordinate System in 3D](https://www.youtube.com/watch?v=S0TofmR_L9A) - Visualizing X, Y, and Z.
*   **Article:** [Three.js Fundamentals](https://threejs.org/manual/) - The official, best place to learn.

## Summary for the Assignment
1.  Set up a Three.js scene.
2.  Add a "Floor" and a "Player" (Cube).
3.  Implement WASD movement in 3D (move on X and Z axes).
4.  **Performance:** Open your browser's console. Does your game run at 60 FPS?

---
**Senior Insight:** Three.js is a wrapper around WebGL. If you create a new `Geometry` or `Material` inside your `animate` loop, you will crash the browser in minutes (Memory Leak). Always define your assets **outside** the loop and only update their positions **inside** the loop.