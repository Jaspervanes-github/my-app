import React from "react";
import "./index.css";
import IconButton from "@material-ui/core/IconButton";
import ReshareIcon from "@material-ui/icons/Share";
import RemixIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import DetailIcon from "@material-ui/icons/Info";

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
              this.createResharePost(state, item);
            }}
          >
            <ReshareIcon />
          </IconButton>
          <IconButton
            className="button"
            title="Remix Post"
            onClick={() => {
              this.createRemixPost(state, item);
            }}
          >
            <RemixIcon />
          </IconButton>
          <IconButton
            className="button"
            title="View Post"
            onClick={() => {
              this.viewPost(state, item);
            }}
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            className="button"
            title="Detail of the Post"
            onClick={() => {
              this.detailPost(state, item);
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
