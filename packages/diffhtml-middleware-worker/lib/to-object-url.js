/**
 * Creates a virtual URL that can be used to create a Worker. This is useful
 * for inlining a script to run, vs using a phsyical file. Since the operations
 * are repetitive we offer this feature as a helper function.
 *
 * @param {Function} fn - Wrapper function containing code to execute in a
 *                        worker
 * @returns {String} URL
 */
export function toObjectURL(fn) {
  const fnString = String(fn);
  const firstBracket = fnString.indexOf('{') + 1;
  const lastBracket = fnString.lastIndexOf('}');
  const workerCode = String(fn).slice(firstBracket, lastBracket);

  return URL.createObjectURL(
    // Create a new blob and split the workerCode so it becomes an array with a
    // single entry.
    new Blob(workerCode.split()),
  );
}
