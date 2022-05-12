import * as THREE from "three";
import React from "react";
import clsx from "clsx";
import ReactTooltip from "react-tooltip";
import Swal from "sweetalert2";
// @ts-ignore
import Layout from "@theme/Layout";
// @ts-ignore
import styles from "./playground.module.css";

import VanillaView3D, { GLTFLoader, LoadingBar } from "../../../src";
import FaceAnnotation from "../../../src/core/annotation/FaceAnnotation";
import ModelTab from "../components/playground/tab/ModelTab";
import EnvironmentTab from "../components/playground/tab/EnvironmentTab";
import DownloadTab from "../components/playground/tab/DownloadTab";
import ModelInfo from "../components/playground/ModelInfo";
import ResetIcon from "../../static/icon/reset.svg";

const menus = [
  {
    name: "Model"
  },
  {
    name: "Environment"
  },
  {
    name: "Download"
  }
];

class Playground extends React.Component<{}, {
  initialized: boolean;
  isLoading: boolean;
  selectedMenu: number;
}> {
  public originalModel;
  private _view3D: VanillaView3D;
  private _loader;

  public get view3D() { return this._view3D; }

  public constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      isLoading: false,
      selectedMenu: 0
    };
  }

  public componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { SimpleDropzone } = require("simple-dropzone");

    const view3D = new VanillaView3D("#playground-view3d", {
      src: "/egjs-view3d/model/cube.glb",
      skybox: "/egjs-view3d/texture/artist_workshop_1k.hdr",
      autoplay: true,
      plugins: [new LoadingBar({ type: "top" })]
    }).on("ready", () => {
      this.originalModel = view3D.model;
      this.setState({});
    });

    void GLTFLoader.setMeshoptDecoder("/egjs-view3d/lib/meshopt_decoder.js");

    this._view3D = view3D;
    this._loader = new GLTFLoader(view3D);

    const pageWrapper = document.querySelector("#playground-container");
    const fileInput = document.querySelector("#dropdown-file");
    const dropzone = new SimpleDropzone(pageWrapper, fileInput);

    dropzone.on("drop", e => {
      const files = e.files as Map<string, any>;
      let hdriFileName = null;
      // For somewhat reason "fileNames = [...files.keys()]" becomes "fileNames = files.keys()" on build
      for (const [name] of files) {
        if (/.hdr$/i.test(name)) {
          hdriFileName = name;
          break;
        }
      }

      if (hdriFileName) {
        const hdriURL = URL.createObjectURL(e.files.get(hdriFileName));
        void this.onEnvmapChange(hdriURL);
      } else {
        void this.onFileChange(e.files);
      }
    });

    this._listenAnnotationAdd();
  }

  public componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  public render() {
    const { initialized, isLoading, selectedMenu } = this.state;

    return <Layout>
      <div className={styles.playgroundRoot}>
        <div id="playground-container" className={styles.model}>
          {!initialized &&
            <div className={clsx("has-text-white is-size-3", styles.dropdownOverlay)}>
              <label htmlFor="dropdown-file" className={clsx("p-2", styles.dropdownBox)}>
                <span>Drag <img src="/egjs-view3d/img/cube_white.svg" style={{ width: "48px", height: "48px" }} /> glTF 2.0 files, zip or folder here</span>
                <input id="dropdown-file" className={styles.dropdownFileInput} type="file" multiple />
              </label>
            </div>
          }
          <div id="playground-view3d" className={clsx("view3d-wrapper", styles.playground)}>
            <canvas className="view3d-canvas"></canvas>
            <div data-tip="Reset Camera" className={clsx(styles.resetBtn, "button", "is-rounded")} onClick={() => { void this._view3D.camera.reset(500); }}>
              <ResetIcon width="32" height="32" />
            </div>
            <ModelInfo playground={this} />
          </div>
        </div>
        <aside className={clsx(styles.control)}>
          <div className={clsx(styles.asideMenu)}>
            { menus.map((menu, menuIdx) => (
              <div
                key={menuIdx}
                onClick={() => { this.setState({ selectedMenu: menuIdx }); }}
                className={clsx(styles.asideMenuItem, menuIdx === selectedMenu ? styles.selected : "")}>
                { menu.name }
              </div>
            )) }
          </div>
          <div className={clsx(styles.asideContent, "bulma-menu", "p-4")}>
            {(() => {
              if (selectedMenu === 0) {
                return <ModelTab playground={this} isLoading={isLoading} onFileChange={this.onFileChange} />;
              } else if (selectedMenu === 1) {
                return <EnvironmentTab playground={this} isLoading={isLoading} onEnvmapChange={this.onEnvmapChange} />;
              } else {
                return <DownloadTab playground={this} isLoading={isLoading} />;
              }
            })()}
          </div>
        </aside>
      </div>
      <ReactTooltip effect="solid" />
    </Layout>;
  }

  public onFileChange = async (fileMap) => {
    this.setState({ isLoading: true });

    try {
      const view3D = this._view3D;
      const files = Array.from(fileMap) as Array<[string, File]>;
      const loader = this._loader;
      const model = await loader.loadFromFiles(files.map(([name, file]) => file));

      (view3D as any)._src = model.src;

      view3D.display(model);
      view3D.autoPlayer.disable();

      this.originalModel = model;

      this.setState({
        initialized: true,
        isLoading: false
      });
    } catch (err) {
      void Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error"
      });
      this.setState({
        isLoading: false
      });
    }
  };

  public onEnvmapChange = async (url) => {
    try {
      const view3D = this._view3D;
      const wasSkyboxEnabled = view3D.scene.skybox.enabled;

      this.setState({ isLoading: true });

      await view3D.scene.setSkybox(url);
      (view3D as any)._skybox = url;

      if (!wasSkyboxEnabled) {
        view3D.scene.skybox.disable();
      }
    } catch (err) {
      void Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error"
      });
    } finally {
      this.setState({ isLoading: false });
      URL.revokeObjectURL(url);
    }
  };

  private _listenAnnotationAdd() {
    const view3D = this._view3D;
    const canvas = view3D.renderer.canvas;
    const raycaster = new THREE.Raycaster();

    canvas.addEventListener("dblclick", evt => {
      const model = view3D.model;
      if (!model) return;

      const pointer = new THREE.Vector2();
      const devicePixelRatio = window.devicePixelRatio;
      pointer.x = (evt.offsetX / canvas.width) * 2 * devicePixelRatio - 1;
      pointer.y = -(evt.offsetY / canvas.height) * 2 * devicePixelRatio + 1;

      raycaster.setFromCamera(pointer, view3D.camera.threeCamera);

      const intersects = raycaster.intersectObjects([model.scene]);

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

      const newAnnotation = new FaceAnnotation(view3D, {
        element: el,
        focus: [currentPose.yaw, currentPose.pitch, currentPose.zoom],
        meshIndex: model.meshes.findIndex(mesh => mesh === intersects[0].object),
        faceIndex: intersect.faceIndex
      });
      view3D.annotation.add(newAnnotation);
      view3D.renderer.renderSingleFrame();

      this.setState({});
    });
  }
}

export default Playground;
