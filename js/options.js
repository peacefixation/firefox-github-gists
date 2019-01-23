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

function setRequestStatus(fontAwesomeClass, color, text = "") {
    let tokenStatus = document.getElementById("tokenStatus");
    tokenStatus.className = fontAwesomeClass;
    tokenStatus.style.display = "inline-block";
    tokenStatus.style.color = color;
    tokenStatus.title = text;
}

function handleMessage(message) {
    console.log("handleMessage: " + message.action);
    if(message.action === "checkStatus") {
        let status = localStorage["requestStatus"];
        switch(status) {
            case "200":
                setRequestStatus("fas fa-check", "green");
                break;
            case "401":
                setRequestStatus("fas fa-times", "red");
                break;
            default:
                setRequestStatus("fas fa-exclamation-triangle", "orange", localStorage["requestStatus"]);
                break;
        }
    }
}

function saveToken() {
    let tokenField = document.getElementById("tokenField");
    localStorage["token"] = tokenField.value;

    let bgPage = chrome.extension.getBackgroundPage();
    bgPage.downloadGists();
}
