import * as THREE from "three";

import View3D, { View3DOptions } from "~/View3D";
import Model from "~/core/Model";
import { EVENTS } from "~/const/external";

// import XRSessionMock from "./xr/XRSessionMock";
// import { XRRenderContext } from "~/type/internal";

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

export const createView3D = async (options: Partial<View3DOptions> = {}): Promise<View3D> => {
  const sandbox = createSandbox(`view3d-${Date.now()}`);
  const wrapper = document.createElement("div");
  const canvas = document.createElement("canvas");

  wrapper.classList.add("view3d-wrapper");
  canvas.classList.add("view3d-canvas");

  wrapper.appendChild(canvas);
  sandbox.appendChild(wrapper);

  const view3D = new View3D(wrapper, options);

  (window as any).instances.push(view3D);

  if (!options.autoInit || !options.src) return view3D;

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

// export const createXRRenderingContext = ({
//   view3d = new View3D(document.createElement("canvas")),
//   model = new Model({ scenes: [] }),
//   delta = 0,
//   xrCam = new THREE.PerspectiveCamera(),
//   size = { width: 100, height: 100 },
//   session = new XRSessionMock().session
// }: {
//   view3d?: XRRenderContext["view3d"];
//   model?: XRRenderContext["model"];
//   delta?: XRRenderContext["delta"];
//   xrCam?: XRRenderContext["xrCam"];
//   size?: XRRenderContext["size"];
//   session?: XRRenderContext["session"];
// } = {}): XRRenderContext => {
//   return {
//     view3d,
//     xrCam,
//     size,
//     model,
//     delta,
//     session,
//     frame: {},
//     referenceSpace: {}
//   };
// };
