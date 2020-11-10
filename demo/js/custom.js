const THREE = View3D.THREE;

const view3d = new View3D("#view3d-canvas");
const loader = new View3D.GLTFLoader();
const textureLoader = new View3D.TextureLoader(view3d.renderer);

// Environments Setup
view3d.scene.addEnv(new View3D.AutoDirectionalLight(0xeeee33, 1, { position: new THREE.Vector3(1, -2, 0) }));
view3d.scene.addEnv(new View3D.AutoDirectionalLight(0xeeee33, 1, { position: new THREE.Vector3(-1, -2, 0) }));

textureLoader.loadHDRTexture("../image/skylit_garage_4k.hdr", true).then(texture => {
  view3d.scene.setBackground(texture);
  view3d.scene.setEnvMap(texture);
}).catch(e => console.error(e));

// Controls Setup
view3d.controller.add(new View3D.AutoControl({ disableOnInterrupt: true }));
view3d.controller.add(new View3D.OrbitControl());

// Inline viewer setup
const inlineViewer = new View3D("#view3d-inline-canvas");

inlineViewer.scene.addEnv(new View3D.AutoDirectionalLight(0x336699, 1, { position: new THREE.Vector3(0, 2, 0)}));
inlineViewer.controller.add(new View3D.AutoControl());
inlineViewer.controller.add(new View3D.OrbitControl());

// Load 3D Model
loader.load("../asset/dodo_draco/model_original.glb")
  .then(model => {
    view3d.display(model);

    const clonedModel = new View3D.Model({
      scenes: model.scene.clone(true).children,
      animations: model.animations
    });
    inlineViewer.display(clonedModel);

    // As View3D is THREE.js based, you can use anything in THREE.js
    clonedModel.meshes.forEach(mesh => {
      mesh.material = new THREE.MeshToonMaterial();
    });
  });
