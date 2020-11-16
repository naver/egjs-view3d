const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');

const loader = new View3D.TextureLoader();
loader.load("../image/plant_pot.png")
  .then(texture => {
    const model = new View3D.TextureModel({
      image: texture,
      width: 0.3,
      billboard: true,
    });
    view3d.display(model, {
      size: 120,
    });
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
});

view3d.xr.addSession(floorSession);
view3d.xr.addSession(new View3D.SceneViewerSession({
  file: new URL("../asset/plant.glb", location.href).href,
  title: "화분",
  link: "https://www.naver.com",
  resizable: false,
  mode: "ar_only"
}));
view3d.xr.addSession(new View3D.QuickLookSession({
  file: new URL("../asset/plant.usdz", location.href).href,
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
