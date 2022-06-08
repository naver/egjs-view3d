import React from "react";

import { Context } from "../context";
import ModelChange from "../item/ModelChange";
import MeshSimplification from "../item/MeshSimplification";
import CameraControl from "../item/CameraControl";
import PlayIcon from "@site/static/icon/play.svg";
import PauseIcon from "@site/static/icon/pause.svg";

class ModelTab extends React.Component {
  public render() {
    const { state } = this.context;

    const view3D = state.view3D;
    const isLoading = state.isLoading;

    if (!view3D) return <></>;

    return <>
      <ModelChange />
      <CameraControl />
      <MeshSimplification />
      <p className="menu-label">Animation</p>
      <div className="menu-list">{
        view3D?.animator.clips.length > 0
          ? <div className="is-flex is-flex-direction-row is-align-items-center mb-2">
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
          </div>
          : <div className="is-size-7">The model does not have any animations!</div>
      }</div>
    </>;
  }
}

ModelTab.contextType = Context;

export default ModelTab;
