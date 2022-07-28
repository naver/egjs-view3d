import React from "react";
import clsx from "clsx";

import ModelTab from "./ModelTab";
import EnvironmentTab from "./EnvironmentTab";
import DownloadTab from "./DownloadTab";
import AnimationTab from "./AnimationTab";
import AnnotationTab from "./AnnotationTab";

import styles from "./tabs.module.css";

import MenuIcon from "@site/static/icon/settings.svg";
import EnvIcon from "@site/static/icon/light.svg";
import DownloadIcon from "@site/static/icon/file_download_black.svg";
import AnimationIcon from "@site/static/icon/movie.svg";
import AnnotationIcon from "@site/static/icon/annotation.svg";

const menus = [
  {
    name: "Model",
    icon: MenuIcon,
    tab: ModelTab
  },
  {
    name: "Environment",
    icon: EnvIcon,
    tab: EnvironmentTab
  },
  {
    name: "Download",
    icon: DownloadIcon,
    tab: DownloadTab
  },
  {
    name: "Animation",
    icon: AnimationIcon,
    tab: AnimationTab
  },
  {
    name: "Annotation",
    icon: AnnotationIcon,
    tab: AnnotationTab
  }
];

class Tabs extends React.Component<{}, {
  selectedMenu: number;
}> {
  public constructor(props) {
    super(props);

    this.state = {
      selectedMenu: 0
    };
  }

  public render() {
    const { selectedMenu } = this.state;

    return <aside className={clsx(styles.control)}>
      <div className={styles.tabWrapper}>
        { menus.map((menu, menuIdx) => (
          <div
            key={menuIdx}
            data-tip={menu.name}
            onClick={() => { this.setState({ selectedMenu: menuIdx }); }}
            className={clsx(styles.iconWrapper, "px-3", "py-2")}>
            { (() => {
              const Icon = menu.icon as any;

              return <Icon width={24} height={24} className={clsx(styles.icon, menuIdx === selectedMenu ? styles.isActive : "")} />;
            })() }
          </div>
        )) }
      </div>
      { (() => {
        const Tab = menus[selectedMenu].tab as any;

        return <Tab />;
      })() }
    </aside>;
  }
}

export default Tabs;
