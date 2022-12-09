import React from "react";
import clsx from "clsx";

import VanillaView3D, { PostProcessing } from "../../../../packages/view3d/src";
import styles from "./comparePostProcessing.module.css";
import * as THREE from 'three';

class ComparePostProcessing extends React.Component {
  private _view3D: VanillaView3D;
  private _postProcessing: PostProcessing;
  private _rootRef = React.createRef<HTMLDivElement>();

  public constructor(props) {
    super(props);
  }

  public componentDidMount() {

    const postProcessing = new PostProcessing({
      ssr: true,
      ssao: false,
      dof: false,
      unrealBloom: true
    });

    const plugins = [postProcessing];

    const view3D = new VanillaView3D(this._rootRef.current!, {
      src: "/egjs-view3d/model/meshopt/alarm.glb",
      meshoptPath: "/egjs-view3d/lib/meshopt_decoder.js",
      initialZoom: 10,
      yaw: -20,
      plugins,
    });

    this._postProcessing = postProcessing;
    this._view3D = view3D;

    const scene = view3D.scene.root;

    const cloneScene = scene.clone(true);
    cloneScene.background = new THREE.Color(0x000000);

    view3D.renderer.threeRenderer.setScissorTest(true);

    view3D.once("load", (ev) => {
      cloneScene.environment = scene.environment;
      const cloneModel = ev.model.scene.clone(true);
      cloneScene.add(cloneModel);
    });

    view3D.on("render", () => {
      const { renderer, camera } = view3D;

      const halfWidth = renderer.canvasSize.width / 2;

      renderer.threeRenderer.setScissor(0, 0, halfWidth, window.innerHeight);
      this._postProcessing!.composer.render();
      renderer.threeRenderer.setScissor(halfWidth, 0, window.innerWidth, window.innerHeight);
      renderer.threeRenderer.render(cloneScene, camera.threeCamera);
    });
  }

  public componentWillUnmount() {
    this._view3D.destroy();
  }

  public render() {
    return <>
      <div>
        <div ref={this._rootRef} className={clsx("view3d-wrapper", "mb-2")}>
          <canvas style={{ width: "100%" }}></canvas>
          <div className={clsx(styles.surface)}>
            <span style={{ color: "white", marginLeft: "5px" }}>ON</span>
            <span style={{ color: "white", marginRight: "5px" }}>OFF</span>
          </div>
          <hr className={clsx(styles.verticalLine)} />
        </div>
      </div>
    </>;
  }
}

export default ComparePostProcessing;
