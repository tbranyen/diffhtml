import { $$render } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(newState) {
  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render]();

    Debounce.set(this, setTimeout(() => {
      Debounce.delete(this);

      if (this.shouldComponentUpdate()) {
        this[$$render]();
      }
    }));
  }
}
