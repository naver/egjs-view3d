```js
import View3D, { GLTFLoader, THREE } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");

const light1 = new THREE.DirectionalLight('#fff', 0.7);
const light2 = new THREE.HemisphereLight('#fff', '#fff', 0.7);
const light3 = new THREE.DirectionalLight('#fff', 0.7);
const ambient = new THREE.AmbientLight('#fff', 0.3);

light1.position.set(0, 50, 40);
light2.position.set(0, 50, 0);
light3.position.set(0, 50, -40);

view3d.scene.addEnv(light1, light2, light3, ambient);

const loader = new GLTFLoader();
loader.load(PATH_TO_YOUR_GLTF).then(model => {
  view3d.display(model);
}).catch(e => { console.error(e); });
```

Or you can use our AutoDirectionalLight or Light preset which automatically updates its size when model loads.

```js
import View3D, { AutoDirectionalLight, SimpleLights, GLTFLoader, THREE } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");

const light1 = new AutoDirectionalLight(0xffffff, 1);
const light2 = new AutoDirectionalLight(0x3333ff, 0.5);
const preset = new SimpleLights();

light1.position.set(1, 1, 1);
light2.position.set(-1, -1, -1);

view3d.addEnv(light1, light2, preset);

const loader = new GLTFLoader();
loader.load(PATH_TO_YOUR_GLTF).then(model => {
  view3d.display(model);
}).catch(e => { console.error(e); });
```
