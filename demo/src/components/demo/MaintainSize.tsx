import React from "react";
import View3D from "../View3D";

export default () => {
  const ref = React.createRef<View3D>();
  const ref2 = React.createRef<View3D>();
  const sizes = [20, 40, 60, 80, 100];

  return <div>
    {sizes.map(size => {
      return <button className="button mr-2" key={size} onClick={() => {
        ref.current.view3D.rootEl.style.width = `${size}%`;
        ref.current.view3D.rootEl.style.paddingTop = `${size}%`;
        ref2.current.view3D.rootEl.style.width = `${size}%`;
        ref2.current.view3D.rootEl.style.paddingTop = `${size}%`;
      }}>Resize to {size}%</button>;
    })}
    <div className="columns mt-4">
      <div className="column has-text-weight-bold has-text-centered">maintainSize: false</div>
      <div className="column has-text-weight-bold has-text-centered">maintainSize: true</div>
    </div>
    <div className="columns">
      <div className="column is-6">
        <View3D
          ref={ref}
          src="/egjs-view3d/model/draco/alarm.glb"
          poster="/egjs-view3d/poster/alarm_default.png"
          maintainSize={false}
          showExampleCode />
      </div>
      <div className="column is-6">
        <View3D
          ref={ref2}
          src="/egjs-view3d/model/draco/alarm.glb"
          poster="/egjs-view3d/poster/alarm_default.png"
          maintainSize={true}
          showExampleCode />
      </div>
    </div>
  </div>;
};
