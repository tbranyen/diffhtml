import createTree from 'diffhtml/dist/cjs/tree/create';
import { NodeCache } from 'diffhtml-shared-internals/dist/cjs/caches';
import { ComponentTreeCache, InstanceCache } from '../util/caches';

const { assign } = Object;

function triggerRef(ref, instance) {
  if (typeof ref === 'function') {
    ref(instance);
  }
  else if (typeof ref === 'string') {
    this[ref](instance);
  }
}

function searchForRefs(newTree) {
  if (newTree.attributes.ref) {
    triggerRef(newTree.attributes.ref, NodeCache.get(newTree));
  }

  newTree.childNodes.forEach(searchForRefs);
}

function componentDidMount(newTree) {
  if (InstanceCache.has(newTree)) {
    InstanceCache.get(newTree).componentDidMount();
  }

  const instance = InstanceCache.get(newTree);

  searchForRefs(newTree);

  if (!instance) {
    return;
  }

  const { ref } = instance.props;

  triggerRef(ref, instance);
}

function componentDidUnmount(oldTree) {
  if (InstanceCache.has(oldTree)) {
    InstanceCache.get(oldTree).componentDidUnmount();
  }

  const instance = InstanceCache.get(oldTree);

  searchForRefs(oldTree);

  if (!instance) {
    return;
  }

  const { ref } = instance.props;

  triggerRef(ref, null);
}

export default function reactLikeComponentTask(transaction) {
  return transaction.onceEnded(() => {
    const { patches } = transaction;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      patches.TREE_OPS.forEach(({
        INSERT_BEFORE,
        REPLACE_CHILD,
        REMOVE_CHILD,
      }) => {
        if (INSERT_BEFORE) {
          for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
            const newTree = INSERT_BEFORE[i + 1];
            componentDidMount(newTree);
          }
        }

        if (REPLACE_CHILD) {
          for (let i = 0; i < REPLACE_CHILD.length; i += 3) {
            const newTree = REPLACE_CHILD[i + 1];
            componentDidMount(newTree);
          }
        }

        if (REMOVE_CHILD) {
          for (let i = 0; i < REMOVE_CHILD.length; i += 1) {
            const oldTree = REMOVE_CHILD[i];
            componentDidUnmount(oldTree);
          }
        }
      });
    }
  });
}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const newCtor = newChild.rawNodeName;
      const oldInstanceCache = InstanceCache.get(oldChild);
      const children = newChild.childNodes;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldChild && oldInstanceCache instanceof newCtor && oldInstanceCache;
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;

      let renderTree = null;

      if (oldInstance) {
        oldInstance.componentWillReceiveProps(props);

        if (oldInstance.shouldComponentUpdate()) {
          renderTree = oldInstance.render(props, oldInstance.state);
        }
      }
      else {
        renderTree = createTree
          (instance && instance.render ? instance.render(props, instance.state) : newCtor(props)
        );
      }

      if (!renderTree) {
        continue;
      }

      if (renderTree.nodeType === 11) {
        throw new Error('Top level render must return single Node');
      }

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree.
      if (instance) {
        ComponentTreeCache.set(instance, renderTree);
        InstanceCache.set(renderTree, instance);
      }

      // Recursively update trees.
      return newTree;
    }
  }
};
