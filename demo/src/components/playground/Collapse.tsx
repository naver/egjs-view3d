import React from "react";
import clsx from "clsx";
import styles from "./collapse.module.css";
import ExpandIcon from "../../../static/icon/expand.svg";
import ExpandLessIcon from "../../../static/icon/expand_less.svg";

class Collapse extends React.Component<{ title: string }, { open: boolean }> {
  public constructor(props) {
    super(props);

    this.state = {
      open: true
    };
  }

  public render() {
    const { title, children } = this.props;
    const open = this.state.open;

    return <div>
      <div className={styles.header} onClick={() => {
        this.setState({ open: !this.state.open });
      }}>
        <div className={clsx(styles.headerLabel, "px-4")}>{title}</div>
        {
          open
            ? <ExpandLessIcon className={clsx(styles.icon, "px-3")} />
            : <ExpandIcon className={clsx(styles.icon, "px-3")} />
        }
      </div>
      <div className={clsx("p-4", "is-size-7", open ? "" : styles.collapsed)}>
        { children }
      </div>
    </div>;
  }
}

export default Collapse;
