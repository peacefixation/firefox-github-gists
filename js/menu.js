document.addEventListener('DOMContentLoaded', init, false);
browser.runtime.onMessage.addListener(handleMessage);

let bgPage = chrome.extension.getBackgroundPage();
let gists = [];

function handleMessage(message) {
    if(message.action === "checkStatus") {
        let status = localStorage["requestStatus"];
        renderMenu(status);
    }
}

function init() {
    let status = localStorage["requestStatus"];
    renderMenu(status);

    let searchField = document.getElementById("searchField");
    searchField.onkeyup = searchGists;
    searchField.focus();
}

function renderMenu(status) {
    if(status === "200") {
        gists = bgPage.getGists();
        hideElement("message");
        showElement("searchField", "block");
        showElement("gistlist");
        renderGists();
    } else if(status === "401") {
        hideElement("searchField");
        hideElement("gistlist");
        showInvalidTokenMessage();
    } else {
        hideElement("searchField");
        hideElement("gistlist");
        showRequestErrorMessage(status);
    }
}

function showRequestErrorMessage(text) {
    let message = document.getElementById("message");
    message.style.display = "block";

    message.appendChild(document.createTextNode(text));
}

function showInvalidTokenMessage() {
    let message = document.getElementById("message");
    message.style.display = "block";

    let textNode = document.createTextNode("click here");
    let anchor = document.createElement("a");
    anchor.href = "#";
    anchor.appendChild(textNode);

    message.appendChild(document.createTextNode("Invalid token, "));
    message.appendChild(anchor);
    message.appendChild(document.createTextNode(" to enter a new one."))

    anchor.onclick = (e) => {
        e.preventDefault();
        browser.runtime.openOptionsPage()
    };
}
function renderGists() {
    gists.forEach(function(gist) {
        renderGist(gist);
    });
}

function renderGist(gist) {
    let description = gist["node"]["description"];
    let textNode = document.createTextNode(description);
    
    let resourcePath = gist["node"]["owner"]["resourcePath"];
    let gistName = gist["node"]["name"];

    let anchor = document.createElement("a");
    anchor.href = "https://gist.github.com" + resourcePath + "/" + gistName;
    anchor.appendChild(textNode);

    let listElement = document.createElement("li");
    listElement.setAttribute("title", description);
    listElement.appendChild(anchor);

    let list = document.getElementById("gistlist");
    list.appendChild(listElement);
}

function clearGists() {
    removeChildren("gistlist");
}

function searchGists(e) {
    let searchTerm = e.target.value.toLowerCase();

    let bgPage = chrome.extension.getBackgroundPage();
    let allGists = bgPage.getGists();
    gists = [];

    for(let i = 0; i < allGists.length; i++) {
        let description = allGists[i]["node"]["description"].toLowerCase();

        if(description.includes(searchTerm)) {
            gists.push(allGists[i]);
        }
    }

    clearGists();
    renderGists();
}
