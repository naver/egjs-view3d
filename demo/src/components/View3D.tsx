import React from "react";
import * as THREE from "three";
import VanillaView3D, { View3DOptions } from "../../../src";

class View3D extends React.Component<{ showBbox: boolean } & Partial<View3DOptions>> {
  private _view3d: VanillaView3D;
  private _canvasRef = React.createRef<HTMLCanvasElement>();

  public componentDidMount() {
    const { children, showBbox, ...restProps } = this.props;
    const view3d = new VanillaView3D(this._canvasRef.current, restProps);

    this._view3d = view3d;

    if (showBbox) {
      view3d.once("modelChange", ({ model }) => {
        const modelBbox = model.bbox.clone().applyMatrix4(model.scene.matrixWorld);
        view3d.scene.add(new THREE.Box3Helper(modelBbox, new THREE.Color(0x00ffff)));
      });
    }
  }

  public componentWillUnmount() {
    this._view3d.destroy();
  }

  public render() {
    return <div className="view3d-canvas-wrapper image is-square mb-2">
      <canvas ref={this._canvasRef} className="view3d-canvas"></canvas>
      { this.props.children }
    </div>;
  }
}

export * from "../../../src";

export default View3D;
