import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import IPFS from '../IPFS.js';
import Post from './Post.js';
import { DataConsumer } from '../DataContext';


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
            < div className="Home">
              {console.log(state.provider)}
              <NavBar />
              {/* <IPFS /> */}
              <Post />
              {/* <Footer /> */}
            </div>
          </React.Fragment >
        )
        }
      </DataConsumer>
    )
  }
}