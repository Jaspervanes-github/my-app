import React from "react";
import "./index.css";

function PopupLayout(props) {
  return (
    <React.Fragment>
      <div className="popup">
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

export default PopupLayout;
