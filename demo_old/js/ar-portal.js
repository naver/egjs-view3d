const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const loader = new View3D.GLTFLoader();

const renderer = view3d.renderer.threeRenderer;

renderer.autoClear = false;

view3d.renderer.disableShadow();
view3d.camera.setDefaultPose(new View3D.Pose(0, 0, 30, new THREE.Vector3(0, -5, -12)));
view3d.camera.maxDistance = 50;

view3d.scene.addEnv(new View3D.AutoDirectionalLight());

view3d.controller.add(new View3D.OrbitControl());

Promise.all([
  loader.load("../asset/smoking_room_fix/scene.glb"),
  loader.load("../asset/decorative_portal/scene.glb"),
]).then(([model, door]) => {
  view3d.display(model);

  model.meshes.forEach(mesh => {
    const prevMat = mesh.material;

    mesh.material = new THREE.MeshBasicMaterial().copy(prevMat);
    mesh.material.map = prevMat.emissiveMap;
    mesh.material.stencilWrite = true;
    mesh.material.stencilRef = 1;
    mesh.material.stencilFunc = THREE.EqualStencilFunc;
    mesh.material.needsUpdate = true;
  });

  model.size = model.originalSize;

  const pivot = model.scene.children[0];

  pivot.rotateY(-Math.PI / 2);
  pivot.translateX(-13.6);
  pivot.translateZ(2.75);

  door.scene.scale.set(0.002, 0.0026, 0.0025);
  door.scene.rotateY(Math.PI / 2);
  door.scene.translateX(1.2);
  door.scene.translateY(6.0);
  door.scene.translateZ(12.4);
  pivot.add(door.scene);
});

const planeGeometry = new THREE.PlaneGeometry(4, 8);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  stencilWrite: true,
  stencilRef: 1,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilFail: THREE.ReplaceStencilOp,
  stencilZFail: THREE.ReplaceStencilOp,
  stencilZPass: THREE.ReplaceStencilOp,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.translateY(-5);
plane.translateZ(-1.5);

const outerBoxGeometry = new THREE.BoxGeometry(26, 26, 26);
const outerBoxMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  stencilWrite: true,
  stencilWriteMask: 0x00,
  stencilRef: 1,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilFail: THREE.KeepStencilOp,
  stencilZFail: THREE.KeepStencilOp,
  stencilZPass: THREE.ReplaceStencilOp,
});
const outerBox = new THREE.Mesh(outerBoxGeometry, outerBoxMaterial);

outerBox.translateZ(-14.5);

const boxGeometry = new THREE.BoxGeometry(25.9, 25.9, 25.9);
const boxMaterial = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  stencilWrite: true,
  stencilWriteMask: 0xFF,
  stencilRef: 1,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilFail: THREE.KeepStencilOp,
  stencilZFail: THREE.KeepStencilOp,
  stencilZPass: THREE.ReplaceStencilOp,
})
const box = new THREE.Mesh(boxGeometry, boxMaterial);

box.translateZ(-14.5);

const maskScene = new THREE.Scene();
maskScene.add(plane);
maskScene.add(box);
maskScene.add(outerBox);

view3d.on("beforeRender", () => {
  renderer.clear();

  maskScene.position.copy(view3d.model.scene.position);
  maskScene.quaternion.copy(view3d.model.scene.quaternion);
  maskScene.scale.copy(view3d.model.scene.scale);

  renderer.render(maskScene, view3d.camera.threeCamera);
  renderer.clearColor();
  renderer.clearDepth();
});

// Buttons setup
const view3dWrapper = document.querySelector("#view3d-wrapper");
const arButton = document.querySelector("#ar-button");
const closeButton = document.querySelector("#xr-close");
const overlay = document.querySelector("#overlay");

const floorSession = new View3D.FloorARSession({
  overlayRoot: overlay,
  loadingEl: "#loading",
  forceOverlay: true,
}).on("start", () => {
  overlay.style.display = "flex";
}).on("end", () => {
  overlay.style.display = "none";
}).on("modelPlaced", () => {
  floorSession.control.disable();
});

view3d.xr.addSession(floorSession);
view3d.xr.addSession(new View3D.SceneViewerSession({
  file: new URL("../asset/the_smoking_room/scene.gltf", location.href).href,
  resizable: false,
  mode: "ar_only"
}));
view3d.xr.addSession(new View3D.QuickLookSession({
  file: new URL("../asset/seal.usdz", location.href).href,
}));

closeButton.addEventListener("click", () => {
  view3d.xr.exit();
});

arButton.addEventListener("click", async () => {
  view3d.xr.enter().then(() => {
    view3d.model.scene.scale.setScalar(0.25);
  }).catch(err => {
    alert(err);
    console.error(err);
  });
});

Prism.highlightAll();
