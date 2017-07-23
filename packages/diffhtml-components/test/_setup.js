const { JSDOM } = require('jsdom-wc');

global.newJSDOMSandbox = () => {
  const instance = new JSDOM(`<!DOCTYPE html>`);
  const { window } = instance;

  Object.assign(global, {
    document: window.document,
    HTMLElement: window.HTMLElement,
    customElements: window.customElements,
    window,
  });
}

newJSDOMSandbox();

after(() => {
  require('../lib/component').unsubscribeMiddleware();
  require('../lib/web-component').unsubscribeMiddleware();
});
