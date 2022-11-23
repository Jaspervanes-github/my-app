import { Button, Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import ReshareIcon from "@material-ui/icons/Share";
import RemixIcon from "@material-ui/icons/Edit";
import ViewIcon from "@material-ui/icons/Visibility";
import DetailIcon from "@material-ui/icons/Info";
import CreatePostIcon from "@material-ui/icons/AddBox";
import React, { Component } from 'react';
import ViewportList from "react-viewport-list";
import { ContractFactory, ethers } from "ethers";
import * as IPFS from 'ipfs-core';
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Chart from 'react-apexcharts';

import "./Post.css";
import Popup from "../components/Popup.js";
import { DataConsumer } from '../DataContext';
import Post_ABI from "../Post_ABI.json";
import Post_ByteCode from "../Post_ByteCode.json";


const ContractType = {
  ORIGINAL: 0,
  RESHARE: 1,
  REMIX: 2
}

const ContentType = {
  TEXT: 0,
  IMAGE: 1
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      triggerResharePostPopup: false,
      triggerRemixPostPopup: false,
      triggerNewPostPopup: false,
      triggerViewPostPopup: false,
      triggerDetailPostPopup: false,

      currentItem: '',
      id: 0,
      contractType: '',
      addressOfPoster: '',
      originalPostAddress: '',
      contentType: ContentType.TEXT,
      hashOfContent: '',
      content: '',
      payees: [],
      shares: [],
      royaltyMultiplier: '',
    }

    this.ref = React.createRef(null);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //Creates a Toast message at the top of the screen
  createToastMessage(text, autoClose) {
    toast(text, {
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    })
  }

  //Handles the changes in the form element of the popups
  handleChange(event) {
    const target = event.target;
    const name = target.name;

    let value;
    switch (target.type) {
      case 'textarea':
        value = target.value;
        break;
      case 'select-one':
        value = target.value;
        break;
      default:
        break;
    }

    this.setState({
      [name]: value
    });
  }

  //Handles the submittions of the form element of the popups
  async handleSubmit(event, state, dispatch, type) {
    this.createToastMessage("The post is being created, please wait...", 3000);
    let _hashOfContent = await this.saveTextToIPFS(this.state.content);

    this.deployNewPostContract(
      state,
      dispatch,
      type,
      state.posts.length,
      this.state.contractType,
      this.state.originalPostAddress,
      this.state.contentType,
      _hashOfContent.cid.toString(),
      this.state.payees,
      this.state.shares,
      this.state.royaltyMultiplier
    );
    event.preventDefault();
  }

  //Saves the text to the IPFS network and returns a hash of the content
  async saveTextToIPFS(text) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let textAdded = await node.add(text);
    console.log(
      "CID of Added text:", textAdded.cid.toString(),
      "\nUrl is: ipfs.io/ipfs/" + textAdded.cid.toString());

    return textAdded;
  }

  //Retrieves the data of the IPFS network using the given hash from the saveTextToIPFS()
  async retrieveDataFromIPFS(hash) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let asyncitr = node.cat(hash);
    const decoder = new TextDecoder();
    let dataReceived = '';

    // decodeImageFromBuffer(asyncitr);

    for await (const itr of asyncitr) {
      dataReceived += decoder.decode(itr, { stream: true })
      console.log("Data received: " + dataReceived);
    }
    return dataReceived;
  }

  //Deploys a new Post contract to the blockchain and adds it to to posts list
  async deployNewPostContract(state, dispatch, type,
    id,
    contractType,
    originalPostAddress,
    contentType,
    hashOfContent,
    payees,
    shares,
    royaltyMultiplier
  ) {
    try {
      const factory = new ContractFactory(Post_ABI, Post_ByteCode, state.signer);
      if (!payees.includes("0xC4B655ceDAF73C1158751706d2326F0B3A698965")) {
        payees.push("0xC4B655ceDAF73C1158751706d2326F0B3A698965");
      }
      const contract = await factory.deploy(
        id,
        contractType,
        originalPostAddress,
        contentType,
        hashOfContent,
        payees,
        shares,
        royaltyMultiplier
      );
      console.log("Address of deployed contract: " + contract.address);

      dispatch({ type: 'addPost', value: contract.address });
      dispatch({ type: 'addPostData', value: this.state.content });
    } catch (err) {
      console.error(err);
      switch (type) {
        case ContractType.RESHARE:
          this.setState({ triggerResharePostPopup: true });
          break;
        case ContractType.REMIX:
          this.setState({ triggerRemixPostPopup: true });
          break;
        case ContractType.ORIGINAL:
          this.setState({ triggerNewPostPopup: true });
          break;
        default: break;
      }
      this.createToastMessage("To submit the post you need to accept the transaction.", 5000);
    }
  }

  async getPayees(state, indexOfContract) {
    try {
      let payees = await state.posts[indexOfContract].getAllPayees();
      return payees;
    } catch (err) {
      console.error(err);
    }
  }

  async getShares(state, indexOfContract) {
    try {
      let shares = await state.posts[indexOfContract].getAllShares();
      return shares;
    } catch (err) {
      console.error(err);
    }
  }

  async payoutUser(state, indexOfContract) {
    try {
      await state.posts[indexOfContract].payoutUser();
    } catch (err) {
      console.error(err);
    }
  }

  //Sets all the correct data to create a new Post and opens the NewPostPopup
  createNewPost() {
    this.setState({
      contractType: ContractType.ORIGINAL,
      contentType: ContentType.TEXT,
      originalPostAddress: "0x0000000000000000000000000000000000000000",
      payees: [],
      shares: [],
      royaltyMultiplier: 5,
      content: '',
      triggerNewPostPopup: true
    });
  }

  //Fetches the data of the post it wants to reshare and opens the ResharePostPopup
  async createResharePost(state, item) {
    let contract = new ethers.Contract(item, Post_ABI, state.signer);
    let _addressOfPoster = await contract.addressOfPoster();
    if (_addressOfPoster.toLowerCase() === state.selectedAccount) {
      this.createToastMessage("You can't reshare your own posts", false);
      return;
    }

    this.createToastMessage("The data of the contract is being retrieved, please wait...", 3000);

    let _contentType = await contract.contentType();
    let _originalPostAddress = await contract.originalPost();
    let _payees = await contract.getAllPayees();
    let _shares = await contract.getAllShares();
    let _hashOfContent = await contract.hashOfContent();
    let _content = await this.retrieveDataFromIPFS(_hashOfContent);

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
      triggerResharePostPopup: true
    });
  }

  //Fetches the data of the post it wants to remix and opens the RemixPostPopup
  async createRemixPost(state, item) {
    let contract = new ethers.Contract(item, Post_ABI, state.signer);
    let _addressOfPoster = await contract.addressOfPoster();
    if (_addressOfPoster.toLowerCase() === state.selectedAccount) {
      this.createToastMessage("You can't remix your own posts", 5000);
      return;
    }

    this.createToastMessage("The data of the contract is being retrieved, please wait...", 3000);

    let _contentType = await contract.contentType();
    let _originalPostAddress = await contract.originalPost();
    let _payees = await contract.getAllPayees();
    let _shares = await contract.getAllShares();
    let _hashOfContent = await contract.hashOfContent();
    let _content = await this.retrieveDataFromIPFS(_hashOfContent);

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
      triggerRemixPostPopup: true
    });
  }

  //Let the user pay a certain amount to view the content of the post
  async viewPost(state, item) {
    let contract = new ethers.Contract(item, Post_ABI, state.signer);
    let _addressOfPoster = await contract.addressOfPoster();

    if (_addressOfPoster.toLowerCase() !== state.selectedAccount) {
      try {
        this.createToastMessage("Awaiting transaction...", 3000);

        const transaction = await contract.viewPost({ value: ethers.utils.parseEther("0.00001") });
        await transaction.wait();
      } catch (err) {
        this.createToastMessage("To view the content of the post you need to accept the transaction.", 5000);
        console.error(err);
        return;
      }
    } else {
      this.createToastMessage("You can't view your own posts", 5000);
      return;
    }

    let _contentType = await contract.contentType();
    let _id = await contract.id();
    let _hashOfContent = await contract.hashOfContent();
    let _content = await this.retrieveDataFromIPFS(_hashOfContent);

    this.setState({
      currentItem: item,
      id: _id.toNumber(),
      addressOfPoster: _addressOfPoster,
      contentType: _contentType,
      hashOfContent: _hashOfContent,
      content: _content,
      triggerViewPostPopup: true
    });
  }

  async detailPost(state, item) {
    this.createToastMessage("The data of the contract is being retrieved, please wait...", 3000);

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
    let _content = await this.retrieveDataFromIPFS(_hashOfContent);

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
      triggerDetailPostPopup: true
    });
  }

  resizeHeightOfElement(elem) {
    elem.target.style.height = '1px';
    elem.target.style.height = elem.target.scrollHeight + 'px';
  }

  contractTypeToString(contractType) {
    switch (contractType) {
      case 0:
        return "ORIGINAL";
      case 1:
        return "RESHARE";
      case 2:
        return "REMIX";
      default:
        break;
    }
  }

  contentTypeToString(contentType) {
    switch (contentType) {
      case 0:
        return "TEXT";
      case 1:
        return "IMAGE";
      default:
        break;
    }
  }

  createDataForChart(payees, shares) {
    let amountOfOriginals = 0;
    let amountOfReshares = 0;
    let amountOfRemixes = 0;

    for (let i = 0; i < payees.length; i++) {
      if (shares[i].toNumber() == 5) {
        amountOfOriginals += 5;
      } else if (shares[i].toNumber() == 4) {
        amountOfRemixes += 4;
      } else if (shares[i].toNumber() == 2) {
        amountOfReshares += 2;
      }
    }

    // Alle shares van Original, Resahre en Remix + altijd 20% voor de publisher
    return [amountOfOriginals, amountOfReshares, amountOfRemixes, ((amountOfOriginals + amountOfRemixes + amountOfReshares) * 1.25) - (amountOfOriginals + amountOfRemixes + amountOfReshares)];
  }

  //Renders all the elements of the Post
  render() {
    return (
      <DataConsumer>
        {({ state, dispatch }) => (
          <React.Fragment>
            <div className="main">
              <Box className="button-container">
                <Button className="create" startIcon={<CreatePostIcon />}
                  onClick={() => { this.createNewPost() }}>
                  Create New Post
                </Button>
              </Box>

              {/* <Button variant="contained" onClick={() => { localStorage.setItem("posts", JSON.stringify([])); localStorage.setItem("postData", JSON.stringify([])) }}>
                Clear the localStorage
              </Button> */}
              <div className="scroll-container" ref={this.ref} style={{
                maxHeight: (window.innerHeight / 1.4) + 'px'
              }}>
                <ViewportList viewportRef={this.ref} items={state.posts} itemMinSize={40} margin={8}>
                  {(item) => (
                    <React.Fragment key={state.posts.indexOf(item)}>
                      <div className="post">
                        <div className="container">
                          <h3>
                            Address of Contract: {item}
                          </h3>
                          {state.postData[state.posts.indexOf(item)].substring(0, 225) + "..."}
                          {/* The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymph... */}
                          <br /><br /><br />
                          <u>To view the full content of the post click the "View" icon!</u>
                        </div>
                        <br />
                        <div className="post-buttons">
                          <IconButton className="button" onClick={() => { this.createResharePost(state, item) }}>
                            <ReshareIcon />
                          </IconButton>
                          <IconButton className="button" onClick={() => { this.createRemixPost(state, item) }}>
                            <RemixIcon />
                          </IconButton>
                          <IconButton className="button" onClick={() => { this.viewPost(state, item) }}>
                            <ViewIcon />
                          </IconButton>
                          <IconButton className="button" onClick={() => { this.detailPost(state, item) }}>
                            <DetailIcon />
                          </IconButton>
                        </div>
                      </div>
                    </React.Fragment>
                  )}
                </ViewportList>
              </div>

              <div className="resharePostTemplate">
                <Popup trigger={this.state.triggerResharePostPopup} setTrigger={() => {
                  this.setState({
                    triggerResharePostPopup: false
                  });
                }}>
                  <h2>Reshare Post</h2>
                  <form onSubmit={(event) => {
                    if (this.state.content === '') {
                      this.createToastMessage("Please enter a valid text", 5000);
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch, ContractType.RESHARE);
                    this.setState({ triggerResharePostPopup: false });
                  }}>
                    <div className="textbox-container">
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20, fontWeight: "bold" }}>
                        Address of Poster:<br /><br />
                        Content Type:<br /><br />
                        Content of Post:
                      </p>

                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20 }}>
                        {state.selectedAccount} <br /><br />
                        {this.contentTypeToString(this.state.contentType)}<br /><br />
                        {(() => {
                          //if contentType is TEXT
                          if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                            return (
                              <p className="textbox" style={{
                                height: this.scrollHeight + 'px',
                                maxHeight: window.innerHeight / 2,
                              }}>
                                {this.state.content}
                              </p>
                            )
                          }
                          //if contentType is IMAGE
                          else if (this.state.contentType === '1' || this.state.contentType === ContentType.IMAGE) {
                            return (
                              // render Image selection component here
                              <div>
                              </div>
                            )
                          }
                        })()}
                      </p>
                    </div>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="remixPostTemplate">
                <Popup trigger={this.state.triggerRemixPostPopup} setTrigger={() => {
                  this.setState({
                    triggerRemixPostPopup: false
                  });
                }}>
                  <h2>Remix Post</h2>
                  <form onSubmit={(event) => {
                    if (this.state.content === '') {
                      this.createToastMessage("Please enter a valid text", 5000);
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch, ContractType.REMIX);
                    this.setState({ triggerRemixPostPopup: false });
                  }}>
                    <div className="textbox-container">
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20, fontWeight: "bold" }}>
                        Address of Poster:<br /><br />
                        Content Type:<br /><br />
                        Content of Post:
                      </p>
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20 }}>
                        {state.selectedAccount}<br /><br />
                        <select type="select" name="contentType" value={this.state.contentType} onChange={this.handleChange}>
                          <option value="0">TEXT</option>
                          <option value="1">IMAGE</option>
                        </select><br /><br />
                        {(() => {
                          //if contentType is TEXT
                          if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                            return (
                              <textarea className="textarea" name="content" rows="1" placeholder="Type text here..." style={{
                                height: this.scrollHeight + 'px',
                                maxHeight: window.innerHeight / 2
                              }} onInput={this.resizeHeightOfElement} onSelect={this.resizeHeightOfElement} onChange={this.handleChange}>
                                {this.state.content}
                              </textarea>
                            )
                          }
                          //if contentType is IMAGE
                          else if (this.state.contentType === '1' || this.state.contentType === ContentType.IMAGE) {
                            return (
                              // render Image selection component here
                              <div></div>
                            )
                          }
                        })()}
                      </p>
                    </div>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="newPostTemplate">
                <Popup trigger={this.state.triggerNewPostPopup} setTrigger={() => {
                  this.setState({
                    triggerNewPostPopup: false,
                  });
                }}>
                  <h2>New Post</h2>
                  <form onSubmit={(event) => {
                    if (this.state.content === '') {
                      this.createToastMessage("Please enter a valid text", 5000);
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch, ContractType.ORIGINAL);
                    this.setState({ triggerNewPostPopup: false });
                  }}>
                    <div className="textbox-container">
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20, fontWeight: "bold" }}>
                        Address of Poster:<br /><br />
                        Content Type:<br /><br />
                        Content of Post:<br /><br />
                      </p>
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20 }}>
                        {state.selectedAccount}<br /><br />

                        <select type="select" name="contentType" value={this.state.contentType} onChange={this.handleChange}>
                          <option value="0">TEXT</option>
                          <option value="1">IMAGE</option>
                        </select><br /><br />

                        {(() => {
                          //if contentType is TEXT
                          if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                            return (
                              <textarea className="textarea" name="content" rows="1" placeholder="Type text here..." style={{
                                height: this.scrollHeight + 'px',
                                maxHeight: window.innerHeight / 2
                              }} onInput={this.resizeHeightOfElement} onSelect={this.resizeHeightOfElement} onChange={this.handleChange}>
                                {this.state.content}
                              </textarea>
                            )
                          }
                          //if contentType is IMAGE
                          else if (this.state.contentType === '1' || this.state.contentType === ContentType.IMAGE) {
                            return (
                              // render Image selection component here
                              <div></div>
                            )
                          }
                        })()}
                        <br /><br />
                      </p>
                    </div>
                    <input className="submit-button" type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="viewPostTemplate">
                <Popup trigger={this.state.triggerViewPostPopup} setTrigger={() => {
                  this.setState({
                    triggerViewPostPopup: false,
                  });
                }}>
                  <h2>View Post</h2>
                  <div className="textbox-container">
                    <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20, fontWeight: "bold" }}>
                      Address of Poster:<br /><br />
                      Contract ID:<br /><br />
                      Content of Post:

                    </p>
                    <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20 }}>
                      {this.state.addressOfPoster}<br /><br />
                      {this.state.id}<br /><br />
                      {(() => {
                        //if contentType is TEXT
                        if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                          return (
                            <p className="textbox" style={{
                              height: this.scrollHeight + 'px',
                              maxHeight: window.innerHeight / 2
                            }}>
                              {this.state.content}
                            </p>
                          )
                        }
                        //if contentType is IMAGE
                        else if (this.state.contentType === '1' || this.state.contentType === ContentType.IMAGE) {
                          return (
                            // render Image selection component here
                            <div></div>
                          )
                        }
                      })()}
                    </p>

                  </div>
                </Popup>
              </div>

              <div className="detailTemplate">
                <Popup trigger={this.state.triggerDetailPostPopup} setTrigger={() => {
                  this.setState({
                    triggerDetailPostPopup: false,
                  });
                }}>
                  <h2>Details of the post</h2>
                  <div className="container">
                    <div className="textbox-container">
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20, fontWeight: "bold", width: "35%" }}>
                        Link to the contract:<br />
                        Wallet Address of Poster:<br />
                        Contract ID:<br />
                        Contract Type:<br />
                        ContentType:<br />
                        Original Post:<br />
                        Hash of the content:<br />
                      </p>
                      <p className="textbox" style={{ height: this.scrollHeight + 'px', maxHeight: (window.innerHeight / 2) + 20 }}>
                        <a href={"https://sepolia.etherscan.io/address/" + this.state.currentItem} target="_blank">Click here to visit etherscan!</a><br />
                        {this.state.addressOfPoster}<br />
                        {this.state.id}<br />
                        {this.contractTypeToString(this.state.contractType)}<br />
                        {this.contentTypeToString(this.state.contentType)}<br />
                        {this.state.originalPostAddress}<br />
                        {this.state.hashOfContent}<br />
                      </p>
                    </div>

                    <br />
                    <h3>
                      Pie Chart of Royaltysplit:
                    </h3>
                    <Chart
                      options={{
                        labels: ["Original", "Reshare", "Remix", "Publisher"],
                        colors: ["#bf1f13", "#1391bf", "#41b037", "#8f246b"],
                        legend: {
                          fontSize: "20px",
                          fontFamily: "PT Mono",
                          fontWeight: 400,
                          labels: {
                            colors: ["#FFFFFF"]
                          }
                        }
                      }}
                      series={this.createDataForChart(this.state.payees, this.state.shares)}
                      type="pie"
                      width="500"
                    />
                  </div>
                </Popup>
              </div>

            </div>
          </React.Fragment >
        )
        }
      </DataConsumer>
    )
  }
}
