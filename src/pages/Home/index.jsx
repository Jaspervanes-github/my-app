import React, { Component } from "react";
import NavBar from "../../components/Navbar";
import { DataConsumer } from "../../contexts/DataContext";
import { Grid } from "@material-ui/core";
import "./index.css";
import CostsDisplay from "../../components/CostsDisplay";
import { Button, Box } from "@material-ui/core";
import CreatePostIcon from "@material-ui/icons/AddBox";
import PopupWrapper from "../../components/Popups/PopupWrapper";
import { PopupState } from "../../utils/enums";
import LoadingScreen from "../../components/LoadingScreen";
import PostContainer from "../../components/PostContainer";
import { useState } from "react";
import { ContractType, ContentType } from "../../utils/contract";
import setResharePopup from "../../hooks/popupHooks";
import { useEffect } from "react";

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(PopupState.CLOSED);
  const [popupData, setPopupData] = useState({
    currentItem: "No item",
    id: -1,
    addressOfPoster: "0x0000000000000000000000000000000000000000",
    originalPostAddress: "0x0000000000000000000000000000000000000000",
    contractType: ContractType.ORIGINAL,
    contentType: ContentType.TEXT,
    payees: [],
    shares: [],
    royaltyMultiplier: -1,
    content: "This is the default content value",
    hashOfContent: "No hash",
  });

  useEffect(() => {
    //Set the popupData to the correct values based on the currentPopup
  }, [currentPopup]);

  return (
    <DataConsumer>
      {({ state, dispatch }) => (
        <React.Fragment>
          <div className="Home">
            <Grid container className="grid-container" spacing={1}>
              <Grid item className="grid-navbar" xs={1}>
                <NavBar />
                <CostsDisplay />
              </Grid>

              <Grid item className="grid-post" xs={1}>
                <Box className="button-container">
                  <Button
                    className="create"
                    startIcon={<CreatePostIcon />}
                    onClick={() => {
                      this.createNewPost();
                    }}
                  >
                    Create New Post
                  </Button>
                </Box>
                <PostContainer state={state} />
                <PopupWrapper
                  state={state}
                  dispatch={dispatch}
                  popupData={popupData}
                  currentState={currentPopup}
                  setPopupClosed={() => {
                    setIsLoading(false);
                    setCurrentPopup(PopupState.CLOSED);
                  }}
                />
                <LoadingScreen trigger={isLoading} />
              </Grid>
            </Grid>
          </div>
        </React.Fragment>
      )}
    </DataConsumer>
  );
}

export default Home;
