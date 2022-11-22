import { type } from './util/types';
import NodeWorker from './util/node-worker-threads';

const isNode = typeof global !== 'undefined';
const SafeWorker = typeof Worker !== 'undefined' ? Worker : NodeWorker;
const { stringify } = JSON;

/**
 *
 * @param {string} workerInit - Location of worker script, Object URL pointing
 * to Blob, or a Worker instance itself.
 * @param {Object} workerOpts
 * @returns {Worker}
 */
export const createWorker = (workerInit, workerOpts = {}) => callback => {
  const safeWorkerOpts = workerOpts || {};

  let worker = null;

  // If the init is a worker object already, simply assign the value and
  // options.
  if (type(workerInit) === 'worker') {
    worker = workerInit;
    Object.assign(worker, safeWorkerOpts);
  }
  // Otherwise, use the workerInit as the value for creating a new worker.
  else {
    worker = new SafeWorker(workerInit, { ...safeWorkerOpts });
  }

  const onMessage = message => {
    const { type, ...rest } = isNode ? message : message.data;

    if (type === 'patches') {
      callback({ type, ...rest });
    }
  };

  const onError = (error) => {
    // Extra logging to the Node console, in the browser the error will bubble
    // automatically so this isn't needed.
    if (isNode) {
      console.error(error);
    }

    callback({
      type: 'log',
      level: 'error',
      message: String(error.stack || error.message),
    });

    return true;
  };

  if (isNode) {
    worker.on('message', onMessage);
    worker.on('error', onError);
  }
  else {
    worker.onmessage = onMessage;
    worker.onerror = onError;
  }

  return worker;
};
