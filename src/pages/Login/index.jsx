import { Button } from "@material-ui/core";
import React from "react";
import { Navigate } from "react-router-dom";

import { ethers } from "ethers";
import { useContext } from "react";
import { DataContext } from "../../contexts/DataContext";
import { createToastMessage } from "../../utils/toast";
import "./index.css";

/**
 * This component displays the login page of the application, this consists of a description of the application 
 * and a button to connect to the MetaMask plugin and navigate the user to the home page.
 * @returns The render components of the Login component.
 */
function Login() {
  const { state, dispatch } = useContext(DataContext);

  /**
   * Connects with the MetaMask plugin and loads the existing posts.
   */
  async function connectToMetamask() {
    if (window.ethereum === undefined) {
      createToastMessage(
        "You need to have MetaMask installed to use this application. You can go to https://metamask.io/ to install the plugin."
      );
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    let posts = JSON.parse(localStorage.getItem("posts"));
    let postData = JSON.parse(localStorage.getItem("postData"));

    dispatch({ type: "setProvider", value: provider });
    dispatch({ type: "setAccounts", value: accounts });
    dispatch({ type: "setSigner", value: signer });
    dispatch({ type: "setSelectedAccount", value: accounts[0] });
    dispatch({ type: "setPosts", value: posts !== null ? posts : [] });
    dispatch({ type: "setPostData", value: postData !== null ? postData : [] });

    provider.provider.on("accountsChanged", function () {
      window.location.reload();
    });

    provider.provider.on("chainChanged", () => {
      window.location.reload();
    });
  }

  /**
   * This function renders all the componets of the Login page.
   * @returns The render components of the Login component.
   */
  function renderMetamask() {
    if (!state.selectedAccount) {
      return (
        <React.Fragment>
          <div className="main">
            <p className="textbox">
              Welcome to the Handpicked Media application. This application is
              created by Jasper van Es during an internship in 2022-2023. This
              application simulates the workings of a social media platform in
              combination with the blockchain.
              <br />
              <br />
              Please click "Sign in with MetaMask" to login to your cryptowallet
              account. Once connected you get navigated to the home page of the
              application.
            </p>
            <div className="container">
              <Button
                className="button"
                variant="contained"
                onClick={() => connectToMetamask()}
              >
                Sign in with Metamask
              </Button>
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return <Navigate to="/" replace={false} />;
    }
  }

  return (
    <React.Fragment>
      <div>{renderMetamask()}</div>
    </React.Fragment>
  );
}

export default Login;
