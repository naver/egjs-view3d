const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const loader = new View3D.GLTFLoader();

view3d.renderer.enableShadow();

const light1 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -0.5, -0.5) });
view3d.scene.addEnv(light1);

const shadowPlane = new View3D.ShadowPlane();
view3d.scene.addEnv(shadowPlane);

view3d.controller.add(new View3D.OrbitControl());
loader.load("../asset/bull/scene.gltf")
  .then(model => {
    model.castShadow = true;
    view3d.display(model);
  });

// Buttons setup
const view3dWrapper = document.querySelector("#view3d-wrapper");
const arButton = document.querySelector("#ar-button");
const closeButton = document.querySelector("#xr-close");
const overlay = document.querySelector("#overlay");

const wallSession = new View3D.WallARSession({
  maxModelSize: 1,
  overlayRoot: overlay,
  loadingEl: "#loading",
  forceOverlay: true,
}).on("start", () => {
  overlay.style.display = "flex";
}).on("end", () => {
  overlay.style.display = "none";
});
view3d.xr.addSession(wallSession);

closeButton.addEventListener("click", () => {
  view3d.xr.exit();
});

arButton.addEventListener("click", async () => {
  view3d.xr.enter().catch(err => {
    alert(err);
    console.error(err);
  });
});

Prism.highlightAll();
