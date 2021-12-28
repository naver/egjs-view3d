import React from "react";
import * as THREE from "three";
import VanillaView3D, { View3DOptions } from "../../../src";
import { ARButton, ARUI } from "../../../src/plugin";

import OptionExample from "./OptionExample";
import EventsList from "./EventsList";

interface DemoOptions extends Partial<View3DOptions> {
  clickToLoad: boolean;
  showARButton: boolean;
  showBbox: boolean;
  showExampleCode: boolean | string[];
  showEventsTriggered: null | string[];
}

class View3D extends React.Component<DemoOptions> {
  public static defaultProps: DemoOptions = {
    clickToLoad: false,
    showARButton: false,
    showBbox: false,
    showExampleCode: false,
    showEventsTriggered: null,
    dracoPath: "/lib/draco/",
    ktxPath: "/lib/basis/",
    meshoptPath: "/lib/meshopt_decoder.js"
  };

  private _view3D: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();

  public get view3D() { return this._view3D; }

  public constructor(props: DemoOptions) {
    super(props);

    this.state = { arAvailable: false };
  }

  public componentDidMount() {
    const { children, showBbox, showARButton, showExampleCode, clickToLoad, ...restProps } = this.props;

    const options = {
      ...restProps,
      autoInit: clickToLoad ? false : restProps.autoInit
    };
    const view3D = new VanillaView3D(this._rootRef.current, options);

    this._view3D = view3D;

    if (showBbox) {
      view3D.once("modelChange", ({ model }) => {
        const modelBbox = model.bbox.clone().applyMatrix4(model.scene.matrixWorld);
        const boxHelper = new THREE.Box3Helper(modelBbox, new THREE.Color(0x00ffff));

        view3D.scene.add(boxHelper);
      });
    }

    if (showARButton) {
      void view3D.loadPlugins(new ARButton(), new ARUI());
    }
  }

  public componentWillUnmount() {
    this._view3D.destroy();
  }

  public render() {
    const { children, showExampleCode, clickToLoad, showEventsTriggered, ...restProps } = this.props;

    const optionsToInclude = Array.isArray(showExampleCode) ? showExampleCode : [];
    const view3DOptions = Object.keys(restProps)
      .filter(key => {
        return key in VanillaView3D.prototype && (restProps[key] !== View3D.defaultProps[key] || optionsToInclude.includes(key));
      })
      .reduce((options, key) => {
        return { ...options, [key]: restProps[key] };
      }, {});

    return <>
      <div ref={this._rootRef} className="view3d-wrapper view3d-square mb-2">
        <canvas className="view3d-canvas"></canvas>
        { clickToLoad && <div className="view3d-overlay"><div className="button is-large" onClick={e => {
          const btn = e.currentTarget;

          if (btn.classList.contains("is-loading")) return;

          btn.classList.add("is-loading");
          void this._view3D.init()
            .then(() => {
              btn.parentElement.classList.add("hidden");
            });
        }}>Load 3D model</div></div>}
        { showEventsTriggered && <EventsList view3D={this} events={showEventsTriggered} />}
        { children }
      </div>
      { showExampleCode && <OptionExample options={view3DOptions} />}
    </>;
  }
}

export * from "../../../src";

export default View3D;
