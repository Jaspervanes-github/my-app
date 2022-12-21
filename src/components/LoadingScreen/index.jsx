import React from "react";
import "./index.css";
import ReactLoading from "react-loading";

/**
 * This component displays a loading screen. Is used to let the user know that the application is busy.
 * @returns The render components of the LoadingScreen component.
 */
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
