Animations can be played by [Animator](Animator.html) of View3D

## Basic usage
```js
import View3D, { GLTFLoader } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");

// First load model...
const loader = new GLTFLoader();
loader.load(PATH_TO_YOUR_GLTF).then(model => {
  view3d.display(model);
  if (model.animations.length > 0) {
    // Play one of model's animation
    view3d.animator.play(0);
  }
  // If you want to pause
  view3d.animator.pause(0);
}).catch(e => { console.error(e); });
```
