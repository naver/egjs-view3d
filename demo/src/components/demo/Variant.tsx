import React, { useRef, useState } from "react";
import clsx from "clsx";
import View3D, { TONE_MAPPING } from "../View3D";

const variants = [
  "midnight",
  "beach",
  "street"
]

export default () => {
  const view3D = useRef<View3D>(null);

  return <>
    <section>
      <div>
        <table>
          <tbody>
            <tr>
              <td className="mr-2">Variant:</td>
              <td>
                <div className={clsx({ select: true, "mr-1": true })}>
                  <select defaultValue={0} onChange={e => {
                    view3D.current!.view3D.variant = e.target.value;
                  }}>
                    { variants.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    )) }
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <View3D
        ref={view3D}
        src="/egjs-view3d/model/MaterialsVariantsShoe.glb" />
    </section>
  </>;
};
