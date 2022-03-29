import { $$hooks } from './util/symbols';
import { EMPTY, ActiveRenderState } from './util/types';

/**
 * Allow a function component to hook into lifecycle in a manner consistent
 * with class components.
 *
 * @param {Function} sideEffectFn
 * @returns {void}
 */
export function createSideEffect(sideEffectFn = EMPTY.FUN) {
  if (ActiveRenderState.length === 0) {
    throw new Error('Cannot create side effect unless in render function');
  }

  if (typeof sideEffectFn !== 'function') {
    throw new Error('Missing function for side effect');
  }

  const [ activeComponent ] = ActiveRenderState;
  const activeHook = activeComponent[$$hooks].shift();

  // Only do this the first time.
  if (!activeHook) {
    /** @type {function} */
    let unMount = EMPTY.FUN;

    // First schedule a componentDidMount
    activeComponent.componentDidMount = activeComponent.componentDidUpdate = () => {
      // Always unmount first
      unMount();

      unMount = sideEffectFn() || EMPTY.FUN;

      if (typeof unMount === 'function') {
        activeComponent.componentWillUnmount = () => unMount();
      }
    };

    // Return currentValue and setState.
    activeComponent[$$hooks].push(sideEffectFn);
  }
}
