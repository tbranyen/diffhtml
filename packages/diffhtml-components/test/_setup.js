import { JSDOM } from 'jsdom';
import globalThis from '../lib/util/global';
import diff from '../lib/util/binding';

const { assign } = Object;

globalThis.newJSDOMSandbox = () => {
  const instance = new JSDOM(`<!DOCTYPE html>`);
  const { window } = instance;
  const { document, HTMLElement, customElements } = window;

  assign(globalThis, { document, HTMLElement, customElements, window });

  // Ensure middleware cache is always empty before running. Sometimes we can
  // get into an inconsistent state and this helps ensure freshness.
  const oldMiddleware = diff.Internals.MiddlewareCache.keys()[0];

  if (oldMiddleware) {
    oldMiddleware.unsubscribe();
  }
}

newJSDOMSandbox();