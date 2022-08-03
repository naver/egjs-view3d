import React from "react";
import clsx from "clsx";
import Swal from "sweetalert2";

import View3D from "../../../packages/view3d/src";
import DownloadIcon from "../../static/icon/file_download_black.svg";

class LoadButton extends React.Component<{ view3D: View3D }, { initialized: boolean }> {
  public constructor(props) {
    super(props);

    this.state = {
      initialized: false
    };
  }

  public render() {

    return <div className={clsx({ "view3d-overlay": true, "hidden": this.state.initialized })}>
      <div className="button is-medium" onClick={e => {
        const btn = e.currentTarget;

        if (btn.classList.contains("is-loading")) return;

        btn.classList.add("is-loading");

        this.props.view3D.once("ready", () => {
          this.setState({ initialized: true });
        });

        void this.props.view3D.init().catch(err => {
          void Swal.fire({
            title: "Error!",
            text: err.message,
            icon: "error"
          });
        });
      }}>
        <span className="icon is-medium">
          <DownloadIcon />
        </span>
        <span>Load 3D model</span>
      </div>
    </div>;
  }
}

export default LoadButton;
