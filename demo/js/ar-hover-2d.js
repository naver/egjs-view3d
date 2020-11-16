const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const light1 = new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -0.5, -0.5) });

view3d.renderer.disableShadow();

const loader = new View3D.TextureLoader();
loader.load("../image/lamp.png")
  .then(texture => {
    const model = new View3D.TextureModel({
      image: texture,
      width: 0.6,
      billboard: true,
    });
    view3d.display(model);
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
}).on("canPlace", () => {
  placeButton.style.display = "flex";
}).on("modelPlaced", () => {
  placeButton.style.display = "none";
  hoverSession.control.rotate.disable();
}).on("end", () => {
  overlay.style.display = "none";
});
view3d.xr.addSession(hoverSession);

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
