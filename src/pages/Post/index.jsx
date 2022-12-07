import { Button, Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ReshareIcon from "@material-ui/icons/Share";
import RemixIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import DetailIcon from "@material-ui/icons/Info";
import CreatePostIcon from "@material-ui/icons/AddBox";
import React, { Component } from "react";
import ViewportList from "react-viewport-list";
import { ethers } from "ethers";

import "./index.css";
import Popup from "../../components/Popup";
import { DataConsumer } from "../../contexts/DataContext";
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
import RoyaltieSplitDiagram from "../../components/RoyaltieSplitDiagram";
import PopupWrapper from "../../components/Popups/PopupWrapper";
import { PopupState } from "../../utils/enums";

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBusy: false,
      currentPopup: PopupState.CLOSED,

      // triggerResharePostPopup: false,
      // triggerRemixPostPopup: false,
      // triggerNewPostPopup: false,
      // triggerViewPostPopup: false,
      // triggerDetailPostPopup: false,

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
      if (!this.state.isBusy) {
        this.setState({ isBusy: true });

        let contract = new ethers.Contract(item, Post_ABI, state.signer);
        let _payees = await contract.getAllPayees();
        let isAlreadyOwner = false;

        for (let i = 0; i < _payees.length; i++) {
          if (
            _payees[i].toUpperCase() === state.selectedAccount.toUpperCase()
          ) {
            isAlreadyOwner = true;
            break;
          }
        }
        if (isAlreadyOwner) {
          createToastMessage("You can't reshare your own posts", false);
          this.setState({ isBusy: false });
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
      }
    } catch (err) {
      console.error(err);
      this.setState({ isBusy: false });
    }
  }

  //Fetches the data of the post it wants to remix and opens the RemixPostPopup
  async createRemixPost(state, item) {
    try {
      if (!this.state.isBusy) {
        this.setState({ isBusy: true });

        let contract = new ethers.Contract(item, Post_ABI, state.signer);
        let _payees = await contract.getAllPayees();
        let isAlreadyOwner = false;

        for (let i = 0; i < _payees.length; i++) {
          if (
            _payees[i].toUpperCase() === state.selectedAccount.toUpperCase()
          ) {
            isAlreadyOwner = true;
            break;
          }
        }
        if (isAlreadyOwner) {
          createToastMessage("You can't reshare your own posts", false);
          this.setState({ isBusy: false });
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
      }
    } catch (err) {
      console.error(err);
      this.setState({ isBusy: false });
    }
  }

  //Let the user pay a certain amount to view the content of the post
  async viewPost(state, item) {
    try {
      if (!this.state.isBusy) {
        this.setState({ isBusy: true });

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
            this.setState({ isBusy: false });
            return;
          }
        } else {
          createToastMessage("You can't view your own posts", 5000);
          this.setState({ isBusy: false });
          return;
        }

        let _contentType = await contract.contentType();
        let _id = await contract.id();
        let _hashOfContent = await contract.hashOfContent();
        let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

        this.setState({
          currentItem: item,
          id: _id.toNumber(),
          addressOfPoster: _addressOfPoster,
          contentType: _contentType,
          hashOfContent: _hashOfContent,
          content: _content,
          currentPopup: PopupState.VIEWING,
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isBusy: false });
    }
  }

  async detailPost(state, item) {
    try {
      if (!this.state.isBusy) {
        this.setState({ isBusy: true });

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
      }
    } catch (err) {
      console.error(err);
      this.setState({ isBusy: false });
    }
  }

  resizeHeightOfElement(elem) {
    elem.target.style.height = "1px";
    elem.target.style.height = elem.target.scrollHeight + "px";
  }

  //Renders all the elements of the Post
  render() {
    return (
      <DataConsumer>
        {({ state, dispatch }) => (
          <React.Fragment>
            <div className="main">
              <Box className="button-container">
                <Button
                  className="create"
                  startIcon={<CreatePostIcon />}
                  onClick={() => {
                    this.createNewPost();
                  }}
                >
                  Create New Post
                </Button>
              </Box>

              {/* <Button variant="contained" onClick={() => { localStorage.setItem("posts", JSON.stringify([])); localStorage.setItem("postData", JSON.stringify([])) }}>
                Clear the localStorage
              </Button> */}
              <div
                className="scroll-container"
                ref={this.ref}
                style={{
                  maxHeight: window.innerHeight / 1.4 + "px",
                }}
              >
                <ViewportList
                  viewportRef={this.ref}
                  items={state.posts || []}
                  itemMinSize={40}
                  margin={8}
                >
                  {(item) => (
                    <React.Fragment key={state.posts.indexOf(item)}>
                      <div className="post">
                        <div className="container">
                          <h3>Address of Contract: {item}</h3>
                          {state.postData[state.posts.indexOf(item)].substring(
                            0,
                            11
                          ) !== "data:image/" ? (
                            state.postData[state.posts.indexOf(item)].substring(
                              0,
                              225
                            ) + "..."
                          ) : (
                            <img
                              src={state.postData[state.posts.indexOf(item)]}
                              alt=""
                              className="imageBox"
                            />
                          )}
                          <br />
                          <br />
                          <br />
                          <u>
                            To view the full content of the post click the
                            "View" icon!
                          </u>
                        </div>
                        <br />
                        <div className="post-buttons">
                          <IconButton
                            className="button"
                            title="Reshare Post"
                            onClick={() => {
                              this.createResharePost(state, item);
                            }}
                          >
                            <ReshareIcon />
                          </IconButton>
                          <IconButton
                            className="button"
                            title="Remix Post"
                            onClick={() => {
                              this.createRemixPost(state, item);
                            }}
                          >
                            <RemixIcon />
                          </IconButton>
                          <IconButton
                            className="button"
                            title="View Post"
                            onClick={() => {
                              this.viewPost(state, item);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            className="button"
                            title="Detail of the Post"
                            onClick={() => {
                              this.detailPost(state, item);
                            }}
                          >
                            <DetailIcon />
                          </IconButton>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </ViewportList>
              </div>

              <div className="popup-container">
                <PopupWrapper
                  state={state}
                  dispatch={dispatch}
                  currentState={this.state.currentPopup}
                  setPopupClosed={() => {
                    this.setState({
                      isBusy: false,
                      currentPopup: PopupState.CLOSED,
                    });
                  }}
                />
              </div>
              
               
              {/* <div className="resharePostTemplate">
                <Popup
                  trigger={this.state.triggerResharePostPopup}
                  setTrigger={() => {
                    this.setState({
                      triggerResharePostPopup: false,
                      isBusy: false,
                    });
                  }}
                >
                  <h2>Reshare Post</h2>
                  <form
                    onSubmit={(event) => {
                      if (this.state.content === "") {
                        createToastMessage("Please enter a valid text", 5000);
                        event.preventDefault();
                        return;
                      }
                      this.handleSubmit(
                        event,
                        state,
                        dispatch,
                        ContractType.RESHARE
                      );
                      this.setState({
                        triggerResharePostPopup: false,
                        isBusy: false,
                      });
                    }}
                  >
                    <div className="textbox-container">
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                          fontWeight: "bold",
                        }}
                      >
                        Address of Poster:
                        <br />
                        <br />
                        Content Type:
                        <br />
                        <br />
                        Content of Post:
                      </p>

                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                        }}
                      >
                        {state.selectedAccount} <br />
                        <br />
                        {contentTypeToString(this.state.contentType)}
                        <br />
                        <br />
                        {(() => {
                          //if contentType is TEXT
                          if (
                            this.state.contentType === "0" ||
                            this.state.contentType === ContentType.TEXT
                          ) {
                            return (
                              <p
                                className="textbox"
                                style={{
                                  height: this.scrollHeight + "px",
                                  maxHeight: window.innerHeight / 2,
                                }}
                              >
                                {this.state.content}
                              </p>
                            );
                          }
                          //if contentType is IMAGE
                          else if (
                            this.state.contentType === "1" ||
                            this.state.contentType === ContentType.IMAGE
                          ) {
                            return (
                              // render Image selection component here
                              <div>
                                <img
                                  src={this.state.content}
                                  alt=""
                                  className="imageBox"
                                />
                              </div>
                            );
                          }
                        })()}
                      </p>
                    </div>
                    <p className="title">
                      <br />
                      COSTS
                      <br />
                    </p>
                    <div className="infoBox">
                      <p className="item" style={{ fontWeight: "bold" }}>
                        New Post:
                        <br />
                        Reshare:
                        <br />
                        Remix:
                        <br />
                        View:
                        <br />
                      </p>
                      <p className="item">
                        0.0057 &nbsp;ETH
                        <br />
                        0.0035 &nbsp;ETH
                        <br />
                        0.0035 &nbsp;ETH
                        <br />
                        0.00031 ETH
                        <br />
                      </p>
                    </div>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="remixPostTemplate">
                <Popup
                  trigger={this.state.triggerRemixPostPopup}
                  setTrigger={() => {
                    this.setState({
                      triggerRemixPostPopup: false,
                      isBusy: false,
                    });
                  }}
                >
                  <h2>Remix Post</h2>
                  <form
                    onSubmit={(event) => {
                      if (this.state.content === "") {
                        createToastMessage("Please enter a valid text", 5000);
                        event.preventDefault();
                        return;
                      }
                      this.handleSubmit(
                        event,
                        state,
                        dispatch,
                        ContractType.REMIX
                      );
                      this.setState({
                        triggerRemixPostPopup: false,
                        isBusy: false,
                      });
                    }}
                  >
                    <div className="textbox-container">
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                          fontWeight: "bold",
                        }}
                      >
                        Address of Poster:
                        <br />
                        <br />
                        Content Type:
                        <br />
                        <br />
                        Content of Post:
                      </p>
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                        }}
                      >
                        {state.selectedAccount}
                        <br />
                        <br />
                        <select
                          type="select"
                          name="contentType"
                          value={this.state.contentType}
                          onChange={this.handleChange}
                        >
                          <option value="0">TEXT</option>
                          <option value="1">IMAGE</option>
                        </select>
                        <br />
                        <br />
                        {(() => {
                          //if contentType is TEXT
                          if (
                            this.state.contentType === "0" ||
                            this.state.contentType === ContentType.TEXT
                          ) {
                            return (
                              <textarea
                                className="textarea"
                                name="content"
                                rows="1"
                                placeholder="Type text here..."
                                value={this.state.content}
                                style={{
                                  height: this.scrollHeight + "px",
                                  maxHeight: window.innerHeight / 2,
                                }}
                                onInput={this.resizeHeightOfElement}
                                onSelect={this.resizeHeightOfElement}
                                onChange={this.handleChange}
                              />
                            );
                          }
                          //if contentType is IMAGE
                          else if (
                            this.state.contentType === "1" ||
                            this.state.contentType === ContentType.IMAGE
                          ) {
                            return (
                              // render Image selection component here
                              <div>
                                <img
                                  src={this.state.content}
                                  alt=""
                                  className="imageBox"
                                />
                                <input
                                  type="file"
                                  name="content"
                                  id="input"
                                  accept="image/*"
                                  onChange={this.handleChange}
                                />
                              </div>
                            );
                          }
                        })()}
                      </p>
                    </div>
                    <p className="title">
                      <br />
                      COSTS
                      <br />
                    </p>
                    <div className="infoBox">
                      <p className="item" style={{ fontWeight: "bold" }}>
                        New Post:
                        <br />
                        Reshare:
                        <br />
                        Remix:
                        <br />
                        View:
                        <br />
                      </p>
                      <p className="item">
                        0.0057 &nbsp;ETH
                        <br />
                        0.0035 &nbsp;ETH
                        <br />
                        0.0035 &nbsp;ETH
                        <br />
                        0.00031 ETH
                        <br />
                      </p>
                    </div>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="newPostTemplate">
                <Popup
                  trigger={this.state.triggerNewPostPopup}
                  setTrigger={() => {
                    this.setState({
                      triggerNewPostPopup: false,
                      isBusy: false,
                    });
                  }}
                >
                  <h2>New Post</h2>
                  <form
                    onSubmit={(event) => {
                      if (this.state.content === "") {
                        createToastMessage("Please enter a valid text", 5000);
                        event.preventDefault();
                        return;
                      }
                      this.handleSubmit(
                        event,
                        state,
                        dispatch,
                        ContractType.ORIGINAL
                      );
                      this.setState({
                        triggerNewPostPopup: false,
                        isBusy: false,
                      });
                    }}
                  >
                    <div className="textbox-container">
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                          fontWeight: "bold",
                        }}
                      >
                        Address of Poster:
                        <br />
                        <br />
                        Content Type:
                        <br />
                        <br />
                        Content of Post:
                        <br />
                        <br />
                      </p>
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                        }}
                      >
                        {state.selectedAccount}
                        <br />
                        <br />

                        <select
                          type="select"
                          name="contentType"
                          value={this.state.contentType}
                          onChange={this.handleChange}
                        >
                          <option value="0">TEXT</option>
                          <option value="1">IMAGE</option>
                        </select>
                        <br />
                        <br />

                        {(() => {
                          //if contentType is TEXT
                          if (
                            this.state.contentType === "0" ||
                            this.state.contentType === ContentType.TEXT
                          ) {
                            return (
                              <textarea
                                className="textarea"
                                name="content"
                                rows="1"
                                placeholder="Type text here..."
                                value={this.state.content}
                                style={{
                                  height: this.scrollHeight + "px",
                                  maxHeight: window.innerHeight / 2,
                                }}
                                onInput={this.resizeHeightOfElement}
                                onSelect={this.resizeHeightOfElement}
                                onChange={this.handleChange}
                              />
                            );
                          }
                          //if contentType is IMAGE
                          else if (
                            this.state.contentType === "1" ||
                            this.state.contentType === ContentType.IMAGE
                          ) {
                            return (
                              // render Image selection component here
                              <span className="image-container">
                                <img
                                  src={this.state.content}
                                  alt=""
                                  className="imageBox"
                                />
                                <br />
                                <input
                                  type="file"
                                  name="content"
                                  id="input"
                                  accept="image/*"
                                  onChange={this.handleChange}
                                />
                              </span>
                            );
                          }
                        })()}
                        <br />
                        <br />
                      </p>
                    </div>
                    <input
                      className="submit-button"
                      type="submit"
                      value="Submit Post"
                    />
                  </form>
                </Popup>
              </div>

              <div className="viewPostTemplate">
                <Popup
                  trigger={this.state.triggerViewPostPopup}
                  setTrigger={() => {
                    this.setState({
                      triggerViewPostPopup: false,
                      isBusy: false,
                    });
                  }}
                >
                  <h2>View Post</h2>
                  <div className="textbox-container">
                    <p
                      className="textbox"
                      style={{
                        height: this.scrollHeight + "px",
                        maxHeight: window.innerHeight / 2 + 20,
                        fontWeight: "bold",
                      }}
                    >
                      Address of Poster:
                      <br />
                      <br />
                      Contract ID:
                      <br />
                      <br />
                      Content of Post:
                    </p>
                    <p
                      className="textbox"
                      style={{
                        height: this.scrollHeight + "px",
                        maxHeight: window.innerHeight / 2 + 20,
                      }}
                    >
                      {this.state.addressOfPoster}
                      <br />
                      <br />
                      {this.state.id}
                      <br />
                      <br />
                      {(() => {
                        //if contentType is TEXT
                        if (
                          this.state.contentType === "0" ||
                          this.state.contentType === ContentType.TEXT
                        ) {
                          return (
                            <p
                              className="textbox"
                              style={{
                                height: this.scrollHeight + "px",
                                maxHeight: window.innerHeight / 2,
                              }}
                            >
                              {this.state.content}
                            </p>
                          );
                        }
                        //if contentType is IMAGE
                        else if (
                          this.state.contentType === "1" ||
                          this.state.contentType === ContentType.IMAGE
                        ) {
                          return (
                            // render Image selection component here
                            <div>
                              <img
                                src={this.state.content}
                                alt=""
                                className="imageBox"
                              />
                            </div>
                          );
                        }
                      })()}
                    </p>
                  </div>
                </Popup>
              </div>

              <div className="detailTemplate">
                <Popup
                  trigger={this.state.triggerDetailPostPopup}
                  setTrigger={() => {
                    this.setState({
                      triggerDetailPostPopup: false,
                      isBusy: false,
                    });
                  }}
                >
                  <h2>Details of the post</h2>
                  <div className="container">
                    <div className="textbox-container">
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                          fontWeight: "bold",
                          width: "35%",
                        }}
                      >
                        Link to the contract:
                        <br />
                        Wallet Address of Poster:
                        <br />
                        Contract ID:
                        <br />
                        Contract Type:
                        <br />
                        ContentType:
                        <br />
                        Original Post:
                        <br />
                        Hash of the content:
                        <br />
                      </p>
                      <p
                        className="textbox"
                        style={{
                          height: this.scrollHeight + "px",
                          maxHeight: window.innerHeight / 2 + 20,
                        }}
                      >
                        <a
                          href={
                            "https://sepolia.etherscan.io/address/" +
                            this.state.currentItem
                          }
                          target="_blank"
                        >
                          Click here to visit etherscan!
                        </a>
                        <br />
                        {this.state.addressOfPoster}
                        <br />
                        {this.state.id}
                        <br />
                        {contractTypeToString(this.state.contractType)}
                        <br />
                        {contentTypeToString(this.state.contentType)}
                        <br />
                        {this.state.originalPostAddress}
                        <br />
                        {this.state.hashOfContent}
                        <br />
                      </p>
                    </div>

                    <br />
                    <RoyaltieSplitDiagram
                      payees={this.state.payees}
                      shares={this.state.shares}
                    />
                  </div>
                </Popup>
              </div> */}
            </div>
          </React.Fragment>
        )}
      </DataConsumer>
    );
  }
}
