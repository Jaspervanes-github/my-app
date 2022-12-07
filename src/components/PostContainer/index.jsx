import React from "react";
import "./index.css";
import ViewportList from "react-viewport-list";
import Post from "../../components/Post";

function PostContainer(props) {
  let state = props.state;
  return (
    <div
      className="scroll-container"
      ref={this.ref}
      style={{
        maxHeight: window.innerHeight / 1.4 + "px",
      }}
    >
      <ViewportList
        viewportRef={this.ref}
        items={state.posts || []}
        itemMinSize={40}
        margin={8}
      >
        {(item) => <Post item={item} state={state} />}
      </ViewportList>
    </div>
  );
}

export default PostContainer;