import React from "react";
import { Context } from "../context";

import RemoveIcon from "@site/static/icon/remove.svg";

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
            <button className="button is-small mt-2" disabled={state.isLoading} onClick={this._downloadAnnotation}>
              <img className="mr-2" src="/egjs-view3d/icon/file_download_black.svg" />
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
