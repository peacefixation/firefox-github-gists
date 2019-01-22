document.addEventListener('DOMContentLoaded', init, false);

let bgPage = chrome.extension.getBackgroundPage();
let gists = bgPage.getGists();

function init() {
    if(localStorage["validToken"] === "true") {
        hideElement("message");
        showElement("searchField", "block");
        showElement("gistlist");
        showElement("pageListContainer");
        renderGists(1);
    } else {
        hideElement("searchField");
        hideElement("gistlist");
        hideElement("pageListContainer");
        showMessage();
    }

    let searchField = document.getElementById("searchField");
    searchField.onkeyup = searchGists;
    searchField.focus();
}

function showMessage() {
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
function renderGists(pageNum) {
    let pageStart = ((pageNum - 1) * 10);
    let pageEnd = Math.min(gists.length, pageNum * 10);

    if(pageEnd > pageStart) {
        gists.slice(pageStart, pageEnd).forEach(function(gist) {
            renderGist(gist);
        });
    }

    renderPagination(gists);
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
    listElement.appendChild(anchor);

    let list = document.getElementById("gistlist");
    list.appendChild(listElement);
}

function renderPagination(gists) {
    let fullPages = parseInt(gists.length / 10);
    let partialPage = (gists.length % 10) > 0;
    let numPages = fullPages + partialPage;
    let list = document.getElementById("pagelist");

    for(let i = 1; i <= numPages; i++) {
        let pageNum = document.createTextNode(i);
        let listElement = document.createElement("li");
        listElement.appendChild(pageNum);
        listElement.onclick = navigateToPage;
        list.appendChild(listElement);
    }
}

function navigateToPage(e) {
    let pageNum = Number(e.target.innerText);
    clearGists();
    renderGists(pageNum);
}

function clearGists() {
    removeChildren("gistlist");
    removeChildren("pagelist");
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
    renderGists(1);
}
