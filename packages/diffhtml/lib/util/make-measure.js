import { Mount, ValidInput, VTree } from "./types";
import getConfig from './config';

export const marks = new Map();
export const prefix = 'diffHTML';

const nop = () => {};

/**
 *
 * @param {Mount} mount
 * @param {ValidInput=} input
 * @return {(name: string) => void}
 */
export default function makeMeasure(mount, input) {
  const wantsPerfChecks = getConfig('collectMetrics', false);

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) { return nop; }

  const inputAsVTree = /** @type {VTree} */ (input);

  return name => {
    const host = /** @type any */ (mount).host;

    // Use the Web Component name if it's available.
    if (mount && host) {
      name = `${host.constructor.name} ${name}`;
    }
    else if (inputAsVTree && typeof inputAsVTree.rawNodeName === 'function') {
      name = `${inputAsVTree.rawNodeName.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    }
    else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
}