import React from "react";

import { Context } from "../context";
import ModelChange from "../item/ModelChange";
import MeshSimplification from "../item/MeshSimplification";
import CameraControl from "../item/CameraControl";

class ModelTab extends React.Component {
  public render() {
    const { state } = this.context;

    const view3D = state.view3D;

    if (!view3D) return <></>;

    return <>
      <ModelChange />
      <CameraControl />
      <MeshSimplification />
    </>;
  }
}

ModelTab.contextType = Context;

export default ModelTab;
