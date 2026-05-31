# Week 71: Character Animation

A moving cube is fine for a prototype, but a real game needs **Characters**. We use **Skinned Meshes** and **Mixamo**.

## 1. The Skeleton (Rigging)

In 3D, characters move using a "Skeleton" (Bones). When a bone moves, the skin (mesh) follows. This is called **Skinning**.

## 2. Coding: Loading a Character (GLTF)

The `.glb` or `.gltf` format is the "JPEG of 3D."

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
let mixer; // Handles animations

loader.load('player.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  // Set up animations
  mixer = new THREE.AnimationMixer(model);
  const action = mixer.clipAction(gltf.animations[0]); // Play first animation
  action.play();
});

// In your animate(dt) loop
if (mixer) mixer.update(dt);
```

## 3. Animation States (Senior Detail)

Just like we used a State Machine for 2D, we use one for 3D.
*   **Cross-fading:** When switching from "Idle" to "Run," don't just snap. Gradually fade the animations over 0.2 seconds. Three.js does this with `action.crossFadeTo(nextAction, 0.2)`.

## 4. Learning Resources (The "Why")

*   **Video:** [Intro to Mixamo & Three.js](https://www.youtube.com/watch?v=8n_vT7j_v_U) - How to get free animations.
*   **Video:** [The GLTF Format - Why it matters](https://www.youtube.com/watch?v=pS3tJq-j7pE) - Future of 3D on the web.
*   **Article:** [Loading 3D Models](https://threejs.org/docs/#manual/en/introduction/Loading-3D-models) - Official guide.

## Summary for the Assignment
1.  Download a character and two animations (Idle/Run) from Mixamo.
2.  Load them into Three.js.
3.  Implement logic: If moving, cross-fade to "Run." If stopped, cross-fade to "Idle."
4.  **Observe:** Does the animation "slide" on the floor? You need to match the animation speed to your `player.speed`.

---
**Senior Insight:** 3D models are **Huge**. A 50MB model will kill your page speed. Use tools like `draco compression` or `gltf-pipeline` to shrink them down to < 5MB before shipping. Always optimize your assets.