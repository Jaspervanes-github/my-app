import React from "react";
import "./index.css";
import { ContentType } from "../../../utils/contract";

function ViewPopup() {
  return (
    <React.Fragment>
      <div className="viewPostTemplate">
          <h2>View Post</h2>
          <div className="textbox-container">
            <p
              className="textbox"
              style={{
                height: this.scrollHeight + "px",
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
                height: this.scrollHeight + "px",
                maxHeight: window.innerHeight / 2 + 20,
              }}
            >
              {this.state.addressOfPoster}
              <br />
              <br />
              {this.state.id}
              <br />
              <br />
              {(() => {
                //if contentType is TEXT
                if (
                  this.state.contentType === "0" ||
                  this.state.contentType === ContentType.TEXT
                ) {
                  return (
                    <p
                      className="textbox"
                      style={{
                        height: this.scrollHeight + "px",
                        maxHeight: window.innerHeight / 2,
                      }}
                    >
                      {this.state.content}
                    </p>
                  );
                }
                //if contentType is IMAGE
                else if (
                  this.state.contentType === "1" ||
                  this.state.contentType === ContentType.IMAGE
                ) {
                  return (
                    // render Image selection component here
                    <div>
                      <img
                        src={this.state.content}
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
