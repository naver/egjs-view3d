import React from "react";
import { Context } from "../context";

import PlayIcon from "@site/static/icon/play.svg";
import PauseIcon from "@site/static/icon/pause.svg";

class AnimationTab extends React.Component {
  public render() {
    const { state } = this.context;
    const view3D = state.view3D;

    if (!view3D) return <></>;

    return <div className="p-4">
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
    </div>;
  }
}

AnimationTab.contextType = Context;

export default AnimationTab;
