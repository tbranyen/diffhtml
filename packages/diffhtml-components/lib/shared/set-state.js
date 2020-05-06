import { $$vTree, $$render } from '../util/symbols';
import { InstanceCache } from '../util/caches';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(state) {
  this.state = assign({}, this.state, state);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    // Only render if we have an instance (has rendered before).
    this[$$render]();
  }
}
