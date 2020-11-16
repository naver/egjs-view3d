const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();

view3d.controller.add(new View3D.OrbitControl());
loader.loadPreset(view3d, "../asset/dodo/model.json");
