import { JSDOM } from 'jsdom';

const { stringify } = JSON;
const { assign } = Object;
const instance = new JSDOM('', { runScripts: 'dangerously' });
const { window } = instance;

const url = new URL('about:blank');

const location = new Proxy(url, {
  set(obj, keyName, value) {
    if (keyName === 'href') {
      assign(obj, new URL(value));

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

assign(global, {
  customElements: window.customElements,
  document: window.document,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  location,
  window,
});

console.json = (...a) => a.forEach(o => console.log(stringify(o, null, 2)));
