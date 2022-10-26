import { Button } from "@material-ui/core";
import React, { Component } from 'react';
import ViewportList from "react-viewport-list";
import Popup from "../components/Popup.js"
import { DataConsumer } from '../DataContext'
import Post_ABI from "../Post_ABI.json"
import Post_ByteCode from "../Post_ByteCode.json"
import { ContractFactory, ethers } from "ethers";
import * as IPFS from 'ipfs-core';



const ContractType = {
  ORIGINAL: 0,
  RESHARE: 1,
  REMIX: 2
}

const ContentType = {
  TEXT: 0,
  IMAGE: 1
}

export default class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      triggerResharePostPopup: false,
      triggerRemixPostPopup: false,
      triggerNewPostPopup: false,
      triggerViewPostPopup: false,

      currentItem: '',
      contractType: '',
      originalPostAddress: '',
      contentType: ContentType.TEXT,
      content: '',
      payees: [],
      shares: [],
      royaltyMultiplier: ''
    }

    this.ref = React.createRef(null);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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

  async handleSubmit(event, state, dispatch) {
    let _hashOfContent = await this.saveTextToIPFS(this.state.content);

    this.deployNewPostContract(
      state,
      dispatch,
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

  async saveTextToIPFS(text) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let textAdded = await node.add(text);
    console.log(
      "CID of Added text:", textAdded.cid.toString(),
      "\nUrl is: ipfs.io/ipfs/" + textAdded.cid.toString());

    return textAdded;
  }

  async retrieveDataFromIPFS(hash) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let asyncitr = node.cat(hash);
    const decoder = new TextDecoder();
    let dataReceived = '';

    // decodeImageFromBuffer(asyncitr);

    for await (const itr of asyncitr) {
      dataReceived += decoder.decode(itr, { stream: true })
      console.log(dataReceived);
    }
    return dataReceived;
  }

  async deployNewPostContract(state, dispatch,
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
      console.log(contract.address);

      dispatch({ type: 'addPost', value: contract.address });
    } catch (err) {
      console.error(err);
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

  // async getTestPayees(state, indexOfContract) {
  //   try {
  //     let testContract = await ethers.getContract(state.posts[indexOfContract], Post_ABI, state.signer);
  //     let payees = await testContract.getAllPayees();
  //     return payees;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  async getShares(state, indexOfContract) {
    try {
      let shares = await state.posts[indexOfContract].getAllShares();
      return shares;
    } catch (err) {
      console.error(err);
    }
  }

  async viewPost(state, indexOfContract) {
    try {
      const transaction = await state.posts[indexOfContract].viewPost({ value: ethers.utils.parseEther("1.0") });
      await transaction.wait();
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

  async createResharePost(state, item) {
    let contract = new ethers.Contract(item, Post_ABI, state.signer);
    let _addressOfPoster = await contract.addressOfPoster();
    if (_addressOfPoster.toLowerCase() === state.selectedAccount) {
      alert("You can't reshare your own posts");
      return;
    }

    let _contentType = await contract.contentType();
    let _originalPostAddress = await contract.originalPost();
    let _payees = await contract.getAllPayees();
    let _shares = await contract.getAllShares();
    let _content = await contract.hashOfContent();

    this.setState({
      currentItem: item,
      contractType: ContractType.RESHARE,
      contentType: _contentType,
      originalPostAddress: _originalPostAddress,
      payees: _payees,
      shares: _shares,
      royaltyMultiplier: 2,
      content: _content,
      triggerResharePostPopup: true
    });
  }

  async createRemixPost(state, item) {
    let contract = new ethers.Contract(item, Post_ABI, state.signer);
    let _addressOfPoster = await contract.addressOfPoster();
    if (_addressOfPoster.toLowerCase() === state.selectedAccount) {
      alert("You can't remix your own posts");
      return;
    }

    let _contentType = await contract.contentType();
    let _originalPostAddress = await contract.originalPost();
    let _payees = await contract.getAllPayees();
    let _shares = await contract.getAllShares();
    let _content = await contract.hashOfContent();

    this.setState({
      currentItem: item,
      contractType: ContractType.REMIX,
      contentType: _contentType,
      originalPostAddress: _originalPostAddress,
      payees: _payees,
      shares: _shares,
      royaltyMultiplier: 4,
      content: _content,
      triggerRemixPostPopup: true
    });
  }

  viewPost(item) {
    this.setState({
      currentItem: item,
      triggerViewPostPopup: true
    });
  }

  resizeHeightOfElement(elem) {
    elem.target.style.height = '1px';
    elem.target.style.height = elem.target.scrollHeight + 'px';
  }

  render() {
    return (
      <DataConsumer>
        {({ state, dispatch }) => (
          <React.Fragment>
            <div className="main">
              <div className="scroll-container" ref={this.ref} style={{
                marginLeft: "3%",
                marginRight: "3%",
                marginTop: "1%",
                marginBottom: "1%",
                overflowY: "auto",
                maxHeight: (window.innerHeight / 1.4) + 'px',
                borderStyle: "solid",
                borderWidth: "4px",
                padding: "4px"
              }}>
                <ViewportList viewportRef={this.ref} items={state.posts} itemMinSize={40} margin={8}>
                  {(item) => (
                    <React.Fragment key={item.id}>
                      <div className="post" style={{
                        borderStyle: "groove",
                        maxWidth: window.innerWidth / 1,
                        maxHeight: window.innerHeight / 3,
                      }}>
                        <h3>
                          {item} - {/*{item.id()}*/}
                        </h3>
                        <div style={{
                          maxWidth: window.innerWidth / 1,
                          maxHeight: window.innerHeight / 5,
                          overflowY: "auto",
                        }}>
                          {/* <p>{item.hashOfContent()}</p>
                          <p>{item.contractType()}</p>
                          <p>{item.contentType()}</p>
                          <p>{item.payees.length}</p>
                          <p>{item.shares.payees.length}</p>
                          <p>{item.royaltyMultiplier()}</p> */}
                        </div>
                        <br />
                        <Button variant="contained" onClick={() => { this.createResharePost(state, item) }}> Reshare</Button>
                        <Button variant="contained" onClick={() => { this.createRemixPost(state, item) }}> Remix</Button>
                        <Button variant="contained" onClick={() => { this.viewPost(item) }}> View</Button>
                      </div>
                    </React.Fragment>
                  )}
                </ViewportList>
              </div>

              <Button variant="contained" onClick={() => { this.createNewPost() }}>
                Create new Post
              </Button>

              <Button variant="contained" onClick={() => { console.log(JSON.stringify(localStorage.posts)) }}>
                log de localStorage.posts
              </Button>
              <Button variant="contained" onClick={() => { localStorage.setItem("posts", JSON.stringify([])) }}>
                Clear the localStorage
              </Button>
              {/* <Button variant="contained" onClick={() => { console.log(this.getTestPayees(state, 0)) }}>
                GetPayees
              </Button> */}

              <p>{state.posts.length}</p>

              <div className="resharePostTemplate">
                <Popup trigger={this.state.triggerResharePostPopup} setTrigger={() => {
                  this.setState({
                    triggerResharePostPopup: false
                  });
                }}>
                  <h2>Reshare Post</h2>
                  <form onSubmit={(event) => {
                    if (this.state.content === '') {
                      alert("Please enter a valid text");
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch);
                    this.setState({ triggerResharePostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      <p>{state.selectedAccount}</p>
                      <br />
                      Content of Post:
                      <p style={{
                        height: this.scrollHeight + 'px',
                        maxHeight: window.innerHeight / 2,
                        overflowY: "auto",
                        borderStyle: "solid",
                        borderColor: "grey",
                        borderWidth: '2px'
                      }}>
                        You made it all the way to here!
                        {/* {this.retrieveDataFromIPFS(this.state.content)}   */}
                      </p>
                      <br />
                    </label>
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
                      alert("Please enter a valid text");
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch);
                    this.setState({ triggerRemixPostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      <p>{state.selectedAccount}</p>
                      <br />
                      Content Type:
                      <select type="select" name="contentType" value={this.state.contentType} onChange={this.handleChange}>
                        <option value="0">TEXT</option>
                        <option value="1">IMAGE</option>
                      </select>
                      <br />
                      Content of Post:
                      {(() => {
                        //if contentType is TEXT
                        if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                          return (
                            <textarea name="content" rows="1" style={{
                              width: '100%',
                              minWidth: '100%',
                              maxWidth: '100%',
                              height: this.scrollHeight + 'px',
                              maxHeight: window.innerHeight / 2,
                              resize: "none"
                            }} onInput={this.resizeHeightOfElement} onSelect={this.resizeHeightOfElement} onChange={this.handleChange}>
                              You made it all the way to here!
                              {/* {this.retrieveDataFromIPFS(this.state.content)} */}
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

                      <br />
                    </label>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="newPostTemplate">
                <Popup trigger={this.state.triggerNewPostPopup} setTrigger={() => {
                  this.setState({
                    triggerNewPostPopup: false,
                    content: ''
                  });
                }}>
                  <h2>New Post</h2>
                  <form onSubmit={(event) => {
                    if (this.state.content === '') {
                      alert("Please enter a valid text");
                      event.preventDefault();
                      return;
                    }
                    this.handleSubmit(event, state, dispatch);
                    this.setState({ triggerNewPostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      <p>{state.selectedAccount}</p>
                      <br />
                      Content Type:
                      <select type="select" name="contentType" value={this.state.contentType} onChange={this.handleChange}>
                        <option selected value="0">TEXT</option>
                        <option value="1">IMAGE</option>
                      </select>
                      <br />
                      Content of Post:
                      {(() => {
                        //if contentType is TEXT
                        if (this.state.contentType === '0' || this.state.contentType === ContentType.TEXT) {
                          return (
                            <textarea name="content" rows="1" style={{
                              width: '100%',
                              minWidth: '100%',
                              maxWidth: '100%',
                              height: this.scrollHeight + 'px',
                              maxHeight: window.innerHeight / 2,
                              resize: "none"
                            }} onInput={this.resizeHeightOfElement} onSelect={this.resizeHeightOfElement} onChange={this.handleChange}>
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
                    </label>
                    <input type="submit" value="Submit Post" />
                  </form>
                </Popup>
              </div>

              <div className="viewPostTemplate">
                <Popup trigger={this.state.triggerViewPostPopup} setTrigger={() => {
                  this.setState({
                    triggerViewPostPopup: false,
                    content: ''
                  });
                }}>
                  <h2>View Post</h2>
                  <h3>
                    {this.state.currentItem.name} - {this.state.currentItem.id}
                  </h3>
                  <div style={{
                    maxHeight: window.innerHeight / 2,
                    overflowY: "auto"
                  }}>
                    <p>{this.state.currentItem.body}</p>
                  </div>
                </Popup>
              </div>
            </div>
          </React.Fragment >
        )}
      </DataConsumer>
    )
  }
}
