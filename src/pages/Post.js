import { faker } from "@faker-js/faker";
import { Button } from "@material-ui/core";
import React, { Component } from 'react';
import ViewportList from "react-viewport-list";
import Popup from "../components/Popup.js"
import { DataConsumer } from '../DataContext'


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
      items: new Array(5).fill().map((value, index) => ({
        id: index,
        name: faker.name.firstName(5),
        body: faker.lorem.paragraph(8)
      })),
      triggerResharePostPopup: false,
      triggerRemixPostPopup: false,
      triggerNewPostPopup: false,
      triggerViewPostPopup: false,

      currentItem: '',
      contractType: '',
      originalPostAddress: '',
      contentType: ContentType.TEXT,
      hashOfContent: '',
      content: '',
      payees: [],
      shares: [],
      royatyMultiplier: ''
    }

    this.ref = React.createRef(null);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;

    let value;
    console.log(target.type);
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

  handleSubmit(event) {
    //TODO: Implement the creating of a contract here
    // let _hashOfContent = IPFS.saveTextToIPFS(this.state.content);
    // this.setState({hashOfContent: _hashOfContent});

    // let contract = deployNewPostContract(
    //   this.state.contractType,
    //   this.state.originalPostAddress,
    //   this.state.contentType,
    //   this.state.hashOfContent,
    //   this.state.payees,
    //   this.state.shares,
    //   this.state.royatyMultiplier
    //   );

    let _items = this.state.items;

    _items.push({
      id: _items.length,
      name: faker.name.firstName(5),
      body: this.state.content
    });

    this.setState({
      items: _items,
      content: ''
    });
    event.preventDefault();
  }

  createNewPost() {
    this.setState({
      contractType: ContractType.ORIGINAL,
      contentType: ContentType.TEXT,
      originalPostAddress: "0x0000000000000000000000000000000000000000",
      payees: [],
      shares: [],
      royatyMultiplier: 5,
      content: '',
      triggerNewPostPopup: true
    });
  }

  createResharePost(index) {
    // let contract = this.state.contracts[index];
    this.setState({
      currentItem: this.state.items[index],
      contractType: ContractType.RESHARE,
      contentType: ContentType.TEXT,
      // originalPostAddress: contract.originalPost,
      // payees: contract.getPayees(),
      // shares: contract.getShares(),
      royatyMultiplier: 2,
      content: this.state.items[index].body,
      triggerResharePostPopup: true
    });
  }

  createRemixPost(index) {
    // let contract = this.state.contracts[index];
    this.setState({
      currentItem: this.state.items[index],
      contractType: ContractType.REMIX,
      // contentType: contract.contentType,
      // originalPostAddress: contract.originalPost,
      // payees: contract.getPayees(),
      // shares: contract.getShares(),
      royatyMultiplier: 4,
      content: this.state.items[index].body,
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
                <ViewportList viewportRef={this.ref} items={this.state.items} itemMinSize={40} margin={8}>
                  {(item) => (
                    <React.Fragment key={item.id}>
                      <div className="post" style={{
                        borderStyle: "groove",
                        maxWidth: window.innerWidth / 1.1,
                        maxHeight: window.innerHeight / 3,
                      }}>
                        <h3>
                          {item.name} - {item.id}
                        </h3>
                        <div style={{
                          maxWidth: window.innerWidth / 1.1,
                          maxHeight: window.innerHeight / 5,
                          overflowY: "auto",
                        }}>
                          <p>{item.body}</p>
                        </div>
                        <br />
                        <Button variant="contained" onClick={() => { this.createResharePost(item.id) }}> Reshare</Button>
                        <Button variant="contained" onClick={() => { this.createRemixPost(item.id) }}> Remix</Button>
                        <Button variant="contained" onClick={() => { this.viewPost(item) }}> View</Button>
                      </div>
                    </React.Fragment>
                  )}
                </ViewportList>
              </div>

              <Button variant="contained" onClick={() => { this.createNewPost() }}>
                Create new Post
              </Button>

              <p>{this.state.items.length}</p>

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
                    this.handleSubmit(event);
                    this.setState({ triggerResharePostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      {/* <p>{this.state.accounts[0]}</p> */}
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
                        {this.state.content}
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
                    this.handleSubmit(event);
                    this.setState({ triggerRemixPostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      {/* <p>{this.state.accounts[0]}</p> */}
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
                    this.handleSubmit(event);
                    this.setState({ triggerNewPostPopup: false });
                  }}>
                    <label>
                      Address of Poster:
                      {/* <p>{this.state.accounts[0]}</p> */}
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
