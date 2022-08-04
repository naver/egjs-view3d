import React, { useState } from "react";
import { FastQuadric, ThreeAdapter } from "mesh-simplifier";

import Range from "../Range";
import WarningIcon from "../../../../static/icon/warning.svg";
import { Model } from "../../../../../packages/view3d/src";

import { Context } from "../context";
import Collapse from "../Collapse";

export default () => {
  const [targetPercentage, setTargetPercentage] = useState(0.5);
  const [aggressiveness, setAggressiveness] = useState(7);
  const { state, dispatch } = React.useContext(Context);

  const isLoading = state.isLoading;
  const view3D = state.view3D;

  if (!view3D) return <></>;

  return <Collapse title="Simplify(Low-poly)">
    <article className="message is-warning">
      <div className="message-header is-size-7">
        <div className="is-flex is-flex-direction-row is-align-items-center">
          <WarningIcon className="mr-2" width={16} height={16} /><span>Warning</span>
        </div>
      </div>
      <div className="message-body is-size-7">This feature is experimental and some models are may not compatible</div>
    </article>
    <div className="mt-4">
      <Range
        name="Target Percentage"
        step={0.01}
        min={0}
        max={1}
        defaultValue={targetPercentage}
        onChange={(values) => {
          setTargetPercentage(values[0]);
        }} />
      <Range
        name="Aggressiveness"
        step={1}
        min={1}
        max={14}
        defaultValue={aggressiveness}
        onChange={(values) => {
          setAggressiveness(values[0]);
        }} />
      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center mt-4">
        <button className="button is-small" disabled={isLoading} onClick={() => {
          const origModel = state.originalModel!;
          const simplifier = new FastQuadric({ targetPercentage, aggressiveness });
          const adaptedModel = new ThreeAdapter(origModel.scene, true);

          dispatch({
            type: "set_loading",
            val: true
          });

          simplifier.simplify(adaptedModel);

          const simplifiedModel = new Model({ src: origModel.src, scenes: [adaptedModel.object] });

          view3D.display(simplifiedModel);

          dispatch({
            type: "set_loading",
            val: false
          });
        }}>Apply</button>
      </div>
    </div>
  </Collapse>;
};
