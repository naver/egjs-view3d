import React from "react";
import * as THREE from "three";
import VanillaView3D, { View3DOptions } from "../../../src";
import { ARButton, ARUI } from "../../../src/plugin";

import OptionExample from "./OptionExample";

interface DemoOptions extends Partial<View3DOptions> {
  showARButton: boolean;
  showBbox: boolean;
  showExampleCode: boolean;
}

class View3D extends React.Component<DemoOptions> {
  public static defaultProps: DemoOptions = {
    showARButton: false,
    showBbox: false,
    showExampleCode: false,
    dracoPath: "/lib/draco/"
  };

  private _view3D: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();

  public get view3D() { return this._view3D; }

  public constructor(props: DemoOptions) {
    super(props);

    this.state = { arAvailable: false };
  }

  public componentDidMount() {
    const { children, showBbox, showARButton, showExampleCode, ...restProps } = this.props;
    const view3d = new VanillaView3D(this._rootRef.current, restProps);

    this._view3D = view3d;

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
    this._view3D.destroy();
  }

  public render() {
    const { children, showExampleCode, ...restProps } = this.props;
    const view3DOptions = Object.keys(restProps)
      .filter(key => {
        return key in VanillaView3D.prototype && restProps[key] !== View3D.defaultProps[key];
      })
      .reduce((options, key) => {
        return { ...options, [key]: restProps[key] };
      }, {});

    return <>
      <div ref={this._rootRef} className="view3d-wrapper view3d-square mb-2">
        <canvas className="view3d-canvas"></canvas>
        { children }
      </div>
      { showExampleCode && <OptionExample options={view3DOptions} />}
    </>;
  }
}

export * from "../../../src";

export default View3D;
