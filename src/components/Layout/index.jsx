import React from "react";
import "./index.css";
import { Button } from "@material-ui/core";

/**
 * This component is used to wrap around a popup, contains the bounds of the popup together with a close button.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the PopupWrapperLayout component.
 */
function PopupWrapperLayout(props) {
  return (
    <React.Fragment>
      <div className="popup-container">
          <div className="popup-inner">
            <Button
              className="close-btn"
              variant="contained"
              onClick={props.setPopupClosed}
            >
              Close
            </Button>
            {props.children}
          </div>
      </div>
    </React.Fragment>
  );
}

export default PopupWrapperLayout;
