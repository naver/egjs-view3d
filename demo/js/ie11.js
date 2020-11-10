/* eslint-disable no-undef */
var pageWrapper = document.querySelector('#view3d-wrapper');
var canvasWrapper = document.querySelector('.view3d-canvas-wrapper');

var dropIndicator = document.querySelector('#drop-indicator');
var fileInput = document.querySelector('#file-fallback');

var controls = document.querySelector('#view3d-controls');
var loadingIndicator = document.querySelector('.loading-indicator');

var pauseButton = document.querySelector('#pause');
var resetButton = document.querySelector('#reset');
var fullscreenButton = document.querySelector('#fullscreen');

var view3d = null;
var THREE = View3D.THREE;

var autoControl = new View3D.AutoControl();
autoControl.disableOnInterrupt = true;

// Buttons setup
fullscreenButton.addEventListener('click', function () {
  screenfull.toggle(canvasWrapper);
});

var paused = false;
pauseButton.addEventListener('click', function() {
  if (!view3d) return;

  autoControl.disable();

  if (paused) {
    view3d.animator.resume(0);
    paused = false;
    pauseButton.src = "image/pause.svg";
  } else {
    view3d.animator.pause(0);
    paused = true;
    pauseButton.src = "image/play.svg";
  }
});

resetButton.addEventListener('click', function() {
  if (!view3d) return;

  view3d.camera.reset(500)
    .then(function() {
      console.log("reset complete")
      autoControl.enable();
    }).catch(function (e) {
      console.error(e);
    });
});

/* Lights setup */
var lightPreset = new View3D.LightPreset.Simple()
var shadowPlane = new View3D.ShadowPlane();
lightPreset.enableShadow();

/* dat.gui options setup */
var gui;
var LightConf = function(color) {
  this.color = [color.r * 255, color.g * 255, color.b * 255];
};
var ShadowConf = function(val) {
  this.opacity = val;
};

var ambientConf = new LightConf(lightPreset.ambient.color);
var directionalConf = new LightConf(lightPreset.main.color);

function initGUI(model) {
  gui && gui.destroy();
  gui = new dat.GUI();

  var f0 = gui.addFolder('Model');
  f0.open();
  f0.add(model, 'size');

  var f1 = gui.addFolder('Ambient Light');
  f1.open();
  f1.add(lightPreset.ambient, 'intensity', 0, 4);
  f1.addColor(ambientConf, 'color')
    .onChange(function(color) {
      lightPreset.ambient.color = new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255);
    });

  var f2 = gui.addFolder('Directional Light');
  f2.open();
  f2.add(lightPreset.main, 'intensity', 0.1, 4);
  f2.addColor(directionalConf, 'color')
    .onChange(function(color) {
      lightPreset.main.color = new THREE.Color(color[0] / 255, color[1] / 255, color[2] / 255);
    });

  var f3 = gui.addFolder('Shadow');
  f3.open();
  f3.add(shadowPlane, 'opacity', 0, 1);
  f3.add(shadowPlane, 'y', -50, 0);

  var f4 = gui.addFolder('Camera');
  f4.open();
  f4.add(view3d.camera, 'yaw', 0, 360)
    .onChange(function() { view3d.controller.syncToCamera(); });
  f4.add(view3d.camera, 'pitch', -90, 90)
    .onChange(function() { view3d.controller.syncToCamera(); });
  f4.add(view3d.camera, 'distance', 0.1, 500)
    .onChange(function() { view3d.controller.syncToCamera(); });
}

function onError(msg) {
  Swal.fire(
    msg,
    '',
    'error'
  )
}

function init() {
  loadingIndicator.classList.add('invisible');
  controls.classList.remove('invisible');

  // Initial setup
  view3d = new View3D('#view3d-canvas');
  view3d.camera.setDefaultPose({
    yaw: 30,
    pitch: 15
  });

  // Add env objects that won't be removed after showing a new model
  for (var i = 0; i < lightPreset.lights.length; i++) {
    view3d.scene.addEnv(lightPreset.lights[i]);
  }
  view3d.scene.addEnv(shadowPlane.mesh);

  view3d.renderer.enableShadow();
  view3d.controller.add(new View3D.OrbitControl());
  view3d.controller.add(autoControl);
}

function testShow(url) {
  dropIndicator.classList.add('invisible');

  // Make loading indicator visible
  var loader = new View3D.GLTFLoader();
  loader.load(url).then(function(model) {
    if (!view3d) {
      init();
    }

    // model.updateSkeletonGeometry();

    // Display model
    model.size = 80;
    view3d.display(model);

    // Modify sizes based on new model
    lightPreset.fit(model);
    shadowPlane.fit(model);

    // BBox visualizer of model, use when it's needed
    view3d.scene.add(new THREE.BoxHelper(model.scene, 0x000000));

    // Shdaow-related settings
    model.castShadow = true;
    model.receiveShadow = true; // Some models can show jiggling surface with this

    // Play first animation of the model
    view3d.animator.play(0);

    // Fix for the alpha channel enabled emissive map
    model.meshes.forEach(function(mesh) {
      if (mesh.material.emissiveMap) {
        mesh.material.emissiveMap.format = THREE.RGBAFormat;
      }
    })

    // Init GUI
    initGUI(model);
  }).catch(function(e) {
    console.error(e);
    onError(e.toString());
  }).finally(function() {
    loadingIndicator.classList.add('invisible');
    if (!view3d) {
      dropIndicator.classList.remove('invisible');
    }
  });
}

testShow("./asset/cubeDraco.glb");
