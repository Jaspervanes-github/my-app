import React, { Component } from "react";
import { ethers } from "ethers";
import "./index.css";

import {
  saveDataToIPFS,
  saveTextToIPFS,
  saveImageToIPFS,
  retrieveDataFromIPFS,
} from "../../utils/ipfs";
import {
  ContractType,
  ContentType,
  deployNewPostContract,
} from "../../utils/contract";
import { createToastMessage } from "../../utils/toast";
import Post_ABI from "../../assets/metadata/Post_ABI.json";
import { PopupState } from "../../utils/enums";

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      currentPopup: PopupState.CLOSED,

      currentItem: "",
      id: 0,
      contractType: "",
      addressOfPoster: "",
      originalPostAddress: "",
      contentType: ContentType.TEXT,
      hashOfContent: "",
      content: "",
      payees: [],
      shares: [],
      royaltyMultiplier: "",
    };

    this.ref = React.createRef(null);
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  // //Handles the changes in the form element of the popups
  // handleChange(event) {
  //   const target = event.target;
  //   const name = target.name;

  //   let value;
  //   switch (target.type) {
  //     case "textarea":
  //       value = target.value;
  //       break;
  //     case "select-one":
  //       value = target.value;
  //       break;
  //     case "file":
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         if (reader.readyState === 2) {
  //           this.setState({ content: reader.result });
  //         }
  //       };
  //       reader.readAsDataURL(event.target.files[0]);
  //       break;
  //     default:
  //       break;
  //   }

  //   this.setState({
  //     [name]: value,
  //   });
  // }

  // //Handles the submittions of the form element of the popups
  // async handleSubmit(event, state, dispatch, type) {
  //   createToastMessage("The post is being created, please wait...", 3000);

  //   let _hashOfContent;
  //   if (
  //     this.state.contentType === "0" ||
  //     this.state.contentType === ContentType.TEXT
  //   ) {
  //     _hashOfContent = await saveTextToIPFS(this.state.content);
  //   } else if (
  //     this.state.contentType === "1" ||
  //     this.state.contentType === ContentType.IMAGE
  //   ) {
  //     _hashOfContent = await saveImageToIPFS(this.state.content);
  //   }

  //   deployNewPostContract(
  //     state,
  //     dispatch,
  //     type,
  //     state.posts?.length || 0,
  //     this.state.contractType,
  //     this.state.originalPostAddress,
  //     this.state.contentType,
  //     _hashOfContent.cid.toString(),
  //     this.state.payees,
  //     this.state.shares,
  //     this.state.royaltyMultiplier
  //   );
  //   event.preventDefault();
  // }

  //Sets all the correct data to create a new Post and opens the NewPostPopup
  createNewPost() {
    this.setState({
      contractType: ContractType.ORIGINAL,
      contentType: ContentType.TEXT,
      originalPostAddress: "0x0000000000000000000000000000000000000000",
      payees: [],
      shares: [],
      royaltyMultiplier: 5,
      content: "",
      currentPopup: PopupState.NEWPOST,
    });
  }

  //Fetches the data of the post it wants to reshare and opens the ResharePostPopup
  async createResharePost(state, item) {
    try {
      this.setState({ isLoading: true });

      let contract = new ethers.Contract(item, Post_ABI, state.signer);
      let _payees = await contract.getAllPayees();
      let isAlreadyOwner = false;

      for (let i = 0; i < _payees.length; i++) {
        if (_payees[i].toUpperCase() === state.selectedAccount.toUpperCase()) {
          isAlreadyOwner = true;
          break;
        }
      }
      if (isAlreadyOwner) {
        createToastMessage("You can't reshare your own posts", false);
        this.setState({ isLoading: false });
        return;
      }

      createToastMessage(
        "The data of the contract is being retrieved, please wait...",
        3000
      );

      let _contentType = await contract.contentType();
      let _originalPostAddress = await contract.originalPost();
      let _shares = await contract.getAllShares();
      let _hashOfContent = await contract.hashOfContent();
      let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

      this.setState({
        isLoading: false,
        currentItem: item,
        contractType: ContractType.RESHARE,
        contentType: _contentType,
        originalPostAddress: _originalPostAddress,
        payees: _payees,
        shares: _shares,
        royaltyMultiplier: 2,
        hashOfContent: _hashOfContent,
        content: _content,
        currentPopup: PopupState.RESHARING,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  //Fetches the data of the post it wants to remix and opens the RemixPostPopup
  async createRemixPost(state, item) {
    try {
      this.setState({ isLoading: true });

      let contract = new ethers.Contract(item, Post_ABI, state.signer);
      let _payees = await contract.getAllPayees();
      let isAlreadyOwner = false;

      for (let i = 0; i < _payees.length; i++) {
        if (_payees[i].toUpperCase() === state.selectedAccount.toUpperCase()) {
          isAlreadyOwner = true;
          break;
        }
      }
      if (isAlreadyOwner) {
        createToastMessage("You can't reshare your own posts", false);
        this.setState({ isLoading: false });
        return;
      }

      createToastMessage(
        "The data of the contract is being retrieved, please wait...",
        3000
      );

      let _contentType = await contract.contentType();
      let _originalPostAddress = await contract.originalPost();
      let _shares = await contract.getAllShares();
      let _hashOfContent = await contract.hashOfContent();
      let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

      this.setState({
        isLoading: false,
        currentItem: item,
        contractType: ContractType.REMIX,
        contentType: _contentType,
        originalPostAddress: _originalPostAddress,
        payees: _payees,
        shares: _shares,
        royaltyMultiplier: 4,
        hashOfContent: _hashOfContent,
        content: _content,
        currentPopup: PopupState.REMIXING,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  //Let the user pay a certain amount to view the content of the post
  async viewPost(state, item) {
    try {
      this.setState({ isLoading: true });

      let contract = new ethers.Contract(item, Post_ABI, state.signer);
      let _addressOfPoster = await contract.addressOfPoster();

      if (
        _addressOfPoster.toLowerCase() !== state.selectedAccount.toLowerCase()
      ) {
        try {
          createToastMessage("Awaiting transaction...", 3000);

          const transaction = await contract.viewPost({
            value: ethers.utils.parseEther("0.00001"),
          });
          await transaction.wait();
        } catch (err) {
          createToastMessage(
            "To view the content of the post you need to accept the transaction.",
            5000
          );
          console.error(err);
          this.setState({ isLoading: false });
          return;
        }
      } else {
        createToastMessage("You can't view your own posts", 5000);
        this.setState({ isLoading: false });
        return;
      }

      let _contentType = await contract.contentType();
      let _id = await contract.id();
      let _hashOfContent = await contract.hashOfContent();
      let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

      this.setState({
        isLoading: false,
        currentItem: item,
        id: _id.toNumber(),
        addressOfPoster: _addressOfPoster,
        contentType: _contentType,
        hashOfContent: _hashOfContent,
        content: _content,
        currentPopup: PopupState.VIEWING,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  async detailPost(state, item) {
    try {
      this.setState({ isLoading: true });

      createToastMessage(
        "The data of the contract is being retrieved, please wait...",
        3000
      );

      let contract = new ethers.Contract(item, Post_ABI, state.signer);
      let _addressOfPoster = await contract.addressOfPoster();

      let _id = await contract.id();
      let _contractType = await contract.contractType();
      let _contentType = await contract.contentType();
      let _originalPostAddress = await contract.originalPost();
      let _payees = await contract.getAllPayees();
      let _shares = await contract.getAllShares();
      let _royaltyMultiplier = await contract.royaltyMultiplier();
      let _hashOfContent = await contract.hashOfContent();
      let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

      this.setState({
        isLoading: false,
        currentItem: item,
        id: _id.toNumber(),
        addressOfPoster: _addressOfPoster,
        contractType: _contractType,
        contentType: _contentType,
        originalPostAddress: _originalPostAddress,
        payees: _payees,
        shares: _shares,
        royaltyMultiplier: _royaltyMultiplier,
        hashOfContent: _hashOfContent,
        content: _content,
        currentPopup: PopupState.DETAILS,
      });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  resizeHeightOfElement(elem) {
    elem.target.style.height = "1px";
    elem.target.style.height = elem.target.scrollHeight + "px";
  }

  //Renders all the elements of the Post
  render() {
    return <div></div>;
  }
}
