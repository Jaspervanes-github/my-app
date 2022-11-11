import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { DataConsumer } from '../DataContext';
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
          <Grid container spacing={1} style={{
            maxWidth: "1500px",
            maxHeight: "1080px"
          }}>
            <Grid item xs={1} style={{
              minWidth: "auto",
              maxWidth: "20%",
              minHeight: "100%"
            }}>
              <NavBar />
            </Grid>
            <Grid item xs={1} style={{
              minWidth: "80%",
              maxWidth: "80%",
              minHeight: "100%"
            }}>
              <h1>Error 404: Page Not Found</h1>
              <h3>Something went wrong...</h3>
              {/* <Footer /> */}
            </Grid>
          </Grid>
        </React.Fragment>
      )
      }
    </DataConsumer>
  )
};

export default NoPage;