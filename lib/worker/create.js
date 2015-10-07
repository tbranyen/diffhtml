import uuid from '../util/uuid';
import { pools as _pools, initializePools, createPool } from '../util/pools';
import { count as poolCount } from '../util/pools';
import { parseHTML, makeParser } from '../util/parser';
import { protectElement, unprotectElement, cleanMemory } from '../util/memory';
import syncNode from '../node/sync';
import workerSource from './source';

var pools = _pools;

export var hasWorker = typeof Worker === 'function';

export function create() {
  let workerBlob = null;
  let worker = null;

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

        // Adds in a global `uuid` function.
        uuid,

        // Add the ability to protect elements from free'd memory.
        protectElement,
        unprotectElement,
        cleanMemory,

        // Add in pool manipulation methods.
        createPool,
        initializePools,
        'initializePools(' + poolCount + ');',

        // Add in Node manipulation.
        'var syncNode = ' + syncNode,

        // Add in the ability to parseHTML.
        parseHTML,

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

  return worker;
}
