const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const light1 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(-1, -1, -1) });
const light2 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(1, -1, 1) });
light2.disableShadow();
view3d.scene.addEnv(light1);
view3d.scene.addEnv(light2);
view3d.scene.addEnv(new THREE.AmbientLight());

const shadowPlane = new View3D.ShadowPlane();
view3d.scene.addEnv(shadowPlane);

view3d.controller.add(new View3D.OrbitControl());
view3d.controller.add(new View3D.AutoControl());

const loader = new View3D.GLTFLoader();
loader.load("../asset/clown_fish/scene.gltf")
  .then(model => {
    model.castShadow = true;

    view3d.display(model);
    view3d.animator.play(0);
  });

// Buttons setup
const view3dWrapper = document.querySelector("#view3d-wrapper");
const arButton = document.querySelector("#ar-button");
const closeButton = document.querySelector("#xr-close");
const overlay = document.querySelector("#overlay");
const placeButton = document.querySelector("#place-button");

const hoverSession = new View3D.HoverARSession({
  overlayRoot: overlay,
  forceOverlay: true,
}).on("start", () => {
  overlay.style.display = "flex";
  shadowPlane.mesh.visible = false;
}).on("canPlace", () => {
  placeButton.style.display = "flex";
}).on("modelPlaced", () => {
  placeButton.style.display = "none";
}).on("end", () => {
  shadowPlane.mesh.visible = true;
  overlay.style.display = "none";
});
view3d.xr.addSession(hoverSession);
view3d.xr.addSession(new View3D.SceneViewerSession({
  file: new URL("../asset/clown_fish/scene.gltf", location.href).href,
  title: "Clown fish",
  link: "https://sketchfab.com/3d-models/clown-fish-fe11968d55574131b1bfaa8c87566a79",
  mode: "ar_only"
}));
view3d.xr.addSession(new View3D.QuickLookSession({
  file: "../asset/guppy_fish.usdz",
}));

placeButton.addEventListener("click", () => {
  hoverSession.placeModel();
});

closeButton.addEventListener("click", () => {
  view3d.xr.exit();
});

arButton.addEventListener("click", async () => {
  view3d.xr.enter().catch(err => {
    console.error(err);
    alert(err);
  });
});

Prism.highlightAll();
