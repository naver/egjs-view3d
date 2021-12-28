import React from "react";
import View3D from "./View3D";

class EventsList extends React.Component<{
  view3D: View3D;
  events: string[];
}, {
  events: Array<{ name: string; count: number }>;
}> {
  public static defaultProps = {
    events: []
  };

  public constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  public componentDidMount(): void {
    setTimeout(() => {
      const { view3D, events } = this.props;

      Object.values(events).forEach(evt => {
        view3D.view3D.on((evt as any), this._onEvent);
      });
    });
  }

  public render() {
    const events = this.state.events;
    return <div className="view3d-events-overlay">
      <div className="view3d-events">
        <div className="button is-white is-outlined" style={{ pointerEvents: "none" }}>Events Triggered</div>
        { events.map(evt => (<div className="bulma-tags has-addons mb-0 ml-2" key={evt.name}>
          <div className="bulma-tag mb-0 is-medium is-dark">{ evt.name }</div>
          <div className="bulma-tag mb-0 is-medium is-info">{ evt.count }</div>
        </div>))}
      </div>
    </div>;
  }

  private _onEvent = evt => {
    const events = this.state.events;
    const lastEvt = events[events.length - 1];

    if (!lastEvt || evt.type !== lastEvt.name) {
      events.push({ name: evt.type, count: 1 });
    } else {
      lastEvt.count += 1;
    }

    this.setState({ events });
  };
}

export default EventsList;
