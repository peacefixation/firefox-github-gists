let gists = [];

let requestNum = 0;
let maxRequests = 10;

function downloadGists() {
    gists = [];
    if(localStorage["token"] === undefined) {
        return;
    }

    requestNum = 0;
    requestGists(100, null);
}

function requestGists(first, after) {
    let xhttp = new XMLHttpRequest();
    
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            
            localStorage["requestStatus"] = this.status;

            if(this.status == 200) {
                let json = JSON.parse(this.responseText);

                if(json["errors"]) {
                    localStorage["requestStatus"] = json["errors"][0]["message"];
                    browser.runtime.sendMessage({"action": "checkStatus"});
                    return;
                }

                let hasNextPage = json["data"]["viewer"]["gists"]["pageInfo"]["hasNextPage"];
                let endCursor = json["data"]["viewer"]["gists"]["pageInfo"]["endCursor"];

                // append the new gists
                for(let i = 0; i < json["data"]["viewer"]["gists"]["edges"].length; i++) {
                    gists.push(json["data"]["viewer"]["gists"]["edges"][i]);
                }

                // keep requesting gists while there are more pages
                if(hasNextPage === true && requestNum < maxRequests) {
                    requestNum++;
                    requestGists(100, endCursor);
                }
            }

            browser.runtime.sendMessage({"action": "checkStatus"});
        }
    };

    xhttp.open("POST", "https://api.github.com/graphql", true);
    xhttp.setRequestHeader("Authorization", "Bearer " + localStorage["token"]);
    xhttp.setRequestHeader("Content-Type", "application/json");
    
    let query = "query ($first: Int, $after: String) { viewer { gists(first:$first, after:$after, privacy:ALL) { edges { node { id description name pushedAt files { language { name } name text } owner { resourcePath } } } pageInfo { endCursor hasNextPage } } } }"
    let request = JSON.stringify({
        query: query,
        variables: { first: first, after: after }
    });

    xhttp.send(request);
}

function getGists() {
    return gists;
}

// init
downloadGists();