import { JSDOM } from 'jsdom';
import globalThis from '../lib/util/global';

const { assign } = Object;

globalThis.newJSDOMSandbox = () => {
  const instance = new JSDOM(`<!DOCTYPE html>`);
  const { window } = instance;
  const { document, HTMLElement, customElements } = window;

  assign(globalThis, { document, HTMLElement, customElements, window });
}

newJSDOMSandbox();