import lifecycleHooks from './lifecycle-hooks';
import setState from './set-state';

export default function wrap(Constructor) {
  Object.assign(Constructor.prototype, lifecycleHooks, { setState });
  return Constructor;
}
