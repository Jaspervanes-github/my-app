import React from 'react'
import "./ListItem.css"
import { Button } from "@material-ui/core"
import Popup from "./Popup.js"

export default function ListItem(props) {
    return (
        <React.Fragment>
                  <div key={props.item.id} className="post">
                    <h3>
                      {item.name} - {item.id}
                    </h3>
                    <p>{item.body}</p>
                    <Button variant="contained" onClick={() => { this.createResharePost(item.id) }}> Reshare</Button>
                    <Button variant="contained" onClick={() => { this.createRemixPost(item.id) }}> Remix</Button>
                    <Button variant="contained" onClick={() => { this.viewPost(item) }}> View</Button>

                    <Popup trigger={this.state.items[item.id].triggerPopup} setTrigger={() => {
                      this.setItemTriggerPopup(item.id, false);
                    }}>
                      <h2>Remix Post</h2>
                      <form onSubmit={(event) => {
                        this.handleSubmit(event);
                        this.setItemTriggerPopup(item.id, false);
                      }}>
                        <label>
                          Content:
                          <input type="text" value={this.state.content} onChange={this.handleChange} />
                        </label>
                        <input type="submit" value="Submit Post" />
                      </form>

                      <p>Content of post {item.id}:</p>
                      {this.state.items[item.id].body}
                    </Popup>
                  </div>
                </React.Fragment>
    )
}
