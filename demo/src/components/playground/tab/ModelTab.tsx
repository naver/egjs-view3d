import React from "react";
import { FastQuadric, ThreeAdapter } from "mesh-simplifier";

import { Model } from "../../../../../src";
import ModelChange from "../item/ModelChange";
import MeshSimplification from "../item/MeshSimplification";
import Playground from "../../../pages/Playground";
import MenuItem from "../MenuItem";
import Range from "../../Range";

class ModelTab extends React.Component<{
  playground: Playground;
  isLoading: boolean;
  onFileChange: any;
}> {
  public render() {
    const { playground, isLoading, onFileChange } = this.props;

    return <>
      <ModelChange onSelect={this._onModelSelect} onUpload={onFileChange} isLoading={isLoading} />
      <MeshSimplification onSimplify={this._onSimplify} isLoading={isLoading} />
      <p className="menu-label">Camera</p>
      <div className="menu-list">
        <li className="is-flex is-size-7">
          <ul className="pl-4" style={{ width: "100%" }}>
            <MenuItem>
              <div className="mb-4">Yaw: {playground.view3D?.camera.yaw ?? 0}°</div>
              <Range
                className="mb-2"
                step={1}
                min={0}
                max={360}
                val={[Math.floor(playground.view3D?.camera.yaw ?? 0)]}
                onChange={(values) => {
                  playground.view3D.camera.yaw = values[0];
                  this.forceUpdate();
                }} />
            </MenuItem>
            <MenuItem>
              <div className="mb-4">Pitch: {playground.view3D?.camera.pitch ?? 0}°</div>
              <Range
                className="mb-2"
                step={1}
                min={-90}
                max={90}
                val={[Math.floor(playground.view3D?.camera.pitch ?? 0)]}
                onChange={(values) => {
                  playground.view3D.camera.pitch = values[0];
                  this.forceUpdate();
                }} />
            </MenuItem>
          </ul>
        </li>
      </div>
      <p className="menu-label">Annotation</p>
      <div className="menu-list">{
        playground.view3D?.annotation.list.map((hotspot, idx) => <div key={idx}>{idx + 1}</div>)
      }</div>
    </>;
  }

  private _onModelSelect = async (e) => {
    const { playground } = this.props;
    const view3D = playground.view3D;
    const selected = e.target.value;
    if (!selected) return;

    playground.setState({ isLoading: true });

    await view3D.load(selected);
    view3D.autoPlayer.disable();

    playground.originalModel = view3D.model;

    playground.setState({
      initialized: true,
      isLoading: false
    });
  };

  private _onSimplify = (targetPercentage, aggressiveness) => {
    const { playground } = this.props;
    const view3D = playground.view3D;
    const origModel = playground.originalModel;
    const simplifier = new FastQuadric({ targetPercentage, aggressiveness });
    const adaptedModel = new ThreeAdapter(origModel.scene, true);

    playground.setState({ isLoading: true });

    requestAnimationFrame(() => {
      simplifier.simplify(adaptedModel);

      const simplifiedModel = new Model({ src: origModel.src, scenes: [adaptedModel.object] });

      view3D.display(simplifiedModel);

      playground.setState({ isLoading: false });
    });
  };
}

export default ModelTab;
