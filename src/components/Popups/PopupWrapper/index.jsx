import React from "react";
import "./index.css";
import PopupWrapperLayout from "../../Layout";
import NewPostPopup from "../NewPostPopup";
import ResharePopup from "../ResharePopup";
import RemixPopup from "../RemixPopup";
import ViewPopup from "../ViewPopup";
import DetailsPopup from "../DetailsPopup";
import { PopupState } from "../../../utils/enums";
import { createToastMessage } from "../../../utils/toast";
import { ContentType, deployNewPostContract } from "../../../utils/contract";
import { saveTextToIPFS, saveImageToIPFS } from "../../../utils/ipfs";

//Handles the changes in the form element of the popups
function handleChange(event) {
  const target = event.target;
  const name = target.name;

  let value;
  switch (target.type) {
    case "textarea":
      value = target.value;
      break;
    case "select-one":
      value = target.value;
      break;
    case "file":
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          this.setState({ content: reader.result });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
      break;
    default:
      break;
  }

  this.setState({
    [name]: value,
  });
}

//Handles the submittions of the form element of the popups
async function handleSubmit(event, state, dispatch, type) {
  createToastMessage("The post is being created, please wait...", 3000);

  let _hashOfContent;
  if (
    this.state.contentType === "0" ||
    this.state.contentType === ContentType.TEXT
  ) {
    _hashOfContent = await saveTextToIPFS(this.state.content);
  } else if (
    this.state.contentType === "1" ||
    this.state.contentType === ContentType.IMAGE
  ) {
    _hashOfContent = await saveImageToIPFS(this.state.content);
  }

  deployNewPostContract(
    state,
    dispatch,
    type,
    state.posts?.length || 0,
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

function PopupWrapper(props) {
  let state = props.state;
  let dispatch = props.dispatch;
  let popupData = props.popupData;
  let currentState = props.currentState;

  switch (currentState) {
    case PopupState.CLOSED:
      return "";
    case PopupState.NEWPOST:
      return (
        <PopupWrapperLayout onClick={props.onClick}>
          <NewPostPopup
            state={state}
            dispatch={dispatch}
            popupData={popupData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </PopupWrapperLayout>
      );
    case PopupState.RESHARING:
      return (
        <PopupWrapperLayout onClick={props.onClick}>
          <ResharePopup
            state={state}
            dispatch={dispatch}
            popupData={popupData}
            handleChange={handleChange.bind(this)}
            handleSubmit={handleSubmit.bind(this)}
          />
        </PopupWrapperLayout>
      );
    case PopupState.REMIXING:
      return (
        <PopupWrapperLayout onClick={props.onClick}>
          <RemixPopup
            state={state}
            dispatch={dispatch}
            popupData={popupData}
            handleChange={handleChange.bind(this)}
            handleSubmit={handleSubmit.bind(this)}
          />
        </PopupWrapperLayout>
      );
    case PopupState.VIEWING:
      return (
        <PopupWrapperLayout onClick={props.onClick}>
          <ViewPopup
            state={state}
            dispatch={dispatch}
            popupData={popupData}
            handleChange={handleChange.bind(this)}
            handleSubmit={handleSubmit.bind(this)}
          />
        </PopupWrapperLayout>
      );
    case PopupState.DETAILS:
      return (
        <PopupWrapperLayout onClick={props.onClick}>
          <DetailsPopup
            state={state}
            dispatch={dispatch}
            popupData={popupData}
            handleChange={handleChange.bind(this)}
            handleSubmit={handleSubmit.bind(this)}
          />
        </PopupWrapperLayout>
      );
  }
}

export default PopupWrapper;
