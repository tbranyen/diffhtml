'use strict';

const connections = new Map();
const savedRequests = [];

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'devtools-page') {
    const devToolsListener = function(message, sender, sendResponse) {
      connections.set(message.tabId, port);

      savedRequests.forEach(function([id, request]) {
        connections.get(id).postMessage(request);
      });

      if (message.name === 'init') {
        chrome.tabs.executeScript(message.tabId, {
          file: message.scriptToInject,
        });
      }
    };

    savedRequests.length = 0;

    port.onMessage.addListener(devToolsListener);

    port.onDisconnect.addListener(function(port) {
       port.onMessage.removeListener(devToolsListener);

       connections.forEach((prevPort, tabId) => {
         if (prevPort === port) {
           connections.delete(tabId);
         }
       });
    });
  }
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    const { id } = sender.tab;

    if (connections.has(id)) {
      connections.get(id).postMessage(request);
    }
    else {
      savedRequests.push([id, request]);
    }
  }

  return true;
});
