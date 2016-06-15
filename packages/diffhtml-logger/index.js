/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param message - Prefix for the console output.
 * @param method - Which console method to call
 * @param color - Which color styles to use
 * @param date - A date object to render
 * @param args - Contains: node, oldTree, newTree, patches, promises
 */
const log = (message, method, color, date, args) => {
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
  console.log('%cpatches %O', 'font-weight: bold; color: #333', patches);

  // Don't clutter the output if there aren't any promises.
  if (promises.length) {
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
export default function logger(start) {
  /**
   * Digs into the middleware methods.
   *
   * @param {Object} args - Arguments to be passed to log rendering.
   * @return {Function} - One final closure indicating rendering has completed
   */
  return args => {
    log(
      '%c∆ diffHTML render transaction started',
      'group',
      'color: #FF0066',
      start,
      args
    );

    /**
     * Rendering has completed so render out another group.
     */
    return end => log(
      '%c∆ diffHTML render transaction ended  ',
      'groupCollapsed',
      'color: #FF78B2',
      end,
      args
    );
  };
};
