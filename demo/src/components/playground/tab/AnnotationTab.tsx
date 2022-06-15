import React from "react";
import { Context } from "../context";
import Range from "../Range";

import CloseIcon from "@site/static/icon/close.svg";
import DownloadIcon from "@site/static/icon/file_download_black.svg";

class AnnotationTab extends React.Component {
  public render() {
    const { state } = this.context;
    const view3D = state.view3D;

    if (!view3D) return <></>;

    return <div className="p-4">
      <p className="menu-label">Annotation</p>
      <div className="menu-list">{
        view3D?.annotation.list.length > 0
          ? <>
            {
              view3D.annotation.list.map((hotspot, idx) => <div key={hotspot.uuid} className="message is-size-7">
                <div className="message-header">
                  <span>{idx + 1}</span>
                  <CloseIcon className="delete" aria-label="delete"
                    width="16" height="16" fill="#ffffff"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      view3D.annotation.remove(idx);
                      this.forceUpdate();
                    }} />
                </div>
                <div className="message-body">
                  <p className="menu-label">Label</p>
                  <input type="text" className="mb-2" onChange={evt => {
                    hotspot.element!.querySelector(".view3d-annotation-tooltip")!.innerHTML = evt.target.value;
                  }} />
                  <Range
                    name="Duration(Second)"
                    className="mb-2"
                    step={0.01}
                    min={0}
                    max={3}
                    defaultValue={1}
                    onChange={val => {
                      hotspot.focusDuration = (val as number) * 1000;
                    }} />
                  <Range
                    name="Yaw"
                    className="mb-2"
                    step={1}
                    min={0}
                    max={360}
                    defaultValue={Math.floor(hotspot.focusPose[0])}
                    onChange={val => {
                      hotspot.focusPose[0] = val;
                    }} />
                  <Range
                    name="Pitch"
                    className="mb-2"
                    step={1}
                    min={-90}
                    max={90}
                    defaultValue={Math.floor(hotspot.focusPose[1])}
                    onChange={val => {
                      hotspot.focusPose[1] = val;
                    }} />
                  <Range
                    name="Zoom"
                    className="mb-2"
                    step={0.1}
                    min={-view3D.control.zoom.range.max}
                    max={-view3D.control.zoom.range.min}
                    defaultValue={Math.floor(hotspot.focusPose[2])}
                    onChange={val => {
                      hotspot.focusPose[2] = val;
                    }} />
                  <button className="button is-small ml-2" onClick={() => {
                    hotspot.focus();
                  }}>Focus</button>
                </div>
              </div>)
            }
            <button className="button is-small mt-2" disabled={state.isLoading} onClick={this._downloadAnnotation}>
              <DownloadIcon className="icon mr-2" />
              <span>Download Annotations (.JSON)</span>
            </button>
          </>
          : <div className="is-size-7">Double click on the model surface to add an annotation!</div>
      }</div>
    </div>;
  }

  private _downloadAnnotation = () => {
    const { state } = this.context;
    const view3D = state.view3D;
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

AnnotationTab.contextType = Context;

export default AnnotationTab;
