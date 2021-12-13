import React from "react";

class ARButton extends React.Component<{
  disabled: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
}> {
  public static defaultProps = {
    disabled: false
  };

  public render() {
    const { buttonRef, disabled } = this.props;

    return <button className="button is-rounded p-3" style={{
      position: "absolute",
      right: "10px",
      bottom: "10px",
      height: "auto",
      fill: "rgba(0, 0, 0, 0.7)"
    }} ref={buttonRef} disabled={disabled}>
      <svg className="image is-32x32" viewBox="0 0 48 48" width="48" height="48">
        <use href="/icon/view_in_ar_black_48dp_outlined.svg#icon"/>
      </svg>
      <div className="tooltip">{ disabled ? "AR is not available in this browser" : "View in AR"}</div>
    </button>;
  }
}

export default ARButton;
