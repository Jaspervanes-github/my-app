import { Box, Button, Grid } from "@material-ui/core";
import CreatePostIcon from "@material-ui/icons/AddBox";
import React, { useContext, useState } from "react";
import CostsDisplay from "../../components/CostsDisplay";
import LoadingScreen from "../../components/LoadingScreen";
import NavBar from "../../components/Navbar";
import PopupWrapper from "../../components/Popups/PopupWrapper";
import PostContainer from "../../components/PostContainer";
import { DataContext } from "../../contexts/DataContext";
import setData from "../../hooks/popupHooks";
import { ContentType, ContractType } from "../../utils/contract";
import { PopupState } from "../../utils/enums";
import "./index.css";

function Home() {
  const { state } = useContext(DataContext);
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

  return (
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
                  setData(
                    setPopupData,
                    setIsLoading,
                    setCurrentPopup,
                    // currentPopup,
                    PopupState.NEWPOST,
                    "No item",
                    state
                  );
                }}
              >
                Create New Post
              </Button>
            </Box>
            <PostContainer
              setPopupData={setPopupData}
              setIsLoading={setIsLoading}
              currentPopup={currentPopup}
              setCurrentPopup={setCurrentPopup}
            />
            <PopupWrapper
              setPopupData={setPopupData}
              popupData={popupData}
              currentPopup={currentPopup}
              setCurrentPopup={setCurrentPopup}
              setPopupClosed={() => {
                setIsLoading(false);
                setCurrentPopup(PopupState.CLOSED);
              }}
            />
            {isLoading ? <LoadingScreen /> : null}
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
}

export default Home;
