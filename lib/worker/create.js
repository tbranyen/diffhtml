import uuid from '../util/uuid';
import { pools, initializePools, createPool } from '../util/pools';
import { count as poolCount } from '../util/pools';
import { parseHTML, makeParser } from '../util/parser';
import { protectElement, unprotectElement, cleanMemory } from '../util/memory';
import syncNode from '../node/sync';
import workerSource from './source';

// Tests if the browser has support for the `Worker` API.
export var hasWorker = typeof Worker === 'function';

/**
 * Creates a new Web Worker per element that will be diffed. Allows multiple
 * concurrent diffing operations to occur simultaneously, leveraging the
 * multi-core nature of desktop and mobile devices.
 *
 * Attach any functions that could be used by the Worker inside the Blob below.
 * All functions are named so they can be accessed globally. Since we're
 * directly injecting the methods into an Array and then calling `join` the
 * `toString` method will be invoked on each function and will inject a valid
 * representation of the function's source. This comes at a cost since Babel
 * rewrites variable names when you `import` a module. This is why you'll see
 * underscored properties being imported and then reassigned to non-underscored
 * names in modules that are reused here.
 *
 * @return {Object} A Worker instance.
 */
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

      // If we cannot create a Worker, then disable trying again, all work
      // will happen on the main UI thread.
      hasWorker = false;
    }
  }

  return worker;
}
