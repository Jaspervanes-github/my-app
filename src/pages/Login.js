import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { ContractFactory, ethers } from "ethers";
import Post_ABI from "../Post_ABI.json"
import Post_ByteCode from "../Post_ByteCode.json"
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

    async connectToMetamask() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        const balance = await provider.getBalance(accounts[0]);
        const balanceInEther = ethers.utils.formatEther(balance);

        const block = await provider.getBlockNumber();
        provider.on("block", (block) => {
            this.setState({ block })
        })

        this.setState({
            selectedAddress: accounts[0],
            balance: balanceInEther,
            block,
            provider,
            accounts,
            signer
        })

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

    renderMetamask() {
        if (!this.state.selectedAddress) {
            return (
                <div style={{margin: "25%"}}>
                    <Button variant='contained' style={{ justifyContent: 'center' }} onClick={() => this.connectToMetamask()}>
                        Connect to Metamask
                    </Button>
                </div>
            )
        } else {
            return (
                <Navigate to="/home" replace={false} />
                // <Navigate to="/home" state={this.state} replace={false} />

                // <div>
                //   <p>Welcome {this.state.selectedAddress}</p>
                //   <p>Your ETH Balance is: {this.state.balance}</p>
                //   <p>Current ETH Block is: {this.state.block}</p>

                //   <Button variant='contained' onClick={() => {
                //     this.getValueOfContract();
                //   }}>
                //     Get Value
                //   </Button>

                //   <Button variant='contained' onClick={() => {
                //     this.incrementValue();
                //   }}>
                //     Increment Value
                //   </Button>

                //   <Button variant='contained' onClick={() => {
                //     this.setValueOfContract(10);
                //   }}>
                //     Set Value
                //   </Button>

                //   <Button variant='contained' onClick={() => {
                //     this.deployNewValueContract();
                //   }}>
                //     Deploy new Contract
                //   </Button>

                //   <p>Current value of ValueContract: {this.state.currentValue}</p>
                //   <p>Current contractAddress of newly deployed contract: {
                //     (this.state.contract.length === 0)
                //       ? "No contract deployed"
                //       : this.state.contract[0].address
                //   }</p>
                // </div>
            );
        }
    }

    render() {
        return (
            <div>
                {this.renderMetamask()}
            </div>
        )
    }
}