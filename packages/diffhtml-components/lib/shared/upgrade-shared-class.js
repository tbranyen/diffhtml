import lifecycleHooks from './lifecycle-hooks';
import setState from './set-state';

const { assign } = Object;

export default function upgradeClass(Constructor) {
  assign(Constructor.prototype, lifecycleHooks, { setState });
  return Constructor;
}
