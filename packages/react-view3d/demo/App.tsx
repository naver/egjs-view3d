import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import "./App.css";

export default class App extends Component<{}> {
  public render() {
    return (<Router>
      <Header/>
      <Switch>
        <Route path="/rerender">
          <Rerender />
        </Route>
        <Route path="/video">
          <Video />
        </Route>
        <Route path="/spin">
          <Default />
        </Route>
      </Switch>
    </Router>);
  }
}
