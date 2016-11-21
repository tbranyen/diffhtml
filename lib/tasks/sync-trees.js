import { NodeCache } from '../util/caches';
import { createElement, syncTree } from '../tree';

const { slice, filter } = Array.prototype;

// Patch actions.
export const REMOVE_ELEMENT_CHILDREN = -2;
export const REMOVE_ENTIRE_ELEMENT = -1;
export const REPLACE_ENTIRE_ELEMENT = 0;
export const MODIFY_ELEMENT = 1;
export const MODIFY_ATTRIBUTE = 2;
export const CHANGE_TEXT = 3;

const runCtor = (vTree, oldMount) => {
  const props = Object.freeze(Object.assign({}, vTree.attributes, {
    children: Object.freeze(vTree.childNodes)
  }));

  const instance = new vTree.nodeName(props);

  // Initial render.
  const newMount = instance.render();

  // Return a single Node or multiple nodes depending on the return value.
  instance.getDOMNode = () => {
    const node = oldMount || newMount;
    return Array.isArray(node) ? node.map(NodeCache.get) : NodeCache.get(node);
  };

  return Array.isArray(newMount) ? createElement('#document-fragment', null, newMount) : newMount;
};

export default function sync(transaction) {
  const { state, newTree } = transaction;

  state.mark('sync');
  transaction.patches = syncTree(state.oldTree, newTree, []);
  state.mark('sync');
}
