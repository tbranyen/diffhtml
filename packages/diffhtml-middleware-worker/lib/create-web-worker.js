import diff from './util/binding';
import { type, Mount } from './util/types';

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

  worker.onmessage = e => {
    const { type, ...rest } = e.data;

    if (type === 'patches') {
      /** @type {any} */
      const transactionConfigAsAny = ({ patches: rest.patches });
      innerHTML(mount, null, transactionConfigAsAny);
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
