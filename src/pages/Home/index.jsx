import React, { Component } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "../../components/Navbar";
import Post from "../Post";
import { DataConsumer } from "../../DataContext";
import { Grid } from "@material-ui/core";
import "./index.css";
import CostsDisplay from "../../components/CostsDisplay";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  checkState(state) {
    //This means that the login page hasnt been visited so it doesnt have access to all the provider data
    if (state.provider === "") {
      return <Navigate to="/" replace={false} />;
    }
  }

  render() {
    return (
      <DataConsumer>
        {({ state, dispatch }) => (
          <React.Fragment>
            {this.checkState(state)}
            <div className="Home">
              <Grid container className="grid-container" spacing={1}>
                <Grid item className="grid-navbar" xs={1}>
                  <NavBar />
                  <CostsDisplay />
                </Grid>
                <Grid item className="grid-post" xs={1}>
                  <Post />
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        )}
      </DataConsumer>
    );
  }
}
