import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import "./Home.css";
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import IPFS from '../IPFS.js';
import Post from './Post.js';
import { DataConsumer } from '../DataContext';
import { Grid } from '@material-ui/core';


export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  checkState(state) {
    //This means that the login page hasnt been visited so it doesnt have access to all the provider data
    if (state.provider === '') {
      return <Navigate to="/" replace={false} />
    }
  }

  render() {
    return (
      <DataConsumer>
        {({ state, dispatch }) => (
          < React.Fragment >
            {this.checkState(state)}
            <div className="Home">
              <Grid container className="grid-container" spacing={1}>
                <Grid item className="grid-navbar" xs={1}>
                  <NavBar />
                  <p className="title">
                      COSTS<br />
                    </p>
                  <div className="infoBox">
                    <p className="item">
                      New Post:<br />
                      Reshare:<br />
                      Remix:<br />
                      View:<br />
                    </p>
                    <p className="item">
                      0.0057  &nbsp;ETH<br />
                      0.0035  &nbsp;ETH<br />
                      0.0035  &nbsp;ETH<br />
                      0.00031 ETH<br />
                    </p>
                  </div>
                </Grid>
                {/* <IPFS /> */}
                <Grid item className="grid-post" xs={1}>
                  <Post />
                </Grid>
                {/* <Footer /> */}
              </Grid>
            </div>
          </React.Fragment >
        )
        }
      </DataConsumer>
    )
  }
}