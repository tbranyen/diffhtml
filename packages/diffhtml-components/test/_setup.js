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
