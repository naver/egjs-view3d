import React from "react";
import clsx from "clsx";

import ModelInfo from "./ModelInfo";
import { Context } from "./context";
import * as actions from "./action";
import styles from "./canvas.module.css";

import VanillaView3D, { GLTFLoader, LoadingBar } from "../../../../src";
import ResetIcon from "../../../static/icon/reset.svg";

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
      skybox: "/egjs-view3d/texture/artist_workshop_1k.hdr",
      autoplay: true,
      plugins: [new LoadingBar({ type: "top" })]
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

    // this._listenAnnotationAdd();

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

                if (e.currentTarget.checked) {
                  view3D.rootEl.style.width = `${this._widthRef.current?.value}px`;
                  view3D.rootEl.style.height = `${this._heightRef.current?.value}px`;
                } else {
                  view3D.rootEl.style.width = "";
                  view3D.rootEl.style.height = "";
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
              <button className="button is-small menu-label">Apply</button>
            </div>
          </div>
          <div className={styles.body}>
            {!state.initialized &&
              <div className={clsx("has-text-white is-size-3", styles.dropdownOverlay)}>
                <label htmlFor="dropdown-file" className={clsx("p-2", styles.dropdownBox)}>
                  <span>Drag <img src="/egjs-view3d/img/cube_white.svg" style={{ width: "48px", height: "48px" }} /> glTF 2.0 files, zip or folder here</span>
                  <input id="dropdown-file" className={styles.dropdownFileInput} type="file" multiple />
                </label>
              </div>
            }
            <div id="playground-view3d" className={clsx("view3d-wrapper", styles.canvasWrapper)}>
              <canvas className="view3d-canvas"></canvas>
            </div>
            <div data-tip="Reset Camera" className={clsx(styles.resetBtn, "button", "is-rounded")} onClick={() => { void state.view3D!.camera.reset(500); }}>
              <ResetIcon width="32" height="32" />
            </div>
            <ModelInfo />
          </div>
        </div>
      </>}
    </Context.Consumer>;
  }
}

RenderSection.contextType = Context;

export default RenderSection;
