const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
view3d.renderer.disableShadow();

const loader = new View3D.TextureLoader();
loader.load("../image/hunting_trophy.png")
  .then(texture => {
    const model = new View3D.TextureModel({
      image: texture,
      width: 0.3,
    });
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
