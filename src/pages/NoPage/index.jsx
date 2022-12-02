import React from "react";
import NavBar from '../../components/Navbar';
import "./index.css";
import { DataConsumer } from '../../contexts/DataContext';
import { Grid } from '@material-ui/core';


const NoPage = () => {
  return (
    <DataConsumer>
      {({ state, dispatch }) => (
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
      )
      }
    </DataConsumer>
  )
};

export default NoPage;