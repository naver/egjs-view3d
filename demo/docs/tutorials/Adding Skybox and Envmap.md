You can use equirectangular texture or cubemap texture as scene skybox.
Be careful that skybox needs View3D's renderer for correct rendering.
See [TextureLoader](TextureLoader.html) for more info.

## Basic usage
```js
import View3D, { Skybox } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");
const loader = new TextureLoader(view3d.renderer);

// Load skybox image
const skyboxTexture = await loader.loadEquirectagularTexture(YOUR_SKYBOX_IMAGE_URL);

// skybox.texture is only available after calling one of the texture load functions
view3d.scene.setBackground(skyboxTexture);
view3d.scene.setEnvmap(skyboxTexture);
```
