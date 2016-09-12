const identity = x => x;

/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param message - Prefix for the console output.
 * @param method - Which console method to call
 * @param color - Which color styles to use
 * @param date - A date object to render
 * @param args - Contains: node, oldTree, newTree, patches, promises
 * @param options - Middleware options
 */
const log = (message, method, color, date, args, options) => {
  const { node, oldTree, newTree, patches, promises } = args;

  console[method](
    message,
    color,
    date.toLocaleString(),
    date.getMilliseconds() + 'ms'
  );

  console.log('%cnode %O', 'font-weight: bold; color: #333', node);
  console.log(
    '%coldTree %O newTree %O',
    'font-weight: bold; color: #333',
    oldTree,
    newTree
  );

  if (patches) {
    const filtered = patches.filter(options.filterPatches || identity);

    console.log('%cpatches %O', 'font-weight: bold; color: #333', filtered);
  }

  // Don't clutter the output if there aren't any promises.
  if (promises && promises.length) {
    console.log(
      '%ctransition promises %O', 'font-weight: bold; color: #333', promises
    );
  }

  console.groupEnd();
};

/**
 * Called when rendering starts.
 *
 * @param {Object} start - A JavaScript Date for the start of rendering
 * @return {Function} - A closure to dig into the middleware flow more
 */
export default (options={}) => opts => {
  const start = new Date();

  /**
   * Digs into the middleware methods.
   *
   * @param {Object} args - Arguments to be passed to log rendering.
   * @return {Function} - One final closure indicating rendering has completed
   */
  return args => {
    log(
      '%c</diffHTML> render transaction started',
      'groupCollapsed',
      'color: #FF0066',
      start,
      Object.assign(args, opts),
      options,
    );

    /**
     * Rendering has completed so render out another group.
     */
    return end => log(
      '%c</diffHTML> render transaction ended  ',
      'group',
      'color: #FF78B2',
      new Date(),
      Object.assign(args, end, opts),
      options,
    );
  };
};
