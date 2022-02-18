import clsx from "clsx";
import React, { useRef, useState } from "react";
import View3D from "../View3D";
import { Range } from "react-range";
import License from "../License";

const envmaps = [
  { name: "Artist Workshop", path: "/egjs-view3d/texture/artist_workshop_1k.hdr" },
  { name: "Comfy Café", path: "/egjs-view3d/texture/comfy_cafe_1k.hdr" },
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
  const [exposure, setExposure] = useState(1);
  const view3D1 = useRef<View3D>();
  const view3D2 = useRef<View3D>();

  return <>
    <section>
      <div>
        <table>
          <tbody>
            <tr>
              <td className="mr-2">Skybox Image:</td>
              <td>
                <div className={clsx({ select: true, "mr-1": true })}>
                  <select defaultValue={4} onChange={e => {
                    const path = envmaps[e.target.value].path;
                    view3D1.current.view3D.skybox = path;
                    view3D2.current.view3D.skybox = path;
                  }}>
                    { envmaps.map((env, idx) => (
                      <option key={idx} value={idx}>{env.name}</option>
                    )) }
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td className="mr-2">Exposure: {exposure}</td>
              <td>
                <Range
                  step={0.01}
                  min={0}
                  max={3}
                  values={[exposure]}
                  onChange={(values) => {
                    const newExposure = values[0];
                    setExposure(newExposure);
                    view3D1.current.view3D.exposure = newExposure;
                    view3D2.current.view3D.exposure = newExposure;
                  }}
                  renderTrack={({ props, children }) => {
                    return <div
                      {...props}
                      style={{
                        ...props.style,
                        height: "6px",
                        width: "100%",
                        backgroundColor: "#ccc"
                      }}
                    >
                      {children}
                    </div>;
                  }}
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="columns">
        <div className="column">
          <View3D
            ref={view3D1}
            src="/egjs-view3d/model/draco/alarm.glb"
            skybox="/egjs-view3d/texture/royal_esplanade_1k.hdr"
            skyboxBlur={true}
            showExampleCode />
        </div>
        <div className="column">
          <View3D
            ref={view3D2}
            src="/egjs-view3d/model/draco/alarm.glb"
            skybox="/egjs-view3d/texture/royal_esplanade_1k.hdr"
            showExampleCode />
        </div>
      </div>
    </section>
    <License items={[
      {
        name: "Alarm Clock 01",
        link: "https://polyhaven.com/a/alarm_clock_01",
        author: "Poly Haven",
        authorLink: "https://polyhaven.com/",
        license: "CC0"
      },
      ...envmaps.map(envmap => ({
        name: envmap.name,
        link: `https://polyhaven.com/a/${/(\w+)_1k.hdr$/.exec(envmap.path)[1]}`,
        author: "Poly Haven",
        authorLink: "https://polyhaven.com/",
        license: "CC0"
      }))
    ]} />
  </>;
};
