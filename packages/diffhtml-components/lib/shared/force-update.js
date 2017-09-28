import { $$render } from '../util/symbols';

export default function forceUpdate(state) {
  this[$$render]();
}
