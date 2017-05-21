(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
  },
  componentWillReceiveProps: function componentWillReceiveProps() {},
  componentWillMount: function componentWillMount() {},
  componentDidMount: function componentDidMount() {},
  componentDidUpdate: function componentDidUpdate() {},
  componentWillUnmount: function componentWillUnmount() {},
  componentDidUnmount: function componentDidUnmount() {}
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setState;
const Debounce = new WeakMap();
const { assign } = Object;
const $$render = Symbol.for('diff.render');

function setState(newState) {
  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[$$render](this);

    // To be continued...
    //Debounce.set(this, setTimeout(() => {
    //  Debounce.delete(this);

    //  if (this.shouldComponentUpdate()) {
    //    rerenderComponent(this);
    //  }
    //}));
  }
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = upgradeClass;

var _lifecycleHooks = require('./lifecycle-hooks');

var _lifecycleHooks2 = _interopRequireDefault(_lifecycleHooks);

var _setState = require('./set-state');

var _setState2 = _interopRequireDefault(_setState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { assign } = Object;

function upgradeClass(Constructor) {
  assign(Constructor.prototype, _lifecycleHooks2.default, { setState: _setState2.default });
  return Constructor;
}

},{"./lifecycle-hooks":1,"./set-state":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _diffhtml = require('diffhtml');

var _upgradeSharedClass = require('./shared/upgrade-shared-class');

var _upgradeSharedClass2 = _interopRequireDefault(_upgradeSharedClass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Debounce = new WeakMap();
const { setPrototypeOf, freeze, assign, keys } = Object;
const $$render = Symbol.for('diff.render');

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = domNode => {
  const observedAttributes = getObserved(domNode.constructor);

  return freeze(observedAttributes.reduce((props, attr) => assign(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || undefined
  }), {}));
};

// Creates the `component.state` object.
const createState = (domNode, newState) => {
  return freeze(assign({}, domNode.state, newState));
};

exports.default = (0, _upgradeSharedClass2.default)(class WebComponent extends HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  [$$render]() {
    this.props = createProps(this);
    (0, _diffhtml.innerHTML)(this.shadowRoot, this.render(this.props, this.state));
    this.componentDidUpdate();
  }

  constructor() {
    super();

    this.props = createProps(this);
    this.state = createState(this);
    this.componentWillMount();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this[$$render]();
    this.componentDidMount();
  }

  disconnectedCallback() {
    // TODO Figure out a better place for `willUnmount`, use the detached
    // transition to determine if a Node is removed would be very accurate
    // as this fires just before an element is removed, also if the user
    // is using a detached animation this would allow them to do something
    // before the animation completes, giving you two nice callbacks to use
    // for detaching.
    this.componentWillUnmount();
    this.componentDidUnmount();
  }

  attributeChangedCallback() {
    if (this.shadowRoot && !Debounce.has(this)) {
      const nextProps = createProps(this);
      this.componentWillReceiveProps(nextProps);
      this[$$render]();

      Debounce.set(this, setTimeout(() => {
        Debounce.delete(this);
        this[$$render]();
      }));
    }
  }
});

},{"./shared/upgrade-shared-class":3,"diffhtml":8}],5:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],6:[function(require,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('PropTypes', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.PropTypes = mod.exports;
  }
})(this, function (exports, module) {

  'use strict';

  var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

  var ReactElement = {};

  ReactElement.isValidElement = function (object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  };

  var ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };

  var emptyFunction = {
    thatReturns: function thatReturns(what) {
      return function () {
        return what;
      };
    }
  };

  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  var ANONYMOUS = '<<anonymous>>';

  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker
  };

  function createChainableTypeChecker(validate) {
    function checkType(isRequired, props, propName, componentName, location, propFullName) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;
      if (props[propName] == null) {
        var locationName = ReactPropTypeLocationNames[location];
        if (isRequired) {
          return new Error('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        var locationName = ReactPropTypeLocationNames[location];

        var preciseType = getPreciseType(propValue);

        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturns(null));
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var locationName = ReactPropTypeLocationNames[location];
        var propType = getPropType(propValue);
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']');
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!ReactElement.isValidElement(props[propName])) {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var locationName = ReactPropTypeLocationNames[location];
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      return createChainableTypeChecker(function () {
        return new Error('Invalid argument supplied to oneOf, expected an instance of array.');
      });
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (propValue === expectedValues[i]) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      var valuesString = JSON.stringify(expectedValues);
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      return createChainableTypeChecker(function () {
        return new Error('Invalid argument supplied to oneOfType, expected an instance of array.');
      });
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName) == null) {
          return null;
        }
      }

      var locationName = ReactPropTypeLocationNames[location];
      return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        var locationName = ReactPropTypeLocationNames[location];
        return new Error('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || ReactElement.isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    if (propType === 'symbol') {
      return true;
    }

    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  function getPreciseType(propValue) {
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  module.exports = ReactPropTypes;
});


},{}],7:[function(require,module,exports){
'use strict';

var _class, _temp;

var _diffhtml = require('diffhtml');

var _webComponent = require('./lib/web-component');

var _webComponent2 = _interopRequireDefault(_webComponent);

var _proptypes = require('proptypes');

var _proptypes2 = _interopRequireDefault(_proptypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

customElements.define('jsx-test', (_temp = _class = class extends _webComponent2.default {
  render({ message }) {
    return (0, _diffhtml.createTree)(
      'div',
      null,
      message
    );
  }

}, _class.propTypes = {
  message: _proptypes2.default.string.isRequired
}, _temp));

(0, _diffhtml.innerHTML)(document.body, (0, _diffhtml.createTree)('jsx-test', { message: 'Hello world!' }));

},{"./lib/web-component":4,"diffhtml":8,"proptypes":6}],8:[function(require,module,exports){
(function (process,global){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.diff = global.diff || {})));
}(this, (function (exports) { 'use strict';

// Associates DOM Nodes with state objects.
const StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache = new Map();

// Cache transition functions.
const TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
const MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();

/**
 * If diffHTML is rendering anywhere asynchronously, we need to wait until it
 * completes before this render can be executed. This sets up the next
 * buffer, if necessary, which serves as a Boolean determination later to
 * `bufferSet`.
 *
 * @param {Object} nextTransaction - The Transaction instance to schedule
 * @return {Boolean} - Value used to terminate a transaction render flow
 */
function schedule(transaction) {
  // The state is a global store which is shared by all like-transactions.
  const { state } = transaction;

  // If there is an in-flight transaction render happening, push this
  // transaction into a queue.
  if (state.isRendering) {
    // Resolve an existing transaction that we're going to pave over in the
    // next statement.
    if (state.nextTransaction) {
      state.nextTransaction.promises[0].resolve(state.nextTransaction);
    }

    // Set a pointer to this current transaction to render immediatately after
    // the current transaction completes.
    state.nextTransaction = transaction;

    const deferred = {};
    const resolver = new Promise(resolve => deferred.resolve = resolve);

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}

function shouldUpdate(transaction) {
  const { markup, state, state: { measure } } = transaction;

  measure('should update');

  // If the contents haven't changed, abort the flow. Only support this if
  // the new markup is a string, otherwise it's possible for our object
  // recycling to match twice.
  if (typeof markup === 'string' && state.markup === markup) {
    return transaction.abort();
  } else if (typeof markup === 'string') {
    state.markup = markup;
  }

  measure('should update');
}

// A modest size.
const size = 10000;

const free = new Set();
const allocate = new Set();
const protect = new Set();
const shape = () => ({
  rawNodeName: '',
  nodeName: '',
  nodeValue: '',
  nodeType: 1,
  key: '',
  childNodes: [],
  attributes: {}
});

// Creates a pool to query new or reused values from.
const memory = { free, allocated: allocate, protected: protect };

// Prime the free memory pool with VTrees.
for (let i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
let freeValues = free.values();

// Cache VTree objects in a pool which is used to get
var Pool = {
  size,
  memory,

  get() {
    const { value = shape(), done } = freeValues.next();

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.
    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },

  protect(value) {
    allocate.delete(value);
    protect.add(value);
  },

  unprotect(value) {
    if (protect.has(value)) {
      protect.delete(value);
      free.add(value);
    }
  }
};

const { memory: memory$1, protect: protect$1, unprotect } = Pool;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */
function protectVTree(vTree) {
  protect$1(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    protectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Allows an vTree to be recycled during a render cycle.
 *
 * @param vTree
 * @return
 */
function unprotectVTree(vTree) {
  unprotect(vTree);

  for (let i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory(isBusy = false) {
  StateCache.forEach(state => isBusy = state.isRendering || isBusy);

  if (isBusy) {
    //return;
  }

  memory$1.allocated.forEach(vTree => memory$1.free.add(vTree));
  memory$1.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  NodeCache.forEach((node, descriptor) => {
    if (!memory$1.protected.has(descriptor)) {
      NodeCache.delete(descriptor);
    }
  });
}

const { CreateTreeHookCache } = MiddlewareCache;
const { isArray } = Array;
const fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes, ...rest) {
  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (let i = 0; i < input.length; i++) {
      const newTree = createTree(input[i]);
      if (!newTree) {
        continue;
      }
      const isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...newTree.childNodes);
      } else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  const isObject = typeof input === 'object';

  // Crawl an HTML or SVG Element/Text Node etc. for attributes and children.
  if (input && isObject && 'parentNode' in input) {
    attributes = {};
    childNodes = [];

    // When working with a text node, simply save the nodeValue as the
    // initial value.
    if (input.nodeType === 3) {
      childNodes = input.nodeValue;
    }
    // Element types are the only kind of DOM node we care about attributes
    // from. Shadow DOM, Document Fragments, Text, Comment nodes, etc. can
    // ignore this.
    else if (input.nodeType === 1 && input.attributes.length) {
        attributes = {};

        for (let i = 0; i < input.attributes.length; i++) {
          const { name, value } = input.attributes[i];

          // If the attribute's value is empty, seek out the property instead.
          if (value === '' && name in input) {
            attributes[name] = input[name];
            continue;
          }

          attributes[name] = value;
        }
      }

    // Get the child nodes from an Element or Fragment/Shadow Root.
    if (input.nodeType === 1 || input.nodeType === 11) {
      if (input.childNodes.length) {
        childNodes = [];

        for (let i = 0; i < input.childNodes.length; i++) {
          childNodes.push(createTree(input.childNodes[i]));
        }
      }
    }

    const vTree = createTree(input.nodeName, attributes, childNodes);
    NodeCache.set(vTree, input);
    return vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    return input;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes, ...rest];
  }

  // Allocate a new VTree from the pool.
  const entry = Pool.get();
  const isTextNode = input === '#text';
  const isString = typeof input === 'string';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    const nodes = arguments.length === 2 ? attributes : childNodes;
    const nodeValue = isArray(nodes) ? nodes.join('') : nodes;

    entry.nodeType = 3;
    entry.nodeValue = String(nodeValue || '');

    return entry;
  }

  if (input === fragmentName || typeof input !== 'string') {
    entry.nodeType = 11;
  } else if (input === '#comment') {
    entry.nodeType = 8;
  } else {
    entry.nodeType = 1;
  }

  const useAttributes = isArray(attributes) || typeof attributes !== 'object';
  const nodes = useAttributes ? attributes : childNodes;
  const nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (let i = 0; i < nodeArray.length; i++) {
      const newNode = nodeArray[i];

      // Assume objects are vTrees.
      if (typeof newNode === 'object') {
        entry.childNodes.push(newNode);
      }
      // Cover generate cases where a user has indicated they do not want a
      // node from appearing.
      else if (newNode) {
          entry.childNodes.push(createTree('#text', null, newNode));
        }
    }
  }

  if (attributes && typeof attributes === 'object' && !isArray(attributes)) {
    entry.attributes = attributes;
  }

  // If is a script tag and has a src attribute, key off that.
  if (entry.nodeName === 'script' && entry.attributes.src) {
    entry.key = String(entry.attributes.src);
  }

  // Set the `key` prop if passed as an attr, overrides `script[src]`.
  if (entry.attributes && 'key' in entry.attributes) {
    entry.key = String(entry.attributes.key);
  }

  let vTree = entry;

  CreateTreeHookCache.forEach((fn, retVal) => {
    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(vTree)) {
      vTree = retVal;
    }
  });

  return vTree;
}

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/i;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const spaceEx = /[^ ]/;
const tokenEx = /__DIFFHTML__([^_]*)__/;
const tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

const selfClosing = new Set(['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};

const kElementsClosedByClosing = {
  li: { ul: true, ol: true },
  a: { div: true },
  b: { div: true },
  i: { div: true },
  p: { div: true },
  td: { tr: true, table: true },
  th: { tr: true, table: true }
};

/**
 * Interpolate dynamic supplemental values from the tagged template into the
 * tree.
 *
 * @param currentParent
 * @param string
 * @param supplemental
 */
const interpolateValues = (currentParent, string, supplemental = {}) => {
  // If this is text and not a doctype, add as a text node.
  if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
    return currentParent.childNodes.push(createTree('#text', string));
  }

  const childNodes = [];
  const parts = string.split(tokenEx);
  let { length } = parts;

  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];

    if (!value) {
      continue;
    }

    // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.
    if (i % 2 === 1) {
      const innerTree = supplemental.children[value];
      if (!innerTree) {
        continue;
      }
      const isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push(...innerTree.childNodes);
      } else {
        childNodes.push(innerTree);
      }
    } else if (!doctypeEx.test(value)) {
      childNodes.push(createTree('#text', value));
    }
  }

  currentParent.childNodes.push(...childNodes);
};

/**
 * HTMLElement, which contains a set of children.
 *
 * Note: this is a minimalist implementation, no complete tree structure
 * provided (no parentNode, nextSibling, previousSibling etc).
 *
 * @param {String} nodeName - DOM Node name
 * @param {Object} rawAttrs - DOM Node Attributes
 * @param {Object} supplemental - Interpolated data from a tagged template
 * @return {Object} vTree
 */
const HTMLElement = (nodeName, rawAttrs, supplemental) => {
  let match = null;

  // Support dynamic tag names like: `<${MyComponent} />`.
  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental);
  }

  const attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (let match; match = attrEx.exec(rawAttrs || '');) {
    const name = match[1];
    const value = match[6] || match[5] || match[4] || match[1];
    let tokenMatch = value.match(tokenEx);

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (tokenMatch && tokenMatch.length) {
      const parts = value.split(tokenEx);
      let { length } = parts;

      const hasToken = tokenEx.exec(name);
      const newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (let i = 0; i < parts.length; i++) {
        const value = parts[i];

        if (!value) {
          continue;
        }

        // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.
        if (i % 2 === 1) {
          if (attributes[newName]) {
            attributes[newName] += supplemental.attributes[value];
          } else {
            attributes[newName] = supplemental.attributes[value];
          }
        } else {
          if (attributes[newName]) {
            attributes[newName] += value;
          } else {
            attributes[newName] = value;
          }
        }
      }
    } else if (tokenMatch = tokenEx.exec(name)) {
      const nameAndValue = supplemental.attributes[tokenMatch[1]];
      const hasToken = tokenEx.exec(value);
      const getValue = hasToken ? supplemental.attributes[hasToken[1]] : value;

      attributes[nameAndValue] = value === '""' ? '' : getValue;
    } else {
      attributes[name] = value === '""' ? '' : value;
    }
  }

  return createTree(nodeName, attributes, []);
};

