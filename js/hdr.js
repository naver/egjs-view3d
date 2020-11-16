const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();

view3d.controller.add(new View3D.OrbitControl());
loader.loadPreset(view3d, "../asset/dodo_draco/model.json");

const textureLoader = new View3D.TextureLoader(view3d.renderer);

textureLoader.loadHDRTexture("../image/moonless_golf_4k.hdr", true).then(texture => {
  view3d.scene.setBackground(texture);
  view3d.scene.setEnvMap(texture);
}).catch(e => console.error(e));

Prism.highlightAll();
