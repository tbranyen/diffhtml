import diff from './util/binding';

const { innerHTML, html } = diff;
const { parse } = JSON;

export const createWebSocket = (socketUrl, { mount, socketOptions }) => {
  const socket = new WebSocket(socketUrl, socketOptions);

  socket.addEventListener('message', async e => {
    const { type, ...rest } = parse(e.data);

    // TODO Deprecate this, we should be smarter to link up
    // renders to avoid duplication.
    if (type === 'clear') {
      mount.innerHTML = '';
    }

    if (type === 'patches') {
      innerHTML(mount, null, { patches: rest.patches });
    }

    if (type === 'log') {
      const { level, message } = rest;
      console[level](...[].concat(message));
    }
  });

  return socket;
};
