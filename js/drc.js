const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.DracoLoader();
const textureLoader = new View3D.TextureLoader(view3d.renderer);

textureLoader.loadHDRTexture("../image/skylit_garage_4k.hdr", true).then(texture => {
  view3d.scene.setBackground(texture);
  view3d.scene.setEnvMap(texture);
}).catch(e => console.error(e));

const light1 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -0.5, -0.5) });
view3d.scene.addEnv(light1);

const shadowPlane = new View3D.ShadowPlane();
view3d.scene.addEnv(shadowPlane);

view3d.controller.add(new View3D.OrbitControl());

loader.load("../asset/bunny.drc", { color: 0x606060 })
  .then(model => {
    view3d.display(model);
  });

Prism.highlightAll();
