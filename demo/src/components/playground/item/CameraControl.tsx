import React from "react";
import Range from "../Range";

import { Context } from "../context";
import Collapse from "../Collapse";

class CameraControl extends React.Component {
  private _yawRef = React.createRef<Range>();
  private _pitchRef = React.createRef<Range>();
  private _zoomRef = React.createRef<Range>();

  public componentDidMount() {
    const { state } = this.context;
    const view3D = state.view3D;

    view3D.on("cameraChange", () => {
      this._yawRef.current?.setVal(view3D.camera.yaw.toFixed(0));
      this._pitchRef.current?.setVal(view3D.camera.pitch.toFixed(0));
      this._zoomRef.current?.setVal(view3D.camera.zoom.toFixed(1));
    });
  }

  public render() {
    const { state } = this.context;
    const view3D = state.view3D;

    if (!view3D) return <></>;

    return <Collapse title="Camera">
      <Range
        ref={this._yawRef}
        name="Yaw"
        className="mb-2"
        step={1}
        min={0}
        max={360}
        defaultValue={Math.floor(view3D?.camera.yaw)}
        onChange={val => {
          view3D.camera.yaw = val as number;
          view3D.renderer.renderSingleFrame(true);
          this.forceUpdate();
        }} />
      <Range
        ref={this._pitchRef}
        name="Pitch"
        className="mb-2"
        step={1}
        min={-90}
        max={90}
        defaultValue={Math.floor(view3D?.camera.pitch)}
        onChange={val => {
          view3D.camera.pitch = val as number;
          view3D.renderer.renderSingleFrame(true);
          this.forceUpdate();
        }} />
      <Range
        ref={this._zoomRef}
        name="Zoom"
        className="mb-2"
        step={0.1}
        min={-view3D.control.zoom.range.max}
        max={-view3D.control.zoom.range.min}
        defaultValue={Math.floor(view3D?.camera.zoom)}
        onChange={val => {
          view3D.camera.zoom = val as number;
          view3D.renderer.renderSingleFrame(true);
          this.forceUpdate();
        }} />
    </Collapse>;
  }
}

CameraControl.contextType = Context;

export default CameraControl;

