import { createTree, Internals } from 'diffhtml';
import { ContextCache, ComponentTreeCache, InstanceCache } from '../util/caches';

const { NodeCache } = Internals;
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
    if (transaction.aborted) {
      return;
    }

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
          for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
            const newTree = REPLACE_CHILD[i];
            const oldTree = REPLACE_CHILD[i + 1];

            if (InstanceCache.has(oldTree)) {
              ComponentTreeCache.delete(InstanceCache.get(oldTree));
              InstanceCache.delete(oldTree);
            }

            InstanceCache.delete(oldTree);
            componentDidMount(newTree);
          }
        }

        if (REMOVE_CHILD) {
          for (let i = 0; i < REMOVE_CHILD.length; i += 1) {
            const oldTree = REMOVE_CHILD[i];

            if (InstanceCache.has(oldTree)) {
              ComponentTreeCache.delete(InstanceCache.get(oldTree));
              InstanceCache.delete(oldTree);
            }

            componentDidUnmount(oldTree);
          }
        }
      });
    }
  });
}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree) => {
  const oldChildNodes = oldTree && oldTree.childNodes;

  if (newTree && newTree.children && !newTree.childNodes) {
    newTree = createTree(newTree.nodeName, newTree.attributes, newTree.children);
  }

  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const newCtor = newChild.rawNodeName;
      const oldChild = oldChildNodes && oldChildNodes[i];
      const oldInstanceCache = InstanceCache.get(oldChild);
      const children = newChild.childNodes;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldChild && oldInstanceCache instanceof newCtor && oldInstanceCache;
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;

      let renderTree = null;

      // Make child/parent relationship.
      ContextCache.set(instance, newTree);

      if (oldInstance) {
        oldInstance.componentWillReceiveProps(props);
        oldInstance.props = props;

        if (oldInstance.shouldComponentUpdate()) {
          renderTree = oldInstance.render(props, oldInstance.state);
        }
      }
      else if (instance && instance.render) {
        renderTree = createTree(instance.render(props, instance.state));
      }
      else {
        renderTree = createTree(newCtor(props));
      }

      // Nothing was rendered so continue.
      if (!renderTree) {
        continue;
      }

      // Replace the rendered value into the new tree, if rendering a fragment
      // this will inject the contents into the parent.
      if (renderTree.nodeType === 11) {
        newTree.childNodes = [...renderTree.childNodes];

        if (instance) {
          ComponentTreeCache.set(instance, oldTree);
          InstanceCache.set(oldTree, instance);
        }
      }
      // If the rendered value is a single element use it as the root for
      // diffing.
      else {
        newTree.childNodes[i] = renderTree;

        if (instance) {
          ComponentTreeCache.set(instance, renderTree);
          InstanceCache.set(renderTree, instance);
        }
      }
    }
  }

  return newTree;
};
