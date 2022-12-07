import { ethers } from "ethers";
import Post_ABI from "../assets/metadata/Post_ABI.json";
import { createToastMessage } from "../utils/toast";
import { retrieveDataFromIPFS } from "../utils/ipfs";
import { ContractType, ContentType } from "../utils/contract";
import { PopupState } from "../utils/enums";


function setData(setPopupData, setIsLoading, currentPopup, state, item) {
    // setNewPostPopup(setPopupData);
    switch (currentPopup) {
        case PopupState.CLOSED:
            break;
        case PopupState.NEWPOST:
            setNewPostPopup(setPopupData);
            break;
        case PopupState.RESHARING:
            setResharePopup(setPopupData, setIsLoading, state, item);
            break;
        case PopupState.REMIXING:
            setRemixPopup(setPopupData, setIsLoading, state, item);
            break;
        case PopupState.VIEWING:
            setViewPopup(setPopupData, setIsLoading, state, item);
            break;
        case PopupState.DETAILS:
            setDetailsPopup(setPopupData, setIsLoading, state, item);
            break;
        default:
            break;
    }
}

function setNewPostPopup(setPopupData) {
    setPopupData({
        // currentItem: "No item",
        // id: -1,
        // addressOfPoster: "0x0000000000000000000000000000000000000000",
        originalPostAddress: "0x0000000000000000000000000000000000000000",
        contractType: ContractType.ORIGINAL,
        contentType: ContentType.TEXT,
        payees: [],
        shares: [],
        royaltyMultiplier: 5,
        content: "",
        // hashOfContent: "No hash",
    });
}

async function setResharePopup(setPopupData, setIsLoading, state, item) {
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
        let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

        setPopupData({
            currentItem: item,
            // id: -1,
            // addressOfPoster: "0x0000000000000000000000000000000000000000",
            originalPostAddress: _originalPostAddress,
            contractType: ContractType.RESHARE,
            contentType: _contentType,
            payees: _payees,
            shares: _shares,
            royaltyMultiplier: 2,
            content: _content,
            hashOfContent: _hashOfContent,
        });
    } catch (err) {
        console.error(err);
        setIsLoading(false);
    }
    setIsLoading(false);
}

async function setRemixPopup(setPopupData, setIsLoading, state, item) {
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
        let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

        setPopupData({
            currentItem: item,
            // id: -1,
            // addressOfPoster: "0x0000000000000000000000000000000000000000",
            originalPostAddress: _originalPostAddress,
            contractType: ContractType.ORIGINAL,
            contentType: ContentType.TEXT,
            payees: _payees,
            shares: _shares,
            royaltyMultiplier: 4,
            content: _content,
            hashOfContent: _hashOfContent,
        })
    } catch (err) {
        console.error(err);
        setIsLoading(false);
    }
    setIsLoading(false);
}

async function setViewPopup(setPopupData, setIsLoading, state, item) {
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
        let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);
        
        setPopupData({
            currentItem: item,
            id: _id.toNumber(),
            addressOfPoster: _addressOfPoster,
            // originalPostAddress: "0x0000000000000000000000000000000000000000",
            // contractType: ContractType.ORIGINAL,
            contentType: _contentType,
            // payees: [],
            // shares: [],
            // royaltyMultiplier: 5,
            content: _content,
            hashOfContent: _hashOfContent,
        })
    } catch (err) {
        console.error(err);
        setIsLoading(false);
    }
    setIsLoading(false);
}

async function setDetailsPopup(setPopupData, setIsLoading, state, item) {
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
        let _content = await retrieveDataFromIPFS(_hashOfContent, _contentType);

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
    } catch (err) {
        console.error(err);
        setIsLoading(false);
    }
    setIsLoading(false);
}

export default setData