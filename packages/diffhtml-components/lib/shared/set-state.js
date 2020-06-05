import { $$render } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function setState(state) {
  this.state = assign({}, this.state, state);

  this.componentWillReceiveProps(this.props, this.state);

  if (!Debounce.has(this) && this.shouldComponentUpdate(this.props, this.state)) {
    // Only render if we have an instance (has rendered before).
    this[$$render]();
  }
}
