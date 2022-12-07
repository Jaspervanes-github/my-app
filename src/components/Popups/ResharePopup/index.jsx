import React from "react";
import "./index.css";
import {
  ContractType,
  ContentType,
  contentTypeToString,
} from "../../../utils/contract";
import { createToastMessage } from "../../../utils/toast";
import { PopupState } from "../../../utils/enums";

function ResharePopup(props) {
  let state = props.state;
  let dispatch = props.dispatch;
  let popupData = props.popupData;

  return (
    <React.Fragment>
      <div className="resharePostTemplate">
        <h2>Reshare Post</h2>
        <form
          onSubmit={(event) => {
            if (popupData.content === "") {
              createToastMessage("Please enter a valid text", 5000);
              event.preventDefault();
              return;
            }
            this.handleSubmit(event, state, dispatch, ContractType.RESHARE);
            this.setState({
              currentPopup: PopupState.CLOSED,
              isLoading: false,
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
              {state.selectedAccount} <br />
              <br />
              {contentTypeToString(popupData.contentType)}
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
                        height: this.scrollHeight + "px",
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

export default ResharePopup;