/**
 * Parses HTML and returns a root element
 *
 * @param {String} html - String of HTML markup to parse into a Virtual Tree
 * @param {Object} supplemental - Dynamic interpolated data values
 * @param {Object} options - Contains options like silencing warnings
 * @return {Object} - Parsed Virtual Tree Element
 */
function parse(html, supplemental, options = {}) {
  const root = createTree('#document-fragment', null, []);
  const stack = [root];
  let currentParent = root;
  let lastTextPos = -1;
  let preLastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  // Look through the HTML markup for valid tags.
  for (let match, text; match = tagEx.exec(html);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        // Do not process leading whitespace in a tagged template.
        if (preLastTextPos === -1 ? hasNonWhitespaceEx.test(text) : text) {
          interpolateValues(currentParent, text, supplemental);
        }
      }
    }

    const matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      const string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    preLastTextPos = lastTextPos;
    lastTextPos = tagEx.lastIndex;

    // This is a comment (TODO support these).
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      const attrs = {};

      if (!match[4] && kElementsClosedByOpening[currentParent.rawNodeName]) {
        if (kElementsClosedByOpening[currentParent.rawNodeName][match[2]]) {
          stack.pop();
          currentParent = stack[stack.length - 1];
        }
      }

      currentParent = currentParent.childNodes[currentParent.childNodes.push(HTMLElement(match[2], match[3], supplemental)) - 1];

      stack.push(currentParent);

      if (blockText.has(match[2])) {
        // A little test to find next </script> or </style> ...
        const closeMarkup = '</' + match[2] + '>';
        const index = html.indexOf(closeMarkup, tagEx.lastIndex);
        const { length } = match[2];

        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        const newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
        const nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        const markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        const caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, `${caret}
Possibly invalid markup. Saw ${match[2]}, expected ${nodeName}...
        `);

        // Throw an error message if the markup isn't what we expected.
        throw new Error(`\n\n${markup.join('\n')}`);
      }

      const tokenMatch = tokenEx.exec(match[2]);

      // </ or /> or <br> etc.
      while (currentParent) {
        // Self closing dynamic nodeName.
        if (match[4] === '/' && tokenMatch) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        }
        // Not self-closing, so seek out the next match.
        else if (tokenMatch) {
            const value = supplemental.tags[tokenMatch[1]];

            if (currentParent.rawNodeName === value) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              break;
            }
          }

        if (currentParent.rawNodeName === match[2]) {
          stack.pop();
          currentParent = stack[stack.length - 1];

          break;
        } else {
          const tag = kElementsClosedByClosing[currentParent.rawNodeName];

          // Trying to close current tag, and move on
          if (tag) {
            if (tag[match[2]]) {
              stack.pop();
              currentParent = stack[stack.length - 1];

              continue;
            }
          }

          // Use aggressive strategy to handle unmatching markups.
          break;
        }
      }
    }
  }

  // Find any last remaining text after the parsing completes over tags.
  const remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  if (remainingText) {
    interpolateValues(currentParent, remainingText, supplemental);
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    const head = { before: [], after: [] };
    const body = { after: [] };
    const HTML = root.childNodes[0];

    let beforeHead = true;
    let beforeBody = true;

    // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.
    HTML.childNodes = HTML.childNodes.filter(el => {
      // If either body or head, allow as a valid element.
      if (el.nodeName === 'body' || el.nodeName === 'head') {
        if (el.nodeName === 'head') beforeHead = false;
        if (el.nodeName === 'body') beforeBody = false;

        return true;
      }
      // Not a valid nested HTML tag element, move to respective container.
      else if (el.nodeType === 1) {
          if (beforeHead && beforeBody) head.before.push(el);else if (!beforeHead && beforeBody) head.after.push(el);else if (!beforeBody) body.after.push(el);
        }
    });

    // Ensure the first element is the HEAD tag.
    if (!HTML.childNodes[0] || HTML.childNodes[0].nodeName !== 'head') {
      const headInstance = createTree('head', null, []);
      const existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    } else {
      const existing = HTML.childNodes[0].childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      const bodyInstance = createTree('body', null, []);
      const existing = bodyInstance.childNodes;

      existing.push.apply(existing, body.after);
      HTML.childNodes.push(bodyInstance);
    } else {
      const existing = HTML.childNodes[1].childNodes;
      existing.push.apply(existing, body.after);
    }
  }

  // Reset regular expression positions per parse.
  attrEx.lastIndex = 0;
  tagEx.lastIndex = 0;

  return root;
}

