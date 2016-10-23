const empty = [];

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
export const states = {
  attached: [],
  detached: [],
  replaced: [],
  attributeChanged: [],
  textChanged: [],
};

// Define the custom signatures necessary for the loop to fill in the "magic"
// methods that process the transitions consistently.
const fnSignatures = {
  attached: el => cb => cb(el),
  detached: el => cb => cb(el),
  replaced: (oldEl, newEl) => cb => cb(oldEl, newEl),
  textChanged: (el, oldVal, newVal) => cb => cb(el, oldVal, newVal),
  attributeChanged: (el, name, oldVal, newVal) => cb => cb(
    el, name, oldVal, newVal
  ),
};

const make = {};

// Dynamically fill in the custom methods instead of manually constructing
// them.
Object.keys(states).forEach(stateName => {
  const mapFn = fnSignatures[stateName];

  /**
   * Make's the transition promises.
   *
   * @param elements
   * @param args
   * @param promises
   */
  make[stateName] = function makeTransitionPromises(elements, args, promises) {
    // Sometimes an array-like is passed so using forEach in this manner yields
    // more consistent results.
    for (let i = 0; i < elements.length; i++) {
      // Call the map function with each element.
      const newPromises = states[stateName].map(
        mapFn.apply(null, [elements[i]].concat(args))
      );

      // Merge these Promises into the main cache.
      promises.push.apply(promises, newPromises);

      // Recursively call into the children if attached or detached.
      if (stateName === 'attached' || stateName === 'detached') {
        make[stateName](elements[i].childNodes, args, promises);
      }
    }

    return promises.filter(promise => Boolean(promise && promise.then));
  };
});

/**
 * Builds a reusable trigger mechanism for the element transitions.
 *
 * @param allPromises
 */
export function buildTrigger(allPromises) {
  const addPromises = allPromises.push.apply.bind(
    allPromises.push, allPromises
  );

  // This becomes `triggerTransition` in process.js.
  return (stateName, makePromisesCallback, callback) => {
    if (!states[stateName] || !states[stateName].length) {
      return callback(empty);
    }

    // Calls into each custom hook to bind Promises into the local array,
    // these will then get merged into the main `allPromises` array.
    const promises = makePromisesCallback([]);

    // Add these promises into the global cache.
    addPromises(promises);

    // Send back the promise values.
    return callback(promises.length ? promises : empty);
  };
}

/**
 * Make a reusable function for easy transition calling. Becomes the
 * `makePromiseCallback` in the buildTrigger method.
 *
 * @param stateName
 */
export function makePromises(stateName, ...args) {
  // Ensure elements is always an array.
  const elements = [].concat(args[0]);

  // Accepts the local Array of promises to use.
  return promises => make[stateName](elements, args.slice(1), promises);
}
