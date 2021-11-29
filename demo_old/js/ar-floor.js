const {
  THREE,
  GLTFLoader,
  AutoDirectionalLight,
  ShadowPlane,
  Pose,
  OrbitControl,
  FloorARSession,
  SceneViewerSession,
  QuickLookSession,
} = View3D;
const view3d = new View3D('#view3d-canvas');
const loader = new GLTFLoader();

const light1 = new AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -1, 0) });
const light2 = new THREE.AmbientLight(0xffffff, 0.4);
view3d.scene.addEnv(light1);
view3d.scene.addEnv(light2);
view3d.camera.setDefaultPose(new Pose(-45, 20, 100));

const shadowPlane = new ShadowPlane();
view3d.scene.addEnv(shadowPlane);

view3d.controller.add(new OrbitControl());
loader.load("../asset/animated_dragon/scene.gltf")
  .then(model => {
    view3d.display(model, {
      size: 140
    });
    view3d.animator.play(0);
  });

// Buttons setup
const view3dWrapper = document.querySelector("#view3d-wrapper");
const arButton = document.querySelector("#ar-button");
const closeButton = document.querySelector("#xr-close");
const overlay = document.querySelector("#overlay");

const floorSession = new FloorARSession({
  overlayRoot: overlay,
  loadingEl: "#loading",
  forceOverlay: true,
}).on("start", () => {
  overlay.style.display = "flex";
}).on("end", () => {
  overlay.style.display = "none";
});

view3d.xr.addSession(floorSession);
view3d.xr.addSession(new SceneViewerSession({
  file: new URL("../asset/animated_dragon/scene.gltf", location.href).href,
  title: "Animated Dragon",
  link: "https://sketchfab.com/3d-models/animated-dragon-0ea921bb3d504023b891bba3fb8e6111",
  resizable: false,
  mode: "ar_only"
}));
view3d.xr.addSession(new QuickLookSession({
  file: new URL("../asset/animated_dragon.usdz", location.href).href,
}));

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
