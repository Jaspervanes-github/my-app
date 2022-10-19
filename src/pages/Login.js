import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { ContractFactory, ethers } from "ethers";
import Post_ABI from "../Post_ABI.json"
import Post_ByteCode from "../Post_ByteCode.json"
import { DataConsumer } from '../DataContext'


export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    async connectToMetamask(state, dispatch) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        dispatch({ type: 'setProvider', value: provider });
        dispatch({ type: 'setAccounts', value: accounts });
        dispatch({ type: 'setSigner', value: signer });
        dispatch({ type: 'setSelectedAccount', value: accounts[0] });
        dispatch({ type: 'setPosts', value: JSON.parse(localStorage.getItem("posts")) });

        provider.provider.on('accountsChanged', function () {
            window.location.reload();
        });

        provider.provider.on("chainChanged", () => {
            window.location.reload();
        });
    }

    renderMetamask(state, dispatch) {
        if (!state.selectedAccount) {
            return (
                <div style={{ margin: "25%" }}>
                    <Button variant='contained' style={{ justifyContent: 'center' }} onClick=
                        {
                            () => this.connectToMetamask(state, dispatch)
                        }>
                        Connect to Metamask
                    </Button>
                </div>
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
                    <div>
                        {this.renderMetamask(state, dispatch)}
                    </div>
                )}
            </DataConsumer>
        )
    }
}