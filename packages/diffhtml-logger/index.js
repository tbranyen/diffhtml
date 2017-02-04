const identity = x => x;
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

const format = patches => {
  const newPatches = {
    ELEMENT: {
      INSERT_BEFORE: [],
      REMOVE_CHILD: [],
      REPLACE_CHILD: [],
      NODE_VALUE: [],
    },

    ATTRIBUTE: {
      SET: [],
      REMOVE: [],
    },
  };

  const { ELEMENT, ATTRIBUTE } = newPatches;

  patches.forEach(changeset => {
    const INSERT_BEFORE = changeset[0];
    const REMOVE_CHILD = changeset[1];
    const REPLACE_CHILD = changeset[2];
    const NODE_VALUE = changeset[3];
    const SET_ATTRIBUTE = changeset[4];
    const REMOVE_ATTRIBUTE = changeset[5];

    INSERT_BEFORE.forEach(patch => {
      const [ vTree, fragment, referenceNode ] = patch;
      ELEMENT.INSERT_BEFORE.push({ vTree, fragment, referenceNode });
    });

    REMOVE_CHILD.forEach(patch => {
      const [ vTree, childNode ] = patch;
      ELEMENT.REMOVE_CHILD.push({ vTree, childNode });
    });

    REPLACE_CHILD.forEach(patch => {
      const [ vTree, newChildNode, oldChildNode ] = patch;
      ELEMENT.REPLACE_CHILD.push({ vTree, newChildNode, oldChildNode });
    });

    SET_ATTRIBUTE.forEach(patch => {
      const [ vTree, attributesList ] = patch;
      const attributes = {};

      for (let i = 0; i < attributesList.length; i++) {
        const [name, value] = attributesList[i];
        attributes[name] = value;
      }

      ATTRIBUTE.SET.push({ vTree, attributes });
    });

    REMOVE_ATTRIBUTE.forEach(patch => {
      const [ vTree, attributesList ] = patch;
      const attributes = {};

      for (let i = 0; i < attributesList.length; i++) {
        const list = attributesList[i];

        for (let i = 0; i < list.length; i++) {
          attributes[list[i].name] = list[i].value;
        }
      }

      ATTRIBUTE.REMOVE.push({ vTree, attributes });
    });
  });

  return newPatches;
};

/**
 * Re-usable log function. Used for during render and after render.
 *
 * @param message - Prefix for the console output.
 * @param method - Which console method to call
 * @param color - Which color styles to use
 * @param date - A date object to render
 * @param transaction - Contains: domNode, oldTree, newTree, patches, promises
 * @param options - Middleware options
 */
const log = (message, method, color, date, transaction, completed) => {
  const {
    domNode,
    oldTree,
    newTree,
    patches,
    promises,
    options,
    markup,
    state,
  } = transaction;

  // Shadow DOM rendering...
  if (domNode.host) {
    const { name: ctorName }  = domNode.host.constructor;

    console[method](
      `%c${ctorName} render ${completed ? 'ended' : 'started' }`,
      `color: ${stringToRGB(ctorName)}${completed ? '; opacity: 0.5' : ''}`,
      completed ? completed : ''
    );
  }
  else {
    console[method](message, color, completed ? completed : '');
  }

  if (!completed && domNode) {
    console.log('%cdomNode %O', 'font-weight: bold; color: #333', domNode);
  }

  if (!completed && markup) {
    console.log('%cmarkup %O', 'font-weight: bold; color: #333', markup);
  }

  if (!completed && options) {
    console.log(
      '%coptions',
      'font-weight: bold; color: #333',
      options
    );
  }

  if (oldTree || newTree) {
    console.log(
      '%coldTree %O newTree %O',
      'font-weight: bold; color: #333',
      transaction._cloneOldTree,
      cloneTree(newTree)
    );
  }

  if (patches) {
    console.log('%cpatches %O', 'font-weight: bold; color: #333', patches);
  }

  // Don't clutter the output if there aren't any promises.
  if (promises && promises.length) {
    console.log(
      '%ctransition promises %O', 'font-weight: bold; color: #333', promises
    );
  }
};

//
export default opts => function loggerTask(transaction) {
  const start = new Date();

  log(
    '%cdiffHTML...render transaction started',
    'group',
    'color: #FF0066',
    start,
    transaction
  );

  const { state: { oldTree } } = transaction;

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
        '%cdiffHTML...render transaction ended  ',
        'group',
        'color: #FF78B2',
        new Date(),
        transaction,
        ' >> Completed in: ' + humanize(Date.now() - start)
      );

      console.groupEnd();
    });
  };
};
