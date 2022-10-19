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

    //   this.state = ({
    //   provider: props.location.state.provider,
    //   accounts: props.location.state.accounts,
    //   signer: props.location.state.signer
    // });
  }

  checkState(state) {
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
              <IPFS />
              <Post />
              <Footer />
            </div>
          </React.Fragment >
        )
        }
      </DataConsumer>
    )
  }
}