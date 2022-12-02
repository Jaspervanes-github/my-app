import React, { Component } from "react";
import NavBar from "../../components/Navbar";
import Post from "../Post";
import { DataConsumer } from "../../contexts/DataContext";
import { Grid } from "@material-ui/core";
import "./index.css";
import CostsDisplay from "../../components/CostsDisplay";

export default class Home extends Component {
  constructor(props) {
    super(props);
  }


  render() {
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
