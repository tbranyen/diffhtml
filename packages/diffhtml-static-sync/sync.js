import diffhtml from 'diffhtml';
import { Socket } from 'engine.io-client';

process.env.NODE_ENV = 'production';

let interval = null;
const domNodes = new Map();
const { html, outerHTML } = diffhtml;

window.staticSyncHandlers = new Set();
window.staticSyncSocket = undefined;

function open() {
  clearInterval(interval);

  const host = location.host.split(':')[0];
  const socket = window.staticSyncSocket = new Socket(`ws://${host}:54321`, {
    transports: ['websocket'],
  });

  socket.on('open', () => {
    console.log('diffhtml-static-sync socket connected');

    socket.on('message', message => {
      const { file, markup, quiet = false } = JSON.parse(message);

      if (!file) {
        return;
      }

      if (!quiet) {
        console.log(`${file} changed`);
      }

      if (staticSyncHandlers.size) {
        let retVal = false;

        staticSyncHandlers.forEach(fn => {
          retVal = retVal || fn({ file, markup, quiet });
        });

        if (retVal) {
          return retVal;
        }
      }

      // Handle CSS files.
      if (file.includes('.css')) {
        const queryString = `?sync=${Date.now()}`;
        const domNode = document.querySelector(`link[href='${file}']`) || domNodes.get(file);

        if (domNode) {
          if (!quiet) {
            console.log(`${file} found on page, reloading`);
          }

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

        return;
      }

      const path = location.pathname.slice(1) || 'index';
      const ext = file.split('.').slice(-1)[0];

      if (
        file === true ||
        path === file ||
        (
          path === file.split('.').slice(0, -1).join('.') &&
          ext === 'html' ||
          ext === 'md'
        )
      ) {
        const children = html(markup);

        if (children.childNodes.length > 1) {
          outerHTML(document.documentElement, children.childNodes[1]);
        }
        else {
          outerHTML(document.documentElement, children);
        }
      }
      // All other files cause a full page reload.
      else {
        location.reload();
      }
    });
  });

  socket.on('close', () => {
    console.log('Socket closed, attempting to reopen every 2 seconds');
    interval = setInterval(() => open(), 2000);
  });

  socket.on('error', (e) => {
    console.log('Socket errored', e);
  });
}

open();
