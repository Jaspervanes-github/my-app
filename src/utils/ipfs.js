import * as IPFS from "ipfs-core";

/**
 * Determines what type the data is and calls the correct method to save the data to the IPFS network.
 * @param {*} contentType An enum of type ContentType. 
 * @param {*} data The data that gets stored on the IPFS network.
 * @returns A cid of the location of the stored data.
 */
export async function saveDataToIPFS(contentType, data) {
    switch (contentType) {
        case 0:
            return await this.saveTextToIPFS(data);
        case 1:
            return await this.saveImageToIPFS(data);
        default:
            break;
    }
}

/**
 * Saves the text to the IPFS network and returns a hash of the content.
 * @param {*} text The text that gets stored on the IPFS network.
 * @returns A cid of the location of the stored data.
 */
export async function saveTextToIPFS(text) {
    let node = await IPFS.create({ repo: "ok" + Math.random() });

    let textAdded = await node.add(text);
    console.log(
        "CID of Added text:",
        textAdded.cid.toString(),
        "\nUrl is: ipfs.io/ipfs/" + textAdded.cid.toString()
    );

    return textAdded;
}

/**
 * Saves the image to the IPFS network and returns a hash of the content.
 * @param {*} image The image that gets stored on the IPFS network.
 * @returns A cid of the location of the stored data.
 */
export async function saveImageToIPFS(image) {
    let node = await IPFS.create({ repo: "ok" + Math.random() });

    let imageAdded = await node.add(image);
    console.log(
        "CID of Added image:",
        imageAdded.cid.toString(),
        "\nUrl is: ipfs.io/ipfs/" + imageAdded.cid.toString()
    );

    return imageAdded;
}

/**
 * Retrieves the data of the IPFS network using the given hash from the saveTextToIPFS() or saveImageToIPFS()
 * @param {*} hash A string of the location of the stored data.
 * @param {*} contentType An enum of type ContentType. 
 * @returns The data that gets retrieved from the IPFS network.
 */
export async function retrieveDataFromIPFS(hash, contentType) {
    // let node = await IPFS.create({ repo: "ok" + Math.random() });

    // let asyncitr = node.cat(hash);
    // const decoder = new TextDecoder();
    // let dataReceived = '';

    // try {
    //     for await (const itr of asyncitr) {
    //         dataReceived += decoder.decode(itr, { stream: true });
    //         console.log("Data received: " + dataReceived);
    //     }
    // } catch (err) { console.log(err) }

    // return dataReceived;
    return "";
}