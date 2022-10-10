import { faker } from "@faker-js/faker";
import { Button } from "@material-ui/core";
import React, { Component } from 'react';
import ViewportList from "react-viewport-list";
import Popup from "../components/Popup.js"


const ContractType = {
  ORIGINAL: 0,
  RESHARE: 1,
  REMIX: 2
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
      content: ''
    }

    this.ref = React.createRef(null);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ content: event.target.value });
  }

  handleSubmit(event) {
    //TODO: Implement the creating of a contract here
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
    this.setState({ triggerNewPostPopup: true });
  }

  createResharePost(index) {
    this.setState({
      currentItem: this.state.items[index],
      content: this.state.items[index].body,
      triggerResharePostPopup: true
    });
  }

  createRemixPost(index) {
    this.setState({
      currentItem: this.state.items[index],
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

  render() {
    return (
      <React.Fragment>
        <div className="main">
          <div className="scroll-container" ref={this.ref}>
            <ViewportList viewportRef={this.ref} items={this.state.items} itemMinSize={40} margin={8}>
              {(item) => (
                <React.Fragment key={item.id}>
                  <div className="post">
                    <h3>
                      {item.name} - {item.id}
                    </h3>
                    <p>{item.body}</p>

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
              this.setState({ triggerResharePostPopup: false });
            }}>
              <h2>Reshare Post</h2>
              <form onSubmit={(event) => {
                if(this.state.content == ''){
                  alert("Please enter a valid text");
                  event.preventDefault();
                  return;
                }
                this.handleSubmit(event);
                this.setState({ triggerResharePostPopup: false });
              }}>
                <label>
                  Content:
                  <input type="text" value={this.state.content} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit Post" />
              </form>

              <p>Content of post {this.state.currentItem.id}:</p>
              {this.state.currentItem.body}
            </Popup>
          </div>
          <div className="remixPostTemplate">
            <Popup trigger={this.state.triggerRemixPostPopup} setTrigger={() => {
              this.setState({ triggerRemixPostPopup: false });
            }}>
              <h2>Remix Post</h2>
              <form onSubmit={(event) => {
                if(this.state.content == ''){
                  alert("Please enter a valid text");
                  event.preventDefault();
                  return;
                }
                this.handleSubmit(event);
                this.setState({ triggerRemixPostPopup: false });
              }}>
                <label>
                  Content:
                  <input type="text" value={this.state.content} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit Post" />
              </form>

              <p>Content of post {this.state.currentItem.id}:</p>
              {this.state.currentItem.body}
            </Popup>
          </div>
          <div className="newPostTemplate">
            <Popup trigger={this.state.triggerNewPostPopup} setTrigger={() => {
              this.setState({ triggerNewPostPopup: false });
            }}>
              <h2>New Post</h2>
              <form onSubmit={(event) => {
                if(this.state.content == ''){
                  alert("Please enter a valid text");
                  event.preventDefault();
                  return;
                }
                this.handleSubmit(event);
                this.setState({ triggerNewPostPopup: false });
              }}>
                <label>
                  Content:
                  <input type="text" value={this.state.content} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit Post" />
              </form>

              <p>This is some filler text...</p>
            </Popup>
          </div>
          <div className="viewPostTemplate">
            <Popup trigger={this.state.triggerViewPostPopup} setTrigger={() => {
              this.setState({ triggerViewPostPopup: false });
            }}>
              <h2>View Post</h2>
              <h3>
                {this.state.currentItem.name} - {this.state.currentItem.id}
              </h3>
              <p>{this.state.currentItem.body}</p>
            </Popup>
          </div>
        </div> 
      </React.Fragment >
    )
  }
}
