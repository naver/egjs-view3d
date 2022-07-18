import React from "react";
import clsx from "clsx";

import VanillaView3D, { ControlBar } from "../../../../src";

class CustomControlBar extends React.Component {
  private _view3D: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const plugins = [new ControlBar({
      autoHide: false,
      progressBar: { position: "left" },
      playButton: { order: 0 },
      animationSelector: false,
      navigationGizmo: false,
      cameraResetButton: false
    })];

    const view3D = new VanillaView3D(this._rootRef.current!, {
      src: "/egjs-view3d/model/RobotExpressive.glb",
      plugins
    });

    this._view3D = view3D;
  }

  public componentWillUnmount() {
    this._view3D.destroy();
  }

  public render() {
    return <>
      <div ref={this._rootRef} className={clsx("view3d-wrapper", "view3d-1by1", "mb-2")}>
        <canvas className="view3d-canvas"></canvas>
      </div>
    </>;
  }
}

export default CustomControlBar;
