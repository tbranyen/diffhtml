import { release, createTree, Internals } from 'diffhtml';
import getContext from '../util/get-context';
import {
  HOCCache,
  ChildParentCache,
  ComponentTreeCache,
  InstanceCache,
} from '../util/caches';

const { NodeCache } = Internals;
const { keys, assign } = Object;
const uppercaseEx = /[A-Z]/g;

function triggerRef(ref, node, instance) {
  if (typeof ref === 'function') {
    ref(node);
  }
  else if (typeof ref === 'string' && instance) {
    instance[ref](node);
  }
}

function componentDidMount(newTree) {
  const instance = InstanceCache.get(newTree);
  const parentTree = ChildParentCache.get(newTree)
  const hocTree = HOCCache.get(newTree) || HOCCache.get(parentTree);

  if (typeof parentTree.rawNodeName === 'function') {
    const instance = InstanceCache.get(parentTree);

    if (instance && instance.componentDidMount) {
      instance.componentDidMount();
    }
  }

  if (hocTree) {
    const instance = InstanceCache.get(hocTree);

    if (instance && instance.componentDidMount) {
      instance.componentDidMount();
    }
  }

  if (newTree.attributes.ref) {
    triggerRef(newTree.attributes.ref, NodeCache.get(newTree), instance);
  }

  newTree.childNodes.forEach(componentDidMount);

  if (!instance) {
    return;
  }

  const { ref } = instance.props;
  triggerRef(ref, instance, instance);
}

function componentDidUnmount(oldTree) {
  const oldChild = ChildParentCache.get(oldTree);
  const instance = InstanceCache.get(oldChild) || InstanceCache.get(oldTree);

  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }

  const domNode = NodeCache.get(oldTree);

  release(domNode);

  if (HOCCache.has(oldTree)) {
    const instance = InstanceCache.get(HOCCache.get(oldTree));

    if (instance && instance.componentWillUnmount) {
      instance.componentWillUnmount();
    }

    HOCCache.delete(oldTree);
  }

  if (oldTree.attributes.ref) {
    triggerRef(oldTree.attributes.ref, NodeCache.get(oldTree), instance);
  }

  oldTree.childNodes.forEach(componentDidUnmount);

  if (!instance) {
    return;
  }

  const { ref } = instance.props;

  triggerRef(ref, null, instance);
}

export default function reactLikeComponentTask(transaction) {
  transaction.onceEnded(() => {
    if (transaction.aborted) {
      return;
    }

    const { patches } = transaction;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      const { SET_ATTRIBUTE } = patches;
      uppercaseEx.lastIndex = 0;

      if (SET_ATTRIBUTE && SET_ATTRIBUTE.length) {
        for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
          const oldTree = SET_ATTRIBUTE[i];
          let name = SET_ATTRIBUTE[i + 1];
          const value = SET_ATTRIBUTE[i + 2];

          // Normalize uppercase attributes.
          if (uppercaseEx.test(name)) {
            uppercaseEx.lastIndex = 0;
            name = name.replace(uppercaseEx, ch => `-${ch.toLowerCase()}`);

            if (value && typeof value === 'string') {
              NodeCache.get(oldTree).setAttribute(name, value);
            }
          }
        }
      }

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
              ChildParentCache.delete(oldTree);
            }

            InstanceCache.delete(oldTree);
            componentDidMount(newTree);
          }
        }

        if (REMOVE_CHILD) {
          for (let i = 0; i < REMOVE_CHILD.length; i += 1) {
            const oldTree = REMOVE_CHILD[i];
            const oldInstance = InstanceCache.has(oldTree);

            componentDidUnmount(oldTree);

            if (oldInstance) {
              ComponentTreeCache.delete(oldInstance);
              InstanceCache.delete(oldTree);
              ChildParentCache.delete(oldTree);
            }
          }
        }
      });
    }
  });

  return () => {
    // Look for patches to remove attrs from.
    if (transaction.patches.SET_ATTRIBUTE.length) {
      const { patches } = transaction;
      const newSetAttr = [];

      for (let i = 0; i < patches.SET_ATTRIBUTE.length; i += 3) {
        const vTree = patches.SET_ATTRIBUTE[i];
        const name = patches.SET_ATTRIBUTE[i + 1];
        const value = patches.SET_ATTRIBUTE[i + 2];

        // FIXME Figure out better way to clean this up.
        if (name !== 'className') {
          newSetAttr.push(vTree, name, value);
        }
        else {
          NodeCache.get(vTree).removeAttribute(name);
        }
      }

      patches.SET_ATTRIBUTE = newSetAttr;
    }
  };
}

