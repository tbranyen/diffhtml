import { outerHTML, release } from 'diffhtml';
import { Socket } from 'engine.io-client';

process.env.NODE_ENV = 'production';

let interval = null;
const domNodes = new Map();

function open() {
  clearInterval(interval);

  const socket = new Socket('ws://localhost:54321');

  socket.on('open', () => {
    console.log('Socket connected');

    socket.on('message', message => {
      release(document.documentElement);

      const { file, markup } = JSON.parse(message);

      console.log(`${file} changed`);

      // Handle CSS files.
      if (file.includes('.css')) {
        const queryString = `?sync=${Date.now()}`;
        const domNode = document.querySelector(`link[href='${file}']`) || domNodes.get(file);

        if (domNode) {
          console.log(`${file} found on page, reloading`);
          domNode.href = domNode.href.replace(/\?.*|$/, queryString);
          domNodes.set(file, domNode);
        }
        // Reload all stylesheets since we want to be sure everything is updated.
        else {
          [...document.querySelectorAll('link')].forEach(domNode => {
            const queryString = `?sync=${Date.now()}`;
            domNode.href = domNode.href.replace(/\?.*|$/, queryString);
          });
        }
      }

      const path = location.pathname.slice(1) || 'index.html';

      if (file === true || path === file) {
        console.log(`Updated with: ${markup}`);
        outerHTML(document.documentElement, markup || '<html></html>')
      }
    });
  });

  socket.on('close', () => {
    console.log('Socket closed, attempting to reopen every 2 seconds');

    interval = setInterval(() => open(), 2000);
  });

  socket.on('error', () => {
    console.log('Socket errored');
  });
}

open();
