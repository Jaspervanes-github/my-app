import React, { Component } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import IPFS from '../IPFS.js';
import Post from './Post.js';

export default class Home extends Component {
  constructor(props) {
    super(props);
    
    //   this.state = ({
    //   provider: props.location.state.provider,
    //   accounts: props.location.state.accounts,
    //   signer: props.location.state.signer
    // });
  }

  render() {
    return (
      <React.Fragment>
        <div className="Home">
          <NavBar />
          <IPFS />
          <Post />
          <Footer />
        </div>
      </React.Fragment>
    )
  }
}