import React from "react";
import { FastQuadric, ThreeAdapter } from "mesh-simplifier";

import { Model } from "../../../../../src";
import ModelChange from "../item/ModelChange";
import MeshSimplification from "../item/MeshSimplification";
import Playground from "../../../pages/Playground";
import MenuItem from "../MenuItem";
import Range from "../../Range";
import RemoveIcon from "../../../../static/icon/remove.svg";
import PlayIcon from "../../../../static/icon/play.svg";
import PauseIcon from "../../../../static/icon/pause.svg";

class ModelTab extends React.Component<{
  playground: Playground;
  isLoading: boolean;
  onFileChange: any;
}> {
  public render() {
    const { playground, isLoading, onFileChange } = this.props;
    const view3D = playground.view3D;

    return <>
      <ModelChange onSelect={this._onModelSelect} onUpload={onFileChange} isLoading={isLoading} />
      <MeshSimplification onSimplify={this._onSimplify} isLoading={isLoading} />
      <p className="menu-label">Camera</p>
      <div className="menu-list">
        <li className="is-flex is-size-7">
          <ul className="pl-4" style={{ width: "100%" }}>
            <MenuItem>
              <div className="mb-4">Yaw: {view3D?.camera.yaw ?? 0}°</div>
              <Range
                className="mb-2"
                step={1}
                min={0}
                max={360}
                val={[Math.floor(view3D?.camera.yaw ?? 0)]}
                onChange={(values) => {
                  view3D.camera.yaw = values[0];
                  view3D.renderer.renderSingleFrame();
                  this.forceUpdate();
                }} />
            </MenuItem>
            <MenuItem>
              <div className="mb-4">Pitch: {view3D?.camera.pitch ?? 0}°</div>
              <Range
                className="mb-2"
                step={1}
                min={-90}
                max={90}
                val={[Math.floor(view3D?.camera.pitch ?? 0)]}
                onChange={(values) => {
                  view3D.camera.pitch = values[0];
                  view3D.renderer.renderSingleFrame();
                  this.forceUpdate();
                }} />
            </MenuItem>
          </ul>
        </li>
      </div>
      <p className="menu-label">Animation</p>
      <div className="menu-list">{
        view3D?.animator.clips.length > 0
          ? <MenuItem className="is-flex is-flex-direction-row is-align-items-center mb-2">
            <div className="select mr-4">
              <select onChange={evt => {
                view3D.animator.play(parseFloat(evt.target.value));
              }}>
                {
                  view3D.animator.clips.map((clip, idx) => (
                    <option value={idx} key={idx}>{ clip.name }</option>
                  ))
                }
              </select>
            </div>
            { view3D?.animator.paused
              ? <PlayIcon className="icon" onClick={() => {
                view3D.animator.resume();
                this.forceUpdate();
              }} />
              : <PauseIcon className="icon" onClick={() => {
                view3D.animator.pause();
                this.forceUpdate();
              }} /> }
          </MenuItem>
          : <div className="is-size-7">The model does not have any animations!</div>
      }</div>
      <p className="menu-label">Annotation</p>
      <div className="menu-list">{
        view3D?.annotation.list.length > 0
          ? <>
            {
              view3D.annotation.list.map((hotspot, idx) => <div key={idx} className="is-flex is-align-items-center mt-2">
                <span className="has-text-weight-bold mr-2">{idx + 1}</span>
                <input type="text" placeholder="Label" onChange={evt => {
                  hotspot.element!.querySelector(".view3d-annotation-tooltip")!.innerHTML = evt.target.value;
                }} />
                <button className="button is-small ml-2" onClick={() => {
                  hotspot.focus();
                }}>Focus</button>
                <button className="button is-small is-danger ml-2" onClick={() => {
                  view3D.annotation.remove(idx);
                  this.forceUpdate();
                }}><RemoveIcon fill="white" width="24" height="24" /></button>
              </div>)
            }
            <button className="button is-small mt-2" disabled={isLoading} onClick={this._downloadAnnotation}>
              <img className="mr-2" src="/egjs-view3d/icon/file_download_black.svg" />
              <span>Download Annotations (.JSON)</span>
            </button>
          </>
          : <div className="is-size-7">Double click on the model surface to add an annotation!</div>
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

  private _downloadAnnotation = () => {
    const { playground } = this.props;
    const view3D = playground.view3D;
    const model = view3D.model;

    if (!view3D || !model || view3D.annotation.list.length <= 0) return;

    const data = view3D.annotation.toJSON();

    const dataBlob = new Blob([JSON.stringify(data)], {
      type: "application/json"
    });
    const dataURL = URL.createObjectURL(dataBlob);

    const nameGuessRegex = /(\w+)\.\w+$/i;
    const regexRes = nameGuessRegex.exec(model.src);
    const modelName = (!regexRes || !regexRes[1])
      ? "model"
      : regexRes[1];

    const downloadBtn = document.createElement("a");
    downloadBtn.href = dataURL;
    downloadBtn.download = `${modelName}-annotations.json`;
    downloadBtn.click();

    URL.revokeObjectURL(dataURL);
  };
}

export default ModelTab;
