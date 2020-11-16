const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const loader = new View3D.GLTFLoader();

view3d.controller.add(new View3D.AutoControl({ speed: 0.5 }));
view3d.controller.add(new View3D.OrbitControl());
loader.loadPreset(view3d, "./asset/moon/model.json", {
  onLoad: (model, lodIndex) => {
    if (lodIndex === 1) {
      view3d.animator.play(0);
    }
  }
});

view3d.on("resize", () => {
  view3d.renderer.threeRenderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  view3d.renderer.threeRenderer.setPixelRatio(1);
});

const menuWrapper = document.querySelector("#menu-wrapper");
const hamburgerBtn = document.querySelector("#menu-hamburger");

hamburgerBtn.addEventListener("click", () => {
  menuWrapper.classList.toggle("open");
  hamburgerBtn.classList.toggle("is-active");
});

// LOD
let lodViewer1;
let lodViewer2;

const originalLoadBtn = document.querySelector("#lod-load-1");
originalLoadBtn.addEventListener("click", () => {
  if (lodViewer1) return;

  // Disable thumbnail & button
  document.querySelector("#lod-thumbnail-1").classList.add("disabled");
  originalLoadBtn.innerHTML = '<div class="spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  originalLoadBtn.classList.add("activated");

  lodViewer1 = new View3D("#lod-canvas-1");
  lodViewer1.scene.addEnv(new THREE.AmbientLight());
  lodViewer1.scene.addEnv(new View3D.AutoDirectionalLight(0xffffff, 1, { direction: new THREE.Vector3(0, -1, 0) }));
  lodViewer1.camera.setDefaultPose(new View3D.Pose(30, 15, 30));
  lodViewer1.controller.add(new View3D.OrbitControl());

  const start = Date.now();
  loader.load("./asset/lofoten/model_original_copy.glb")
    .then(model => {
      lodViewer1.display(model);
      requestAnimationFrame(() => {
        const end = Date.now();
        document.querySelector("#lod-result-1").innerHTML = `<div class="lod-result-text">Load time: ${end - start}ms</div>`;
        originalLoadBtn.classList.add("disabled");
      });
    });
});

const lodLoadBtn = document.querySelector("#lod-load-2");
lodLoadBtn.addEventListener("click", () => {
  if (lodViewer2) return;

  // Disable thumbnail & button
  document.querySelector("#lod-thumbnail-2").classList.add("disabled");
  lodLoadBtn.innerHTML = '<div class="spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>';
  lodLoadBtn.classList.add("activated");

  lodViewer2 = new View3D("#lod-canvas-2");
  lodViewer2.camera.setDefaultPose(new View3D.Pose(30, 15, 30));
  lodViewer2.controller.add(new View3D.OrbitControl());

  const start = Date.now();
  loader.loadPreset(lodViewer2, "./asset/lofoten/model.json", {
    onLoad: (model, lodIndex) => {
      requestAnimationFrame(() => {
        const end = Date.now();
        const resultEl = document.createElement("div");
        resultEl.classList.add("lod-result-text");
        resultEl.innerHTML = `Load time(${lodIndex === 0 ? "Simplified" : "Original"}): ${end - start}ms`;
        document.querySelector("#lod-result-2").appendChild(resultEl);

        if (lodIndex === 1) {
          lodLoadBtn.classList.add("disabled");
        }
      });
    }
  })
});
