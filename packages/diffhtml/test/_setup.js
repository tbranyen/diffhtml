import { JSDOM } from 'jsdom';

const { stringify } = JSON;
const { assign } = Object;
const instance = new JSDOM();
const { window } = instance;

assign(global, {
  document: window.document,
  Element: window.Element,
  location: window.location,
  window,
});

console.json = (...a) => a.forEach(o => console.log(stringify(o, null, 2)));
