import { initGUI } from "./controls.gui.js";

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();
const textureLoader = new View3D.TextureLoader(view3d.renderer);

// Basic environment setup
textureLoader.loadHDRTexture("../image/studio_small_03_4k.hdr", true).then(texture => {
  view3d.scene.setBackground(texture);
  view3d.scene.setEnvMap(texture);
}).catch(e => console.error(e));

// Controls setup
const controls = {
  auto: new View3D.AutoControl(),
  orbit: new View3D.OrbitControl(),
}
view3d.controller.add(controls.auto);
view3d.controller.add(controls.orbit);

// Model load
loader.load("../asset/cube.glb").then(model => {
  view3d.display(model);
});

// Init GUI
initGUI(view3d, controls);

// Enable code highlight
Prism.highlightAll();
