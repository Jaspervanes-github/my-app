import React from "react";
import "./index.css";

/**
 * This component displays a list in which it states the costs of creating posts.
 * @returns The render components of the CostDisplay component.
 */
function CostsDisplay() {
  return (
    <React.Fragment>
      <p className="title">
        COSTS
        <br />
      </p>
      <div className="infoBox">
        <p className="item">
          New Post:
          <br />
          Reshare:
          <br />
          Remix:
          <br />
          View:
          <br />
        </p>
        <p className="item">
          0.0057 &nbsp;ETH
          <br />
          0.0035 &nbsp;ETH
          <br />
          0.0035 &nbsp;ETH
          <br />
          0.00031 ETH
          <br />
        </p>
      </div>
    </React.Fragment>
  );
}

export default CostsDisplay;
