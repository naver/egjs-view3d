import React from "react";
import * as THREE from "three";
import VanillaView3D, { View3DOptions } from "../../../src";
import { ARButton, ARUI } from "../../../src/plugin";

interface DemoOptions extends Partial<View3DOptions> {
  showARButton: boolean;
  showBbox: boolean;
}

class View3D extends React.Component<DemoOptions> {
  public static defaultProps: DemoOptions = {
    showARButton: false,
    showBbox: false,
    dracoPath: "/lib/draco/"
  };

  private _view3d: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();

  public constructor(props: DemoOptions) {
    super(props);

    this.state = { arAvailable: false };
  }

  public componentDidMount() {
    const { children, showBbox, showARButton, ...restProps } = this.props;
    const view3d = new VanillaView3D(this._rootRef.current, restProps);

    this._view3d = view3d;

    if (showBbox) {
      view3d.once("modelChange", ({ model }) => {
        const modelBbox = model.bbox.clone().applyMatrix4(model.scene.matrixWorld);
        view3d.scene.add(new THREE.Box3Helper(modelBbox, new THREE.Color(0x00ffff)));
      });
    }

    if (showARButton) {
      void view3d.loadPlugins(new ARButton(), new ARUI());
    }
  }

  public componentWillUnmount() {
    this._view3d.destroy();
  }

  public render() {
    const { children } = this.props;

    return <div ref={this._rootRef} className="view3d-wrapper view3d-square mb-2">
      <canvas className="view3d-canvas"></canvas>
      { children }
    </div>;
  }
}

export * from "../../../src";

export default View3D;
