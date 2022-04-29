import { type } from './util/types';

let NodeWorker = null;

// TODO Better isNode check
if (typeof global !== 'undefined') {
  NodeWorker = (await import('worker_threads')).Worker;
}

const { stringify } = JSON;

/**
 *
 * @param {string} workerPath
 * @param {Object} options
 * @param {any} options.socket
 * @param {Object} options.workerOpts
 * @returns {Worker}
 */
export const createNodeWorker = (workerPath, { socket, workerOpts }) => {
  const worker = new Worker(workerPath, { ...(workerOpts || {}) });

  worker.on('message', data => {
    socket.send(stringify(data));
  })
  .on('error', (error) => {
    console.error(error);

    socket.send(stringify({
      type: 'log',
      level: 'error',
      message: String(error.stack),
    }));

    return true;
  });

  return worker;
};
