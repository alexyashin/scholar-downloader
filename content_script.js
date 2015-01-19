console.log("CONTENT SCRIPT "+document.URL);

var port = chrome.extension.connect({name: "linkGetter"});
port.postMessage({content_script: "ready"});
port.onMessage.addListener(function(msg) {
    if (msg.extension == "getLinks"){
        port.postMessage({content_script: "links", links: getLinks(), url: document.URL});
    }
    else if (msg.extension == "goToNext"){
        sleep(3000);
        clickNext();
        port.postMessage({content_script: "iAmGoing"});
    }
});

function getLinks() {
    var content = document.documentElement.innerHTML;
    var regEx = /http:[^"]*\.pdf/gi;
    links = content.match(regEx);
    links = links.filter( function( item, index, inputArray ) {
        return inputArray.indexOf(item) == index;
    });
    return links;
}

function clickNext() {
    document.getElementsByClassName('gs_ico_nav_next')[0].click();
}

function sleep(ms) {
    ms += new Date().getTime();
    while (new Date() < ms){}
}