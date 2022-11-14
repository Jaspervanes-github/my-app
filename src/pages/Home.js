import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
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
              <Grid container spacing={1} style={{
                maxWidth: "1500px",
                maxHeight: "1080px"
              }}>
                <Grid item xs={1} style={{
                  minWidth: "auto",
                  maxWidth: "20%",
                  minHeight: "100%",
                  marginTop: "5%"
                }}>
                  <NavBar />
                </Grid>
                {/* <IPFS /> */}
                <Grid item xs={1} style={{
                  minWidth: "80%",
                  maxWidth: "80%",
                  minHeight: "100%"
                }}>
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