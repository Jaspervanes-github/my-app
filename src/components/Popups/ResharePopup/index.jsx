import React, { useContext } from "react";
import { DataContext } from "../../../contexts/DataContext";
import {
  ContentType,
  contentTypeToString, ContractType
} from "../../../utils/contract";
import { PopupState } from "../../../utils/enums";
import { createToastMessage } from "../../../utils/toast";
import "./index.css";

/**
 * This component displays a popup in which repost a post.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the ResharePopup component.
 */
function ResharePopup(props) {
  const { state, dispatch } = useContext(DataContext);
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
            props.handleSubmit(
              event,
              ContractType.RESHARE,
              props.setCurrentPopup,
              popupData,
              state,
              dispatch
            );
            props.setCurrentPopup(PopupState.CLOSED);
          }}
        >
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
              Content Type:
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
