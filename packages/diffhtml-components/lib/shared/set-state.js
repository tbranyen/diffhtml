import { Internals } from 'diffhtml';
import { $$render, $$vTree } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(state) {
  const oldState = this.state;

  this.state = assign({}, this.state, state);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render]();

    //Debounce.set(this, setTimeout(() => {
    //  Debounce.delete(this);

    //  // Grab the associated VTree.
    //  const vTree = this[$$vTree];

    //  if (!Internals.Pool.memory.protected.has(vTree)) {
    //    return;
    //  }

    //  // Trigger its lifecycle willreceiveprops function.
    //  this.componentWillReceiveProps(vTree.attributes, oldState);

    //  if (this.shouldComponentUpdate()) {
    //    this[$$render]();
    //  }
    //}));
  }
}
