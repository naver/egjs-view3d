---
title: Loading a 3D model
id: loading-model
slug: /loading-model
custom_edit_url: null
---

Loading models can be done with [GLTFLoader](GLTFLoader.html)

# Basic usage
```js
import View3D, { GLTFLoader } from "@egjs/view3d";

const view3d = new View3D("#view3d-wrapper");

const loader = new GLTFLoader();
loader.load(PATH_TO_YOUR_GLTF).then(model => {
  view3d.display(model);
}).catch(e => { console.error(e); });
```

You can also use our preset(`.json`) file with LOD feature that you can download on our editor.
```js
import View3D, { GLTFLoader } from "@egjs/view3d";

const view3d = new View3D("#view3d-wrapper");

const loader = new GLTFLoader();
loader.loadPreset(view3d, PATH_TO_YOUR_PRESET_JSON);
```
