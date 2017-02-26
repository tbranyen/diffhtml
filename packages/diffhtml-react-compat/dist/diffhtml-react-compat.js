(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('diffhtml');
var createTree = _require.createTree;
var innerHTML = _require.innerHTML;
var outerHTML = _require.outerHTML;
var use = _require.use;
var html = _require.html;

var syntheticEvents = require('diffhtml-synthetic-events');
var assign = Object.assign;
var freeze = Object.freeze;
var keys = Object.keys;


var NodeCache = null;
var ComponentCache = new Map();
var reactFlow = [];

var reconcileComponents = function reconcileComponents(oldTree, newTree) {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called
  // is `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (var i = 0; i < newTree.childNodes.length; i++) {
    var oldChild = oldTree && oldTree.childNodes[i];
    var newChild = newTree.childNodes[i];

    // If no new child return.
    if (!newChild) {
      newTree.childNodes.splice(i, 1);
      i--;
      continue;
    }

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      var oldChildNodes = oldTree && oldTree.childNodes;
      var oldCtor = oldChild && oldChild.rawNodeName;
      var newCtor = newChild.rawNodeName;
      var children = newChild.childNodes.length ? newChild.childNodes.filter(Boolean) : null;
      var props = assign({}, newChild.attributes, { children: children });
      var canNew = newCtor.prototype && newCtor.prototype.render;

      // If the component has already been initialized, we can reuse it.
      var oldInstance = oldCtor === newCtor && ComponentCache.get(oldChild);
      var newInstance = !oldInstance && canNew && new newCtor(props);
      var instance = oldInstance || newInstance;

      // See if we should update.
      var shouldUpdate = instance && instance.shouldComponentUpdate(instance.props, instance.state);

      var renderTree = createTree(instance ? shouldUpdate ? instance.render(props, instance.state) : ComponentCache.get(instance) : newCtor(props));

      console.log(renderTree && renderTree.nodeName);

      if (!renderTree) {
        continue;
      }

      renderTree.rawNodeName = newCtor;

      // Remove any missing children.
      renderTree.childNodes = renderTree.childNodes.filter(Boolean);

      // Build a new tree from the render, and use this as the current tree.
      newTree.childNodes[i] = renderTree;

      // Cache this new current tree in both directions.
      if (instance) {
        ComponentCache.set(instance, renderTree);
        ComponentCache.set(renderTree, instance);
      }

      // Recursively update trees.
      reconcileComponents(oldChild, renderTree);
    } else if (newChild) {
      reconcileComponents(oldChild, newChild);
    }
  }
};

function reactCompatibility() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var startReconcileComponents = function startReconcileComponents(transaction) {
    reconcileComponents(transaction.state.oldTree, transaction.newTree);
  };

  var diffHTMLTasks = null;

  function reactCompatibilityTask(transaction) {
    // Use React Flow.
    var tasks = transaction.tasks;

    var index = tasks.indexOf(diffHTMLTasks.reconcileTrees);

    // Inject after tree reconcilation.
    transaction.tasks = tasks.splice(index + 1, 0, startReconcileComponents);

    return function () {
      ComponentCache.forEach(function (key, value) {
        value.componentDidMount && value.componentDidMount();
        value.componentDidUpdate && value.componentDidUpdate(value.props, value.state);
      });
    };
  }

  var subscribe = function subscribe(_ref) {
    var internals = _ref.internals,
        tasks = _ref.tasks;

    diffHTMLTasks = tasks;
    NodeCache = internals.NodeCache;
  };

  return assign(reactCompatibilityTask, { subscribe: subscribe });
}

use(reactCompatibility());
use(syntheticEvents());

exports.createElement = function () {
  var tree = createTree.apply(undefined, arguments);

  tree.$$typeof = Symbol.for('react.element');

  var attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  attributes.forEach(function (name) {
    if (name.indexOf('on') === 0) {
      tree.attributes[name.toLowerCase()] = tree.attributes[name];
    }
  });

  return tree;
};

exports.Component = function () {
  function Component(props) {
    var _this = this;

    _classCallCheck(this, Component);

    var constructor = this.constructor;
    var _constructor$defaultP = constructor.defaultProps,
        defaultProps = _constructor$defaultP === undefined ? {} : _constructor$defaultP,
        _constructor$propType = constructor.propTypes,
        propTypes = _constructor$propType === undefined ? {} : _constructor$propType;


    this.props = assign({}, props);
    this.state = {};

    Object.keys(defaultProps).forEach(function (prop) {
      if (_this.props[prop] === undefined) {
        _this.props[prop] = defaultProps[prop];
      }
    });

    
  }

  _createClass(Component, [{
    key: 'setState',
    value: function setState(newState) {
      this.state = freeze(assign({}, this.state, newState));

      if (this.shouldComponentUpdate()) {
        outerHTML(NodeCache.get(ComponentCache.get(this)), this.render(this.props, this.state), {
          flow: reactFlow
        });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {}
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {}
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {}
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }]);

  return Component;
}();

exports.PropTypes = require('proptypes');
exports.html = html;
exports.render = function (component, mount) {
  return innerHTML(mount, component);
};
exports.isValidElement = function (object) {
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === Symbol.for('react.element');
};

})));
//# sourceMappingURL=diffhtml-react-compat.js.map
