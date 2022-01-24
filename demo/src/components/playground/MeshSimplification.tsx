import React, { useState } from "react";
import Range from "../Range";
import WarningIcon from "../../../static/icon/warning.svg";

export default ({ onSimplify, isLoading }) => {
  const [targetPercentage, setTargetPercentage] = useState(0.5);
  const [aggressiveness, setAggressiveness] = useState(7);

  return <div className="mb-4">
    <div className="is-flex is-flex-direction-row is-align-items-center">
      <WarningIcon data-tip="⚠ WARNING: This feature is experimental and some models are not compatible" className="mr-2" />
      <span className="mr-2">Apply mesh simplify(low-poly)</span>
    </div>
    <div className="ml-4 mt-4 is-size-7 has-text-centered">
      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center mb-2">
        <div className="px-2" style={{ width: "120px" }}>Target Percentage</div>
        <Range
          style={{ flex: "1" }}
          step={0.01}
          min={0}
          max={1}
          val={targetPercentage}
          onChange={(values) => {
            setTargetPercentage(values[0]);
          }} />
        <div className="px-2" style={{ width: "45px" }}>{ targetPercentage }</div>
      </div>
      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center mb-4">
        <div className="px-2" style={{ width: "120px" }}>Aggressiveness</div>
        <Range
          style={{ flex: "1" }}
          step={1}
          min={1}
          max={14}
          val={aggressiveness}
          onChange={(values) => {
            setAggressiveness(values[0]);
          }} />
        <div className="px-2" style={{ width: "45px" }}>{ aggressiveness }</div>
      </div>
      <div className="is-flex is-flex-direction-row is-align-items-center is-justify-content-center">
        <button className="button is-small" disabled={isLoading} onClick={() => {
          onSimplify(targetPercentage, aggressiveness);
        }}>Apply</button>
      </div>
    </div>
  </div>;
};
