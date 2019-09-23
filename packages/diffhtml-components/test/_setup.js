const { JSDOM } = require('jsdom-wc');

global.newJSDOMSandbox = () => {
  const instance = new JSDOM(`<!DOCTYPE html>`);
  const { window } = instance;
  const { document, HTMLElement, customElements } = window;

  Object.assign(global, { document, HTMLElement, customElements, window });
}

newJSDOMSandbox();

after(() => {
  require('../lib/component').unsubscribeMiddleware();
  require('../lib/web-component').unsubscribeMiddleware();
});
