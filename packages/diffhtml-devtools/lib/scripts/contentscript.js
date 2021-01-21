// The content script is used by the extension to communicate with the UI
// layer.
// Check injector.js for how to communicate from the UI layer to the extension.

// This uses browserify fs to embed. It's pretty buggy and not ideal. There is
// a better way to do this, but I haven't looked into it yet.
const path = require('path');
const fs = require('fs');
const bridgeModule = fs.readFileSync(path.join(__dirname, '/../../chrome-extension/dist/extension/js/bridge.js'), 'utf8');
const injectorModule = fs.readFileSync(path.join(__dirname, '/injector.js'), 'utf8');
const { parse } = JSON;

const middleware = document.createElement('script')
middleware.appendChild(document.createTextNode(bridgeModule));
document.documentElement.appendChild(middleware);
middleware.parentNode.removeChild(middleware);

const injector = document.createElement('script')
injector.appendChild(document.createTextNode(injectorModule));
document.documentElement.appendChild(injector);
injector.parentNode.removeChild(injector);

const postMessage = body => chrome.runtime.sendMessage(body);

chrome.runtime.onMessage.addListener(ev => document.dispatchEvent(
  new CustomEvent(`diffHTML:${ev.type}`, {
    detail: ev,
  })
));

const postEvent = ev => postMessage(ev.detail);

document.addEventListener('diffHTML:activated', postEvent);
document.addEventListener('diffHTML:start', postEvent);
document.addEventListener('diffHTML:end', postEvent);
document.addEventListener('diffHTML:ping', postEvent);
document.addEventListener('diffHTML:gc', postEvent);
