import { outerHTML, release } from 'diffhtml';
import { Socket } from 'engine.io-client';

const socket = new Socket('ws://localhost:54321');

socket.on('open', () => {
  socket.on('message', message => {
    const { file, markup } = JSON.parse(message);

    if (file === true || location.pathname.slice(1) === file) {
      outerHTML(document.documentElement, markup)
    }
  });
});
