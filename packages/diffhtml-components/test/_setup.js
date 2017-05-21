import { jsdom } from 'jsdom';

const instance = jsdom();
const { defaultView } = instance;

Object.assign(global, {
  document: defaultView.document,
  Element: defaultView.Element,
  HTMLElement: defaultView.HTMLElement,
  location: defaultView.location,
  window: defaultView,
});

console.json = (...a) => a.forEach(o => console.log(JSON.stringify(o, null, 2)));

const installCE = require('document-register-element/pony');

// by default, the second argument is 'auto'
// but it could be also 'force'
// which ignores feature detection and force
// the polyfill version of CustomElements
installCE(global, 'force');

