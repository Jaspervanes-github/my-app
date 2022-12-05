import React from "react";
import "./index.css";
import { ContractType, ContentType } from "../../../utils/contract";
import { createToastMessage } from "../../../utils/toast";
import { PopupState } from "../../../utils/enums";

function RemixPopup() {
  return (
    <React.Fragment>
      <div className="remixPostTemplate">
        <h2>Remix Post</h2>
        <form
          onSubmit={(event) => {
            if (this.state.content === "") {
              createToastMessage("Please enter a valid text", 5000);
              event.preventDefault();
              return;
            }
            this.handleSubmit(event, state, dispatch, ContractType.REMIX);
            this.setState({
              currentPopup: PopupState.CLOSED,
              isBusy: false,
            });
          }}
        >
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
              Content Type:
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
              {state.selectedAccount}
              <br />
              <br />
              <select
                type="select"
                name="contentType"
                value={this.state.contentType}
                onChange={this.handleChange}
              >
                <option value="0">TEXT</option>
                <option value="1">IMAGE</option>
              </select>
              <br />
              <br />
              {(() => {
                //if contentType is TEXT
                if (
                  this.state.contentType === "0" ||
                  this.state.contentType === ContentType.TEXT
                ) {
                  return (
                    <textarea
                      className="textarea"
                      name="content"
                      rows="1"
                      placeholder="Type text here..."
                      value={this.state.content}
                      style={{
                        height: this.scrollHeight + "px",
                        maxHeight: window.innerHeight / 2,
                      }}
                      onInput={this.resizeHeightOfElement}
                      onSelect={this.resizeHeightOfElement}
                      onChange={this.handleChange}
                    />
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
                      <input
                        type="file"
                        name="content"
                        id="input"
                        accept="image/*"
                        onChange={this.handleChange}
                      />
                    </div>
                  );
                }
              })()}
            </p>
          </div>
          <p className="title">
            <br />
            COSTS
            <br />
          </p>
          <div className="infoBox">
            <p className="item" style={{ fontWeight: "bold" }}>
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
          <input type="submit" value="Submit Post" />
        </form>
      </div>
    </React.Fragment>
  );
}

export default RemixPopup;
