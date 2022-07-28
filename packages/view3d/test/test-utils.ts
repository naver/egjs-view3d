import * as THREE from "three";

import View3D, { View3DOptions } from "~/View3D";
import { EVENTS } from "~/const/external";
import { merge } from "~/utils";
import { Animation, Model } from "~/core";

export const createSandbox = (id: string = ""): HTMLElement => {
  const tmp = document.createElement("div");

  tmp.className = "_tempSandbox_";
  tmp.id = id;

  document.body.appendChild(tmp);

  return tmp;
};

export const cleanup = () => {
  const elements: HTMLElement[] = [].slice.call(document.querySelectorAll("._tempSandbox_"));
  elements.forEach(v => {
    v.parentNode!.removeChild(v);
  });
};

export const createView3D = async (options: Partial<View3DOptions & { children: HTMLElement[] }> = {}): Promise<View3D> => {
  const sandbox = createSandbox(`view3d-${Date.now()}`);
  const wrapper = document.createElement("div");
  const canvas = document.createElement("canvas");

  wrapper.classList.add("view3d-wrapper");
  canvas.classList.add("view3d-canvas");

  wrapper.appendChild(canvas);
  sandbox.appendChild(wrapper);

  canvas.style.width = "1000px";
  canvas.style.height = "660px";

  const { children = [], ...restOptions } = options;

  children.forEach(el => {
    wrapper.appendChild(el);
  });

  const view3D = new View3D(wrapper, restOptions);

  (window as any).instances.push(view3D);

  if (!view3D.autoInit || !view3D.src) return view3D;

  return new Promise(resolve => {
    view3D.once(EVENTS.READY, () => {
      resolve(view3D);
    });
  });
};

export const wait = (time: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

export const simulate = (el: HTMLElement, options: Partial<{
  pos: [number, number];
  deltaX: number;
  deltaY: number;
  duration: number;
}> = {}): Promise<void> => (
  new Promise<void>(resolve => {
    options = merge({
      pos: [el.offsetLeft + el.offsetWidth / 2, el.offsetTop + el.offsetHeight / 2],
      deltaX: 0,
      deltaY: 0,
      duration: 500
    }, options);

    // Fire mousedown first
    const downEvt = createMouseEvent("mousedown", options.pos[0], options.pos[1]);
    el.dispatchEvent(downEvt);

    const animation = new Animation({ duration: options.duration });

    animation.on("progress", e => {
      const x = options.pos[0] + e.easedProgress * options.deltaX;
      const y = options.pos[1] + e.easedProgress * options.deltaY;

      const moveEvt = createMouseEvent("mousemove", x, y);
      window.dispatchEvent(moveEvt);
    });
    animation.on("finish", () => {
      const upEvt = createMouseEvent("mouseup", options.pos[0], options.pos[1]);
      el.dispatchEvent(upEvt);

      resolve();
    });

    animation.start();
  })
);

const createMouseEvent = (name: string, x: number, y: number) => {
  const evt = new MouseEvent(name, {
    screenX: x,
    screenY: y,
    clientX: x,
    clientY: y
  });

  return evt;
};

export const loadDefaultModel = async (view3D: View3D) => {
  (view3D as any)._src = "/cube.glb";

  const cubeGeometry = new THREE.BoxBufferGeometry();
  const cubeMaterial = new THREE.MeshBasicMaterial();
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  const model = new Model({
    src: "/cube.glb",
    scenes: [cube]
  });

  view3D.display(model);

  // Prevent loading model by src
  (view3D as any)._loadModel = () => [Promise.resolve()];

  if (!view3D.initialized) {
    await view3D.init();
  }
};
