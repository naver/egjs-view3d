import React from "react";

import Playground from "../../../pages/Playground";
import EnvmapChange from "../item/EnvmapChange";
import MenuItem from "../MenuItem";
import Range from "../../Range";
import { Skybox } from "../../../../../src/core";

class EnvironmentTab extends React.Component<{
  playground: Playground;
  isLoading: boolean;
  onEnvmapChange: any;
}> {
  public render() {
    const { playground, isLoading, onEnvmapChange } = this.props;
    const view3D = playground.view3D;

    return <>
      <EnvmapChange onChange={onEnvmapChange} onExposureChange={val => this.props.playground.view3D.exposure = val} isLoading={isLoading} />
      <MenuItem className="is-flex is-align-items-center">
        <span className="menu-label my-0 mr-2">Show Skybox</span>
        <input className="checkbox" type="checkbox" defaultChecked={true} disabled={isLoading} onChange={e => {
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
        }}></input>
      </MenuItem>
      <MenuItem className="is-flex is-align-items-center">
        <span className="menu-label my-0 mr-2">Blur skybox</span>
        <input className="checkbox" type="checkbox" defaultChecked={false} disabled={isLoading} onChange={e => {
          const checked = e.currentTarget.checked;

          if (checked) {
            view3D.skyboxBlur = true;
          } else {
            view3D.skyboxBlur = false;
          }
        }}></input>
      </MenuItem>
      <MenuItem>
        <div className="menu-label mb-4">Shadow darkness: {playground.view3D?.scene.shadowPlane.darkness ?? 0.5}</div>
        <Range
          className="mb-2"
          step={0.01}
          min={0}
          max={1}
          val={playground.view3D?.scene.shadowPlane.darkness ?? 0.5}
          onChange={(values) => {
            view3D.scene.shadowPlane.darkness = values[0];
            view3D.renderer.renderSingleFrame();
            this.forceUpdate();
          }} />
      </MenuItem>
      <MenuItem>
        <div className="menu-label mb-4">Shadow blur: {playground.view3D?.scene.shadowPlane.blur ?? 3.5}</div>
        <Range
          className="mb-2"
          step={1}
          min={1}
          max={14}
          val={playground.view3D?.scene.shadowPlane.blur ?? 3.5}
          onChange={(values) => {
            view3D.scene.shadowPlane.blur = values[0];
            view3D.renderer.renderSingleFrame();
            this.forceUpdate();
          }} />
      </MenuItem>
    </>;
  }
}

export default EnvironmentTab;
