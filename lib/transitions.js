/**
 * Transition states:
 *
 * - added - For when elements come into the DOM.  The callback triggers
 *   immediately after the element enters the DOM.  It is called with the
 *   element as the only argument.
 *
 * - removed - For when elements are removed from the DOM.  The callback
 *   triggers just before the element leaves the DOM.  It is called with the
 *   element as the only argument.
 *
 * - replaced - For when elements are replaced in the DOM.  The callback
 *   triggers after the new element enters the DOM, and before the old element
 *   leaves.  It is called with old and new elements as arguments, in that
 *   order.
 */
export var transitionStates = { added: [], removed: [], replaced: [] };
