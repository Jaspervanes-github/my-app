import React from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { DataConsumer } from '../DataContext';
import { Navigate } from 'react-router-dom';


function checkState(state) {
  //This means that the login page hasnt been visited so it doesnt have access to all the provider data
  if (state.provider === '') {
    return <Navigate to="/" replace={false} />
  }
}

const NoPage = () => {
  return(
  <DataConsumer>
    {({ state, dispatch }) => (
      <React.Fragment>
        {checkState(state)}
        <NavBar />
        <h1>Error 404: Page Not Found</h1>
        <h3>Something went wrong...</h3>
        {/* <Footer /> */}
      </React.Fragment>
    )
    }
  </DataConsumer>
  )
};

export default NoPage;