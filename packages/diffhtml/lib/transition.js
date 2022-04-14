import internalProcess from './util/process';
import {
  TransitionCache,
  NodeCache,
  NODE_TYPE,
  VTree,
  TransitionStateNames,
  TransitionStateName,
} from './util/types';

/**
 *
 * @param {TransitionStateName} stateName
 * @param {Function} callback
 * @return {void}
 */
export function addTransitionState(stateName, callback) {
  if (internalProcess.env.NODE_ENV !== 'production') {
    if (!TransitionStateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  TransitionCache.get(stateName)?.add(callback);
}

/**
 *
 * @param {TransitionStateName=} stateName
 * @param {Function=} callback
 * @return {void}
 */
export function removeTransitionState(stateName, callback) {
  if (internalProcess.env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !TransitionStateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
  }

  // Remove all specific transition callbacks.
  if (!callback && stateName) {
    TransitionCache.get(stateName)?.clear();
  }
  // Remove a single distinct transition callback.
  else if (stateName && callback) {
    TransitionCache.get(stateName)?.delete(callback);
  }
  // Remove all transition callbacks.
  else {
    for (let i = 0; i < TransitionStateNames.length; i++) {
      TransitionCache.get(TransitionStateNames[i])?.clear();
    }
  }
}

/**
 *
 * @param {TransitionStateName} setName
 * @param  {...any} args
 *
 * @return {Promise<any>[]}
 */
export function runTransitions(setName, ...args) {
  const set = TransitionCache.get(setName);

  /** @type {Promise<any>[]} */
  const promises = [];

  if (!set) {
    return promises;
  }

  const vTree = args[0];
  const isElement = vTree.nodeType === NODE_TYPE.ELEMENT;

  // Filter out text nodes and fragments from transition callbacks.
  if (!set.size || (setName !== 'textChanged' && !isElement)) {
    return promises;
  }

  // Run each transition callback, but only if the passed args are an
  // Element.
  set.forEach(callback => {
    const nodes = args.map(x => NodeCache.get(x) || x);
    const retVal = callback(...nodes);

    // Is a `thennable` object or Native Promise.
    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  // For attached and detached transitions, dig into children to ensure
  // all are run with this.
  if (setName === 'attached' || setName === 'detached') {
    vTree.childNodes.forEach((/** @type {VTree} */ childTree) => {
      promises.push(...runTransitions(setName, childTree, ...args.slice(1)));
    });
  }

  return promises;
}
