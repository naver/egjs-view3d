import React from "react";
import Range from "../Range";

import { Context } from "../context";
import Collapse from "../Collapse";

class CameraControl extends React.Component {
  private _yawRef = React.createRef<Range>();
  private _pitchRef = React.createRef<Range>();
  private _zoomRef = React.createRef<Range>();
  private _fovRef = React.createRef<Range>();
  private _pivotXRef = React.createRef<Range>();
  private _pivotYRef = React.createRef<Range>();
  private _pivotZRef = React.createRef<Range>();
  private _initialZoomAxisRef = React.createRef<HTMLSelectElement>();
  private _initialZoomRef = React.createRef<Range>();

  public componentDidMount() {
    const { state } = this.context;
    const view3D = state.view3D;

    view3D.on("resize", this._onResize);
    view3D.on("cameraChange", this._onCameraChange);
  }

  public componentWillUnmount() {
    const { state } = this.context;
    const view3D = state.view3D;

    view3D.off("resize", this._onResize);
    view3D.off("cameraChange", this._onCameraChange);
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
        defaultValue={Math.floor(view3D.camera.yaw)}
        onChange={val => {
          view3D.camera.yaw = val as number;
          view3D.renderer.renderSingleFrame(true);
        }} />
      <Range
        ref={this._pitchRef}
        name="Pitch"
        className="mb-2"
        step={1}
        min={-90}
        max={90}
        defaultValue={Math.floor(view3D.camera.pitch)}
        onChange={val => {
          view3D.camera.pitch = val as number;
          view3D.renderer.renderSingleFrame(true);
        }} />
      <Range
        ref={this._zoomRef}
        name="Zoom"
        className="mb-2"
        step={0.1}
        min={-view3D.control.zoom.range.max}
        max={-view3D.control.zoom.range.min}
        defaultValue={Math.floor(view3D.camera.zoom)}
        onChange={val => {
          view3D.camera.zoom = val as number;
          view3D.renderer.renderSingleFrame(true);
        }} />
      <Range
        ref={this._fovRef}
        name="FOV"
        className="mb-2"
        step={0.1}
        min={1}
        max={179}
        defaultValue={Math.floor(view3D.camera.baseFov)}
        onChange={val => {
          view3D.camera.baseFov = val as number;
          view3D.renderer.renderSingleFrame(true);
        }} />
      <div>
        <Range
          ref={this._pivotXRef}
          name="pivot.x"
          className="mb-2"
          step={0.01}
          min={view3D.model?.bbox.min.x}
          max={view3D.model?.bbox.max.x}
          defaultValue={view3D.camera.newPose.pivot.x.toFixed(2)}
          onChange={val => {
            view3D.camera.newPose.pivot.x = val as number;
            view3D.renderer.renderSingleFrame(true);
          }} />
        <Range
          ref={this._pivotYRef}
          name="pivot.y"
          className="mb-2"
          step={0.01}
          min={view3D.model?.bbox.min.y}
          max={view3D.model?.bbox.max.y}
          defaultValue={view3D.camera.pivot.y.toFixed(2)}
          onChange={val => {
            view3D.camera.newPose.pivot.y = val as number;
            view3D.renderer.renderSingleFrame(true);
          }} />
        <Range
          ref={this._pivotZRef}
          name="pivot.z"
          className="mb-2"
          step={0.01}
          min={view3D.model?.bbox.min.z}
          max={view3D.model?.bbox.max.z}
          defaultValue={view3D.camera.pivot.z.toFixed(2)}
          onChange={val => {
            view3D.camera.newPose.pivot.z = val as number;
            view3D.renderer.renderSingleFrame(true);
          }} />
      </div>
      <div>
        <div className="mb-1 menu-label">Initial Zoom</div>
        <div className="is-flex is-flex-direction-row">
          <div className="select is-primary">
            <select ref={this._initialZoomAxisRef}>
              <option value="x">x</option>
              <option value="y">y</option>
              <option value="z">z</option>
            </select>
          </div>
          <Range
            ref={this._initialZoomRef}
            className="ml-2"
            style={{ flex: "1" }}
            step={0.01}
            min={0}
            max={1}
            defaultValue={0.8} />
        </div>
        <div className="is-flex is-flex-direction-row is-justify-content-center mt-2">
          <button className="button is-small" disabled={state.isLoading} onClick={() => {
            const initialZoom = this._initialZoomRef.current?.val;
            if (!initialZoom) return;
            const zoomAxis = this._initialZoomAxisRef.current?.value;

            view3D.initialZoom = {
              axis: zoomAxis,
              ratio: initialZoom
            };

            view3D.camera.fit(view3D.model, view3D.center);
            view3D.camera.reset(0);

            view3D.initialZoom = 0;
          }}>Apply Initial Zoom</button>
        </div>
      </div>
    </Collapse>;
  }

  private _onResize = () => {
    this.forceUpdate();
  };

  private _onCameraChange = () => {
    const { state } = this.context;
    const view3D = state.view3D!;

    this._yawRef.current?.setVal(view3D.camera.yaw.toFixed(0));
    this._pitchRef.current?.setVal(view3D.camera.pitch.toFixed(0));
    this._zoomRef.current?.setVal(view3D.camera.zoom.toFixed(1));
    this._fovRef.current?.setVal(view3D.camera.baseFov.toFixed(0));
    this._pivotXRef.current?.setVal(view3D.camera.pivot.x.toFixed(2));
    this._pivotYRef.current?.setVal(view3D.camera.pivot.y.toFixed(2));
    this._pivotZRef.current?.setVal(view3D.camera.pivot.z.toFixed(2));
  };
}

CameraControl.contextType = Context;

export default CameraControl;

