const THREE = View3D.THREE;

const view3d = new View3D('#view3d-canvas');
const loader = new View3D.GLTFLoader();
const autoControl = new View3D.AutoControl();

view3d.controller.add(autoControl);
view3d.controller.add(new View3D.OrbitControl());
loader.loadPreset(view3d, "../asset/moon/model.json", {
  onLoad: (model, lodIndex) => {
    if (lodIndex === 1) {
      view3d.animator.play(0);
    }
  }
});

// Buttons setup
const wrapperEl = document.querySelector(".view3d-canvas-wrapper");
const pauseEl = document.querySelector("#pause");
const playEl = document.querySelector("#play");
const resetEl = document.querySelector("#reset");
const fullscreenEl = document.querySelector("#fullscreen");
const fullscreenExitEl = document.querySelector("#fullscreen-exit");

pauseEl.addEventListener("click", () => {
  view3d.animator.pause(0);
  autoControl.disable();

  pauseEl.classList.add("hidden");
  playEl.classList.remove("hidden");
});

playEl.addEventListener("click", () => {
  view3d.animator.resume(0);
  autoControl.enable();

  pauseEl.classList.remove("hidden");
  playEl.classList.add("hidden");
});

resetEl.addEventListener("click", () => {
  view3d.camera.reset(500);
});

fullscreenEl.addEventListener("click", () => {
  if (screenfull.isEnabled) {
    screenfull.request(wrapperEl);
  }
});

fullscreenExitEl.addEventListener("click", () => {
  if (screenfull.isEnabled) {
    screenfull.exit();
  }
});

screenfull.on('change', () => {
  fullscreenEl.classList.toggle("hidden");
  fullscreenExitEl.classList.toggle("hidden");
});

Prism.highlightAll();
