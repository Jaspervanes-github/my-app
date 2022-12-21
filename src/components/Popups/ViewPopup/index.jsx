import React from "react";
import { ContentType } from "../../../utils/contract";
import "./index.css";

function ViewPopup(props) {
  let popupData = props.popupData;
  return (
    <React.Fragment>
      <div className="viewPostTemplate">
          <h2>View Post</h2>
          <div className="textbox-container">
            <p
              className="textbox"
              style={{
                height: 135 + "px",
                maxHeight: window.innerHeight / 2 + 20,
                fontWeight: "bold",
              }}
            >
              Address of Poster:
              <br />
              <br />
              Contract ID:
              <br />
              <br />
              Content of Post:
            </p>
            <p
              className="textbox"
              style={{
                height: 135 + "px",
                maxHeight: window.innerHeight / 2 + 20,
              }}
            >
              {popupData.addressOfPoster}
              <br />
              <br />
              {popupData.id}
              <br />
              <br />
              {(() => {
                //if contentType is TEXT
                if (
                  popupData.contentType === "0" ||
                  popupData.contentType === ContentType.TEXT
                ) {
                  return (
                    <p
                      className="textbox"
                      style={{
                        height: 135 + "px",
                        maxHeight: window.innerHeight / 2,
                      }}
                    >
                      {popupData.content}
                    </p>
                  );
                }
                //if contentType is IMAGE
                else if (
                  popupData.contentType === "1" ||
                  popupData.contentType === ContentType.IMAGE
                ) {
                  return (
                    // render Image selection component here
                    <div>
                      <img
                        src={popupData.content}
                        alt=""
                        className="imageBox"
                      />
                    </div>
                  );
                }
              })()}
            </p>
          </div>
      </div>
    </React.Fragment>
  );
}

export default ViewPopup;
