function showElement(elementId, display) {
    let element = document.getElementById(elementId);
    element.style.display = display;
}

function hideElement(elementId) {
    let element = document.getElementById(elementId);
    element.style.display = "none";
}

function removeChildren(parentId) {
    let parent = document.getElementById(parentId);
    while (parent.childNodes.length > 0) {
        parent.childNodes[0].parentNode.removeChild(parent.childNodes[0]);
    }
}