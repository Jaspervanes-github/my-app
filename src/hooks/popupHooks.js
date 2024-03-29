import { ethers } from "ethers";
import Post_ABI from "../assets/metadata/Post_ABI.json";
import { ContentType, ContractType } from "../utils/contract";
import { PopupState } from "../utils/enums";
import { retrieveDataFromIPFS } from "../utils/ipfs";
import { createToastMessage } from "../utils/toast";

/**
 * This function handles the switching of the PopupStates. Everytime this variable changes it sets the popupData to the correct values depending on the PopupState.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setIsLoading Function to set the isLoading variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} currentPopup This varaiable holds all the data of the current post.
 * @param {*} item This variable holds the contractAddress of the selected post.
 * @param {*} state Variable in which the data of the application gets stored globally.
 */
function setData(setPopupData, setIsLoading, setCurrentPopup, currentPopup, item, state) {

    switch (currentPopup) {
        case PopupState.CLOSED:
            break;
        case PopupState.NEWPOST:
            setNewPostPopup(setPopupData, setCurrentPopup);
            break;
        case PopupState.RESHARING:
            setResharePopup(setPopupData, setIsLoading, setCurrentPopup, item, state);
            break;
        case PopupState.REMIXING:
            setRemixPopup(setPopupData, setIsLoading, setCurrentPopup, item, state);
            break;
        case PopupState.VIEWING:
            setViewPopup(setPopupData, setIsLoading, setCurrentPopup, item, state);
            break;
        case PopupState.DETAILS:
            setDetailsPopup(setPopupData, setIsLoading, setCurrentPopup, item, state);
            break;
        default:
            break;
    }
}

/**
 * This function sets the popupData to the correct values of the NewPostPopup.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 */
function setNewPostPopup(setPopupData, setCurrentPopup) {
    setPopupData({
        originalPostAddress: "0x0000000000000000000000000000000000000000",
        contractType: ContractType.ORIGINAL,
        contentType: ContentType.TEXT,
        payees: [],
        shares: [],
        royaltyMultiplier: 5,
        content: ""
    });
    setCurrentPopup(PopupState.NEWPOST);
}

/**
 * This function retrieves the data of the selected post contract and sets the popupData to the correct values of the ResharePopup.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setIsLoading Function to set the isLoading variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} item This variable holds the contractAddress of the selected post.
 * @param {*} state Variable in which the data of the application gets stored globally.
 * @returns 
 */
async function setResharePopup(setPopupData, setIsLoading, setCurrentPopup, item, state) {
    try {
        setIsLoading(true);

        let contract = new ethers.Contract(item, Post_ABI, state.signer);
        let _payees = await contract.getAllPayees();
        let isAlreadyOwner = false;

        for (let i = 0; i < _payees.length; i++) {
            if (_payees[i].toUpperCase() === state.selectedAccount.toUpperCase()) {
                isAlreadyOwner = true;
                break;
            }
        }
        if (isAlreadyOwner) {
            createToastMessage("You can't reshare your own posts", false);
            setIsLoading(false);
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
        // let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);
        let _content = state.postData[state.posts.indexOf(item)];


        setPopupData({
            currentItem: item,
            originalPostAddress: _originalPostAddress,
            contractType: ContractType.RESHARE,
            contentType: _contentType,
            payees: _payees,
            shares: _shares,
            royaltyMultiplier: 2,
            content: _content,
            hashOfContent: _hashOfContent
        });
        setCurrentPopup(PopupState.RESHARING);
    } catch (err) {
        console.error(err);
        setCurrentPopup(PopupState.CLOSED);
        setIsLoading(false);
    }
    setIsLoading(false);
}

/**
 * This function retrieves the data of the selected post contract and sets the popupData to the correct values of the RemixPopup.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setIsLoading Function to set the isLoading variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} item This variable holds the contractAddress of the selected post.
 * @param {*} state Variable in which the data of the application gets stored globally.
 * @returns 
 */
async function setRemixPopup(setPopupData, setIsLoading, setCurrentPopup, item, state) {
    try {
        setIsLoading(true);

        let contract = new ethers.Contract(item, Post_ABI, state.signer);
        let _payees = await contract.getAllPayees();
        let isAlreadyOwner = false;

        for (let i = 0; i < _payees.length; i++) {
            if (_payees[i].toUpperCase() === state.selectedAccount.toUpperCase()) {
                isAlreadyOwner = true;
                break;
            }
        }
        if (isAlreadyOwner) {
            createToastMessage("You can't reshare your own posts", false);
            setIsLoading(false);
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
        // let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);
        let _content = state.postData[state.posts.indexOf(item)];


        setPopupData({
            currentItem: item,
            originalPostAddress: _originalPostAddress,
            contractType: ContractType.REMIX,
            contentType: _contentType,
            payees: _payees,
            shares: _shares,
            royaltyMultiplier: 4,
            content: _content,
            hashOfContent: _hashOfContent
        })
        setCurrentPopup(PopupState.REMIXING);
    } catch (err) {
        console.error(err);
        setCurrentPopup(PopupState.CLOSED);
        setIsLoading(false);
    }
    setIsLoading(false);
}

/**
 * This function retrieves the data of the selected post contract and sets the popupData to the correct values of the ViewPopup.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setIsLoading Function to set the isLoading variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} item This variable holds the contractAddress of the selected post.
 * @param {*} state Variable in which the data of the application gets stored globally. 
 * @returns 
 */
async function setViewPopup(setPopupData, setIsLoading, setCurrentPopup, item, state) {
    try {
        setIsLoading(true);

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
                setIsLoading(false);
                return;
            }
        } else {
            createToastMessage("You can't view your own posts", 5000);
            setIsLoading(false);
            return;
        }

        let _contentType = await contract.contentType();
        let _id = await contract.id();
        let _hashOfContent = await contract.hashOfContent();
        // let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);
        let _content = state.postData[state.posts.indexOf(item)];


        setPopupData({
            currentItem: item,
            id: _id.toNumber(),
            addressOfPoster: _addressOfPoster,
            contentType: _contentType,
            content: _content,
            hashOfContent: _hashOfContent
        })
        setCurrentPopup(PopupState.VIEWING);
    } catch (err) {
        console.error(err);
        setCurrentPopup(PopupState.CLOSED);
        setIsLoading(false);
    }
    setIsLoading(false);
}

/**
 * This function retrieves the data of the selected post contract and sets the popupData to the correct values of the DetailsPopup.
 * @param {*} setPopupData Function to set the popupData variable.
 * @param {*} setIsLoading Function to set the isLoading variable.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} item This variable holds the contractAddress of the selected post.
 * @param {*} state Variable in which the data of the application gets stored globally.
 */
async function setDetailsPopup(setPopupData, setIsLoading, setCurrentPopup, item, state) {
    try {
        setIsLoading(true);

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
        // let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);
        let _content = state.postData[state.posts.indexOf(item)];


        setPopupData({
            currentItem: item,
            id: _id.toNumber(),
            addressOfPoster: _addressOfPoster,
            originalPostAddress: _originalPostAddress,
            contractType: _contractType,
            contentType: _contentType,
            payees: _payees,
            shares: _shares,
            royaltyMultiplier: _royaltyMultiplier,
            content: _content,
            hashOfContent: _hashOfContent,
        })

        setCurrentPopup(PopupState.DETAILS);
    } catch (err) {
        console.error(err);
        setCurrentPopup(PopupState.CLOSED);
        setIsLoading(false);
    }
    setIsLoading(false);
}

export default setData