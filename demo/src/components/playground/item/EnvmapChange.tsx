import React, { useState } from "react";
import clsx from "clsx";
import Range from "../Range";
import Collapse from "../Collapse";
import { Context } from "../context";
import { onEnvmapChange } from "../action";
import { Skybox } from "../../../../../src/core";
import UploadIcon from "@site/static/icon/file_upload_black.svg";

const envmaps = [
  { name: "Artist Workshop", path: "/egjs-view3d/texture/artist_workshop_1k.hdr" },
  { name: "Comfy Cafe", path: "/egjs-view3d/texture/comfy_cafe_1k.hdr" },
  { name: "Dry Hay Field", path: "/egjs-view3d/texture/dry_hay_field_1k.hdr" },
  { name: "Evening Meadow", path: "/egjs-view3d/texture/evening_meadow_1k.hdr" },
  { name: "Royal Esplanade", path: "/egjs-view3d/texture/royal_esplanade_1k.hdr" },
  { name: "Spruit Sunrise", path: "/egjs-view3d/texture/spruit_sunrise_1k.hdr" },
  { name: "Vignaioli Night", path: "/egjs-view3d/texture/vignaioli_night_1k.hdr" },
  { name: "Fireplace", path: "/egjs-view3d/texture/fireplace_1k.hdr" },
  { name: "Venice Sunset", path: "/egjs-view3d/texture/venice_sunset_1k.hdr" },
  { name: "Moonless Golf", path: "/egjs-view3d/texture/moonless_golf_1k.hdr" },
  { name: "Studio Garden", path: "/egjs-view3d/texture/studio_garden_1k.hdr" },
  { name: "Studio", path: "/egjs-view3d/texture/studio_small_08_1k.hdr" }
];

export default () => {
  const { state, dispatch } = React.useContext(Context);
  const view3D = state.view3D;
  const isLoading = state.isLoading;

  if (!view3D) return <></>;

  return <>
    <Collapse title="Environment">
      <p className="menu-label">Choose HDR envmap</p>
      <div className="is-flex is-flex-direction-row mb-4">
        <div className={clsx({ select: true, "mr-1": true, "is-primary": true, "is-loading": isLoading })}>
          <select onChange={e => {
            onEnvmapChange(view3D, dispatch, e.target.value);
          }} disabled={isLoading}>
            { envmaps.map((envmap, idx) => (
              <option key={idx} value={envmap.path}>{envmap.name}</option>
            )) }
          </select>
        </div>
        <div className="file">
          <label className="file-label">
            <input className="file-input" type="file" name="resume" accept=".hdr" onChange={e => {
              const files = e.target.files;
              const file = files?.item(0);
              if (!file) return;

              onEnvmapChange(view3D, dispatch, URL.createObjectURL(file));
            }}></input>
            <span className="file-cta">
              <span className="file-icon"><UploadIcon /></span>
              <span className="file-label">HDR</span>
            </span>
          </label>
        </div>
      </div>
      <Range
        name="Exposure"
        step={0.01}
        min={0}
        max={2}
        defaultValue={1}
        onChange={val => {
          view3D.exposure = val as number;
        }} />
      <div className="is-flex is-flex-direction-row is-align-items-center mb-2">
        <input className="checkbox mr-2" type="checkbox" defaultChecked={true} disabled={state.isLoading} onChange={e => {
          const scene = view3D.scene;
          const checked = e.currentTarget.checked;

          if (checked && scene.root.environment) {
            if (view3D.skyboxBlur) {
              scene.root.background = Skybox.createBlurredHDR(view3D, scene.root.environment);
            } else {
              scene.root.background = scene.root.environment;
            }
          } else {
            scene.root.background = null;
          }
          view3D.renderer.renderSingleFrame();
        }}></input>
        <span className="menu-label m-0">Show Skybox</span>
      </div>
      <div className="is-flex is-flex-direction-row is-align-items-center">
        <input className="checkbox mr-2" type="checkbox" defaultChecked={false} disabled={state.isLoading} onChange={e => {
          const checked = e.currentTarget.checked;

          view3D.skyboxBlur = checked;
          view3D.renderer.renderSingleFrame();
        }}></input>
        <span className="menu-label m-0">Blur skybox</span>
      </div>
    </Collapse>
  </>;
};