function renderComponent({ oldTree, newTree, oldChild, newChild }) {
  let oldInstanceCache = null;

  if (oldChild && oldChild.nodeName) {
    oldInstanceCache = InstanceCache.get(ChildParentCache.get(oldChild));
  }

  const newCtor = newChild.rawNodeName;
  const { childNodes } = newChild;
  const children = (childNodes.length === 1 ? childNodes[0] : childNodes) || [];
  const props = assign({}, newChild.attributes, { children });
  const canNew = newCtor.prototype && newCtor.prototype.render;

  // If the component has already been initialized, we can reuse it.
  const oldInstance = oldInstanceCache instanceof newCtor && oldInstanceCache;
  const context = getContext(oldTree);
  const newInstance = !oldInstance && canNew && new newCtor(props, context);
  const instance = oldInstance || newInstance;

  let renderTree = null;

  if (instance) {
    const { defaultProps = {} } = instance.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in props && props[prop] !== undefined) {
        return;
      }

      props[prop] = defaultProps[prop];
    });
  }

  if (oldInstance) {
    if (oldInstance.componentWillReceiveProps) {
      oldInstance.componentWillReceiveProps(props);
    }

    oldInstance.props = props;
    InstanceCache.delete(ComponentTreeCache.get(oldInstance));

    if (oldInstance.shouldComponentUpdate && oldInstance.shouldComponentUpdate()) {
      renderTree = oldInstance.render(props, oldInstance.state);
      oldInstance.componentDidUpdate(props, oldInstance.state || {});
    }

    ComponentTreeCache.set(oldInstance, renderTree);
    InstanceCache.set(renderTree, oldInstance);
    oldTree.childNodes.splice(oldTree.childNodes.indexOf(newTree), 1, renderTree);

    return renderTree;
  }
  else if (instance && instance.render) {
    instance.props = props;

    renderTree = createTree(instance.render(props, instance.state));

    if (renderTree) {
      ChildParentCache.set(renderTree, newTree);
    }
  }
  else if (typeof newCtor === 'function') {
    renderTree = createTree(newCtor(props));
    InstanceCache.set(renderTree, instance);
  }

  // Nothing was rendered so continue.
  if (!renderTree) {
    return null;
  }

  // A higher order component is when a component renders a nested component.
  // We track these here to invoke properly during lifecycle events. As they
  // do not produce elemenets of their own, they get optimized out of the
  // diffHTML tree. This is the only way possible to reference them.
  if (typeof renderTree.rawNodeName === 'function') {
    HOCCache.set(renderTree, oldInstance ? oldTree : newTree);
    ComponentTreeCache.set(instance, oldInstance ? oldTree : newTree);
    InstanceCache.set(newTree, instance);
  }
  // Replace the rendered value into the new tree, if rendering a fragment
  // this will inject the contents into the parent.
  else if (typeof renderTree.rawNodeName === 'string' && renderTree.nodeType === 11) {
    newTree.childNodes = [...renderTree.childNodes];

    if (instance) {
      ComponentTreeCache.set(instance, oldTree);
      InstanceCache.set(oldTree, instance);
    }
  }
  // If the rendered value is a single element use it as the root for
  // diffing.
  else if (instance) {
    ComponentTreeCache.set(instance, renderTree);
    InstanceCache.set(newTree, instance);
  }

  if (oldTree) {
    oldTree.childNodes.splice(oldTree.childNodes.indexOf(newTree), 1, renderTree);
  }

  return renderTree;
}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree, keys, parentTree) => {
  // Top level component to process.
  if (newTree && typeof newTree.rawNodeName === 'function') {
    const upgraded = renderComponent({
      oldTree: parentTree,
      newTree,
      oldChild: oldTree,
      newChild: newTree,
    });

    if (!ChildParentCache.has(newTree)) {
      ChildParentCache.set(upgraded, newTree);
      ChildParentCache.set(newTree, parentTree);
    }

    return upgraded;
  }

  // Do not pave over HOC that have been set outside of the physical tree.
  if (!ChildParentCache.has(newTree)) {
    ChildParentCache.set(newTree, parentTree);
  }

  return newTree;
};
