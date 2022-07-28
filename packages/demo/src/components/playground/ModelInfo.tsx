import React from "react";
import { Model } from "../../../../view3d/src";

import styles from "./model-info.module.css";
import { Context } from "./context";

import RightArrowIcon from "../../../static/icon/arrow_right_white.svg";


class ModelInfo extends React.Component {
  public render() {
    const { state } = this.context;
    const originalModel = state.originalModel;
    if (!originalModel) return <></>;

    const simplifiedModel = state.view3D.model !== originalModel
      ? state.view3D.model
      : null;

    return <div className={styles.modelInfo}>
      <div className="p-4">
        <div>src: { originalModel.src }</div>
        <div className="is-flex is-flex-direction-row is-align-items-center">
          <span className="mr-1">vertices:</span>
          <span>{ this._getVertexCount(originalModel) }</span>
          { simplifiedModel && <><RightArrowIcon /><span>{ this._getVertexCount(simplifiedModel) }</span></>}
        </div>
        <div className="is-flex is-flex-direction-row is-align-items-center">
          <span className="mr-1">triangles:</span>
          <span>{ this._getTriangleCount(originalModel) }</span>
          { simplifiedModel && <><RightArrowIcon /><span>{ this._getTriangleCount(simplifiedModel) }</span></>}
        </div>
      </div>
    </div>;
  }

  private _getVertexCount(model: Model) {
    return model.meshes.reduce((total, mesh) => {
      if (!mesh.geometry.attributes.position) return total;

      const vCount = mesh.geometry.attributes.position.count;
      return total + vCount;
    }, 0);
  }

  private _getTriangleCount(model: Model) {
    return model.meshes.reduce((total, mesh) => {
      if (!mesh.geometry.index) return total;

      const tCount = mesh.geometry.index.count / 3;
      return total + tCount;
    }, 0);
  }
}

ModelInfo.contextType = Context;

export default ModelInfo;
