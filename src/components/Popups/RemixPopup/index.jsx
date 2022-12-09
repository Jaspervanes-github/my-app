import React from "react";
import "./index.css";
import { ContractType, ContentType } from "../../../utils/contract";
import { createToastMessage } from "../../../utils/toast";
import { PopupState } from "../../../utils/enums";
import resizeHeightOfElement from "../../../utils/resizeElement";
import { useContext } from "react";
import { DataContext } from "../../../contexts/DataContext";

function RemixPopup(props) {
  const {state, dispatch} = useContext(DataContext);
  let popupData = props.popupData;

  return (
    <React.Fragment>
      <div className="remixPostTemplate">
        <h2>Remix Post</h2>
        <form
          onSubmit={(event) => {
            if (popupData.content === "") {
              createToastMessage("Please enter a valid text", 5000);
              event.preventDefault();
              return;
            }
            props.handleSubmit(
              event,
              ContractType.REMIX,
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
              {state.selectedAccount}
              <br />
              <br />
              <select
                type="select"
                name="contentType"
                value={popupData.contentType}
                onChange={(event) => {
                  props.handleChange(event, props.setPopupData, popupData);
                }}
              >
                <option value="0">TEXT</option>
                <option value="1">IMAGE</option>
              </select>
              <br />
              <br />
              {(() => {
                //if contentType is TEXT
                if (
                  popupData.contentType === "0" ||
                  popupData.contentType === ContentType.TEXT
                ) {
                  return (
                    <textarea
                      className="textarea"
                      name="content"
                      rows="1"
                      placeholder="Type text here..."
                      value={popupData.content}
                      style={{
                        height: 135 + "px",
                        maxHeight: window.innerHeight / 2,
                      }}
                      onInput={resizeHeightOfElement}
                      onSelect={resizeHeightOfElement}
                      onChange={(event) => {
                        props.handleChange(
                          event,
                          props.setPopupData,
                          popupData
                        );
                      }}
                    />
                  );
                }
                //if contentType is IMAGE
                else if (
                  popupData.contentType === "1" ||
                  popupData.contentType === ContentType.IMAGE
                ) {
                  return (
                    // render Image selection component here
                    <span className="image-container">
                      <img
                        src={popupData.content}
                        alt=""
                        className="imageBox"
                      />
                      <br />
                      <input
                        type="file"
                        name="content"
                        id="input"
                        accept="image/*"
                        onChange={(event) => {
                          props.handleChange(
                            event,
                            props.setPopupData,
                            popupData
                          );
                        }}
                      />
                    </span>
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
