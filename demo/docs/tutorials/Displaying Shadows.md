Basically as View3D has dependency on the [three.js](https://github.com/mrdoob/three.js/), you can use that for displaying & customizing shadows.

First, create View3D's instance
```js
const view3d = new View3D("#view3d-canvas");

// You can customize things like physically correct light
// See their documentation: https://threejs.org/docs/index.html#api/en/renderers/WebGLRenderer
const threeRenderer = view3d.renderer.threeRenderer;
threeRenderer.physicallyCorrectLights = true;
```

Next you should load model and make it cast(and receive, if you want) shadow.
```js
const loader = new GLTFLoader();
loader.load(PATH_TO_YOUR_GLTF).then(model => {
  model.castShadow = true;
  model.receiveShadow = true;
  view3d.display(model);
}).catch(e => { console.error(e); });
```

Finally, add some lights & bottom plane to display shadow.
```js
import View3D, { THREE, ShadowPlane, AutoDirectionalLight, GLTFLoader } from "@egjs/view3d";

const light = new AutoDirectionalLight();

light.position.set(0, 5, 4);
view3d.scene.addEnv(light);

const shadowPlane = new ShadowPlane();
view3d.scene.addEnv(shadowPlane);

const view3d = new View3D("#view3d-canvas");
const loader = new GLTFLoader();

loader.load(URL_TO_YOUR_GLTF).then(model => {
  view3d.display(model);
});
```
