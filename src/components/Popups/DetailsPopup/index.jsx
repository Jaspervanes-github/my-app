import React from "react";
import { contentTypeToString, contractTypeToString } from "../../../utils/contract";
import RoyaltieSplitDiagram from "../../RoyaltieSplitDiagram";
import "./index.css";

/**
 * This component displays the detail data of a post. This data consists of a link to the contract, 
 * wallet adress of poster, contract ID, contract type, content type, post address, hash of content and a pie diagram of the royaltysplit.
 * @param {*} props Contains the passed variables.
 * @returns The render components of the DetaislPopup component.
 */
function DetailsPopup(props) {
  let popupData = props.popupData;
  return (
    <React.Fragment>
      <div className="detailTemplate"> 
          <h2>Details of the post</h2>
          <div className="container">
            <div className="textbox-container">
              <p
                className="textbox"
                style={{
                  height:  125 + "px",
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
                  height: 125 + "px",
                  maxHeight: window.innerHeight / 2 + 20,
                }}
              >
                <a
                  href={
                    "https://sepolia.etherscan.io/address/" +
                    popupData.currentItem
                  }
                  target="_blank"
                >
                  Click here to visit etherscan!
                </a>
                <br />
                {popupData.addressOfPoster}
                <br />
                {popupData.id}
                <br />
                {contractTypeToString(popupData.contractType)}
                <br />
                {contentTypeToString(popupData.contentType)}
                <br />
                {popupData.originalPostAddress}
                <br />
                {popupData.hashOfContent}
                <br />
              </p>
            </div>

            <br />
            <RoyaltieSplitDiagram
              payees={popupData.payees}
              shares={popupData.shares}
            />
          </div>
      </div>
    </React.Fragment>
  );
}

export default DetailsPopup;
