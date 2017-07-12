import lifecycleHooks from './lifecycle-hooks';
import setState from './set-state';
import forceUpdate from './force-update';
import getChildContext from './get-child-context';

const { assign } = Object;

export default function upgradeClass(Constructor) {
  assign(Constructor.prototype, lifecycleHooks, {
    forceUpdate,
    setState,
    getChildContext,
  });

  return Constructor;
}
