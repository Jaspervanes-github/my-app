function resizeHeightOfElement(elem) {
    elem.target.style.height = "1px";
    elem.target.style.height = elem.target.scrollHeight + "px";
}

export default resizeHeightOfElement 