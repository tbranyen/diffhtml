import { $$render } from '../util/symbols';

const Debounce = new WeakMap();
const { assign } = Object;

export default function forceUpdate() {
  this[$$render]();
}
