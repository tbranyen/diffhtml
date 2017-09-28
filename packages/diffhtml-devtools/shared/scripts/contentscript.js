var fs = require('fs');
var bridgeModule = fs.readFileSync(__dirname +  '/../../chrome-extension/dist/extension/js/bridge.js', 'utf8');
var injectorModule = fs.readFileSync(__dirname + '/injector.js', 'utf8');

const middleware = document.createElement('script')
middleware.appendChild(document.createTextNode(bridgeModule));
document.documentElement.appendChild(middleware);
middleware.parentNode.removeChild(middleware);

const injector = document.createElement('script')
injector.appendChild(document.createTextNode(injectorModule));
document.documentElement.appendChild(injector);
injector.parentNode.removeChild(injector);

const postMessage = body => chrome.runtime.sendMessage(body);
//const receiveMessages = fn => chrome.runtime.onMessage.addListener(fn);
const postEvent = ev => postMessage(JSON.parse(ev.detail));

document.addEventListener('diffHTML:activated', postEvent);
document.addEventListener('diffHTML:start', postEvent);
document.addEventListener('diffHTML:end', postEvent);
