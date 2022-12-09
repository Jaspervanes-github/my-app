import React from "react";
import "./index.css";
import ReactLoading from "react-loading";

function LoadingScreen() {
  return (
    <div className="loading">
      <div className="loading-inner">
        <ReactLoading type="spinningBubbles" color="#FFFFFF" />
        <p>Loading</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
