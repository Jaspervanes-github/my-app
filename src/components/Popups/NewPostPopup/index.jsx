import React from "react";
import "./index.css";
import { ContractType, ContentType } from "../../../utils/contract";
import { createToastMessage } from "../../../utils/toast";
import { PopupState } from "../../../utils/enums";
import resizeHeightOfElement from "../../../utils/resizeElement";

function NewPostPopup(props) {
  let state = props.state;
  let dispatch = props.dispatch;
  let popupData = props.popupData;

  return (
    <React.Fragment>
      <div className="newPostTemplate">
        <h2>New Post</h2>
        <form
          onSubmit={(event) => {
            if (popupData.content === "") {
              createToastMessage("Please enter a valid text", 5000);
              event.preventDefault();
              return;
            }
            props.handleSubmit(
              event,
              state,
              dispatch,
              ContractType.REMIX,
              props.setCurrentPopup,
              popupData
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
              <br />
              <br />
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
                      // onInput={resizeHeightOfElement}
                      // onSelect={resizeHeightOfElement}
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
              <br />
              <br />
            </p>
          </div>
          <input className="submit-button" type="submit" value="Submit Post" />
        </form>
      </div>
    </React.Fragment>
  );
}

export default NewPostPopup;
