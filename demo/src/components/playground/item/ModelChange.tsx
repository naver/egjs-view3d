import React from "react";
import clsx from "clsx";
import Collapse from "../Collapse";
import { Context } from "../context";
import { onFileChange } from "../action";
import UploadIcon from "@site/static/icon/file_upload_black.svg";

const models = [
  { name: "Cube", path: "/egjs-view3d/model/cube.glb" },
  { name: "Alarm", path: "/egjs-view3d/model/draco/alarm.glb" },
  { name: "Extinguisher", path: "/egjs-view3d/model/draco/extinguisher.glb" },
  { name: "Plant", path: "/egjs-view3d/model/draco/plant.glb" },
  { name: "Watch", path: "/egjs-view3d/model/draco/watch.glb" },
  { name: "Payphone", path: "/egjs-view3d/model/draco/payphone.glb" },
  { name: "Suzanne", path: "/egjs-view3d/model/meshopt/suzanne.glb" },
  { name: "Lucy", path: "/egjs-view3d/model/draco/lucy.glb" }
];

export default () => {
  const { state, dispatch } = React.useContext(Context);
  const view3D = state.view3D;
  const isLoading = state.isLoading;

  if (!view3D) return <></>;

  return <Collapse title="Select 3D Model">
    <div className="is-flex is-flex-direction-row">
      <div className={clsx({ select: true, "mr-1": true, "is-primary": true, "is-loading": isLoading })}>
        <select onChange={async e => {
          const selected = e.target.value;
          if (!selected) return;

          dispatch({
            type: "set_loading",
            val: true
          });

          await view3D.load(selected);
          view3D.autoPlayer.disable();

          dispatch({
            type: "set_orig_model",
            val: view3D.model!
          });

          dispatch({
            type: "set_loading",
            val: false
          });

          dispatch({
            type: "set_initialized",
            val: true
          });
        }} disabled={isLoading}>
          { models.map((model, idx) => (
            <option key={idx} value={model.path}>{model.name}</option>
          )) }
        </select>
      </div>
      <div className="file">
        <label className="file-label">
          <input className="file-input" type="file" name="resume" accept=".glb" onChange={e => {
            const fileMap = new Map();
            const files = e.target.files;

            if (!files) return;

            for (let idx = 0; idx < files.length; idx++) {
              const file = files.item(idx);

              file && fileMap.set(file.name, file);
            }

            dispatch({
              type: "set_initialized",
              val: true
            });

            onFileChange(view3D, dispatch, fileMap);
          }}></input>
          <span className="file-cta">
            <span className="file-icon"><UploadIcon /></span>
            <span className="file-label">GLB</span>
          </span>
        </label>
      </div>
    </div>
  </Collapse>;
};
