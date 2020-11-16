Controls are not included by default to minimize bundle size.
You can easily add them by creating new instance of them and adding them on the controller.

See:
- [AnimationControl](AnimationControl.html)
- [AutoControl](AutoControl.html)
- [OrbitControl](OrbitControl.html)
- [RotateControl](RotateControl.html)
- [TranslateControl](TranslateControl.html)
- [DistanceControl](DistanceControl.html)

## Basic usage
```js
import View3D, { Rotatecontrol, DistanceControl } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");

view3d.controller.add(new RotateControl());
view3d.controller.add(new DistanceControl());
```

## Changing option
```js
import View3D, { Rotatecontrol, DistanceControl, THREE } from "@egjs/view3d";

const view3d = new View3D("#view3d-canvas");
const myTargetElement = document.querySelector("#my-control-target");

const rotateControl = new RotateControl({
  element: myTargetElement,
  scale: new THREE.Vector2(2, 1),
  useGrabCursor: false,
});

// Or...
rotateControl.setElement(myTargetElement);
rotateControl.scale.setX(2);
rotateControl.useGrabCursor = false;

view3d.controller.add(rotateControl);
```
