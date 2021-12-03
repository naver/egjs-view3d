import React from "react";
import VanillaView3D, { View3DOptions } from "../../../src/View3D";

class View3D extends React.Component<Partial<View3DOptions>> {
  private _view3d: VanillaView3D;
  private _canvasRef = React.createRef<HTMLCanvasElement>();

  public componentDidMount() {
    const { children, ...restProps } = this.props;

    this._view3d = new VanillaView3D(this._canvasRef.current, restProps);
  }

  public componentWillUnmount() {
    this._view3d.destroy();
  }

  public render() {
    return <div className="view3d-canvas-wrapper image is-square">
      <canvas ref={this._canvasRef} className="view3d-canvas"></canvas>
      { this.props.children }
    </div>;
  }
}

export * from "../../../src";

export default View3D;
