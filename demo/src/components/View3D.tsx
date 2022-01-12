import React from "react";
import clsx from "clsx";
import VanillaView3D, { View3DOptions, ARButton, AROverlay } from "../../../src";
import DownloadIcon from "../../static/icon/file_download_black.svg";

import OptionExample from "./OptionExample";
import EventsList from "./EventsList";
import ControlGUI from "./ControlGUI";

interface DemoOptions extends Partial<View3DOptions> {
  className: string;
  poster: string | null;
  clickToLoad: boolean;
  showARButton: boolean;
  showBbox: boolean;
  showExampleCode: boolean | string[];
  showEventsTriggered: null | string[];
  showControl: string[] | null;
}

class View3D extends React.Component<DemoOptions, {
  arAvailable: boolean;
  initialized: boolean;
}> {
  public static defaultProps: DemoOptions = {
    className: "",
    poster: null,
    clickToLoad: false,
    showARButton: false,
    showBbox: false,
    showExampleCode: false,
    showEventsTriggered: null,
    showControl: null,
    dracoPath: "/egjs-view3d/lib/draco/",
    ktxPath: "/egjs-view3d/lib/basis/",
    meshoptPath: "/egjs-view3d/lib/meshopt_decoder.js"
  };

  private _view3D: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();
  private _guiRef = React.createRef<ControlGUI>();

  public get view3D() { return this._view3D; }

  public constructor(props: DemoOptions) {
    super(props);

    this.state = {
      arAvailable: false,
      initialized: false
    };
  }

  public componentDidMount() {
    const { children, showBbox, showARButton, showExampleCode, showControl, clickToLoad, ...restProps } = this.props;

    const options = {
      ...restProps,
      autoInit: clickToLoad ? false : restProps.autoInit
    };
    const view3D = new VanillaView3D(this._rootRef.current, options);
    view3D.on("ready", () => {
      this.setState({
        initialized: true
      });
    });

    this._view3D = view3D;

    if (showBbox) {
      view3D.once("modelChange", ({ model }) => {
        const modelBbox = model.bbox.clone().applyMatrix4(model.scene.matrixWorld);
        const boxHelper = new THREE.Box3Helper(modelBbox, new THREE.Color(0x00ffff));

        view3D.scene.add(boxHelper);
      });
    }

    if (showARButton) {
      void view3D.loadPlugins(new ARButton(), new AROverlay());
    }

    if (showControl) {

    }
  }

  public componentWillUnmount() {
    this._view3D.destroy();
  }

  public render() {
    const { initialized } = this.state;
    const { children, className, poster, showExampleCode, showControl, clickToLoad, showEventsTriggered, ...restProps } = this.props;

    const optionsToInclude = Array.isArray(showExampleCode) ? showExampleCode : [];
    const view3DOptions = Object.keys(restProps)
      .filter(key => {
        return key in VanillaView3D.prototype && (restProps[key] !== View3D.defaultProps[key] || optionsToInclude.includes(key));
      })
      .reduce((options, key) => {
        return { ...options, [key]: restProps[key] };
      }, {});

    return <>
      <div ref={this._rootRef} className={clsx(className, "view3d-wrapper", "view3d-square", "mb-2")}>
        <canvas className="view3d-canvas"></canvas>
        { clickToLoad && <div className={clsx({ "view3d-overlay": true, "hidden": initialized })}>
          <div className="button is-medium" onClick={e => {
            const btn = e.currentTarget;

            if (btn.classList.contains("is-loading")) return;

            btn.classList.add("is-loading");
            void this._view3D.init();
          }}>
            <span className="icon is-medium">
              <DownloadIcon />
            </span>
            <span>Load 3D model</span>
          </div>
        </div>}
        { (poster && !initialized) && <img className="view3d-poster" src={poster} />}
        { showEventsTriggered && <EventsList view3D={this} events={showEventsTriggered} />}
        { showControl && <ControlGUI ref={this._guiRef} /> }
        { children }
      </div>
      { showExampleCode && <OptionExample options={view3DOptions} />}
    </>;
  }
}

export * from "../../../src";

export default View3D;
