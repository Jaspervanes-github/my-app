import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';

import { ContractFactory, ethers } from "ethers";
import Value_ABI from "../Value_ABI.json";
import Value_ByteCode from "../Value_ByteCode.json";

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentValue: 0,
            contract: []
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
            signer
        })

        provider.provider.on('accountsChanged', function () {
            window.location.reload();
        });

        provider.provider.on("chainChanged", () => {
            window.location.reload();
        });
    }

    async getValueOfContract() {
        if (this.state.contract.length === 0) {
            console.log("Please deploy a contract first");
            return;
        }
        try {
            console.log("In method getValueOfContract");
            let value = await this.state.contract[0].value();
            console.log("Value retrieved is:", value.toNumber());

            this.setState({ currentValue: value.toNumber() });
        } catch (err) {
            console.error(err);
        }
    }

    async incrementValue() {
        if (this.state.contract.length === 0) {
            console.log("Please deploy a contract first");

            return;
        }
        try {
            console.log("In method incrementValue");
            await this.state.contract[0].increment();

            this.setState({ currentValue: this.state.currentValue + 1 });
        } catch (err) {
            console.error(err);
        }
    }

    async setValueOfContract(value) {
        if (this.state.contract.length === 0) {
            console.log("Please deploy a contract first");
            return;
        }
        try {
            console.log("In method setValueOfContract");
            await this.state.contract[0].setValue(value);
            this.setState({ currentValue: value });
        } catch (err) {
            console.error(err);
        }
    }

    async deployNewValueContract() {
        try {
            const factory = new ContractFactory(Value_ABI, Value_ByteCode, this.state.signer);
            const contract = await factory.deploy();

            console.log(contract.address);
            this.state.contract.push(contract);
        } catch (err) {
            console.error(err);
        }
    }

    renderMetamask() {
        if (!this.state.selectedAddress) {
            return (
                <Button variant='contained' onClick={() => this.connectToMetamask()}>
                    Connect to Metamask
                </Button>
            )
            window.location.reload();
        } else {
            return (
                <div>
                    <Navigate to="/home" replace={false} />
                </div>
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