function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, measure } = state;
  const { inner } = options;

  measure('reconcile trees');

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      unprotectVTree(state.oldTree);
    }

    state.oldTree = createTree(domNode);
    NodeCache.set(state.oldTree, domNode);
    protectVTree(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const { childNodes } = parse(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.
    transaction.newTree = createTree(inner ? childNodes : childNodes[0] || childNodes);
  }
  // Otherwise the value passed is a Virtual Tree or an Array.
  else {
      const { rawNodeName, nodeName, attributes } = transaction.oldTree;
      const newTree = createTree(markup);
      const isFragment = newTree.nodeType === 11;
      const isUnknown = typeof newTree.rawNodeName !== 'string';

      transaction.newTree = newTree;

      if (inner) {
        const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
        transaction.newTree = createTree(nodeName, attributes, children);
      }
    }

  measure('reconcile trees');
}

const normalize = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};

var process$1 = Object.defineProperty({}, 'env', {
  enumerable: true,
  get: () => normalize.env
});

const { SyncTreeHookCache } = MiddlewareCache;
const empty = {};
const keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
function syncTree(oldTree, newTree, patches) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  const oldNodeName = oldTree.nodeName;
  const newNodeName = newTree.nodeName;
  const isFragment = newTree.nodeType === 11;
  const isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  const keysLookup = { old: new Map(), new: new Map() };

  if (process$1.env.NODE_ENV !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    }

    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error(`Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`);
    }
  }

  // Reduce duplicate logic by condensing old and new operations in a loop.
  for (let i = 0; i < keyNames.length; i++) {
    const keyName = keyNames[i];
    const map = keysLookup[keyName];
    const vTree = arguments[i];
    const nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        const vTree = nodes[i];

        if (vTree.key) {
          map.set(vTree.key, vTree);
        } else if (map.size && vTree.nodeType === 1) {
          if (process$1.env.NODE_ENV !== 'production') {
            throw new Error(`Missing \`key\` all siblings must supply this attribute.

Virtual Element: ${JSON.stringify(vTree, null, 2)}`);
          }
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach((fn, retVal) => {
    if (retVal = fn(oldTree, newTree, null)) {
      newTree = retVal;

      // Find attributes.
      syncTree(null, retVal, patches);
    }

    for (let i = 0; i < newTree.childNodes.length; i++) {
      const oldChildNode = isEmpty ? empty : oldTree.childNodes[i];
      const newChildNode = newTree.childNodes[i];

      if (retVal = fn(oldChildNode, newChildNode, keysLookup)) {
        newTree.childNodes[i] = retVal;
      }
    }
  });

  // Create new arrays for patches or use existing from a recursive call.
  patches = patches || {
    SET_ATTRIBUTE: [],
    REMOVE_ATTRIBUTE: [],
    TREE_OPS: [],
    NODE_VALUE: []
  };

  const { SET_ATTRIBUTE, REMOVE_ATTRIBUTE, TREE_OPS, NODE_VALUE } = patches;

  // Build up a patchset object to use for tree operations.
  const patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: []
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = patchset;
  const isElement = newTree.nodeType === 1;

  // Text nodes are low level and frequently change, so this path is accounted
  // for first.
  if (newTree.nodeName === '#text') {
    // If there was no previous element to compare to, simply set the value
    // on the new node.
    if (oldTree.nodeName !== '#text') {
      NODE_VALUE.push(newTree, newTree.nodeValue, null);
    }
    // If both VTrees are text nodes and the values are different, change the
    // `Element#nodeValue`.
    else if (!isEmpty && oldTree.nodeValue !== newTree.nodeValue) {
        NODE_VALUE.push(oldTree, newTree.nodeValue, oldTree.nodeValue);
        oldTree.nodeValue = newTree.nodeValue;
      }

    return patches;
  }

  // Seek out attribute changes first, but only from element Nodes.
  if (isElement) {
    const oldAttributes = isEmpty ? empty : oldTree.attributes;
    const newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (let key in newAttributes) {
      const value = newAttributes[key];

      if (key in oldAttributes && oldAttributes[key] === newAttributes[key]) {
        continue;
      }

      if (!isEmpty) {
        oldAttributes[key] = value;
      }

      SET_ATTRIBUTE.push(isEmpty ? newTree : oldTree, key, value);
    }

    // Search for removals.
    if (!isEmpty) {
      for (let key in oldAttributes) {
        if (key in newAttributes) {
          continue;
        }
        REMOVE_ATTRIBUTE.push(oldTree, key);
        delete oldAttributes[key];
      }
    }
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  if (process$1.env.NODE_ENV !== 'production') {
    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error(`Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`);
    }
  }

  const oldChildNodes = oldTree.childNodes;
  const newChildNodes = newTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    const values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (let i = 0; i < newChildNodes.length; i++) {
      const oldChildNode = oldChildNodes[i];
      const newChildNode = newChildNodes[i];
      const newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      const oldKey = oldChildNode.key;
      const oldInNew = keysLookup.new.has(oldKey);
      const newInOld = keysLookup.old.has(newKey);

      // Remove the old Node and insert the new node (aka replace).
      if (!oldInNew && !newInOld) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1, newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }
      // Remove the old node instead of replacing.
      else if (!oldInNew) {
          REMOVE_CHILD.push(oldChildNode);
          oldChildNodes.splice(oldChildNodes.indexOf(oldChildNode), 1);
          i = i - 1;
          continue;
        }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        let optimalNewNode = newChildNode;

        // Prefer existing to new and remove from old position.
        if (newKey && newInOld) {
          optimalNewNode = keysLookup.old.get(newKey);
          oldChildNodes.splice(oldChildNodes.indexOf(optimalNewNode), 1);
        } else if (newKey) {
          optimalNewNode = newChildNode;

          // Find attribute changes for this Node.
          syncTree(null, newChildNode, patches);
        }

        INSERT_BEFORE.push(oldTree, optimalNewNode, oldChildNode);
        oldChildNodes.splice(i, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[i] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (let i = 0; i < newChildNodes.length; i++) {
        const oldChildNode = oldChildNodes && oldChildNodes[i];
        const newChildNode = newChildNodes[i];

        // If there is no old element to compare to, this is a simple addition.
        if (!oldChildNode) {
          INSERT_BEFORE.push(oldTree, newChildNode, null);

          if (oldChildNodes) {
            oldChildNodes.push(newChildNode);
          }

          syncTree(null, newChildNode, patches);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (oldChildNode.nodeName !== newChildNode.nodeName) {
          REPLACE_CHILD.push(newChildNode, oldChildNode);
          oldTree.childNodes[i] = newChildNode;
          syncTree(null, newChildNode, patches);
          continue;
        }

        syncTree(oldChildNode, newChildNode, patches);
      }
    }

  // If there was no `oldTree` provided, we have sync'd all the attributes and
  // the node value of the `newTree` so we can early abort and not worry about
  // tree operations.
  if (isEmpty) {
    return patches;
  }

  // We've reconciled new changes, so we can remove any old nodes and adjust
  // lengths to be equal.
  if (oldChildNodes.length !== newChildNodes.length) {
    for (let i = newChildNodes.length; i < oldChildNodes.length; i++) {
      REMOVE_CHILD.push(oldChildNodes[i]);
    }

    oldChildNodes.length = newChildNodes.length;
  }

  // We want to look if anything has changed, if nothing has we won't add it to
  // the patchset.
  if (INSERT_BEFORE.length || REMOVE_CHILD.length || REPLACE_CHILD.length) {
    // Null out the empty arrays.
    if (!INSERT_BEFORE.length) {
      patchset.INSERT_BEFORE = null;
    }
    if (!REMOVE_CHILD.length) {
      patchset.REMOVE_CHILD = null;
    }
    if (!REPLACE_CHILD.length) {
      patchset.REPLACE_CHILD = null;
    }

    TREE_OPS.push(patchset);
  }

  return patches;
}

// Namespace.
const namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
const elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];

const { CreateNodeHookCache } = MiddlewareCache;

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree, ownerDocument = document) {
  if (process$1.env.NODE_ENV !== 'production') {
    if (!vTree) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  const existingNode = NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  const { nodeName, childNodes = [] } = vTree;

  // Will vary based on the properties of the VTree.
  let domNode = null;

  CreateNodeHookCache.forEach((fn, retVal) => {
    // Invoke all the `createNodeHook` functions passing along the vTree as the
    // only argument. These functions must return a valid DOM Node value.
    if (retVal = fn(vTree)) {
      domNode = retVal;
    }
  });

  if (!domNode) {
    // Create empty text elements. They will get filled in during the patch
    // process.
    if (nodeName === '#text') {
      domNode = ownerDocument.createTextNode(vTree.nodeValue);
    }
    // Support dynamically creating document fragments.
    else if (nodeName === '#document-fragment') {
        domNode = ownerDocument.createDocumentFragment();
      }
      // If the nodeName matches any of the known SVG element names, mark it as
      // SVG. The reason for doing this over detecting if nested in an <svg>
      // element, is that we do not currently have circular dependencies in the
      // VTree, by avoiding parentNode, so there is no way to crawl up the
      // parents.
      else if (elements.indexOf(nodeName) > -1) {
          domNode = ownerDocument.createElementNS(namespace, nodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(nodeName);
          }
  }

  // Add to the domNodes cache.
  NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument));
  }

  return domNode;
}

