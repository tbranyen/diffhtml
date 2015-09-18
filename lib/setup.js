import uuid from './util/uuid';
import * as buffers from './util/buffers';
import { pools as _pools, initializePools, createPool } from './util/pools';
import { count as poolCount } from './util/pools';
import { parseHTML, makeParser } from './util/parser';
import { copyElement, copyElementAttribute } from './element/copy';
import syncNode from './node/sync';
import workerSource from './worker';

let pools = _pools;

export let hasWorker = typeof Worker === 'function';
export let workerBlob = null;
export let worker = null;

// Set up a WebWorker if available.
if (hasWorker) {
  // Construct the worker reusing code already organized into modules.  Keep
  // this code ES5 since we do not get time to pre-process it as ES6.
  workerBlob = new Blob([
    [
      // Reusable Array methods.
      'var slice = Array.prototype.slice;',

      // Add a namespace to attach pool methods to.
      'var pools = {};',
      'var nodes = 0;',

      // Allows elements and attributes to be copied.
      copyElement,
      copyElementAttribute,

      // Adds in a global `uuid` function.
      uuid,

      // Add in pool manipulation methods.
      createPool,
      initializePools,
      'initializePools(' + poolCount + ');',

      // Add in Node manipulation.
      'var syncNode = ' + syncNode,

      // Add in the ability to parseHTML.
      parseHTML,

      // Give the webworker utilities.
      buffers.stringToBuffer,
      buffers.bufferToString,

      'var makeParser = ' + makeParser,
      'var parser = makeParser();',

      // Add in the worker source.
      workerSource,

      // Metaprogramming up this worker call.
      'startup(self);'
    ].join('\n')
  ], { type: 'application/javascript' });

  // Construct the worker and start it up.
  try {
    worker = new Worker(URL.createObjectURL(workerBlob));
  }
  catch(e) {
    if (console && console.info) {
      console.info("Failed to create diffhtml worker",e);
    }

    hasWorker = false;
  }
}
