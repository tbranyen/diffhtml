import { $$vTree, $$render } from '../util/symbols';
import { ComponentTreeCache } from '../util/caches';
import { getBinding } from '../util/binding';

const Debounce = new WeakMap();
const { assign } = Object;
const { from } = Array;

export default function setState(state) {
  this.state = assign({}, this.state, state);

  const vTree = this[$$vTree];
  const { NodeCache } = getBinding().Internals;
  const childTrees = from(ComponentTreeCache.keys()).filter(key => {
    const rootTree = ComponentTreeCache.get(key);

    if (rootTree === vTree) {
      return true;
    }
  });

  if (childTrees.length && !Debounce.has(this) && this.shouldComponentUpdate()) {
    console.log('Updating', this.constructor.name);
    // Only render if we have an instance (has rendered before).
    this[$$render]();
  }
}
