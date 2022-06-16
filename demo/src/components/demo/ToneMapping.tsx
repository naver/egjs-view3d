import clsx from "clsx";
import React, { useRef, useState } from "react";
import Slider from "rc-slider";
import View3D, { TONE_MAPPING } from "../View3D";
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
  const [toneMapping, setToneMapping] = useState(TONE_MAPPING.LINEAR);
  const view3D = useRef<View3D>(null);

  return <>
    <section>
      <div>
        <table>
          <tbody>
            <tr>
              <td className="mr-2">ToneMapping:</td>
              <td>
                <div className={clsx({ select: true, "mr-1": true })}>
                  <select defaultValue={4} onChange={e => {
                    const newToneMapping = Object.values(TONE_MAPPING)[e.target.value];
                    setToneMapping(newToneMapping);
                    view3D.current!.view3D.toneMapping = newToneMapping;
                  }}>
                    { Object.keys(TONE_MAPPING).map((name, idx) => (
                      <option key={idx} value={idx}>{name}</option>
                    )) }
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <td className="mr-2">Skybox Image:</td>
              <td>
                <div className={clsx({ select: true, "mr-1": true })}>
                  <select defaultValue={4} onChange={e => {
                    const path = envmaps[e.target.value].path;
                    view3D.current!.view3D.skybox = path;
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
                <Slider
                  step={0.01}
                  min={0}
                  max={3}
                  defaultValue={exposure}
                  onChange={val => {
                    const newExposure = val as number;
                    setExposure(newExposure);
                    view3D.current!.view3D.exposure = newExposure;
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <View3D
        ref={view3D}
        src="/egjs-view3d/model/draco/alarm.glb"
        skybox="/egjs-view3d/texture/royal_esplanade_1k.hdr"
        toneMapping={toneMapping}
        showExampleCode />
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
        link: `https://polyhaven.com/a/${/(\w+)_1k.hdr$/.exec(envmap.path)![1]}`,
        author: "Poly Haven",
        authorLink: "https://polyhaven.com/",
        license: "CC0"
      }))
    ]} />
  </>;
};
