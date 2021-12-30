import React, { useState } from "react";
import clsx from "clsx";
import { Range } from "react-range";

const models = [
  { name: "Artist Workshop", path: "/texture/artist_workshop_1k.hdr" },
  { name: "Comfy Cafe", path: "/texture/comfy_cafe_1k.hdr" },
  { name: "Dry Hay Field", path: "/texture/dry_hay_field_1k.hdr" },
  { name: "Evening Meadow", path: "/texture/evening_meadow_1k.hdr" },
  { name: "Royal Esplanade", path: "/texture/royal_esplanade_1k.hdr" },
  { name: "Spruit Sunrise", path: "/texture/spruit_sunrise_1k.hdr" },
  { name: "Vignaioli Night", path: "/texture/vignaioli_night_1k.hdr" },
  { name: "Fireplace", path: "/texture/fireplace_1k.hdr" },
  { name: "Venice Sunset", path: "/texture/venice_sunset_1k.hdr" },
  { name: "Moonless Golf", path: "/texture/moonless_golf_1k.hdr" },
  { name: "Studio", path: "/texture/studio_small_08_1k.hdr" }
];

export default ({ onChange, onExposureChange, isLoading }) => {
  const [exposure, setExposure] = useState(1);

  return <div>
    <p className="menu-label">
      Choose HDR envmap
    </p>
    <div className="is-flex is-flex-direction-row">
      <div className={clsx({ select: true, "mr-1": true, "is-loading": isLoading })}>
        <select onChange={e => {
          onChange(e.target.value);
        }} disabled={isLoading}>
          { models.map((model, idx) => (
            <option key={idx} value={model.path}>{model.name}</option>
          )) }
        </select>
      </div>
      <div className="file">
        <label className="file-label">
          <input className="file-input" type="file" name="resume" accept=".hdr" onChange={e => {
            const file = e.target.files[0];
            if (!file) return;

            onChange(URL.createObjectURL(file));
          }}></input>
          <span className="file-cta">
            <span className="file-icon">
              <img src="/icon/file_upload_black.svg" />
            </span>
            <span className="file-label">HDR</span>
          </span>
        </label>
      </div>
    </div>
    <div className="py-4">
      <div className="mb-4">Exposure: {exposure}</div>
      <Range
        step={0.01}
        min={0}
        max={2}
        values={[exposure]}
        onChange={(values) => {
          setExposure(values[0]);
          onExposureChange(values[0]);
        }}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "6px",
              width: "100%",
              backgroundColor: "#ccc"
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "15px",
              width: "15px",
              borderRadius: "9999px",
              backgroundColor: "#485fc7"
            }}
          />
        )}/>
    </div>
  </div>;
};
