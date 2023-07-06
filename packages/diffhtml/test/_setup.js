import { JSDOM } from 'jsdom';
import globalThis from '../lib/util/global';

const { stringify } = JSON;
const { assign } = Object;
const instance = new JSDOM('', { runScripts: 'dangerously' });
const { window } = instance;

const url = new URL('about:blank');

const location = new Proxy(url, {
  set(obj, keyName, value) {
    if (keyName === 'href') {
      // Parse out the href and set the search param
      const newURL = new URL(value);

      obj.search = newURL.search;

      if (obj.search === null) {
        obj.search = '';
      }
    }

    return true;
  },

  get(obj, keyName) {
    return obj[keyName] || '';
  },
});

assign(globalThis, {
  customElements: window.customElements,
  document: window.document,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  location,
  window,
});

console.json = (...a) => a.forEach(o => console.log(stringify(o, null, 2)));
