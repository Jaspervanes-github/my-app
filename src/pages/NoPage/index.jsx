import React from "react";
import Footer from "../../components/Footer";
import NavBar from '../../components/Navbar';
import "./index.css";
import { DataConsumer } from '../../DataContext';
import { Navigate } from 'react-router-dom';
import { Grid } from '@material-ui/core';


function checkState(state) {
  //This means that the login page hasnt been visited so it doesnt have access to all the provider data
  if (state.provider === '') {
    return <Navigate to="/" replace={false} />
  }
}

const NoPage = () => {
  return (
    <DataConsumer>
      {({ state, dispatch }) => (
        <React.Fragment>
          {checkState(state)}
          <div className="NoPage">
            <Grid container className="grid-container" spacing={1}>
              <Grid item className="grid-navbar" xs={1}>
                <NavBar />
              </Grid>
              <Grid item className="grid-text" xs={1}>
                <h1>Error 404: Page Not Found</h1>
                <h3>Something went wrong...</h3>
                {/* <Footer /> */}
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