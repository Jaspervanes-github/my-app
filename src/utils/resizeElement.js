/**
 * This function automatically resizes the height of a given element.
 * @param {*} elem The element on which the height gets adjusted automatically.
 */
function resizeHeightOfElement(elem) {
    elem.target.style.height = "1px";
    elem.target.style.height = elem.target.scrollHeight + "px";
}

export default resizeHeightOfElement 