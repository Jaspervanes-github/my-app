import { ContractFactory } from "ethers";
import Post_ABI from "../assets/metadata/Post_ABI.json";
import Post_ByteCode from "../assets/metadata/Post_ByteCode.json";
import { createToastMessage } from "./toast";

const PUBLISHER_ADDRESS = "0x1F871dC82BF9048946540Ac41231b50fE4Da883b";

export const ContractType = {
    ORIGINAL: 0,
    RESHARE: 1,
    REMIX: 2,
};

export const ContentType = {
    TEXT: 0,
    IMAGE: 1,
};

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

//Deploys a new Post contract to the blockchain and adds it to to posts list
export async function deployNewPostContract(
    state,
    dispatch,
    type,
    id,
    contractType,
    originalPostAddress,
    contentType,
    hashOfContent,
    payees,
    shares,
    royaltyMultiplier,
    setState
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
            data: this.state.content,
        });
    } catch (err) {
        console.error(err);
        switch (type) {
            case ContractType.RESHARE:
                // TODO:setState({ triggerResharePostPopup: true });
                break;
            case ContractType.REMIX:
                // TODO:setState({ triggerRemixPostPopup: true });
                break;
            case ContractType.ORIGINAL:
                // TODO:setState({ triggerNewPostPopup: true });
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

export async function getPayees(state, indexOfContract) {
    try {
        let payees = await state.posts[indexOfContract].getAllPayees();
        return payees;
    } catch (err) {
        console.error(err);
    }
}

export async function getShares(state, indexOfContract) {
    try {
        let shares = await state.posts[indexOfContract].getAllShares();
        return shares;
    } catch (err) {
        console.error(err);
    }
}

export async function payoutUser(state, indexOfContract) {
    try {
        await state.posts[indexOfContract].payoutUser();
    } catch (err) {
        console.error(err);
    }
}