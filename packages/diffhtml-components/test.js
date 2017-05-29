const { JSDOM } = require('jsdom-wc');
const { window } = new JSDOM(`<!DOCTYPE html>`);

Object.assign(global, {
  document: window.document,
  HTMLElement: window.HTMLElement,
  customElements: window.customElements,
  window,
});

class BoldComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<b>${this.innerHTML}</b>`;
  }
}

customElements.define('bold-component', BoldComponent);

document.body.innerHTML = `
  <bold-component>What a time to be...</bold-component>
`;

console.log(document.body.outerHTML);
