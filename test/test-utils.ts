import * as THREE from "three";
import View3D from "~/View3D";
import Model from "~/core/Model";
import { XRRenderContext } from "~/type/internal";
import XRSessionMock from "./xr/XRSessionMock";

export const createSandbox = (id: string = ""): HTMLElement => {
  const tmp = document.createElement("div");

  tmp.className = "_tempSandbox_";
  tmp.id = id;

  document.body.appendChild(tmp);

  return tmp;
};

export function cleanup() {
  const elements: HTMLElement[] = [].slice.call(document.querySelectorAll("._tempSandbox_"));
  elements.forEach(v => {
    v.parentNode!.removeChild(v);
  });
}

export function createXRRenderingContext({
  view3d = new View3D(document.createElement("canvas")),
  model = new Model({ scenes: [] }),
  delta = 0,
  xrCam = new THREE.PerspectiveCamera(),
  size = { width: 100, height: 100 },
  session = new XRSessionMock().session,
}: {
  view3d?: XRRenderContext["view3d"];
  model?: XRRenderContext["model"];
  delta?: XRRenderContext["delta"];
  xrCam?: XRRenderContext["xrCam"];
  size?: XRRenderContext["size"];
  session?: XRRenderContext["session"];
} = {}): XRRenderContext {
  return {
    view3d,
    xrCam,
    size,
    model,
    delta,
    session,
    frame: {},
    referenceSpace: {},
  }
}
