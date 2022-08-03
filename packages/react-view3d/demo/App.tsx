import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Header from "./Header";
import View3D, { ControlBar, LoadingBar, View3DPlugin } from "../src";
import "./App.css";
import "@egjs/view3d/css/view3d-bundle.css"

export default class App extends Component<{}, { skybox: string | null }> {
  public plugins: View3DPlugin[];
  public view3DRef: View3D;

  public constructor(props) {
    super(props);
    this.plugins = [new LoadingBar(), new ControlBar()];
    this.state = {
      skybox: null
    }
  }

  public render() {
    return (<Router>
      <Header />
      <main>
        <Switch>
          <Route path="/basic">
            <View3D
              key={0}
              src="https://naver.github.io/egjs-view3d/model/cube.glb"
              className="view3d-3by1" />
          </Route>
          <Route path="/event">
            <View3D
              key={1}
              src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
              className="view3d-3by1"
              onLoad={e => {
                console.log("loaded", e);
              }} />
          </Route>
          <Route path="/method">
            <View3D
              key={2}
              ref={ref => {
                if (ref) {
                  this.view3DRef = ref;
                }
              }}
              src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
              className="view3d-3by1"
              onReady={e => {
                console.log(e.target);
                e.target.animator.play(1);
              }} />
            <button onClick={() => { this.view3DRef.animator.play(2); }}>CHANGE ANIMATION</button>
          </Route>
          <Route path="/annotation">
            <View3D
              key={3}
              src="https://naver.github.io/egjs-view3d/model/draco/payphone.glb"
              className="view3d-3by1"
            >
              <div className="view3d-annotation-wrapper">
                <div className="view3d-annotation default" data-position="0.13 0.5 -0.05" data-focus="-90 0 30"></div>
                <div className="view3d-annotation default" data-position="-0.22 0.5 0.05" data-focus="90 0 30" data-duration="500"></div>
                <div className="view3d-annotation default" data-position="-0.05 0.4 0.18" data-focus="0 20 35" data-duration="0"></div>
              </div>
            </View3D>
          </Route>
          <Route path="/plugin">
            <View3D
              key={4}
              src="https://naver.github.io/egjs-view3d/model/RobotExpressive.glb"
              className="view3d-3by1"
              plugins={this.plugins}
            ></View3D>
          </Route>
          <Route path="/prop">
            <View3D
              key={5}
              src="https://naver.github.io/egjs-view3d/model/draco/alarm.glb"
              className="view3d-3by1"
              skybox={this.state.skybox}
              />
            <button onClick={() => {
              if (!this.state.skybox) {
                this.setState({ skybox: "https://naver.github.io/egjs-view3d/texture/venice_sunset_1k.hdr" })
              } else {
                this.setState({ skybox: null });
              }
            }}>Change Skybox</button>
          </Route>
        </Switch>
      </main>
    </Router>);
  }
}
