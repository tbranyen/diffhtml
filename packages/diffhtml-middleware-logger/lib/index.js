const { assign } = Object;

const humanize = ms => {
  if (ms >= 1000) {
    return `${ms / 1000}s`;
  }

  return `${ms}ms`;
};

const stringToRGB = string => {
  const code = string.split('').reduce((
    (hash, _, i) => `${string.charCodeAt(i) + (hash << 5) - hash}`
  ), 0);

  const hex = (code & 0x00FFFFFF).toString(16);
  return `#${'00000'.slice(0, 6 - hex.length) + hex}`;
};

const cloneTree = tree => assign({}, tree, {
  attributes: assign({}, tree.attributes),
  childNodes: tree.childNodes.map(vTree => cloneTree(vTree))
});

let Internals = null;

/**
 * @returns {any}
 */
const format = (patches) => {
  if (!Internals) {
    return {};
  }

  const { decodeEntities, PATCH_TYPE } = Internals;

  const newPatches = {
    'Node (Insert)': [],
    'Node (Remove)': [],
    'Node (Replace)': [],
    'Node value (Set)': [],
    'Attribute (Set)': [],
    'Attribute (Remove)': [],
  };

  const { length } = patches;

  let i = 0;
  let uniquePatches = 0;

  while (true) {
    const patchType = patches[i];

    if (i === length) {
      break;
    }

    uniquePatches += 1;

    switch(patchType) {
      case PATCH_TYPE.SET_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];
        const value = decodeEntities(patches[i + 3]);

        newPatches['Attribute (Set)'].push({
          'Node': Internals.NodeCache.get(vTree),
          'Name': name,
          'Value': value,
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.REMOVE_ATTRIBUTE: {
        const vTree = patches[i + 1];
        const name = patches[i + 2];

        newPatches['Attribute (Remove)'].push({
          'Node': Internals.NodeCache.get(vTree),
          'Name': name,
        });

        i += 3;
        break;
      }

      case PATCH_TYPE.NODE_VALUE: {
        const vTree = patches[i + 1];
        const nodeValue = patches[i + 2];
        const oldValue = patches[i + 3];

        newPatches['Node value (Set)'].push({
          'Node': Internals.NodeCache.get(vTree),
          'Value': nodeValue,
          'Old value': oldValue,
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.INSERT_BEFORE: {
        const vTree = patches[i + 1];
        const newTree = patches[i + 2];
        const refTree = patches[i + 3];

        newPatches['Node (Insert)'].push({
          'Container': Internals.NodeCache.get(vTree),
          'Node': Internals.NodeCache.get(newTree),
          'Insert Before': Internals.NodeCache.get(refTree),
        });

        i += 4;
        break;
      }

      case PATCH_TYPE.REPLACE_CHILD: {
        const newTree = patches[i + 1];
        const oldTree = patches[i + 2];

        newPatches['Node (Replace)'].push({
          'New node': Internals.NodeCache.get(newTree),
          'New tree': newTree,
          'Old tree': oldTree,
        });

        i += 3;
        break;
      }

      case PATCH_TYPE.REMOVE_CHILD: {
        const vTree = patches[i + 1];

        newPatches['Node (Remove)'].push({
          'Tree': vTree,
        });

        i += 2;
        break;
      }
    }
  }

  return [newPatches, uniquePatches];
};

/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param {string} message - Prefix for the console output.
 * @param {string} method - Which console method to call
 * @param {string} color - Which color styles to use
 * @param {Date} _date - A date object to render
 * @param {import('diffhtml/lib/transaction').default} transaction - Contains: domNode, oldTree, newTree, patches, promises
 * @param {any=} completed - Middleware options
 */
const log = (message, method, color, _date, transaction, completed) => {
  const {
    mount,
    newTree,
    patches,
    promises,
    config,
    input,
    state,
  } = transaction;

  // Shadow DOM rendering...
  if (mount.host) {
    const { name: ctorName }  = mount.host.constructor;

    console[method](
      `%c${ctorName} render ${completed ? 'ended' : 'started' }`,
      `color: ${stringToRGB(ctorName)}${completed ? '; opacity: 0.5' : ''}`,
      completed ? completed : ''
    );
  }
  else {
    console[method](message, color, completed ? completed : '');
  }

  if (!completed && mount) {
    console.log('%cdomNode %O', 'font-weight: bold; color: #868686', mount);
  }

  if (!completed && input) {
    console.log('%cmarkup %O', 'font-weight: bold; color: #868686', input);
  }

  if (!completed && config) {
    console.log(
      '%coptions',
      'font-weight: bold; color: #868686',
      config
    );
  }

  if (state) {
    console.log(
      '%cstate %O',
      'font-weight: bold; color: #868686',
      state,
    );
  }

  if (transaction._cloneOldTree || newTree) {
    console.log(
      '%coldTree %O newTree %O',
      'font-weight: bold; color: #868686',
      transaction._cloneOldTree,
      cloneTree(newTree)
    );
  }

  if (patches && patches.length) {
    const [ formattedPatches, uniqueCount ] = format(patches);

    console.log(
      '%cpatches (%d) %O', 'font-weight: bold; color: #868686',
      uniqueCount,
      formattedPatches,
    );
  }

  // Don't clutter the output if there aren't any promises.
  if (promises && promises.length) {
    console.log(
      '%ctransition promises %O', 'font-weight: bold; color: #868686', promises
    );
  }
};

const logger = ({ minimize = false }) => assign(function loggerTask(transaction) {
  const start = new Date();
  const { domNode } = transaction;
  const name = domNode.name || domNode.displayName || domNode.nodeName;

  log(
    `%c<${transaction.domNode.nodeName}> render started  `,
    'groupCollapsed',
    'color: #FF0066',
    start,
    transaction
  );

  const { oldTree } = transaction;

  if (transaction.state.isRendering) {
    console.groupEnd();

    log(
      `%c<${name}> render aborted  `,
      minimize ? 'groupCollapsed' : 'group',
      'color: #FF78B2',
      new Date(),
      transaction
    );

    console.groupEnd();
  }

  transaction._cloneOldTree = oldTree && cloneTree(oldTree);

  /**
   * Transaction is effectively done, but we need to listen for it to actually
   * be finished.
   */
  return () => {
    // Transaction has fully completed.
    transaction.onceEnded(() => {
      console.groupEnd();

      log(
        `%c<${name}> render ended  `,
        minimize ? 'groupCollapsed' : 'group',
        'color: #FF78B2',
        new Date(),
        transaction,
        ' >> Completed in: ' + humanize(Date.now() - Number(start))
      );

      console.groupEnd();
    });
  };
}, {
  displayName: 'loggerTask',

  subscribe(_Internals) {
    Internals = _Internals;
  },
});

export default (opts = {}) => logger(opts);
