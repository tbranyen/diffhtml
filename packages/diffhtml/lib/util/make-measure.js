import getConfig from './config';
import { EMPTY } from './types';

const prefix = 'diffHTML';
const marks = new Map();
let count = 0;

/**
 * Creates a measure function that will collect data about the currently running
 * transaction.
 *
 * @param {import('../transaction').default} transaction
 * @return {(name: string) => void}
 */
export default function makeMeasure(transaction) {
  const { mount, input } = transaction;
  const inputAsVTree = /** @type {import('./types').VTree} */ (input);
  const id = count++;

  // Marks will only be available if the user has requested they want to collect
  // metrics.
  if (!getConfig('collectMetrics', false)) { return EMPTY.FUN; }

  return name => {
    name = `[${id}] ${name}`;

    const { host } = /** @type {any} */ (mount);

    // Use the Web Component name if it's available.
    if (mount && host) {
      name = `${host.constructor.name} ${name}`;
    }
    // Otherwise try an find the function name used.
    else if (inputAsVTree && typeof inputAsVTree.rawNodeName === 'function') {
      name = `${inputAsVTree.rawNodeName.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (marks.has(name)) {
      const prevMark = marks.get(name) || 0;
      const totalMs = (performance.now() - prevMark).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
    else {
      marks.set(name, performance.now());
      performance.mark(name);
    }
  };
}
