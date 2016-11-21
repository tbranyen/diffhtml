export const marks = new Map();
export const prefix = 'diffHTML';

const wantsPerfChecks = location.search.includes('diff_perf');

export function mark(name) {
  if (!wantsPerfChecks) { return; }

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
}
