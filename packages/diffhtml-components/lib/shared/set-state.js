import { $$render } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(state) {
  this.state = assign({}, this.state, state);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render]();
  }
}