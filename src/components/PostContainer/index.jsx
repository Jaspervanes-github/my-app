import React, { useContext } from "react";
import ViewportList from "react-viewport-list";
import Post from "../../components/Post";
import { DataContext } from "../../contexts/DataContext";
import "./index.css";

/**
 * This component displays all the posts in a list.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the PostContainer component.
 */
function PostContainer(props) {
  const { state } = useContext(DataContext);
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
            setCurrentPopup={props.setCurrentPopup}
          />
        )}
      </ViewportList>
    </div>
  );
}

export default PostContainer;
