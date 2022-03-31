import { $$hooks } from './util/symbols';
import { EMPTY, ActiveRenderState } from './util/types';

/**
 * Allow a function component to hook into lifecycle methods in a manner
 * consistent with class components.
 *
 * @param {Function} sideEffectFn - A function that is called whenever the
 * component is mounted or updated. To invoke cleanup pass a second function
 * which will run whenever the component is removed.
 *
 * @returns {void}
 */
export function createSideEffect(sideEffectFn) {
  if (ActiveRenderState.length === 0) {
    throw new Error('Cannot create side effect unless in render function');
  }

  if (typeof sideEffectFn !== 'function') {
    throw new Error('Missing function for side effect');
  }

  const [ activeComponent ] = ActiveRenderState;
  const hooks = activeComponent[$$hooks];

  // First schedule a componentDidMount
  activeComponent.componentDidMount = activeComponent.componentDidUpdate = () => {
    const unMount = sideEffectFn() || EMPTY.FUN;

    if (typeof unMount === 'function') {
      activeComponent.componentWillUnmount = () => unMount();
    }
  };

  // Return currentValue and setState.
  hooks.fns[hooks.i] = sideEffectFn;

  // Increment the hooks count.
  hooks.i += 1;
}
