export const marks = new Map();
export const prefix = 'diffHTML';
const token = 'diff_perf';

const hasSearch = typeof location !== 'undefined' && location.search;
const hasArguments = typeof process !== 'undefined' && process.argv;
const wantsSearch = hasSearch && location.search.includes(token);
const wantsArguments = hasArguments && process.argv.includes(token);
const wantsPerfChecks = wantsSearch || wantsArguments;
const nop = () => {};

export default (domNode, vTree) => {
  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) { return nop; }

  return name => {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = `${domNode.host.constructor.name} ${name}`;
    }
    else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTreevTree.name} ${name}`;
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
};
