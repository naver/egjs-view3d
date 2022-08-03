import React from "react";
import clsx from "clsx";
import Slider, { SliderProps } from "rc-slider";
import styles from "./range.module.css";
import { clamp } from "../../../../packages/view3d/src/utils";

class Range extends React.Component<SliderProps & {
  name?: string;
}, {
  val: number;
}> {
  public get val() { return this.state.val; }

  public constructor(props) {
    super(props);
    this.state = {
      val: props.defaultValue ?? 0
    };
  }

  public setVal(val: number) {
    this.setState({
      val
    });
  }

  public render() {
    const {
      name,
      className,
      onChange,
      min,
      max,
      step,
      style,
      ...otherProps
    } = this.props;

    return <div className={className} style={style}>
      {name && <div className="mb-1 menu-label">{name}</div>}
      <div className={styles.wrapper}>
        <Slider
          min={min}
          max={max}
          step={step}
          onChange={(val) => {
            if (onChange) {
              onChange(val);
            }

            this.setState({
              val: val as number
            });
          }}
          value={this.state.val}
          {...otherProps}
        />
        <input
          type="number"
          className={clsx(styles.input, "input", "is-small", "is-primary", "ml-2")}
          value={this.state.val}
          step={step ?? 1}
          onChange={e => {
            const newVal = clamp(parseFloat(e.currentTarget.value), this.props.min ?? 0, this.props.max ?? 100);

            if (isNaN(newVal)) return;

            if (onChange) {
              onChange(newVal);
            }

            this.setState({
              val: newVal
            });
          }}
        />
      </div>
    </div>;
  }
}

export default Range;
