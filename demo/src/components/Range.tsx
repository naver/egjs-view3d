import React from "react";
import { Range as ReactRange } from "react-range";

export default ({
  step = 0.01,
  min,
  max,
  val,
  onChange,
  className = "",
  style = {}
}) => <ReactRange
  step={step}
  min={min}
  max={max}
  values={[val]}
  onChange={onChange}
  renderTrack={({ props, children }) => (
    <div
      {...props}
      className={className}
      style={{
        ...style,
        ...props.style,
        height: "6px",
        width: "100%",
        backgroundColor: "#ccc"
      }}
    >
      {children}
    </div>
  )}
  renderThumb={({ props }) => (
    <div
      {...props}
      style={{
        ...style,
        ...props.style,
        height: "15px",
        width: "15px",
        borderRadius: "9999px",
        backgroundColor: "#485fc7"
      }}
    />
  )}/>;
