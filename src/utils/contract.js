import { ContractFactory } from "ethers";
import Post_ABI from "../assets/metadata/Post_ABI.json";
import Post_ByteCode from "../assets/metadata/Post_ByteCode.json";
import { PopupState } from "./enums";
import { createToastMessage } from "./toast";

const PUBLISHER_ADDRESS = "0x1F871dC82BF9048946540Ac41231b50fE4Da883b";

/**
 * Represents the type of the contract.
 */
export const ContractType = {
    ORIGINAL: 0,
    RESHARE: 1,
    REMIX: 2,
};

/**
 * Represents the type of the content of the post.
 */
export const ContentType = {
    TEXT: 0,
    IMAGE: 1,
};

/**
 * Converts the enum ContractType to a string value.
 * @param {*} contractType An enum of type ContractType. 
 * @returns A string value of the corresponding ContractType enum.
 */
export function contractTypeToString(contractType) {
    switch (contractType) {
        case 0:
            return "ORIGINAL";
        case 1:
            return "RESHARE";
        case 2:
            return "REMIX";
        default:
            break;
    }
}

/**
 * Converts the enum ContentType to a string value.
 * @param {*} contentType An enum of type ContentType. 
 * @returns A string value of the corresponding ContentType enum.
 */
export function contentTypeToString(contentType) {
    switch (contentType) {
        case 0:
            return "TEXT";
        case 1:
            return "IMAGE";
        default:
            break;
    }
}

/**
 * Deploys a new Post contract to the blockchain and adds it to to posts list.
 * @param {*} type An enum of the type ContractType. States of what typing the current post is.
 * @param {*} id Unique key value of the post.
 * @param {*} contractType An enum of the type ContractType. States of what typing the selected post is.
 * @param {*} originalPostAddress The contract address of the original post contract.
 * @param {*} contentType An enum of the type ContentType. States of what typing the content of the current post is.
 * @param {*} hashOfContent A string which refers to the data of the content of the post.
 * @param {*} payees An array of wallet addresses which refer to the account that have shares in this post.
 * @param {*} shares An array of numbers which refer to the amount of shares the payees hold in this post.
 * @param {*} royaltyMultiplier The share multiplier of the current post.
 * @param {*} setCurrentPopup Function to set the currentPopup variable.
 * @param {*} popupData This varaiable holds all the data of the current post.
 * @param {*} state Variable in which the data of the application gets stored globally.
 * @param {*} dispatch Function to change the global state variable.
 */
export async function deployNewPostContract(
    type,
    id,
    contractType,
    originalPostAddress,
    contentType,
    hashOfContent,
    payees,
    shares,
    royaltyMultiplier,
    setCurrentPopup,
    popupData,
    state, 
    dispatch
) {
    try {
        const factory = new ContractFactory(
            Post_ABI,
            Post_ByteCode,
            state.signer
        );
        let copyPayees = [...payees];
        let copyShares = [...shares];
        if (copyPayees.includes(PUBLISHER_ADDRESS)) {
            copyPayees.pop();
            copyShares.pop();
        }

        const contract = await factory.deploy(
            id,
            contractType,
            originalPostAddress,
            contentType,
            hashOfContent,
            copyPayees,
            copyShares,
            royaltyMultiplier,
            PUBLISHER_ADDRESS
        );
        console.log("Address of deployed contract: " + contract.address);

        dispatch({
            type: "addPost",
            value: contract.address,
            data: popupData.content,
        });
    } catch (err) {
        console.error(err);
        switch (type) {
            case ContractType.ORIGINAL:
                setCurrentPopup(PopupState.NEWPOST)
                break;
            case ContractType.RESHARE:
                setCurrentPopup(PopupState.RESHARING)
                break;
            case ContractType.REMIX:
                setCurrentPopup(PopupState.REMIXING)
                break;
            default:
                break;
        }
        createToastMessage(
            "To submit the post you need to accept the transaction.",
            5000
        );
    }
}

// export async function getPayees(indexOfContract) {
//     const { state } = useContext(DataContext);
//     try {
//         let payees = await state.posts[indexOfContract].getAllPayees();
//         return payees;
//     } catch (err) {
//         console.error(err);
//     }
// }

// export async function getShares(indexOfContract) {
//     const { state } = useContext(DataContext);
//     try {
//         let shares = await state.posts[indexOfContract].getAllShares();
//         return shares;
//     } catch (err) {
//         console.error(err);
//     }
// }

// export async function payoutUser(indexOfContract) {
//     const { state } = useContext(DataContext);
//     try {
//         await state.posts[indexOfContract].payoutUser();
//     } catch (err) {
//         console.error(err);
//     }
// }