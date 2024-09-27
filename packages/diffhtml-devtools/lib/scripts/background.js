'use strict';

const connections = new Map();
const savedRequests = [];

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'devtools-page') {
    const devToolsListener = message => {
      connections.set(message.tabId, port);

      savedRequests.forEach(([id, request]) => {
        connections.get(id).postMessage(request);
      });

      if (message.name === 'init') {
        chrome.scripting.executeScript({
          target: {tabId: message.tabId},
          files: [message.scriptToInject]
        });

        //chrome.tabs.executeScript(message.tabId, {
        //  file: message.scriptToInject,
        //});
      }
    };

    savedRequests.length = 0;

    port.onMessage.addListener(devToolsListener);

    port.onDisconnect.addListener(port => {
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
chrome.runtime.onMessage.addListener((request, sender) => {
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
