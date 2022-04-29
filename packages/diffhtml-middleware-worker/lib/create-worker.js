import { type } from './util/types';

let NodeWorker = null;
const isNode = typeof global !== 'undefined';

// TODO Better isNode check
if (isNode) {
  NodeWorker = (await import('worker_threads')).Worker;
}

const SafeWorker = typeof Worker !== 'undefined' ? Worker : NodeWorker;
const { stringify } = JSON;

/**
 *
 * @param {string} workerInit - Location of worker script, Object URL pointing
 * to Blob, or a Worker instance itself.
 * @param {Object} options
 * @param {Object} options.workerOpts
 * @returns {Worker}
 */
export const createWorker = (workerInit, { workerOpts }) => callback => {
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

  const onMessage = data => callback(data);

  const onError = (error) => {
    console.error(error);

    callback({
      type: 'log',
      level: 'error',
      message: String(error.stack),
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
