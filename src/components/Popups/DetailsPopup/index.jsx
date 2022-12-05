import React from "react";
import "./index.css";
import { contractTypeToString, contentTypeToString } from "../../../utils/contract";
import RoyaltieSplitDiagram from "../../RoyaltieSplitDiagram";

function DetailsPopup() {
  return (
    <React.Fragment>
      <div className="detailTemplate"> 
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
      </div>
    </React.Fragment>
  );
}

export default DetailsPopup;
