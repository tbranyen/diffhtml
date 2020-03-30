import { $$render } from '../util/symbols';

export default function forceUpdate() {
  this[$$render]();
}