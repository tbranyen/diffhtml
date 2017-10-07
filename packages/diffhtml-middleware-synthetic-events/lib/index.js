import { Internals } from 'diffhtml';

const { NodeCache, createNode } = Internals;

const useCapture = [
  'onload', 'onunload', 'onscroll', 'onfocus', 'onblur', 'onloadstart',
  'onprogress', 'onerror', 'onabort', 'onload', 'onloadend', 'onpointerenter',
  'onpointerleave',
];

const eventNames = [];
const handlers = new Map();
const bounded = new Set();

// Ensure we don't get user added event/properties.
const cloneDoc = typeof document !== 'undefined' ? document.cloneNode() : null;

// Fill up event names.
for (const name in cloneDoc) {
  if (name.indexOf('on') === 0) {
    eventNames.push(name);
  }
}

class SyntheticEvent {}

const cloneEvent = (ev, ov = {}) => {
  const newEvent = new SyntheticEvent();

  // Copy over original event getters/setters first, will need some extra
  // intelligence to ensure getters/setters work, thx @kofifus.
  for (let key in ev) {
    const desc = Object.getOwnPropertyDescriptor(ev, key);

    if (key === 'isTrusted') { continue; }

    if (desc && desc.get) {
      Object.defineProperty(newEvent, key, desc);
    }
    else {
      newEvent[key] = ev[key];
    }
  }

  // Copy over overrides.
  for (let key in ov) {
    newEvent[key] = ov[key];
  }

  return newEvent;
}

const getShadowRoot = node => {
  while (node = node.parentNode) {
    if (node.toString() === "[object ShadowRoot]") {
      return node;
    }
  }

  return false;
};

// Set up global event delegation, once clicked call the saved handlers.
const bindEventsTo = domNode => {
  const rootNode = getShadowRoot(domNode) || domNode.ownerDocument;
  const { addEventListener } = rootNode;

  if (bounded.has(rootNode)) {
    return false;
  }

  bounded.add(rootNode);

  eventNames.forEach(eventName => addEventListener(eventName.slice(2), ev => {
    let target = ev.target;
    let eventHandler = null;

    const path = ev.path ? ev.path : ev.composedPath ? ev.composedPath() : [];

    // If we were unable to get the path via some kind of standard approach,
    // build it up manually.
    if (!path.length) {
      for (let node = target; node; node = node.parentNode) {
        path.push(node);
      }
    }

    for (let i = 0; i < path.length; i++) {
      const node = path[i];

      if (handlers.has(node)) {
        const hasEventHandler = handlers.get(node)[eventName];

        if (hasEventHandler) {
          eventHandler = hasEventHandler;
        }

        break;
      }
    }

    const syntheticEvent = cloneEvent(ev, {
      stopPropagation() {
        ev.stopImmediatePropagation();
        ev.stopPropagation();
      },
      preventDefault() { ev.preventDefault(); },
      nativeEvent: ev,
    });
    eventHandler && eventHandler(syntheticEvent);
  }, useCapture.includes(eventName) ? true : false));
}

const syntheticEvents = (options = {}) => {
  function syntheticEventsTask() {
    return ({ state, patches }) => {
      const { SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

      if (SET_ATTRIBUTE.length) {
        for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
          const vTree = SET_ATTRIBUTE[i];
          const name = SET_ATTRIBUTE[i + 1];
          const value = SET_ATTRIBUTE[i + 2];

          const domNode = createNode(vTree);
          const eventName = name.toLowerCase();

          // Remove inline event binding from element and add to handlers.
          if (eventNames.includes(eventName)) {
            const handler = value;
            domNode[eventName] = undefined;

            const newHandlers = handlers.get(domNode) || {};

            // If the value passed is a function, that's what we're looking for.
            if (typeof handler === 'function') {
              newHandlers[eventName] = handler;
            }
            // If the value passed is a string name for a global function, use
            // that.
            else if (typeof window[handler] === 'function') {
              newHandlers[eventName] = window[handler];
            }
            // Remove the event association if the value passed was not a
            // function.
            else {
              delete newHandlers[eventName];
            }

            handlers.set(domNode, newHandlers);
            bindEventsTo(domNode);
          }
        }
      }

      if (REMOVE_ATTRIBUTE.length) {
        for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
          const vTree = REMOVE_ATTRIBUTE[i];
          const name = REMOVE_ATTRIBUTE[i + 1];

          const domNode = NodeCache.get(vTree);
          const eventName = name.toLowerCase();

          // Remove event binding from element and instead add to handlers.
          if (eventNames.includes(eventName)) {
            const newHandlers = handlers.get(domNode) || {};
            delete newHandlers[eventName];
            handlers.set(domNode, newHandlers);
          }
        }
      }
    }
  }

  return Object.assign(syntheticEventsTask, {});
};

export default syntheticEvents;
