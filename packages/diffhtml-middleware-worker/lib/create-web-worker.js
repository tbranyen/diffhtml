import diff from './util/binding';
import { type, Mount } from './util/types';

const { exchange, notify } = Atomics;
const { createTree, innerHTML } = diff;
const { stringify } = JSON;

/**
 * Provides a Web Worker implementation
 *
 * @param {string} path - Location of worker script
 * @param {Object} options
 * @param {Mount} options.mount - DOM Node or VTree to render worker contents into
 * @param {Object} workerOpts - Supply additional options to new Worker()
 * @returns {Worker}
 */
export const createWebWorker = (path, { mount, workerOpts }) => {
  const worker = new Worker(path, { type: 'module', ...(workerOpts || {}) });
  let buffer = null;

  worker.onmessage = e => {
    const { type, ...rest } = e.data;

    // Set e.type to sharedarraybuffer, patches, caller, or prop
    if (type === 'sab') {
      buffer = new Int32Array(rest.buffer);
    }
    else if (type === 'patches') {
      /** @type {any} */
      const transactionConfigAsAny = ({ patches: rest.patches });
      innerHTML(mount, null, transactionConfigAsAny);
    }
    else if (type === 'get') {
      const propBuffer = new Int32Array([window[rest.target][rest.keyName]]);

      // Store the value
      for (let i = 0; i < propBuffer.length; i++) {
        // Offset value past the toggle byte.
        buffer[i + 1] = propBuffer[i];
      }

      exchange(buffer, 0, propBuffer.byteLength);
      notify(buffer, 0);
    }
    else if (type === 'set') {
      if (rest.value.__caller) {
        window[rest.target][rest.keyName] = () => {
          worker.postMessage({ type: 'caller', ...rest.value });
        };
      }

      exchange(buffer, 0, 1);
      notify(buffer, 0);
    }
  };

  worker.onerror = e => {
    innerHTML(mount, createTree('h1', [
      createTree('#text', `Error in worker: ${path}`),
      createTree('pre', stringify(e, null, 2)),
    ]));
  };

  return worker;
};
