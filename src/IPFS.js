import { Button, Typography } from '@material-ui/core';
import * as IPFS from 'ipfs-core';
import React, { useState } from 'react';

async function saveTextToIPFS(text) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let textAdded = await node.add(text);
    console.log(
        "CID of Added text:", textAdded.cid.toString(),
        "\nUrl is: ipfs.io/ipfs/" + textAdded.cid.toString());

    return textAdded;
}

async function saveFileToIPFS(file) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let fileAdded = await node.add({
        // path: "file.txt"
        content: file
    });

    console.log(
        "CID of Added text:", fileAdded.cid.toString(),
        "\nUrl is: ipfs.io/ipfs/" + fileAdded.cid.toString());

    return fileAdded;
}

async function retrieveDataFromIPFS(hash) {
    let node = await IPFS.create({ repo: 'ok' + Math.random() });

    let asyncitr = node.cat(hash.cid);
    const decoder = new TextDecoder();
    let dataReceived = '';

    // decodeImageFromBuffer(asyncitr);

    for await (const itr of asyncitr) {
        dataReceived += decoder.decode(itr, { stream: true })
        console.log(dataReceived);
    }
    return dataReceived;
}

// async function decodeImageFromBuffer(buffer) {

//   var blob = new Blob(buffer, { type: "image/png" });
//   var urlCreator = window.URL || window.webkitURL;
//   var imageUrl = urlCreator.createObjectURL(blob);
//   var img = document.querySelector("#photo");
//   img.src = imageUrl;
// }

function IPFSObject() {
    let hashOfData;
    let dataReceived;

    const [data, setData] = useState("No data retrieved yet...");
    // const [images, setImages] = useState([]);
    // const [imageURLs, setImageURLs] = useState([]);

    // useEffect(() => {
    //   if (images.length < 1) return;
    //   const newImageUrls = [];
    //   images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
    //   setImageURLs(newImageUrls);
    // }, [images]);

    // function onImageChange(e) {
    //   setImages([...e.target.files]);
    // }

    return (
        <div className="App">
            <Button variant='contained' onClick={() => {
                saveTextToIPFS("Saved this text to IPFS").then((response) => {
                    hashOfData = response;
                });
            }}>
                Store Text to IPFS
            </Button>

            <Button variant='contained' onClick={() => {
                saveFileToIPFS("I saved this file to IPFS").then((response) => {
                    hashOfData = response;
                });
            }}>
                Store File to IPFS
            </Button>

            <Button variant='contained' onClick={() => {
                retrieveDataFromIPFS(hashOfData).then((response) => {
                    dataReceived = response;
                    setData(dataReceived);
                });
            }}>
                Retrieve Data from IPFS
            </Button>

            <Typography>Data retrieved: {data}</Typography>

            {/* <input type="file" accept="image/*" onChange={onImageChange} />
      <br />{imageURLs.map(imageSrc => <img src={imageSrc} />)}
      <img id="photo"/> */}
        </div>
    );
}

export default IPFSObject;
