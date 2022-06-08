import React from "react";
import ReactTooltip from "react-tooltip";
// @ts-ignore
import Layout from "@theme/Layout";
import styles from "./playground.module.css";

import ContextProvider from "../components/playground/context";
import Tabs from "../components/playground/tab/Tabs";
import Canvas from "../components/playground/Canvas";

class Playground extends React.Component {
  public componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  public render() {
    return <Layout>
      <ContextProvider>
        <div className={styles.playgroundRoot}>
          <Tabs />
          <Canvas />
        </div>
        <ReactTooltip effect="solid" place="bottom" />
      </ContextProvider>
    </Layout>;
  }
}

export default Playground;
