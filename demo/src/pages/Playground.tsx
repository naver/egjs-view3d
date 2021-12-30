import React from "react";
import clsx from "clsx";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Swal from "sweetalert2";
import { SimpleDropzone } from "simple-dropzone";
// @ts-ignore
import Layout from "@theme/Layout";
// @ts-ignore
import styles from "./playground.module.css";

import ModelChange from "./playground/ModelChange";
import EnvmapChange from "./playground/EnvmapChange";
import VanillaView3D, { GLTFLoader } from "../../../src";

class Playground extends React.Component<{}, {
  initialized: boolean;
  isLoading: boolean;
}> {
  private _view3D: VanillaView3D;
  private _skyboxRef = React.createRef<HTMLInputElement>();

  public constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      isLoading: false
    };
  }

  public componentDidMount() {
    const view3D = new VanillaView3D("#playground-view3d", {
      src: "/model/cube.glb",
      skybox: "/texture/artist_workshop_1k.hdr",
      autoplay: true
    });

    void GLTFLoader.setMeshoptDecoder("/lib/meshopt_decoder.js");

    this._view3D = view3D;

    const pageWrapper = document.querySelector("#playground-container");
    const fileInput = document.querySelector("#dropdown-file");
    const dropzone = new SimpleDropzone(pageWrapper, fileInput);

    dropzone.on("drop", e => {
      const fileNames = [...e.files.keys()];
      const hdri = fileNames.find(name => /\.hdr$/i.test(name));

      if (hdri) {
        const hdriURL = URL.createObjectURL(e.files.get(hdri));
        void this._onEnvmapChange(hdriURL);
      } else {
        void this._onFileChange(e.files);
      }
    });
  }

  public render() {
    const { initialized, isLoading } = this.state;

    return <Layout>
      <div className={styles.playgroundRoot}>
        <div id="playground-container" className={styles.model}>
          <div id="playground-view3d" className={clsx("view3d-wrapper", styles.playground)}>
            <canvas className="view3d-canvas"></canvas>
          </div>
          {!initialized &&
            <div className={clsx("has-text-white is-size-3", styles.dropdownOverlay)}>
              <label htmlFor="dropdown-file" className={clsx("p-2", styles.dropdownBox)}>
                <span>Drag <img src="/img/cube_white.svg" style={{ width: "48px", height: "48px" }} /> glTF 2.0 files, zip or folder here</span>
                <input id="dropdown-file" className={styles.dropdownFileInput} type="file" multiple />
              </label>
            </div>
          }
        </div>
        <aside className={clsx("menu", "p-4", styles.control)}>
          <ModelChange onSelect={this._onModelSelect} onUpload={this._onFileChange} isLoading={isLoading} />
          <EnvmapChange onChange={this._onEnvmapChange} onExposureChange={val => this._view3D.exposure = val} isLoading={isLoading} />
          <div className="is-flex is-align-items-center mb-4">
            <span className="mr-2">Show Skybox</span>
            <input ref={this._skyboxRef} type="checkbox" defaultChecked={true} onChange={e => {
              const view3D = this._view3D;
              const root = view3D.scene.root;
              const checked = e.currentTarget.checked;

              if (checked) {
                root.background = root.environment;
              } else {
                root.background = null;
              }
            }}></input>
          </div>
          <button className="button" disabled={isLoading} onClick={this._downloadModel}>
            <img className="mr-2" src="/icon/file_download_black.svg" />
            <span>Download .glb</span>
          </button>
        </aside>
      </div>
    </Layout>;
  }

  private _onModelSelect = async (e) => {
    const view3D = this._view3D;
    const selected = e.target.value;
    if (!selected) return;

    this.setState({ isLoading: true });

    await view3D.load(selected);
    view3D.autoPlayer.disable();

    this.setState({
      initialized: true,
      isLoading: false
    });
  };

  private _onFileChange = async (fileMap) => {
    this.setState({ isLoading: true });

    try {
      const view3D = this._view3D as any;
      const files = Array.from(fileMap) as Array<[string, File]>;
      const loader = new GLTFLoader(view3D);
      const model = await loader.loadFromFiles(files.map(([name, file]) => file));

      view3D._src = model.src;

      view3D._display(model);
      view3D.autoPlayer.disable();

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

  private _onEnvmapChange = async (url) => {
    try {
      const view3D = this._view3D;

      this.setState({ isLoading: true });

      if (this._skyboxRef.current.checked) {
        view3D.skybox = url;
      } else {
        view3D.envmap = url;
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

  private _downloadModel = () => {
    try {
      this.setState({ isLoading: true });

      const origModel = this._view3D.model;

      new GLTFExporter().parse(origModel.scene, gltf => {
        const tempAnchorTag = document.createElement("a");

        const blob = new Blob([gltf as ArrayBuffer]);
        const url = URL.createObjectURL(blob);

        const nameGuessRegex = /(\w+)\.\w+$/i;
        const regexRes = nameGuessRegex.exec(origModel.src);
        const modelName = (!regexRes || !regexRes[1])
          ? "model"
          : regexRes[1];

        tempAnchorTag.href = url;
        tempAnchorTag.download = `${modelName}.glb`;
        tempAnchorTag.click();
        URL.revokeObjectURL(url);
      }, { binary: true, animations: origModel.animations, includeCustomExtensions: true });
    } catch (err) {
      void Swal.fire({
        title: "Error!",
        text: err.message,
        icon: "error"
      });
    } finally {
      this.setState({ isLoading: false });
    }
  };
}

export default Playground;
