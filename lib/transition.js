import { TransitionCache } from './util/caches';

// Sets up the states up so we can add and remove events from the sets.
TransitionCache.set('attached', new Set());
TransitionCache.set('detached', new Set());
TransitionCache.set('replaced', new Set());
TransitionCache.set('attributedCached', new Set());
TransitionCache.set('textChanged', new Set());

const stateNames = [...TransitionCache.keys()];

//export default class Transition {
//  static create() {
//
//  }
//
//  constructor(stateName, childNodes) {
//    this.states = {
//
//    };
//  }
//
//  trigger(callback) {
//    return this;
//  }
//}

// Transition.create('detached', childNodes).trigger(() => {
//
// });

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
  if (!callback && stateName) {
    TransitionCache.get(stateName).clear();
  }
  else if (stateName && callback) {
    // Not a valid state name.
    if (stateNames.indexOf(stateName) === -1) {
      throw new Error(`Invalid state name ${stateName}`);
    }

    TransitionCache.get(stateName).delete(callback);
  }
  else {
    for (let stateName in stateNames) {
      if (TransitionCache.has(stateName)) {
        TransitionCache.get(stateName).clear();
      }
    }
  }
}
