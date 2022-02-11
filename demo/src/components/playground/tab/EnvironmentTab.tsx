import React from "react";

import Playground from "../../../pages/Playground";
import EnvmapChange from "../item/EnvmapChange";
import MenuItem from "../MenuItem";
import Range from "../../Range";

class EnvironmentTab extends React.Component<{
  playground: Playground;
  isLoading: boolean;
  onEnvmapChange: any;
}> {
  public render() {
    const { playground, isLoading, onEnvmapChange } = this.props;

    return <>
      <EnvmapChange onChange={onEnvmapChange} onExposureChange={val => this.props.playground.view3D.exposure = val} isLoading={isLoading} />
      <MenuItem className="is-flex is-align-items-center">
        <span className="menu-label my-0 mr-2">Show Skybox</span>
        <input className="checkbox" type="checkbox" defaultChecked={true} disabled={isLoading} onChange={e => {
          const view3D = this.props.playground.view3D;
          const scene = view3D.scene;
          const checked = e.currentTarget.checked;

          if (checked) {
            scene.skybox.enable();
          } else {
            scene.skybox.disable();
          }
        }}></input>
      </MenuItem>
      <MenuItem className="is-flex is-align-items-center">
        <span className="menu-label my-0 mr-2">Blur skybox</span>
        <input className="checkbox" type="checkbox" defaultChecked={false} disabled={isLoading} onChange={e => {
          const view3D = this.props.playground.view3D;
          const checked = e.currentTarget.checked;

          if (checked) {
            view3D.skyboxBlur = true;
          } else {
            view3D.skyboxBlur = false;
          }
        }}></input>
      </MenuItem>
      <MenuItem>
        <div className="menu-label mb-4">Skybox Rotation: {playground.view3D?.skyboxRotation ?? 0}°</div>
        <Range
          className="mb-2"
          step={1}
          min={0}
          max={360}
          val={playground.view3D?.skyboxRotation ?? 0}
          onChange={(values) => {
            playground.view3D.skyboxRotation = values[0];
            this.forceUpdate();
          }} />
      </MenuItem>
      <MenuItem>
        <div className="menu-label mb-4">Shadow opacity: {playground.view3D?.scene.shadowPlane.opacity ?? 0.3}</div>
        <Range
          className="mb-2"
          step={0.01}
          min={0}
          max={1}
          val={playground.view3D?.scene.shadowPlane.opacity ?? 0}
          onChange={(values) => {
            playground.view3D.scene.shadowPlane.opacity = values[0];
            this.forceUpdate();
          }} />
      </MenuItem>
      <MenuItem>
        <div className="menu-label mb-4">Shadow hardness: {playground.view3D?.scene.shadowPlane.hardness ?? 6}</div>
        <Range
          className="mb-2"
          step={1}
          min={1}
          max={14}
          val={playground.view3D?.scene.shadowPlane.hardness ?? 6}
          onChange={(values) => {
            const view3D = playground.view3D;
            view3D.scene.shadowPlane.hardness = values[0];
            this.forceUpdate();
          }} />
      </MenuItem>
    </>;
  }
}

export default EnvironmentTab;
