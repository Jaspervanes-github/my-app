import React from "react";
import "./index.css";
import { Button } from "@material-ui/core";

function PopupWrapperLayout(props) {
  return (
    <React.Fragment>
      <div className="popup-container">
          <div className="popup-inner">
            <Button
              className="close-btn"
              variant="contained"
              setPopupClosed={props.setPopupClosed}
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
