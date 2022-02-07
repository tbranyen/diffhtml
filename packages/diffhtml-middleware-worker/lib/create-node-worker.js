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
  let buffer = null;

  /**
   * @type {string} msg
   */
  const onSocketMessage = (msg) => {
    worker.postMessage(msg);
  };

  worker.on('message', data => {
    const { type, ...rest } = data;

    if (type === 'sab') {
      buffer = new Int32Array(rest.buffer);
    }
    else if (type === 'get') {
      console.log('get property', rest.keyName);
    }
    else {
      socket.send(stringify(data));
    }
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
