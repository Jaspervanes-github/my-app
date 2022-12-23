import React, { useContext } from "react";
import { DataContext } from "../../../contexts/DataContext";
import { ContentType, ContractType } from "../../../utils/contract";
import { PopupState } from "../../../utils/enums";
import { createToastMessage } from "../../../utils/toast";
import "./index.css";

/**
 * This component displays a popup in which you can put content to post.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the NewPostPopup component.
 */
function NewPostPopup(props) {
  const {state, dispatch} = useContext(DataContext);
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
              ContractType.ORIGINAL,
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
