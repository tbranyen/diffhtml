(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.diffComponents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (process){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Debounce = new WeakMap();
var freeze = Object.freeze,
    assign = Object.assign;


exports.WebComponent = function WebComponent(observedAttributes) {
  function createProps(domNode) {
    return freeze(observedAttributes.reduce(function (props, attr) {
      return assign(props, _defineProperty({}, attr, domNode.hasAttribute(attr) ? domNode.getAttribute(attr) : domNode[attr]));
    }, {}));
  }

  function createState(domNode, newState) {
    return freeze(assign({}, this.state, newState));
  }

  function rerenderComponent(domNode) {
    var nextProps = createProps(domNode);
    domNode.componentWillReceiveProps(nextProps);
    domNode.props = nextProps;
    domNode.rerender();
  }

  return function (_HTMLElement) {
    _inherits(_class, _HTMLElement);

    _createClass(_class, null, [{
      key: 'observedAttributes',
      get: function get() {
        return observedAttributes;
      }
    }]);

    function _class() {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this));

      _this.props = createProps(_this);
      _this.state = createState(_this);
      return _this;
    }

    _createClass(_class, [{
      key: 'rerender',
      value: function rerender() {
        // Ensure that props are completely updated before rendering.
        this.props = createProps(this);
        diff.innerHTML(this.shadowRoot, this.render());
      }
    }, {
      key: 'setState',
      value: function setState(newState) {
        this.state = newState;

        if (this.shouldComponentUpdate()) {
          this.rerender();
        }
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.rerender();
        this.componentDidMount();
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback() {
        var _this2 = this;

        if (this.shadowRoot && !Debounce.has(this)) {
          rerenderComponent(this);

          Debounce.set(this, setTimeout(function () {
            Debounce.delete(_this2);
            rerenderComponent(_this2);
          }));
        }
      }
    }, {
      key: 'disconnectedCallback',
      value: function disconnectedCallback() {
        this.componentWillUnmount();
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps() {}
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {}
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {}
    }]);

    return _class;
  }(HTMLElement);
};

exports.Component = function () {
  function Component(props) {
    var _this3 = this;

    _classCallCheck(this, Component);

    var constructor = this.constructor;
    var _constructor$defaultP = constructor.defaultProps,
        defaultProps = _constructor$defaultP === undefined ? {} : _constructor$defaultP,
        _constructor$propType = constructor.propTypes,
        propTypes = _constructor$propType === undefined ? {} : _constructor$propType;


    this.props = assign({}, props);
    this.state = {};

    if (process.env.NODE_ENV !== 'production') {
      Object.keys(defaultProps).forEach(function (prop) {
        if (_this3.props[prop] === undefined) {
          _this3.props[prop] = defaultProps[prop];
        }
      });

      Object.keys(propTypes).forEach(function (prop) {
        var err = propTypes[prop](_this3.props, prop, constructor.name, 'prop');
        if (err) {
          throw err;
        }
      });
    }
  }

  _createClass(Component, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate() {
      return true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {}
  }, {
    key: 'setState',
    value: function setState(newState) {
      this.state = freeze(assign({}, this.state, newState));

      if (this.shouldComponentUpdate()) {
        this.rerender();
      }
    }
  }]);

  return Component;
}();

}).call(this,_dereq_('_process'))
},{"_process":2}],2:[function(_dereq_,module,exports){
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[1])(1)
});