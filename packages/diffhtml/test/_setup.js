/// <reference types="mocha" />

import { JSDOM } from 'jsdom';
import { parse } from 'url';

const { stringify } = JSON;
const { assign } = Object;
const instance = new JSDOM();
const { window } = instance;

const location = new Proxy(parse('about:blank'), {
  set(obj, keyName, value) {
    if (keyName === 'href') {
      assign(obj, parse(value));

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