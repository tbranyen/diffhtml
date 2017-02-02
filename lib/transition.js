import { TransitionCache } from './util';

// Available transition states.
const stateNames = [
  'attached',
  'detached',
  'replaced',
  'attributeChanged',
  'textChanged',
];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => TransitionCache.set(stateName, new Set()));

export function addTransitionState(stateName, callback) {
  if (!stateName) {
    throw new Error('Missing transition state name');
  }

  if (!callback) {
    throw new Error('Missing transition state callback');
  }

  // Not a valid state name.
  if (stateNames.indexOf(stateName) === -1) {
    throw new Error(`Invalid state name: ${stateName}`);
  }

  TransitionCache.get(stateName).add(callback);
}

export function removeTransitionState(stateName, callback) {
  // Not a valid state name.
  if (stateName && !stateNames.includes(stateName)) {
    throw new Error(`Invalid state name ${stateName}`);
  }

  // Remove all transition callbacks from state.
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {

    TransitionCache.get(stateName).delete(callback);
  }
  // Remove all callbacks.
  else {
    for (let stateName in stateNames) {
      TransitionCache.get(stateName).clear();
    }
  }
}

export function runTransitions(set, ...args) {
  const promises = [];

  set.forEach(callback => {
    if (typeof callback === 'function') {
      const retVal = callback(...args);

      // Is a `thennable` object or Native Promise.
      if (typeof retVal === 'object' && retVal.then) {
        promises.push(retVal);
      }
    }
  });

  return promises;
}
