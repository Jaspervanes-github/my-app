import React from "react";
import { ContentType, deployNewPostContract } from "../../../utils/contract";
import { PopupState } from "../../../utils/enums";
import { saveImageToIPFS, saveTextToIPFS } from "../../../utils/ipfs";
import { createToastMessage } from "../../../utils/toast";
import PopupWrapperLayout from "../../Layout";
import DetailsPopup from "../DetailsPopup";
import NewPostPopup from "../NewPostPopup";
import RemixPopup from "../RemixPopup";
import ResharePopup from "../ResharePopup";
import ViewPopup from "../ViewPopup";
import "./index.css";

//Handles the changes in the form element of the popups
function handleChange(event, setPopupData, popupData) {
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
          setPopupData({...popupData, content: reader.result});
          // this.setState({ content: reader.result });
        }
      };
      reader.readAsDataURL(event.target.files[0]);
      break;
    default:
      break;
  }
setPopupData({...popupData, [name]: value});
  // this.setState({
  //   [name]: value,
  // });
}

//Handles the submittions of the form element of the popups
async function handleSubmit(event, type, setCurrentPopup, popupData, state, dispatch) {
  createToastMessage("The post is being created, please wait...", 3000);

  let _hashOfContent;
  if (
    popupData.contentType === "0" ||
    popupData.contentType === ContentType.TEXT
  ) {
    _hashOfContent = await saveTextToIPFS(popupData.content);
  } else if (
    popupData.contentType === "1" ||
    popupData.contentType === ContentType.IMAGE
  ) {
    _hashOfContent = await saveImageToIPFS(popupData.content);
  }

  deployNewPostContract(
    type,
    state.posts?.length || 0,
    popupData.contractType,
    popupData.originalPostAddress,
    popupData.contentType,
    _hashOfContent.cid.toString(),
    popupData.payees,
    popupData.shares,
    popupData.royaltyMultiplier,
    setCurrentPopup,
    popupData,
    state,
    dispatch
  );
  event.preventDefault();
}

function PopupWrapper(props) {
  let popupData = props.popupData;
  let currentPopup = props.currentPopup;

  switch (currentPopup) {
    case PopupState.CLOSED:
      return "";
    case PopupState.NEWPOST:
      return (
        <PopupWrapperLayout setPopupClosed={props.setPopupClosed}>
          <NewPostPopup
            setPopupData={props.setPopupData}
            popupData={popupData}
            setCurrentPopup={props.setCurrentPopup}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </PopupWrapperLayout>
      );
    case PopupState.RESHARING:
      return (
        <PopupWrapperLayout setPopupClosed={props.setPopupClosed}>
          <ResharePopup
            setPopupData={props.setPopupData}
            popupData={popupData}
            setCurrentPopup={props.setCurrentPopup}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </PopupWrapperLayout>
      );
    case PopupState.REMIXING:
      return (
        <PopupWrapperLayout setPopupClosed={props.setPopupClosed}>
          <RemixPopup
            setPopupData={props.setPopupData}
            popupData={popupData}
            setCurrentPopup={props.setCurrentPopup}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </PopupWrapperLayout>
      );
    case PopupState.VIEWING:
      return (
        <PopupWrapperLayout setPopupClosed={props.setPopupClosed}>
          <ViewPopup
            popupData={popupData}
            setCurrentPopup={props.setCurrentPopup}
          />
        </PopupWrapperLayout>
      );
    case PopupState.DETAILS:
      return (
        <PopupWrapperLayout setPopupClosed={props.setPopupClosed}>
          <DetailsPopup
            popupData={popupData}
            setCurrentPopup={props.setCurrentPopup}
          />
        </PopupWrapperLayout>
      );
  }
}

export default PopupWrapper;
