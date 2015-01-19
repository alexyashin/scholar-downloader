var runPlugin = false;
chrome.browserAction.onClicked.addListener(function(tab) {
    runPlugin = !runPlugin;
    if (runPlugin) {
        runPlugin = true;
        console.log("Run scholar downloader");
        chrome.browserAction.setIcon({path: "stop-icon.png", tabId:tab.id});
        chrome.tabs.executeScript(null, {file: "content_script.js"});
    }
    else{
        runPlugin = false;
        console.log("Stop scholar downloader");

    }
});

chrome.extension.onConnect.addListener(function (port) {
    if (!runPlugin)
        return;
    port.onMessage.addListener(function (msg) {
        if (msg.content_script == "ready") {
            port.postMessage({extension: "getLinks"});
        }
        else if (msg.content_script == "links") {
            var links = msg.links;
            if (links != null) {
                downloadLinks(links);
            }
            port.postMessage({extension: "goToNext"});
        }
        else if (msg.content_script == "iAmGoing") {
            //port.postMessage({extension: "getLinks"});
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (!runPlugin){
        return;
    }
    if (/.*scholar\.google\..*\?/.test(tab.url) && changeInfo.status === "complete") {
        chrome.browserAction.setIcon({path: "stop-icon.png", tabId:tab.id});
        chrome.tabs.executeScript(null, {file: "content_script.js"});
    }
});

function downloadLinks(links) {
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var fileName = link.split('/').pop();
        chrome.downloads.download({url: link});
    }
}