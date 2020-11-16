export function initGUI(view3d, controls) {
  const { auto, orbit } = controls;
  const wrapper = document.querySelector("#gui-wrapper");
  const gui = new dat.GUI({ autoPlace: false });
  wrapper.appendChild(gui.domElement);

  // AutoControl options
  const autoControlOptions = gui.addFolder("AutoControl");
  autoControlOptions.add(auto, "enable");
  autoControlOptions.add(auto, "disable");
  autoControlOptions.add(auto, "canInterrupt");
  autoControlOptions.add(auto, "disableOnInterrupt");
  autoControlOptions.add(auto, "delay");
  autoControlOptions.add(auto, "speed");
  autoControlOptions.add(auto, "pauseOnHover");
  autoControlOptions.add(auto, "delayOnMouseLeave");
  autoControlOptions.open();

  // RotateControl options
  const rotate = orbit.rotate;
  const rotateScaleMock = { "scale.x": rotate.scale.x, "scale.y": rotate.scale.y };
  const rotateControlOptions = gui.addFolder("RotateControl");
  rotateControlOptions.add(rotate, "enable");
  rotateControlOptions.add(rotate, "disable");
  rotateControlOptions.add(rotate, "useGrabCursor");
  rotateControlOptions.add(rotate, "scaleToElement");
  rotateControlOptions.add(rotateScaleMock, "scale.x")
    .onChange(val => rotate.scale.setX(val));
  rotateControlOptions.add(rotateScaleMock, "scale.y")
    .onChange(val => rotate.scale.setY(val));

  // TranslateControl options
  const translate = orbit.translate;
  const translateScaleMock = { "scale.x": translate.scale.x, "scale.y": translate.scale.y };
  const translateControlOptions = gui.addFolder("TranslateControl");
  translateControlOptions.add(translate, "enable");
  translateControlOptions.add(translate, "disable");
  translateControlOptions.add(translate, "useGrabCursor");
  translateControlOptions.add(translate, "scaleToElement");
  translateControlOptions.add(translateScaleMock, "scale.x")
    .onChange(val => translate.scale.setX(val));
    translateControlOptions.add(translateScaleMock, "scale.y")
    .onChange(val => translate.scale.setY(val));

  // DistanceControl options
  const distance = orbit.distance;
  const distanceControlOptions = gui.addFolder("DistanceControl");
  distanceControlOptions.add(distance, "enable");
  distanceControlOptions.add(distance, "disable");
  distanceControlOptions.add(distance, "scale");
}
