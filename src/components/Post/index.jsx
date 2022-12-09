import React from "react";
import "./index.css";
import IconButton from "@material-ui/core/IconButton";
import ReshareIcon from "@material-ui/icons/Share";
import RemixIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import DetailIcon from "@material-ui/icons/Info";
import { PopupState } from "../../utils/enums";
import setData from "../../hooks/popupHooks";

function Post(props) {
  let item = props.item;
  let state = props.state;
  return (
    <React.Fragment key={state.posts.indexOf(item)}>
      <div className="post">
        <div className="container">
          <h3>Address of Contract: {item}</h3>
          {state.postData[state.posts.indexOf(item)].substring(0, 11) !==
          "data:image/" ? (
            state.postData[state.posts.indexOf(item)].substring(0, 225) + "..."
          ) : (
            <img
              src={state.postData[state.posts.indexOf(item)]}
              alt=""
              className="imageBox"
            />
          )}
          <br />
          <br />
          <br />
          <u>To view the full content of the post click the "View" icon!</u>
        </div>
        <br />
        <div className="post-buttons">
          <IconButton
            className="button"
            title="Reshare Post"
            onClick={() => {
              props.setCurrentPopup(PopupState.RESHARING);
              setData(
                props.setPopupData,
                props.setIsLoading,
                props.setCurrentPopup,
                // props.currentPopup,
                PopupState.RESHARING,
                state,
                item
              );
            }}
          >
            <ReshareIcon />
          </IconButton>
          <IconButton
            className="button"
            title="Remix Post"
            onClick={() => {
              props.setCurrentPopup(PopupState.REMIXING);
              setData(
                props.setPopupData,
                props.setIsLoading,
                props.setCurrentPopup,
                // props.currentPopup,
                PopupState.REMIXING,
                state,
                item
              );
            }}
          >
            <RemixIcon />
          </IconButton>
          <IconButton
            className="button"
            title="View Post"
            onClick={() => {
              props.setCurrentPopup(PopupState.VIEWING);
              setData(
                props.setPopupData,
                props.setIsLoading,
                props.setCurrentPopup,
                // props.currentPopup,
                PopupState.VIEWING,
                state,
                item
              );
            }}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            className="button"
            title="Detail of the Post"
            onClick={() => {
              props.setCurrentPopup(PopupState.DETAILS);
              setData(
                props.setPopupData,
                props.setIsLoading,
                props.setCurrentPopup,
                // props.currentPopup,
                PopupState.DETAILS,
                state,
                item
              );
            }}
          >
            <DetailIcon />
          </IconButton>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Post;
