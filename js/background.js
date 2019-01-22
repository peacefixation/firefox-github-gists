// TODO REMOVE:  a889939cede5a71dea792a427de6d4ac5f1052d3

let gists = [];

function downloadGists() {
    gists = [];
    if(localStorage["token"] === undefined) {
        return;
    }
    requestGists(10, null);
}

function requestGists(first, after) {
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) {
                let json = JSON.parse(this.responseText);

                let hasNextPage = json["data"]["viewer"]["gists"]["pageInfo"]["hasNextPage"];
                let endCursor = json["data"]["viewer"]["gists"]["pageInfo"]["endCursor"];

                // append the new gists
                for(let i = 0; i < json["data"]["viewer"]["gists"]["edges"].length; i++) {
                    gists.push(json["data"]["viewer"]["gists"]["edges"][i]);
                }

                localStorage["validToken"] = "true";
                console.log("valid token message");
                browser.runtime.sendMessage({"action": "validToken"});

                // keep requesting gists while there are more pages
                if(hasNextPage === true) {
                    requestGists(10, endCursor);
                }
            } else if(this.status == 401) {
                localStorage["validToken"] = "false";
                browser.runtime.sendMessage({"action": "invalidToken"});
            } else {
                console.log("HTTP Error: " + this.status + " " + this.statusText);
            }
        }
    };

    xhttp.open("POST", "https://api.github.com/graphql", true);
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage["token"]);
    xhttp.setRequestHeader("Content-Type", "application/json");
    
    let query = "query ($after: String) { viewer { gists(first:100, after:$after, privacy:ALL) { edges { node { id description name pushedAt owner { resourcePath } } } pageInfo { endCursor hasNextPage } } } }"
    let request = JSON.stringify({
        query: query,
        variables: { after: after }
    });

    xhttp.send(request);
}

function getGists() {
    return gists;
}

// init
downloadGists();