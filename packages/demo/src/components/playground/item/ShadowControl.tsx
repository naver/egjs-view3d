import React from "react";
import Range from "../Range";

import { Context } from "../context";
import Collapse from "../Collapse";

export default () => {
  const { state } = React.useContext(Context);

  const view3D = state.view3D;

  if (!view3D) return <></>;

  return <Collapse title="Shadow">
    <Range
      name="Shadow darkness"
      className="mb-2"
      step={0.01}
      min={0}
      max={1}
      defaultValue={view3D.scene.shadowPlane.darkness}
      onChange={val => {
        view3D.scene.shadowPlane.darkness = val as number;
        view3D.renderer.renderSingleFrame();
      }} />
    <Range
      name="Shadow blur"
      className="mb-2"
      step={1}
      min={1}
      max={14}
      defaultValue={view3D?.scene.shadowPlane.blur}
      onChange={val => {
        view3D.scene.shadowPlane.blur = val as number;
        view3D.renderer.renderSingleFrame();
      }} />
  </Collapse>;
};
