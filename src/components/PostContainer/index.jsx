import React from "react";
import "./index.css";
import ViewportList from "react-viewport-list";
import Post from "../../components/Post";

function PostContainer(props) {
  let state = props.state;
  let ref = React.createRef(null);
  return (
    <div
      className="scroll-container"
      ref={ref}
      style={{
        maxHeight: window.innerHeight / 1.4 + "px",
      }}
    >
      <ViewportList
        viewportRef={ref}
        items={state.posts || []}
        itemMinSize={40}
        margin={8}
      >
        {(item) => (
          <Post
            setPopupData={props.setPopupData}
            setIsLoading={props.setIsLoading}
            currentPopup={props.currentPopup}
            item={item}
            state={state}
            setCurrentPopup={props.setCurrentPopup}
          />
        )}
      </ViewportList>
    </div>
  );
}

export default PostContainer;
