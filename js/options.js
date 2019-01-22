browser.runtime.onMessage.addListener(handleMessage);
document.addEventListener('DOMContentLoaded', init, false);

function init() {
    // populate the token field
    let token = localStorage["token"];
    document.getElementById("tokenField").value = token;

    document.getElementById("saveTokenButton").onclick = saveToken;
    document.getElementById("tokenField").onkeyup = enableSaveTokenButton;

    if(localStorage["token"] === undefined || localStorage["token"] === "") {
        document.getElementById("saveTokenButton").disabled = true;
    }
}

function enableSaveTokenButton(e) {
    if(e.target.value === "") {
        document.getElementById("saveTokenButton").disabled = true;
    } else {
        document.getElementById("saveTokenButton").disabled = false;
    }
}

function validToken() {
    let tokenStatus = document.getElementById("tokenStatus");
    tokenStatus.className = "fas fa-check";
    tokenStatus.style.display = "inline-block";
    tokenStatus.style.color = "green";
}

function invalidToken() {
    let tokenStatus = document.getElementById("tokenStatus");
    tokenStatus.className = "fas fa-times";
    tokenStatus.style.display = "inline-block";
    tokenStatus.style.color = "red";
}

function handleMessage(message) {
    console.log("handleMessage: " + message.action);
    if(message.action === "invalidToken") {
        invalidToken();
    } else if(message.action === "validToken") {
        validToken();
    }
}

function saveToken() {
    let tokenField = document.getElementById("tokenField");
    localStorage["token"] = tokenField.value;

    let bgPage = chrome.extension.getBackgroundPage();
    bgPage.downloadGists();
}
