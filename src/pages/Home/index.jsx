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

function Home() {
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
                  currentState={this.state.currentPopup}
                  setPopupClosed={() => {
                    this.setState({
                      isLoading: false,
                      currentPopup: PopupState.CLOSED,
                    });
                  }}
                />
                <LoadingScreen trigger={this.state.isLoading} />
              </Grid>
            </Grid>
          </div>
        </React.Fragment>
      )}
    </DataConsumer>
  );
}

export default Home;
