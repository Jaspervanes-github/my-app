import { Grid } from "@material-ui/core";
import React from "react";
import NavBar from "../../components/Navbar";
import "./index.css";

/**
 * This component displays the error page of the application, this page gets shown when an invalid URL is enterred.
 * @returns The render components of the DataConsumer component.
 */
const NoPage = () => {
  return (
    <React.Fragment>
      <div className="NoPage">
        <Grid container className="grid-container" spacing={1}>
          <Grid item className="grid-navbar" xs={1}>
            <NavBar />
          </Grid>
          <Grid item className="grid-text" xs={1}>
            <h1>Error 404: Page Not Found</h1>
            <h3>Something went wrong...</h3>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  );
};

export default NoPage;
