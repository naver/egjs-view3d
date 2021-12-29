import React from "react";
import clsx from "clsx";

const models = [
  { name: "Cube", path: "/model/cube.glb" },
  { name: "Alarm", path: "/model/meshopt/alarm.glb" },
  { name: "Extinguisher", path: "/model/meshopt/extinguisher.glb" },
  { name: "Plant", path: "/model/draco/plant.glb" },
  { name: "Watch", path: "/model/meshopt/watch.glb" },
  { name: "Payphone", path: "/model/draco/payphone.glb" },
  { name: "Suzanne", path: "/model/meshopt/suzanne.glb" }
];

export default ({ onSelect, onUpload, isLoading }) => {
  return <div className="mb-4">
    <p className="menu-label">
      Choose 3D Model
    </p>
    <div className="is-flex is-flex-direction-row">
      <div className={clsx({ select: true, "mr-1": true, "is-loading": isLoading })}>
        <select onChange={e => {
          onSelect(e);
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

            [...files].forEach(file => {
              fileMap.set(file.name, file);
            });
            onUpload(fileMap);
          }}></input>
          <span className="file-cta">
            <span className="file-icon">
              <img src="/icon/file_upload_black.svg" />
            </span>
            <span className="file-label">GLB</span>
          </span>
        </label>
      </div>
    </div>
  </div>;
};
