import * as React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.Component {
  public render() {
    return (
      <header className="header">
        <Link to="/basic">Basic</Link>
        <Link to="/event">Event</Link>
        <Link to="/method">Method</Link>
        <Link to="/annotation">Annotation</Link>
        <Link to="/plugin">Plugin</Link>
        <Link to="/prop">PropChange</Link>
      </header>
    );
  }
}
