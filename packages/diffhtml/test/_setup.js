import { JSDOM } from 'jsdom';
import { parse } from 'url';

const { stringify } = JSON;
const { assign } = Object;
const instance = new JSDOM();
const { window } = instance;

const _location = { href: 'about:blank', search: '' };
const location = new Proxy(_location, {
  set(obj, keyName, value) {
    if (keyName === 'href') {
      assign(_location, parse(value));

      if (_location.search === null) {
        _location.search = '';
      }
    }

    return true;
  },

  get(obj, keyName) {
    return _location[keyName];
  }
});

assign(global, {
  document: window.document,
  Element: window.Element,
  location,
  window,
});

console.json = (...a) => a.forEach(o => console.log(stringify(o, null, 2)));
