import React from "react";
import clsx from "clsx";
// @ts-ignore
import Layout from "@theme/Layout";
// @ts-ignore
import styles from "./playground.module.css";

import VanillaView3D from "../../../src";

class Playground extends React.Component {
  private _view3D: VanillaView3D;
  private _rootRef = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const view3D = new VanillaView3D(this._rootRef.current, {
      src: "/model/draco/alarm.glb",
      envmap: "/texture/artist_workshop_1k.hdr"
    });

    this._view3D = view3D;
  }

  public render() {
    return <Layout>
      <div className="container">
        <div ref={this._rootRef} className={clsx("view3d-wrapper", styles.playground)}>
          <canvas className="view3d-canvas"></canvas>
        </div>
      </div>
    </Layout>;
  }
}

export default Playground;
