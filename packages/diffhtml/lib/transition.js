import { TransitionCache, NodeCache } from './util/caches';
import process from './util/process';
import createTree from './tree/create';
import createNode from './node/create';
import { VTree } from './util/types';

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

/**
 *
 * @param {string} stateName
 * @param {Function} callback
 * @return {void}
 */
export function addTransitionState(stateName, callback) {
  if (process.env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  TransitionCache.get(stateName).add(callback);
}

/**
 *
 * @param {string=} stateName
 * @param {Function=} callback
 * @return {void}
 */
export function removeTransitionState(stateName, callback) {
  if (process.env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
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
    for (let i = 0; i < stateNames.length; i++) {
      TransitionCache.get(stateNames[i]).clear();
    }
  }
}

/**
 *
 * @param {string} setName
 * @param  {...any} args
 *
 * @return {Promise<any>[]}
 */
export function runTransitions(setName, ...args) {
  /** @type {Set<Function>} */
  const set = TransitionCache.get(setName);

  /** @type {Promise<any>[]} */
  const promises = [];

  const [ vTree, ...rest ] = args;

  // Do not pass text nodes to anything but textChanged.
  if (!set.size || (setName !== 'textChanged' && vTree.nodeType === 3)) {
    return promises;
  }

  // Run each transition callback, but only if the passed args are an
  // Element.
  set.forEach(callback => {
    if (setName !== 'textChanged' && vTree.nodeType !== 1) {
      return;
    }

    const retVal = callback(NodeCache.get(vTree), ...rest);

    // Is a `thennable` object or Native Promise.
    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  // For attached and detached transitions, dig into children to ensure
  // all are run with this.
  if (setName === 'attached' || setName === 'detached') {
    vTree.childNodes.forEach((/** @type {VTree} */ childTree) => {
      promises.push(...runTransitions(setName, childTree, ...rest));
    });
  }

  return promises;
}
