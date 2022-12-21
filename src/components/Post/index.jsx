import IconButton from "@material-ui/core/IconButton";
import RemixIcon from "@material-ui/icons/Edit";
import DetailIcon from "@material-ui/icons/Info";
import ReshareIcon from "@material-ui/icons/Share";
import ViewIcon from "@material-ui/icons/Visibility";
import React, { useContext } from "react";
import { DataContext } from "../../contexts/DataContext";
import setData from "../../hooks/popupHooks";
import { PopupState } from "../../utils/enums";
import "./index.css";

const buttons = [
  {
    title: "Reshare Post",
    state: PopupState.RESHARING,
    icon: <ReshareIcon />,
  },
  {
    title: "Remix Post",
    state: PopupState.REMIXING,
    icon: <RemixIcon />,
  },
  {
    title: "View Post",
    state: PopupState.VIEWING,
    icon: <ViewIcon />,
  },
  {
    title: "Details of the Post",
    state: PopupState.DETAILS,
    icon: <DetailIcon />,
  },
];

/**
 * This component displays a preview of the post content together with buttons to reshare, remix, view or see details of the post. 
 * @param {*} props Contains the passed variables.
 * @returns The render components of the Post component.
 */
function Post(props) {
  const { state } = useContext(DataContext);
  let item = props.item;
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
          {buttons.map((buttonContent) => (
            <IconButton
              className="button"
              title={buttonContent.title}
              onClick={() => {
                setData(
                  props.setPopupData,
                  props.setIsLoading,
                  props.setCurrentPopup,
                  buttonContent.state,
                  item,
                  state
                );
              }}
            >
              {buttonContent.icon}
            </IconButton>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Post;