function syncTrees(transaction) {
  const { state: { measure }, oldTree, newTree, domNode } = transaction;

  measure('sync trees');

  // Do a global replace of the element, unable to do this at a lower level.
  // Ignore this for document fragments, they don't appear in the DOM and we
  // treat them as transparent containers.
  if (oldTree.nodeName !== newTree.nodeName && newTree.nodeType !== 11) {
    transaction.patches = {
      TREE_OPS: [{ REPLACE_CHILD: [newTree, oldTree] }],
      SET_ATTRIBUTE: [],
      REMOVE_ATTRIBUTE: [],
      NODE_VALUE: []
    };

    unprotectVTree(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    protectVTree(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    StateCache.set(createNode(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = syncTree(oldTree, newTree);
    }

  measure('sync trees');
}

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  if (process$1.env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (process$1.env.NODE_ENV !== 'production') {
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

function runTransitions(setName, ...args) {
  const set = TransitionCache.get(setName);
  const promises = [];

  if (!set.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set.forEach(callback => {
    const retVal = callback(...args);

    // Is a `thennable` object or Native Promise.
    if (typeof retVal === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    const element = args[0];

    [...element.childNodes].forEach(childNode => {
      promises.push(...runTransitions(setName, childNode, ...args.slice(1)));
    });
  }

  return promises;
}

// Support loading diffHTML in non-browser environments.
const g = typeof global === 'object' ? global : window;
const element = g.document ? document.createElement('div') : null;

/**
 * Decodes HTML strings.
 *
 * @see http://stackoverflow.com/a/5796718
 * @param string
 * @return unescaped HTML
 */
function decodeEntities(string) {
  // If there are no HTML entities, we can safely pass the string through.
  if (!element || !string || !string.indexOf || !string.includes('&')) {
    return string;
  }

  element.innerHTML = string;
  return element.textContent;
}

/**
 * Tiny HTML escaping function, useful to protect against things like XSS and
 * unintentionally breaking attributes with quotes.
 *
 * @param {String} unescaped - An HTML value, unescaped
 * @return {String} - An HTML-safe string
 */
function escape(unescaped) {
  return unescaped.replace(/[&<>]/g, match => `&#${match.charCodeAt(0)};`);
}

const blockText$1 = new Set(['script', 'noscript', 'style', 'code', 'template']);

const removeAttribute = (domNode, name) => {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

function patchNode(patches) {
  const promises = [];
  const { TREE_OPS, NODE_VALUE, SET_ATTRIBUTE, REMOVE_ATTRIBUTE } = patches;

  // Set attributes.
  if (SET_ATTRIBUTE.length) {
    for (let i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      const vTree = SET_ATTRIBUTE[i];
      const _name = SET_ATTRIBUTE[i + 1];
      const value = decodeEntities(SET_ATTRIBUTE[i + 2]);

      const domNode = createNode(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(_name);
      const newPromises = runTransitions('attributeChanged', domNode, _name, oldValue, value);

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      const isObject = typeof value === 'object';
      const isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      const name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        const noValue = value === null || value === undefined;

        // Allow the user to find the real value in the DOM Node as a
        // property.
        try {
          domNode[name] = value;
        } catch (unhandledException) {}

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
          const keys = Object.keys(value);

          for (let i = 0; i < keys.length; i++) {
            domNode.style[keys[i]] = value[keys[i]];
          }
        } else if (typeof value !== 'string') {
          // We remove and re-add the attribute to trigger a change in a web
          // component or mutation observer. Although you could use a setter or
          // proxy, this is more natural.
          if (domNode.hasAttribute(name) && domNode[name] !== value) {
            domNode.removeAttribute(name, '');
          }

          // Necessary to track the attribute/prop existence.
          domNode.setAttribute(name, '');

          // Since this is a property value it gets set directly on the node.
          try {
            domNode[name] = value;
          } catch (unhandledException) {}
        }

      if (newPromises.length) {
        promises.push(...newPromises);
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    for (let i = 0; i < REMOVE_ATTRIBUTE.length; i += 2) {
      const vTree = REMOVE_ATTRIBUTE[i];
      const name = REMOVE_ATTRIBUTE[i + 1];

      const domNode = NodeCache.get(vTree);
      const attributeChanged = TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(name);
      const newPromises = runTransitions('attributeChanged', domNode, name, oldValue, null);

      if (newPromises.length) {
        Promise.all(newPromises).then(() => removeAttribute(domNode, name));
        promises.push(...newPromises);
      } else {
        removeAttribute(domNode, name);
      }
    }
  }

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (let i = 0; i < TREE_OPS.length; i++) {
    const { INSERT_BEFORE, REMOVE_CHILD, REPLACE_CHILD } = TREE_OPS[i];

    // Insert/append elements.
    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
        const vTree = INSERT_BEFORE[i];
        const newTree = INSERT_BEFORE[i + 1];
        const referenceTree = INSERT_BEFORE[i + 2];

        const domNode = NodeCache.get(vTree);
        const referenceNode = referenceTree && createNode(referenceTree);
        const attached = TransitionCache.get('attached');

        if (referenceTree) {
          protectVTree(referenceTree);
        }

        const newNode = createNode(newTree);
        protectVTree(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        domNode.insertBefore(newNode, referenceNode);

        const attachedPromises = runTransitions('attached', newNode);

        promises.push(...attachedPromises);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const vTree = REMOVE_CHILD[i];
        const domNode = NodeCache.get(vTree);
        const detached = TransitionCache.get('detached');
        const detachedPromises = runTransitions('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            unprotectVTree(vTree);
          });

          promises.push(...detachedPromises);
        } else {
          domNode.parentNode.removeChild(domNode);
          unprotectVTree(vTree);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
        const newTree = REPLACE_CHILD[i];
        const oldTree = REPLACE_CHILD[i + 1];

        const oldDomNode = NodeCache.get(oldTree);
        const newDomNode = createNode(newTree);
        const attached = TransitionCache.get('attached');
        const detached = TransitionCache.get('detached');
        const replaced = TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        protectVTree(newTree);

        const attachedPromises = runTransitions('attached', newDomNode);
        const detachedPromises = runTransitions('detached', oldDomNode);
        const replacedPromises = runTransitions('replaced', oldDomNode, newDomNode);
        const allPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

        if (allPromises.length) {
          Promise.all(allPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            unprotectVTree(oldTree);
          });

          promises.push(...allPromises);
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          unprotectVTree(oldTree);
        }
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (let i = 0; i < NODE_VALUE.length; i += 3) {
      const vTree = NODE_VALUE[i];
      const nodeValue = NODE_VALUE[i + 1];
      const oldValue = NODE_VALUE[i + 2];
      const domNode = NodeCache.get(vTree);
      const textChanged = TransitionCache.get('textChanged');
      const textChangedPromises = runTransitions('textChanged', domNode, oldValue, nodeValue);

      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = decodeEntities(nodeValue);
      } else {
        domNode.nodeValue = nodeValue;
      }

      if (parentNode && blockText$1.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = escape(decodeEntities(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push(...textChangedPromises);
      }
    }
  }

  return promises;
}

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  const { domNode, state, state: { measure }, patches } = transaction;
  const { promises = [] } = transaction;

  measure('patch node');
  promises.push(...patchNode(patches, state));
  measure('patch node');

  transaction.promises = promises;
}

// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  const { promises = [] } = transaction;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.
  if (promises.length) {
    return Promise.all(promises).then(() => transaction.end());
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}

const marks = new Map();
const prefix = 'diffHTML';
const DIFF_PERF = 'diff_perf';

const hasSearch = typeof location !== 'undefined';
const hasArguments = typeof process !== 'undefined' && process.argv;
const nop = () => {};

var makeMeasure = ((domNode, vTree) => {
  // Check for these changes on every check.
  const wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  const wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  const wantsPerfChecks = wantsSearch || wantsArguments;

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return name => {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = `${domNode.host.constructor.name} ${name}`;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = `${vTree.rawNodeName.name} ${name}`;
    }

    const endName = `${name}-end`;

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      const totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(`${prefix} ${name} (${totalMs}ms)`, name, endName);
    }
  };
});

class Transaction {
  static create(domNode, markup, options) {
    return new Transaction(domNode, markup, options);
  }

  static renderNext(state) {
    if (!state.nextTransaction) {
      return;
    }

    // Create the next transaction.
    const { nextTransaction, nextTransaction: { promises } } = state;
    const resolver = promises && promises[0];

    state.nextTransaction = undefined;
    nextTransaction.aborted = false;

    // Remove the last task, this has already been executed (via abort).
    nextTransaction.tasks.pop();

    // Reflow this transaction.
    Transaction.flow(nextTransaction, nextTransaction.tasks);

    // Wait for the promises to complete if they exist, otherwise resolve
    // immediately.
    if (promises && promises.length > 1) {
      Promise.all(promises.slice(1)).then(() => resolver.resolve());
    } else if (resolver) {
      resolver.resolve();
    }
  }

  static flow(transaction, tasks) {
    let retVal = transaction;

    // Execute each "task" serially, passing the transaction as a baton that
    // can be used to share state across the tasks.
    for (let i = 0; i < tasks.length; i++) {
      // If aborted, don't execute any more tasks.
      if (transaction.aborted) {
        return retVal;
      }

      // Run the task.
      retVal = tasks[i](transaction);

      // The last `returnValue` is what gets sent to the consumer. This
      // mechanism is crucial for the `abort`, if you want to modify the "flow"
      // that's fine, but you must ensure that your last task provides a
      // mechanism to know when the transaction completes. Something like
      // callbacks or a Promise.
      if (retVal !== undefined && retVal !== transaction) {
        return retVal;
      }
    }
  }

  static assert(transaction) {
    if (process$1.env.NODE_ENV !== 'production') {
      if (typeof transaction.domNode !== 'object') {
        throw new Error('Transaction requires a DOM Node mount point');
      }

      if (transaction.aborted && transaction.completed) {
        throw new Error('Transaction was previously aborted');
      }

      if (transaction.completed) {
        throw new Error('Transaction was previously completed');
      }
    }
  }

  static invokeMiddleware(transaction) {
    const { tasks } = transaction;

    MiddlewareCache.forEach(fn => {
      // Invoke all the middleware passing along this transaction as the only
      // argument. If they return a value (must be a function) it will be added
      // to the transaction task flow.
      const result = fn(transaction);

      if (result) {
        tasks.push(result);
      }
    });
  }

  constructor(domNode, markup, options) {
    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = StateCache.get(domNode) || {
      measure: makeMeasure(domNode, markup)
    };

    this.tasks = options.tasks || [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    StateCache.set(domNode, this.state);
  }

  start() {
    if (process$1.env.NODE_ENV !== 'production') {
      Transaction.assert(this);
    }

    const { domNode, state: { measure }, tasks } = this;
    const takeLastTask = tasks.pop();

    this.aborted = false;

    // Add middleware in as tasks.
    Transaction.invokeMiddleware(this);

    // Measure the render flow if the user wants to track performance.
    measure('render');

    // Push back the last task as part of ending the flow.
    tasks.push(takeLastTask);

    return Transaction.flow(this, tasks);
  }

  // This will immediately call the last flow task and terminate the flow. We
  // call the last task to ensure that the control flow completes. This should
  // end psuedo-synchronously. Think `Promise.resolve()`, `callback()`, and
  // `return someValue` to provide the most accurate performance reading. This
  // doesn't matter practically besides that.
  abort() {
    const { state } = this;

    this.aborted = true;

    // Grab the last task in the flow and return, this task will be responsible
    // for calling `transaction.end`.
    return this.tasks[this.tasks.length - 1](this);
  }

  end() {
    const { state, domNode, options } = this;
    const { measure } = state;
    const { inner } = options;

    measure('finalize');

    this.completed = true;

    // Mark the end to rendering.
    measure('finalize');
    measure('render');

    // Trigger all `onceEnded` callbacks, so that middleware can know the
    // transaction has ended.
    this.endedCallbacks.forEach(callback => callback(this));
    this.endedCallbacks.clear();

    // Cache the markup and text for the DOM node to allow for short-circuiting
    // future render transactions.
    state.previousMarkup = domNode.outerHTML;
    state.isRendering = false;

    // Clean up memory before rendering the next transaction, however if
    // another transaction is running concurrently this will be delayed until
    // the last render completes.
    cleanMemory();

    // Try and render the next transaction if one has been saved.
    Transaction.renderNext(state);

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}

const isAttributeEx = /(=|"|')[^><]*?$/;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__';

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? escape(decodeEntities(value)) : value;
};

function handleTaggedTemplate(strings, ...values) {
  // Automatically coerce a string literal to array.
  if (typeof strings === 'string') {
    strings = [strings];
  }

  // Do not attempt to parse empty strings.
  if (!strings) {
    return null;
  }

  // Parse only the text, no dynamic bits.
  if (strings.length === 1 && !values.length) {
    const childNodes = parse(strings[0]).childNodes;
    return childNodes.length > 1 ? createTree(childNodes) : childNodes[0];
  }

  // Used to store markup and tokens.
  let HTML = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  const supplemental = {
    attributes: {},
    children: {},
    tags: {}
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach((string, i) => {
    // Always add the string, we need it to parse the markup later.
    HTML += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      const value = nextValue(values);
      const lastSegment = string.split(' ').pop();
      const lastCharacter = lastSegment.trim().slice(-1);
      const isAttribute = Boolean(HTML.match(isAttributeEx));
      const isTag = Boolean(lastCharacter.match(isTagEx));
      const isString = typeof value === 'string';
      const isObject = typeof value === 'object';
      const isArray = Array.isArray(value);
      const token = TOKEN + i + '__';

      // Injected as attribute.
      if (isAttribute) {
        supplemental.attributes[i] = value;
        HTML += token;
      }
      // Injected as a tag.
      else if (isTag && !isString) {
          supplemental.tags[i] = value;
          HTML += token;
        }
        // Injected as a child node.
        else if (isArray || isObject) {
            supplemental.children[i] = createTree(value);
            HTML += token;
          }
          // Injected as something else in the markup or undefined, ignore
          // obviously falsy values used with boolean operators.
          else if (value) {
              HTML += value;
            }
    }
  });

  // Parse the instrumented markup to get the Virtual Tree.
  const childNodes = parse(HTML, supplemental).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : createTree(childNodes);
}

function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    unprotectVTree(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  StateCache.delete(domNode);

  // Recycle all unprotected objects.
  cleanMemory();
}

const {
  CreateTreeHookCache: CreateTreeHookCache$1,
  CreateNodeHookCache: CreateNodeHookCache$1,
  SyncTreeHookCache: SyncTreeHookCache$1
} = MiddlewareCache;

function use(middleware) {
  if (process$1.env.NODE_ENV !== 'production') {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
  }

  const {
    subscribe,
    unsubscribe,
    createTreeHook,
    createNodeHook,
    syncTreeHook
  } = middleware;

  // Add the function to the set of middlewares.
  MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe(use.diff);

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache$1.add(createTreeHook);
  createNodeHook && CreateNodeHookCache$1.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache$1.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe(use.diff);

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache$1.delete(createTreeHook);
    CreateNodeHookCache$1.delete(createNodeHook);
    SyncTreeHookCache$1.delete(syncTreeHook);
  };
}

/**
 * A convenient helper to create Virtual Tree elements. This can be used in
 * place of HTML parsing and is what the Babel transform will compile down to.
 *
 * @example
 *
 *    import { createTree } from 'diffhtml';
 *
 *    // Creates a div with the test class and a nested text node.
 *    const vTree = createTree('div', { 'class': 'test' }, 'Hello world');
 *
 *    // Creates an empty div.
 *    const vTree = createTree('div');
 *
 *    // Creates a VTree and associates it with a DOM Node.
 *    const div = document.createElement('div');
 *    const vTree = createTree(div);
 *
 *    // Create a fragment of Nodes (is wrapped by a #document-fragment).
 *    const vTree = createTree([createTree('div'), createTree('h1')]);
 *    console.log(vTree.nodeName === '#document-fragment'); // true
 *
 *    // Any other object passed to `createTree` will be returned and assumed
 *    // to be an object that is shaped like a VTree.
 *    const vTree = createTree({
 *      nodeName: 'div',
 *      attributes: { 'class': 'on' },
 *    });
 *
 *
 * @param {Array|Object|Node} nodeName - Value used to infer making the DOM Node
 * @param {Object =} attributes - Attributes to assign
 * @param {Array|Object|String|Node =} childNodes - Children to assign
 * @return {Object} A VTree object
 */
/**
 * Parses HTML strings into Virtual Tree elements. This can be a single static
 * string, like that produced by a template engine, or a complex tagged
 * template string.
 *
 * @example
 *
 *    import { html } from 'diffhtml';
 *
 *    // Parses HTML directly from a string, useful for consuming template
 *    // engine output and inlining markup.
 *    const fromString = html('<center>Markup</center>');
 *
 *    // Parses a tagged template string. This can contain interpolated
 *    // values in between the `${...}` symbols. The values are typically
 *    // going to be strings, but you can pass any value to any property or
 *    // attribute.
 *    const fromTaggedTemplate = html`<center>${'Markup'}</center>`;
 *
 *    // You can pass functions to event handlers and basically any value to
 *    // property or attribute. If diffHTML encounters a value that is not a
 *    // string it will still create an attribute, but the value will be an
 *    // empty string. This is necessary for tracking changes.
 *    const dynamicValues = html`<center onclick=${
 *      ev => console.log('Clicked the center tag')
 *    }>Markup</center>`;
 *
 *
 * @param {String} markup - A string or tagged template string containing HTML
 * @return {Object|Array} - A single instance or array of Virtual Tree elements
 */
/**
 * Recycles internal memory, removes state, and cancels all scheduled render
 * transactions. This is mainly going to be used in unit tests and not
 * typically in production. The reason for this is that components are usually
 * going to live the lifetime of the page, with a refresh cleaning slate.
 *
 * @example
 *
 *    import { innerHTML, release } from 'diffhtml';
 *
 *    // Associate state and reuse pre-allocated memory.
 *    innerHTML(document.body, 'Hello world');
 *
 *    // Free all association to `document.body`.
 *    release(document.body);
 *
 *
 * @param {Object} node - A DOM Node that is being tracked by diffHTML
 */
/**
 * Registers middleware functions which are called during the render
 * transaction flow. These should be very fast and ideally asynchronous to
 * avoid blocking the render.
 *
 * @example
 *
 *    import { use } from 'diffhtml';
 *    import logger from 'diffhtml-logger';
 *    import devTools from 'diffhtml-devtools';
 *
 *    use(logger());
 *    use(devTools());
 *
 *
 * @param {Function} middleware - A function that gets passed internals
 * @return Function - When invoked removes and deactivates the middleware
 */
const tasks = [schedule, shouldUpdate, reconcileTrees, syncTrees, patch, endAsPromise];

/**
 * Export the version based on the package.json version field value, no longer
 * inlined with babel, due to ES Modules support.
 */
const VERSION = '1.0.0-beta';

/**
 * Used to diff the outerHTML contents of the passed element with the markup
 * contents. Very useful for applying a global diff on the
 * `document.documentElement`.
 *
 * @example
 *
 *    import { outerHTML } from 'diffhtml';
 *
 *    // Remove all attributes and set the children to be a single text node
 *    // containing the text 'Hello world',
 *    outerHTML(document.body, '<body>Hello world</body>');
 *
 *
 * @param {Object} element - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function outerHTML(domNode, markup = '', options = {}) {
  options.inner = false;
  //options.tasks = options.tasks || tasks;
  return Transaction.create(domNode, markup, options).start();
}

/**
 * Used to diff the innerHTML contents of the passed element with the markup
 * contents. This is useful with libraries like Backbone that render Views
 * into element container.
 *
 * @example
 *
 *    import { innerHTML } from 'diffhtml';
 *
 *    // Sets the body children to be a single text node containing the text
 *    // 'Hello world'.
 *    innerHTML(document.body, 'Hello world');
 *
 *
 * @param {Object} domNode - A DOM Node to render into
 * @param {String|Object} markup='' - A string of markup or virtual tree
 * @param {Object =} options={} - An object containing configuration options
 */
function innerHTML(domNode, markup = '', options = {}) {
  options.inner = true;
  //options.tasks = options.tasks || tasks;
  return Transaction.create(domNode, markup, options).start();
}

// Public API. Passed to subscribed middleware.
const diff = {
  VERSION,
  addTransitionState,
  removeTransitionState,
  release,
  createTree,
  use,
  outerHTML,
  innerHTML,
  html: handleTaggedTemplate,
  tasks
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!use.diff) {
  Object.defineProperty(use, 'diff', { value: diff, enumerable: false });
}

// Automatically hook up to DevTools if they are present.
if (typeof devTools === 'function') {
  use(devTools());
  console.info('diffHTML DevTools Found and Activated...');
}

exports.VERSION = VERSION;
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.release = release;
exports.createTree = createTree;
exports.createElement = createTree;
exports.use = use;
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.html = handleTaggedTemplate;
exports['default'] = diff;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":5}]},{},[7]);
