import React from "react";
import * as THREE from "three";
import clsx from "clsx";

import ModelInfo from "./ModelInfo";
import FixedRaycaster from "./FixedRaycaster";
import { Context } from "./context";
import * as actions from "./action";
import styles from "./canvas.module.css";

import VanillaView3D, { GLTFLoader, LoadingBar, FaceAnnotation, ControlBar } from "../../../../src";
import ResetIcon from "../../../static/icon/reset.svg";
import { getAnimatedFace } from "../../../../src/utils";

class RenderSection extends React.Component<{}, {
  overrideSize: boolean;
}> {
  private _widthRef = React.createRef<HTMLInputElement>();
  private _heightRef = React.createRef<HTMLInputElement>();

  public constructor(props) {
    super(props);

    this.state = {
      overrideSize: false
    };
  }

  public componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SimpleDropzone } = require("simple-dropzone");
    const { dispatch } = this.context;

    const view3D = new VanillaView3D("#playground-view3d", {
      src: "/egjs-view3d/model/cube.glb",
      autoplay: true,
      plugins: [new LoadingBar({ type: "top" }), new ControlBar()]
    }).on("ready", () => {
      dispatch({
        type: "set_orig_model",
        val: view3D.model!
      });

      dispatch({
        type: "set_loading",
        val: false
      });
    });

    this._widthRef.current!.value = view3D.rootEl.clientWidth.toString();
    this._heightRef.current!.value = view3D.rootEl.clientHeight.toString();

    void GLTFLoader.setMeshoptDecoder("/egjs-view3d/lib/meshopt_decoder.js");

    const pageWrapper = document.querySelector("#playground-container");
    const fileInput = document.querySelector("#dropdown-file");
    const dropzone = new SimpleDropzone(pageWrapper, fileInput);

    dropzone.on("drop", e => {
      const files = e.files as Map<string, any>;
      let hdriFileName: string | null = null;
      // For somewhat reason "fileNames = [...files.keys()]" becomes "fileNames = files.keys()" on build
      for (const [name] of files) {
        if (/.hdr$/i.test(name)) {
          hdriFileName = name;
          break;
        }
      }

      if (hdriFileName) {
        const hdriURL = URL.createObjectURL(e.files.get(hdriFileName));
        void actions.onEnvmapChange(view3D, dispatch, hdriURL);
      } else {
        void actions.onFileChange(view3D, dispatch, e.files);
      }
    });

    this._listenAnnotationAdd(view3D, dispatch);

    dispatch({
      type: "set_view3d",
      val: view3D
    });
  }

  public render() {
    return <Context.Consumer>
      {({ state }) => <>
        <div id="playground-container" className={styles.container}>
          <div className={styles.head}>
            <div className={styles.headItem}>
              <span className="my-0 menu-label">Override canvas size</span>
              <input className="checkbox mr-2" type="checkbox" defaultChecked={this.state.overrideSize} onChange={e => {
                const view3D = state.view3D!;
                const width = parseFloat(this._widthRef.current!.value);
                const height = parseFloat(this._heightRef.current!.value);

                if (e.currentTarget.checked) {
                  this._setNewCanvasSize(view3D, width, height);
                } else {
                  view3D.renderer.resize();
                  view3D.autoResize = true;
                  view3D.rootEl.style.cssText = "";
                }

                this.setState({
                  overrideSize: e.currentTarget.checked
                });
              }}></input>
            </div>
            <div className={styles.headItem}>
              <span className="menu-label my-0 mr-2">Canvas Width</span>
              <input ref={this._widthRef} className={clsx(styles.headInput, "input is-small")} disabled={!this.state.overrideSize} type="number" defaultValue={640} min={1}></input>
            </div>
            <div className={styles.headItem}>
              <span className="menu-label my-0 mr-2">Canvas Height</span>
              <input ref={this._heightRef} className={clsx(styles.headInput, "input is-small")} disabled={!this.state.overrideSize} type="number" defaultValue={480} min={1}></input>
            </div>
            <div className={styles.headItem}>
              <button className="button is-small menu-label" onClick={() => {
                const view3D = state.view3D!;
                const width = parseFloat(this._widthRef.current!.value);
                const height = parseFloat(this._heightRef.current!.value);
                this._setNewCanvasSize(view3D, width, height);
              }}>Apply</button>
            </div>
          </div>
          <div id="canvas-body" className={styles.body}>
            {!state.initialized &&
              <div className={clsx("has-text-white is-size-3", styles.dropdownOverlay)}>
                <label htmlFor="dropdown-file" className={clsx("p-2", styles.dropdownBox)}>
                  <span>Drag <img src="/egjs-view3d/img/cube_white.svg" style={{ width: "48px", height: "48px" }} /> glTF 2.0 files, zip or folder here</span>
                  <input id="dropdown-file" className={styles.dropdownFileInput} type="file" multiple />
                </label>
              </div>
            }
            <div id="playground-view3d" className={clsx("view3d-wrapper", styles.canvasWrapper)}>
              <canvas className={clsx("view3d-canvas", styles.canvas)}></canvas>
            </div>
            <ModelInfo />
          </div>
        </div>
      </>}
    </Context.Consumer>;
  }

  private _setNewCanvasSize(view3D: VanillaView3D, width: number, height: number) {
    const rootEl = view3D.rootEl;
    view3D.autoResize = false;

    const bodyEl = document.querySelector("#canvas-body")!;
    const canvasEl = view3D.renderer.canvas;
    const origAspect = bodyEl.clientWidth / bodyEl.clientHeight;
    const newAspect = width / height;

    if (newAspect > origAspect) {
      rootEl.style.paddingTop = `${100 / newAspect}%`;
      rootEl.style.marginLeft = "";
      rootEl.style.marginRight = "";
      rootEl.style.height = "auto";
    } else {
      const halfAspect = (100 - newAspect * 100 / origAspect) * 0.5;
      rootEl.style.paddingTop = "";
      rootEl.style.marginLeft = `${halfAspect}%`;
      rootEl.style.marginRight = `${halfAspect}%`;
      rootEl.style.height = "";
    }

    view3D.resize();
    view3D.renderer.threeRenderer.setSize(width, height, false);
    view3D.renderer.canvasSize.set(canvasEl.clientWidth, canvasEl.clientHeight);
  }

  private _listenAnnotationAdd(view3D: VanillaView3D, dispatch) {
    const canvas = view3D.renderer.canvas;
    const raycaster = new FixedRaycaster();

    canvas.addEventListener("dblclick", evt => {
      const model = view3D.model;
      if (!model) return;

      const pointer = new THREE.Vector2();
      pointer.x = (evt.offsetX / canvas.clientWidth) * 2 - 1;
      pointer.y = -(evt.offsetY / canvas.clientHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, view3D.camera.threeCamera);

      const intersects = raycaster.intersectObject(model.scene);

      if (!intersects.length) return;

      const currentPose = view3D.camera.currentPose;
      const el = document.createElement("div");
      el.classList.add("view3d-annotation");
      el.classList.add("default");

      const tooltip = document.createElement("div");
      tooltip.classList.add("view3d-annotation-tooltip");
      tooltip.classList.add("default");
      el.appendChild(tooltip);

      view3D.annotation.wrapper.appendChild(el);

      const intersect = intersects[0];
      const size = view3D.renderer.size;
      const aspect = Math.max(size.height / size.width, 1);

      const meshIndex = model.meshes.findIndex(mesh => mesh === intersects[0].object);
      const faceIndex = intersect.faceIndex!;
      const animatedVertices = getAnimatedFace(model, meshIndex, faceIndex);

      if (!animatedVertices) return;

      const weights = this._getBarycentricWeight(intersect.point, animatedVertices);

      const newAnnotation = new FaceAnnotation(view3D, {
        element: el,
        baseFov: view3D.camera.baseFov,
        baseDistance: view3D.camera.baseDistance,
        aspect,
        focus: [currentPose.yaw, currentPose.pitch, currentPose.zoom],
        meshIndex,
        faceIndex,
        weights
      });

      (newAnnotation as any).uuid = THREE.MathUtils.generateUUID();
      view3D.annotation.add(newAnnotation);
      view3D.renderer.renderSingleFrame();

      // Force re-render
      dispatch({
        type: "set_loading",
        val: false
      });
    });
  }

  private _getBarycentricWeight(p: THREE.Vector3, vertices: THREE.Vector3[]) {
    const v1 = new THREE.Vector3().subVectors(vertices[0], p);
    const v2 = new THREE.Vector3().subVectors(vertices[1], p);
    const v3 = new THREE.Vector3().subVectors(vertices[2], p);

    const faceSize = new THREE.Vector3().crossVectors(
      new THREE.Vector3().subVectors(v1, v2),
      new THREE.Vector3().subVectors(v1, v3),
    ).length();
    const w1 = new THREE.Vector3().crossVectors(v2, v3).length() / faceSize;
    const w2 = new THREE.Vector3().crossVectors(v1, v3).length() / faceSize;
    const w3 = new THREE.Vector3().crossVectors(v1, v2).length() / faceSize;

    return [w1, w2, w3];
  }
}

RenderSection.contextType = Context;

export default RenderSection;
