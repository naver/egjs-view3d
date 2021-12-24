import React from "react";
import View3D from "./View3D";

class ModelSwapper extends React.Component<{
  view3DRef: React.RefObject<View3D>;
  models: string[];
}> {
  public render() {
    const { models } = this.props;

    return (
      <div className="ar-model-swapper">{
        models.map((model, idx) => <div key={idx} className="button mr-2" onClick={() => {
          const view3D = this.props.view3DRef.current;

          if (!view3D) return;

          view3D.view3D.load(model);
        }}>{ model }</div>)
      }</div>
    );
  }
}

export default ModelSwapper;
