import { $$hooks } from './util/symbols';
import { ActiveRenderState } from './util/types';

/**
 * Create state allows a class or function component to create state from the
 * render function. Any other attempt to use this will fail. All createState
 * invocations must be in the exact same order, every render.
 *
 * Borrowed from the concept introduced by React, useState. This will be used by
 * the React Compatibility later renamed as `useState`. The reason this is named
 * `createState` is due to no guarentees of parity with React hooks.
 *
 * @param {any} defaultValue
 *
 * @returns {any[]}
 */
export function createState(defaultValue = {}) {
  if (ActiveRenderState.length === 0) {
    throw new Error('Cannot create state unless in render function');
  }

  const [ activeComponent ] = ActiveRenderState;
  const hooks = activeComponent[$$hooks];
  const activeHook = hooks.fns[hooks.i];
  const currentValue = activeHook ? activeHook[0] : defaultValue;
  const retVal = activeHook || [currentValue];

  /**
   * @param {any} newValue
   */
  const setState = newValue => {
    retVal[0] = newValue;
    return activeComponent.forceUpdate();
  };

  if (retVal.length === 1) {
    retVal.push(setState);
  }

  // Return currentValue and setState.
  hooks.fns[hooks.i] = retVal;

  // Increment the hooks count.
  hooks.i += 1;

  return retVal;
}
