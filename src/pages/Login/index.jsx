import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { ethers } from "ethers";
import { DataConsumer } from '../../DataContext';
import "./index.css";


export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    //Connects with the MetaMask plugin and loads the existing posts
    async connectToMetamask(state, dispatch) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        let posts = JSON.parse(localStorage.getItem("posts"));
        let postData = JSON.parse(localStorage.getItem("postData"));

        dispatch({ type: 'setProvider', value: provider });
        dispatch({ type: 'setAccounts', value: accounts });
        dispatch({ type: 'setSigner', value: signer });
        dispatch({ type: 'setSelectedAccount', value: accounts[0] });
        dispatch({ type: 'setPosts', value: ((posts !== null) ? posts : []) });
        dispatch({ type: 'setPostData', value: ((postData !== null) ? postData : []) });

        provider.provider.on('accountsChanged', function () {
            window.location.reload();
        });

        provider.provider.on("chainChanged", () => {
            window.location.reload();
        });
    }

    //Renders all the ellements of the Login page
    renderMetamask(state, dispatch) {
        if (!state.selectedAccount) {
            return (
                <React.Fragment>
                    <div className="main">
                        <p className="textbox">
                            Welcome to the Handpicked Media application.
                            This application is created by Jasper van Es during an internship in 2022-2023.
                            This application simulates the workings of a social media platform in combination with the blockchain.
                            <br />
                            <br />
                            Please click "Sign in with MetaMask" to login to your cryptowallet account. Once connected you get navigated to the home page of the application.
                        </p>
                        <div className="container" >
                            <Button className="button" variant='contained' onClick=
                                {
                                    () => this.connectToMetamask(state, dispatch)
                                }>
                                Sign in with Metamask
                            </Button>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            return (
                <Navigate to="/home" replace={false} />
            );
        }
    }

    render() {
        return (
            <DataConsumer>
                {({ state, dispatch }) => (
                    <React.Fragment>
                        <div>
                            {this.renderMetamask(state, dispatch)}
                        </div>
                    </React.Fragment>
                )}
            </DataConsumer>
        )
    }
}