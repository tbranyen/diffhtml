import { JSDOM } from 'jsdom';

const instance = new JSDOM();
const { window } = instance;

Object.assign(global, {
  document: window.document,
  Element: window.Element,
  location: window.location,
  window,
});

console.json = (...a) => a.forEach(o => console.log(JSON.stringify(o, null, 2)));
