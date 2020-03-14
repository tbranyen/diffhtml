export const marks = new Map();
export const prefix = 'diffHTML';

const DIFF_PERF = 'diff_perf';
const hasSearch = typeof location !== 'undefined';
const hasArguments = typeof process !== 'undefined' && process.argv;
const nop = () => {};

/**
 *
 * @param {HTMLElement} domNode
 * @param {any} vTree
 */
export default function makeMeasure(domNode, vTree) {
  // Check for these changes on every check.
  const wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  const wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  const wantsPerfChecks = wantsSearch || wantsArguments;

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) { return nop; }

  return name => {
    const host = /** @type any */ (domNode).host;

    // Use the Web Component name if it's available.
    if (domNode && host) {
      name = `${host.constructor.name} ${name}`;
    }
    else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTree.rawNodeName.name} ${name}`;
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