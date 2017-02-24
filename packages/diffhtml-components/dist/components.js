(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('diffhtml')) :
	typeof define === 'function' && define.amd ? define(['exports', 'diffhtml'], factory) :
	(factory((global.components = global.components || {}),global.diff));
}(this, (function (exports,diffhtml) { 'use strict';

var lifecycleHooks = {
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

const Debounce = new WeakMap();
const { assign } = Object;

function setState(newState) {
  const { rerenderComponent } = this.constructor;

  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    rerenderComponent(this);

    Debounce.set(this, setTimeout(() => {
      Debounce.delete(this);
      rerenderComponent(this);
    }));
  }
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function wrap(Constructor) {
  Object.assign(Constructor.prototype, _extends({}, lifecycleHooks, {
    setState
  }));

  return Constructor;
}

const ComponentCache = new Map();
const { assign: assign$1 } = Object;

function _reconcileComponents(oldTree, newTree) {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called
  // is `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const oldCtor = oldChild && oldChild.rawNodeName;
      const newCtor = newChild.rawNodeName;
      const children = newChild.childNodes;
      const props = assign$1({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;
      const renderTree = diffhtml.createTree(instance ? instance.render(props) : newCtor(props));

      if (!renderTree) {
        continue;
      }

      if (renderTree.nodeType === 11) {
        throw new Error('Top level render must return single Node');
      }

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree.
      if (instance) {
        ComponentCache.set(renderTree, instance);
        ComponentCache.set(instance, renderTree);
      }

      // Recursively update trees.
      _reconcileComponents(oldChild, renderTree);
    } else {
      _reconcileComponents(oldChild, newChild);
    }
  }
}

let reconcileTrees = null;
let NodeCache = null;

function reactLikeComponentTask(transaction) {
  const index = transaction.tasks.indexOf(reconcileTrees);

  if (index === -1) {
    throw new Error('Missing required reconcileTrees task');
  }

  // Reconcile trees.
  transaction.tasks.splice(index + 1, 0, function reconcileComponents() {
    _reconcileComponents(transaction.oldTree, transaction.newTree);
  });
}

reactLikeComponentTask.subscribe = ({ internals, tasks }) => {
  reconcileTrees = tasks.reconcileTrees;
  NodeCache = internals.NodeCache;
};

diffhtml.use(reactLikeComponentTask);

// Creates the `component.state` object.
const createState = (instance, state) => assign$1({}, instance.state, state);

class Component$1 {
  // Facilities a component re-render.
  static rerenderComponent(instance) {
    const domNode = NodeCache.get(ComponentCache.get(instance));
    diffhtml.outerHTML(domNode, instance.render());
    instance.componentDidUpdate();
  }

  constructor(props) {
    this.props = props;
    this.state = createState(this);
    this.componentWillMount();

    //const { defaultProps, propTypes } = this.constructor;

    //Object.keys(defaultProps).forEach(prop => {
    //  if (this.props[prop] === undefined) {
    //    this.props[prop] = defaultProps[prop];
    //  }
    //});

    //if (process.env.NODE_ENV !== 'production') {
    //  Object.keys(propTypes).forEach(prop => {
    //    const err = propTypes[prop](this.props, prop, constructor.name, 'prop');
    //    if (err) { throw err; }
    //  });
    //}
  }
}

const Debounce$2 = new WeakMap();
const { setPrototypeOf, freeze, assign: assign$2, keys } = Object;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = domNode => {
  const observedAttributes = getObserved(domNode.constructor);

  return freeze(observedAttributes.reduce((props, attr) => assign$2(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || undefined
  }), {}));
};

// Creates the `component.state` object.
const createState$1 = (domNode, newState) => {
  return freeze(assign$2({}, domNode.state, newState));
};

class WebComponent$1 extends HTMLElement {
  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  // Facilities a component re-render.
  static rerenderComponent(domNode) {
    const nextProps = createProps(domNode);

    domNode.props = nextProps;
    diffhtml.innerHTML(domNode.shadowRoot, domNode.render());
    domNode.componentDidUpdate();
  }

  constructor() {
    super();

    this.props = createProps(this);
    this.state = createState$1(this);
    this.componentWillMount();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    WebComponent$1.rerenderComponent(this);
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
    if (this.shadowRoot && !Debounce$2.has(this)) {
      const nextProps = createProps(this);
      this.componentWillReceiveProps(nextProps);
      WebComponent$1.rerenderComponent(this);

      Debounce$2.set(this, setTimeout(() => {
        Debounce$2.delete(this);
        WebComponent$1.rerenderComponent(this);
      }));
    }
  }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index = createCommonjsModule(function (module, exports) {
(function (global, factory) {
  if (typeof undefined === 'function' && undefined.amd) {
    undefined('PropTypes', ['exports', 'module'], factory);
  } else {
    factory(exports, module);
  }
})(commonjsGlobal, function (exports, module) {

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


});

const Component$$1 = wrap(Component$1);
const WebComponent$$1 = wrap(WebComponent$1);

exports.Component = Component$$1;
exports.WebComponent = WebComponent$$1;
exports.PropTypes = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
