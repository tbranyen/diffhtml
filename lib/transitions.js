import { components } from './element/custom';

var slice = Array.prototype.slice;
var forEach = Array.prototype.forEach;
var concat = Array.prototype.concat;
var empty = { prototype: {} };

/**
 * Contains arrays to store transition callbacks.
 *
 * attached
 * --------
 *
 * For when elements come into the DOM. The callback triggers immediately after
 * the element enters the DOM. It is called with the element as the only
 * argument.
 *
 * detached
 * --------
 *
 * For when elements are removed from the DOM. The callback triggers just
 * before the element leaves the DOM. It is called with the element as the only
 * argument.
 *
 * replaced
 * --------
 *
 * For when elements are replaced in the DOM. The callback triggers after the
 * new element enters the DOM, and before the old element leaves. It is called
 * with old and new elements as arguments, in that order.
 *
 * attributeChanged
 * ----------------
 *
 * Triggered when an element's attribute has changed. The callback triggers
 * after the attribute has changed in the DOM. It is called with the element,
 * the attribute name, old value, and current value.
 *
 * textChanged
 * -----------
 *
 * Triggered when an element's `textContent` chnages. The callback triggers
 * after the textContent has changed in the DOM. It is called with the element,
 * the old value, and current value.
 */
export let states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: [],
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
var fnSignatures = {
  attached: {
    mapFn: el => cb => cb(el),
    customElementsFn: el => cb => cb.call(el)
  },

  detached: {
    mapFn: el => cb => cb(el),
    customElementsFn: el => cb => cb.call(el)
  },

  replaced: {
    mapFn: (oldEl, newEl) => cb => cb(oldEl, newEl)
  },

  attributeChanged: {
    mapFn: (el, name, oldVal, newVal) => cb => cb(el, name, oldVal, newVal),
    customElementsFn: (el, name, oldVal, newVal) =>
      cb => cb.call(el, name, oldVal, newVal)
  },

  textChanged: {
    mapFn: (el, oldVal, newVal) => cb => cb(el, oldVal, newVal)
  }
};

var make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(function(stateName) {
  var mapFn = fnSignatures[stateName].mapFn;

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    forEach.call(elements, element => {
      // Never pass text nodes to a state callback unless it is textChanged.
      if (stateName !== 'textChanged' && element.nodeType !== 1) {
        return;
      }

      // Call the map function with each element.
      var newPromises = states[stateName].map(
        mapFn.apply(null, [element].concat(args))
      ).filter(Boolean);

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children.
      make[stateName](element.childNodes, args, promises);
    });

    return promises;
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param stateName
 * @param nodes
 * @param callback
 * @return
 */
export function buildTrigger(allPromises) {
  var addPromises = allPromises.push.apply.bind(allPromises.push, allPromises);

  // This becomes `triggerTransition` in process.js.
  return (stateName, makePromisesCallback, callback=x => x) => {
    if (states[stateName] && states[stateName].length) {
      // Calls into each custom hook to bind Promises into the local array,
      // these will then get merged into the main `allPromises` array.
      let promises = makePromisesCallback([]);

      // Add these promises into the global cache.
      addPromises(promises);

      if (!promises.length) {
        callback(promises);
      }
      else {
        Promise.all(promises).then(callback, function(ex) {
          console.log(ex);
        });
      }
    }
    else {
      callback();
    }
  };
}

/**
 * Triggers the lifecycle events on an HTMLElement.
 *
 * @param stateName
 * @param elements
 * @return
 */
function triggerLifecycleEvent(stateName, args, elements) {
  // Trigger custom element
  var customElementFn = fnSignatures[stateName].customElementsFn;

  for (let i = 0; i < elements.length; i++) {
    let element = elements[i];

    if (element) {
      let customElement = components[element.nodeName.toLowerCase()] || empty;
      let customElementMethodName = `${stateName}Callback`;

      // Call the associated CustomElement's lifecycle callback, if it exists.
      if (customElement.prototype[customElementMethodName]) {
        customElementFn.apply(null, args)(
          customElement.prototype[customElementMethodName].bind(element)
        );
      }
    }
  }
}

/**
 * Make a reusable function for easy transition calling.
 *
 * @param stateName
 * @param elements
 * @return
 */
export function makePromises(stateName, ...args) {
  // Ensure elements is always an array.
  var elements = slice.call(args[0]);

  triggerLifecycleEvent(stateName, args.slice(1), elements);

  // Accepts the local Array of promises to use.
  return (promises) => {
    return make[stateName](elements, args.slice(1), promises);
  };
}
