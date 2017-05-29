const { JSDOM } = require('jsdom-wc');
const { window } = new JSDOM('<!doctype html>');

Object.assign(global, {
  document: window.document,
  window,
});
