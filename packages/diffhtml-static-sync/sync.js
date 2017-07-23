import diffhtml from 'diffhtml';
import { Socket } from 'engine.io-client';

process.env.NODE_ENV = 'production';

let interval = null;
const domNodes = new Map();
const SECRET = 'MY BRAIN IBM';
const transactions = new Map();
const { use, innerHTML, outerHTML, release, Internals } = (window.diff || diffhtml);

//diffhtml.addTransitionState('textChanged', (domNode, name, oldValue, newValue) => {
//  if (domNode.matches('script') &&) {
//    if (oldValue !== newValue) {
//      try {
//        eval(newValue);
//      }
//      catch (ex) {
//        console.log('Whoops, ya broke something, see you again shortly');
//        throw ex;
//      }
//    }
//  }
//});

window.staticSyncHandlers = new Set();

//use(transaction => {
//  transactions.set(transaction.domNode, transaction);
//
//  transactions.forEach((existingTransaction, existingDomNode)  => {
//    const { options, state, domNode, markup } = existingTransaction;
//
//    if (state.isRendering || transaction.domNode === existingDomNode) {
//      console.log('Not re-rendering', transaction);
//      return;
//    }
//
//    console.log('Re-rendering', transaction)
//
//    release(domNode);
//
//    if (options.inner) {
//      innerHTML(domNode, markup);
//    }
//    else {
//      outerHTML(domNode, markup);
//    }
//  });
//
//  return transaction;
//});

function open() {
  clearInterval(interval);

  const socket = new Socket('ws://localhost:54321');

  socket.on('open', () => {
    console.log('diffhtml-static-sync socket connected');

    socket.on('message', message => {
      const { file, markup, quiet = false } = JSON.parse(message);

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

      if (file === true || path === file.split('.').slice(0, -1).join('.')) {
        if (!quiet) {
          console.log(`Updated with: ${markup}`);
        }

        outerHTML(document.documentElement, markup || '<html></html>');
        /*
          .then(() => {
            Internals.StateCache.forEach((state, domNode) => {
              if (domNode !== document.documentElement) {
                outerHTML(domNode, state.previousMarkup);
              }
            });
          });
        */
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

  socket.on('error', () => {
    console.log('Socket errored');
  });
}

open();
