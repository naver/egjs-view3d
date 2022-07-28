import React from "react";

export default ({ type, defaultVal }) => (
  <div className="bulma-tags">
    { type && (
      <div className="bulma-tags has-addons are-medium mb-1 mr-2">
        <span className="bulma-tag is-dark">Type</span>
        <span className="bulma-tag is-info">{ type }</span>
      </div>
    ) }
    { defaultVal && (
      <div className="bulma-tags has-addons are-medium mb-1">
        <span className="bulma-tag is-dark">Default</span>
        <span className="bulma-tag is-warning">{ defaultVal }</span>
      </div>
    ) }
  </div>
);
