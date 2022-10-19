import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { ContractFactory, ethers } from "ethers";
import Post_ABI from "../Post_ABI.json"
import Post_ByteCode from "../Post_ByteCode.json"
import { DataConsumer } from '../DataContext'
// import Value_ABI from "../Value_ABI.json";
// import Value_ByteCode from "../Value_ByteCode.json";


export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // currentValue: 0,
            contracts: []
        };
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

    async deployNewPostContract(
        contractType,
        originalPostAddress,
        contentType,
        hashOfContent,
        payees,
        shares,
        royaltyMultiplier
    ) {
        try {
            const factory = new ContractFactory(Post_ABI, Post_ByteCode, this.state.signer);
            const contract = await factory.deploy(
                contractType,
                originalPostAddress,
                contentType,
                hashOfContent,
                payees,
                shares,
                royaltyMultiplier
            );
            console.log(contract.address);

            let currentPosts = JSON.parse(localStorage.getItem("posts"));
            currentPosts.push(contract);
            localStorage.setItem("posts", JSON.stringify(currentPosts));

            this.state.contracts.push(contract);
            // return contract;
        } catch (err) {
            console.error(err);
        }
    }

    async getPayees(indexOfContract) {
        try {
            let payees = await this.state.contracts[indexOfContract].getAllPayees();
            return payees;
        } catch (err) {
            console.error(err);
        }
    }

    async getShares(indexOfContract) {
        try {
            let shares = await this.state.contracts[indexOfContract].getAllShares();
            return shares;
        } catch (err) {
            console.error(err);
        }
    }

    async viewPost(indexOfContract) {
        try {
            const transaction = await this.state.contracts[indexOfContract].viewPost({ value: ethers.utils.parseEther("1.0") });
            await transaction.wait();
        } catch (err) {
            console.error(err);
        }
    }

    async payoutUser(indexOfContract) {
        try {
            await this.state.contracts[indexOfContract].payoutUser();
        } catch (err) {
            console.error(err);
        }
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