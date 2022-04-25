import { type } from './util/types';

let Worker = null;

if (typeof global !== 'undefined') {
  Worker = (await import('worker_threads')).Worker;
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

  /**
   * @type {string} msg
   */
  const onSocketMessage = (msg) => {
    worker.postMessage(msg);
  };

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

    socket.send(stringify({
      type: 'clear',
    }));

    return true;
  })
  .on('exit', () => {
    socket.off('message', onSocketMessage);

    setTimeout(() => {
      createNodeWorker(workerPath, { socket, workerOpts });
    }, 2000);
  });

  // Handle incoming messages, must be on main thread to support synchronous
  // worker calls.
  socket.on('message', onSocketMessage);

  return worker;
};
