import { Internals } from 'diffhtml';
import { $$render, $$vTree } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(state) {
  const oldState = this.state;

  this.state = assign({}, this.state, state);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render]();
  }
}
