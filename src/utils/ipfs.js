import * as IPFS from "ipfs-core";

//Determines what type the data is and call the correct method to save the data to the IPFS network
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

//Saves the text to the IPFS network and returns a hash of the content
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

//Retrieves the data of the IPFS network using the given hash from the saveTextToIPFS()
export async function retrieveDataFromIPFS(hash, contentType) {
    let node = await IPFS.create({ repo: "ok" + Math.random() });

    let dataReceived;
    let asyncitr = node.cat(hash);
    const decoder = new TextDecoder();
    dataReceived = "";

    for await (const itr of asyncitr) {
        dataReceived += decoder.decode(itr, { stream: true });
        console.log("Data received: " + dataReceived);
    }
    return dataReceived;
}