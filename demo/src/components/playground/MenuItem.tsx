import React from "react";
import clsx from "clsx";

import styles from "./menu-item.module.css";

export default (props: React.HTMLProps<HTMLDivElement>) => {
  const { children, className, ...restProps } = props;
  return <div className={clsx(styles.menuItem, className)} {...restProps}>{children}</div>;
};
