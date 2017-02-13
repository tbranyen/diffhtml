import { jsdom } from 'jsdom';

const instance = jsdom();
const { defaultView } = instance;

Object.assign(global, {
  document: defaultView.document,
  Element: defaultView.Element,
  location: defaultView.location,
  window: defaultView,
});
