(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _diffhtml = require('diffhtml');

var _caches = require('diffhtml-shared-internals/dist/cjs/caches');

var _process = require('diffhtml-shared-internals/dist/cjs/process');

var _process2 = _interopRequireDefault(_process);

var _reactLikeComponent = require('./tasks/react-like-component');

var _reactLikeComponent2 = _interopRequireDefault(_reactLikeComponent);

var _upgradeSharedClass = require('./shared/upgrade-shared-class');

var _upgradeSharedClass2 = _interopRequireDefault(_upgradeSharedClass);

var _caches2 = require('./util/caches');

var _symbols = require('./util/symbols');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { keys, assign } = Object;

// Registers a custom middleware to help map the diffHTML render lifecycle
// internals to React. This currently isn't necessary for the Web Component
// implementation since they inherently provide lifecycle hooks.
const root = typeof global !== 'undefined' ? global : window;

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
const unsubscribeMiddleware = (0, _diffhtml.use)(_reactLikeComponent2.default);

exports.default = (0, _upgradeSharedClass2.default)(class Component {
  static unsubscribeMiddleware() {
    unsubscribeMiddleware();
  }

  constructor(initialProps) {
    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = {};

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
      contextTypes = {},
      name
    } = this.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in props && props[prop] !== undefined) {
        return;
      }

      props[prop] = defaultProps[prop];
    });

    if (_process2.default.env.NODE_ENV !== 'production') {
      keys(propTypes).forEach(prop => {
        const err = propTypes[prop](props, prop, name, 'prop');
        if (err) {
          throw err;
        }
      });
    }

    keys(childContextTypes).forEach(prop => {
      if (_process2.default.env.NODE_ENV !== 'production') {
        const err = childContextTypes[prop](this.context, prop, name, 'context');
        if (err) {
          throw err;
        }
      }

      //this.context[prop] = child
    });

    keys(contextTypes).forEach(prop => {
      if (_process2.default.env.NODE_ENV !== 'production') {
        const err = childContextTypes[prop](this.context, prop, name, 'context');
        if (err) {
          throw err;
        }
      }

      this.context[prop] = child;
    });
  }

  [_symbols.$$render]() {
    const vTree = _caches2.ComponentTreeCache.get(this);
    const domNode = _caches.NodeCache.get(vTree);
    const renderTree = this.render();

    (0, _diffhtml.outerHTML)(domNode, renderTree).then(() => {
      this.componentDidUpdate();
    });
  }
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./shared/upgrade-shared-class":5,"./tasks/react-like-component":6,"./util/caches":7,"./util/symbols":8,"diffhtml":16,"diffhtml-shared-internals/dist/cjs/caches":9,"diffhtml-shared-internals/dist/cjs/process":10}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = forceUpdate;

var _symbols = require('../util/symbols');

const Debounce = new WeakMap();
const { assign } = Object;

function forceUpdate() {
  this[_symbols.$$render]();
}
},{"../util/symbols":8}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setState;

var _symbols = require('../util/symbols');

const Debounce = new WeakMap();
const { assign } = Object;

function setState(newState) {
  this.state = assign({}, this.state, newState);

  if (!Debounce.has(this) && this.shouldComponentUpdate()) {
    this[_symbols.$$render]();

    Debounce.set(this, setTimeout(() => {
      Debounce.delete(this);

      if (this.shouldComponentUpdate()) {
        this[_symbols.$$render]();
      }
    }));
  }
}
},{"../util/symbols":8}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = upgradeClass;

var _lifecycleHooks = require('./lifecycle-hooks');

var _lifecycleHooks2 = _interopRequireDefault(_lifecycleHooks);

var _setState = require('./set-state');

var _setState2 = _interopRequireDefault(_setState);

var _forceUpdate = require('./force-update');

var _forceUpdate2 = _interopRequireDefault(_forceUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { assign } = Object;

function upgradeClass(Constructor) {
  assign(Constructor.prototype, _lifecycleHooks2.default, { forceUpdate: _forceUpdate2.default, setState: _setState2.default });
  return Constructor;
}
},{"./force-update":2,"./lifecycle-hooks":3,"./set-state":4}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reactLikeComponentTask;

var _create = require('diffhtml/dist/cjs/tree/create');

var _create2 = _interopRequireDefault(_create);

var _caches = require('diffhtml-shared-internals/dist/cjs/caches');

var _caches2 = require('../util/caches');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { assign } = Object;

function triggerRef(ref, instance) {
  if (typeof ref === 'function') {
    ref(instance);
  } else if (typeof ref === 'string') {
    this[ref](instance);
  }
}

function searchForRefs(newTree) {
  if (newTree.attributes.ref) {
    triggerRef(newTree.attributes.ref, _caches.NodeCache.get(newTree));
  }

  newTree.childNodes.forEach(searchForRefs);
}

function componentDidMount(newTree) {
  if (_caches2.InstanceCache.has(newTree)) {
    _caches2.InstanceCache.get(newTree).componentDidMount();
  }

  const instance = _caches2.InstanceCache.get(newTree);

  searchForRefs(newTree);

  if (!instance) {
    return;
  }

  const { ref } = instance.props;

  triggerRef(ref, instance);
}

function reactLikeComponentTask(transaction) {
  return transaction.onceEnded(() => {
    const { patches } = transaction;

    if (patches.TREE_OPS && patches.TREE_OPS.length) {
      patches.TREE_OPS.forEach(({ INSERT_BEFORE, REPLACE_CHILD }) => {
        if (INSERT_BEFORE) {
          for (let i = 0; i < INSERT_BEFORE.length; i += 3) {
            const newTree = INSERT_BEFORE[i + 1];
            componentDidMount(newTree);
          }
        }

        if (REPLACE_CHILD) {
          for (let i = 0; i < REPLACE_CHILD.length; i += 3) {
            const newTree = REPLACE_CHILD[i + 1];
            componentDidMount(newTree);
          }
        }
      });
    }
  });
}

reactLikeComponentTask.syncTreeHook = (oldTree, newTree) => {
  // Stateful components have a very limited API, designed to be fully
  // implemented by a higher-level abstraction. The only method ever called is
  // `render`. It is up to a higher level abstraction on how to handle the
  // changes.
  for (let i = 0; i < newTree.childNodes.length; i++) {
    const oldChild = oldTree && oldTree.childNodes && oldTree.childNodes[i];
    const newChild = newTree.childNodes[i];

    // If incoming tree is a component, flatten down to tree for now.
    if (newChild && typeof newChild.rawNodeName === 'function') {
      const newCtor = newChild.rawNodeName;
      const oldInstanceCache = _caches2.InstanceCache.get(oldChild);
      const children = newChild.childNodes;
      const props = assign({}, newChild.attributes, { children });
      const canNew = newCtor.prototype;

      // If the component has already been initialized, we can reuse it.
      const oldInstance = oldChild && oldInstanceCache instanceof newCtor && oldInstanceCache;
      const newInstance = !oldInstance && canNew && new newCtor(props);
      const instance = oldInstance || newInstance;

      let renderTree = null;

      if (oldInstance) {
        oldInstance.componentWillReceiveProps(props);

        if (oldInstance.shouldComponentUpdate()) {
          renderTree = oldInstance.render(props, oldInstance.state);
        }
      } else {
        renderTree = (0, _create2.default)(instance && instance.render ? instance.render(props, instance.state) : newCtor(props));
      }

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
        _caches2.ComponentTreeCache.set(instance, renderTree);
        _caches2.InstanceCache.set(renderTree, instance);
      }

      // Recursively update trees.
      return newTree;
    }
  }
};
},{"../util/caches":7,"diffhtml-shared-internals/dist/cjs/caches":9,"diffhtml/dist/cjs/tree/create":30}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const ComponentTreeCache = exports.ComponentTreeCache = new WeakMap();
const InstanceCache = exports.InstanceCache = new WeakMap();
},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const $$render = exports.$$render = Symbol('diff.render');
},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caches = require('diffhtml/dist/cjs/util/caches');

Object.keys(_caches).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _caches[key];
    }
  });
});
},{"diffhtml/dist/cjs/util/caches":33}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _process = require('diffhtml/dist/cjs/util/process');

Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_process).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"diffhtml/dist/cjs/util/process":40}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n      Stable is ', '\n\n      <select onchange=', '>\n        ', '\n      </select>\n\n      <p>\n        All of the following methods are available under the <code>diff</code>\n        namespace and you can alternatively import them individually using\n        CommonJS or ES-2015 modules. The examples shown use the ES-2015 modules\n        format. If you want to use this format as well, you\'ll need a\n        transpiler like <a href="https://babeljs.io/">Babel</a>.\n      </p>\n\n      <hr>\n\n      <ul class="methods">\n        ', '\n      </ul>\n\n      <hr>\n\n      <section class="comments">\n        ', '\n        </section>\n    '], ['\n      Stable is ', '\n\n      <select onchange=', '>\n        ', '\n      </select>\n\n      <p>\n        All of the following methods are available under the <code>diff</code>\n        namespace and you can alternatively import them individually using\n        CommonJS or ES-2015 modules. The examples shown use the ES-2015 modules\n        format. If you want to use this format as well, you\'ll need a\n        transpiler like <a href="https://babeljs.io/">Babel</a>.\n      </p>\n\n      <hr>\n\n      <ul class="methods">\n        ', '\n      </ul>\n\n      <hr>\n\n      <section class="comments">\n        ', '\n        </section>\n    ']),
    _templateObject2 = _taggedTemplateLiteral(['<option\n          data-ref="', '"\n          ', '\n        >\n          ', '\n        </option>'], ['<option\n          data-ref="', '"\n          ', '\n        >\n          ', '\n        </option>']),
    _templateObject3 = _taggedTemplateLiteral(['<li>\n          <a href="#', '">', '<strong class="args">(', ')</strong></a>\n        </li>'], ['<li>\n          <a href="#', '">', '<strong class="args">(', ')</strong></a>\n        </li>']),
    _templateObject4 = _taggedTemplateLiteral(['\n            <div class="comment">\n              <a class="header" id="', '" href="#', '"><h4 class="api-method">', '<strong class="args">(', ')</strong></h4></a>\n\n              <p class="push-left">\n                <a class="methods" href="#api">&nbsp; Back to API</a> |\n                <a class="view-on-github" href="', '">\n                  <i class="fa fa-github" aria-hidden="true"></i> View source on GitHub\n                </a>\n              </p>\n\n              <div>\n                ', '\n              </div>\n\n              <h5>', '</h5>\n\n              ', '\n\n              <h5>Arguments</h5>\n\n              ', '\n\n              <h5>Return value</h5>\n\n              ', '\n\n              <div class="gap"></div>\n              <hr>\n            </div>\n          '], ['\n            <div class="comment">\n              <a class="header" id="', '" href="#', '"><h4 class="api-method">', '<strong class="args">(', ')</strong></h4></a>\n\n              <p class="push-left">\n                <a class="methods" href="#api">&nbsp; Back to API</a> |\n                <a class="view-on-github" href="', '">\n                  <i class="fa fa-github" aria-hidden="true"></i> View source on GitHub\n                </a>\n              </p>\n\n              <div>\n                ', '\n              </div>\n\n              <h5>', '</h5>\n\n              ', '\n\n              <h5>Arguments</h5>\n\n              ', '\n\n              <h5>Return value</h5>\n\n              ', '\n\n              <div class="gap"></div>\n              <hr>\n            </div>\n          ']),
    _templateObject5 = _taggedTemplateLiteral(['\n                <pre><code class="javascript hljs">\n                  ', '\n                </code></pre>\n              '], ['\n                <pre><code class="javascript hljs">\n                  ', '\n                </code></pre>\n              ']),
    _templateObject6 = _taggedTemplateLiteral(['\n                <table class="details">\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Description</th>\n                      <th>Default value</th>\n                      <th>Required</th>\n                    </tr>\n                  </thead>\n\n                  <tbody>\n                    ', '\n                  </tbody>\n                </table>\n              '], ['\n                <table class="details">\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Description</th>\n                      <th>Default value</th>\n                      <th>Required</th>\n                    </tr>\n                  </thead>\n\n                  <tbody>\n                    ', '\n                  </tbody>\n                </table>\n              ']),
    _templateObject7 = _taggedTemplateLiteral(['<tr>\n                      <td class="strong">', '</td>\n                      <td>', '</td>\n                      <td><code>', '</code></td>\n                      <td>', '</td>\n                    </tr>'], ['<tr>\n                      <td class="strong">', '</td>\n                      <td>', '</td>\n                      <td><code>', '</code></td>\n                      <td>', '</td>\n                    </tr>']),
    _templateObject8 = _taggedTemplateLiteral(['\n                No arguments to display\n              '], ['\n                No arguments to display\n              ']),
    _templateObject9 = _taggedTemplateLiteral(['<p>\n                ', '\n              </p>'], ['<p>\n                ', '\n              </p>']),
    _templateObject10 = _taggedTemplateLiteral(['\n      No API data loaded.\n    '], ['\n      No API data loaded.\n    ']),
    _templateObject11 = _taggedTemplateLiteral(['<', ' />'], ['<', ' />']);

var _diffhtml = require('diffhtml');

var _component = require('diffhtml-components/dist/cjs/component');

var _component2 = _interopRequireDefault(_component);

require('proxy-polyfill/proxy.min');

require('whatwg-fetch');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _hljs = hljs,
    highlightAuto = _hljs.highlightAuto;

var $$render = Symbol.for('diff.render');

var ApiBrowser = function (_Component) {
  _inherits(ApiBrowser, _Component);

  _createClass(ApiBrowser, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return this.state.latestStable ? (0, _diffhtml.html)(_templateObject, this.state.latestStable, this.switchVersion.bind(this), this.state.refs.map(function (ref, i) {
        return (0, _diffhtml.html)(_templateObject2, encodeURIComponent(ref), ref === _this2.state.ref ? 'selected' : '', _this2.prettyPrint(ref, i));
      }), this.state.comments.map(function (comment) {
        return (0, _diffhtml.html)(_templateObject3, comment.ctx.name, comment.ctx.name, _this2.makeArgs(comment.tags.filter(function (tag) {
          return tag.type === 'param';
        })));
      }), this.state.comments.map(function (comment) {
        var ref = _this2.state.ref.split('/').slice(-1)[0];
        var url = _this2.state.url + '/blob/' + ref + '/lib/index.js#L' + comment.codeStart;
        var returnValue = comment.tags.filter(function (tag) {
          return tag.type === 'return';
        });
        var examples = comment.tags.filter(function (tag) {
          return tag.type === 'example';
        });
        var params = comment.tags.filter(function (tag) {
          return tag.type === 'param';
        });

        return (0, _diffhtml.html)(_templateObject4, comment.ctx.name, comment.ctx.name, comment.ctx.name, _this2.makeArgs(params), url, _this2.strip('br', comment.description.full), examples.length > 1 ? 'Examples' : 'Example', examples.length ? examples.map(function (tag) {
          return (0, _diffhtml.html)(_templateObject5, (0, _diffhtml.html)(highlightAuto(_this2.trimCode(tag.string), ['javascript']).value));
        }) : 'No examples', params.length ? (0, _diffhtml.html)(_templateObject6, params.map(function (tag) {
          return (0, _diffhtml.html)(_templateObject7, _this2.getName(tag.name), tag.description ? (0, _diffhtml.html)(tag.description) : 'n/a', _this2.getDefault(tag.name), String(!tag.optional));
        })) : (0, _diffhtml.html)(_templateObject8), returnValue.length ? (0, _diffhtml.html)(_templateObject9, returnValue[0].string) : (0, _diffhtml.html)('<code>undefined</code>'));
      })) : (0, _diffhtml.html)(_templateObject10);
    }
  }]);

  function ApiBrowser() {
    _classCallCheck(this, ApiBrowser);

    var _this = _possibleConstructorReturn(this, (ApiBrowser.__proto__ || Object.getPrototypeOf(ApiBrowser)).call(this));

    var debounce = function debounce() {
      clearTimeout(debounce.timeout);
      debounce.timeout = setTimeout(function () {
        return _this[$$render]();
      }, 10);
    };

    var bindState = {
      get: function get(o, k) {
        return o[k];
      },
      set: function set(o, k, v) {
        o[k] = v;return !debounce();
      }
    };

    _this.state = new Proxy({
      url: 'http://github.com/tbranyen/diffhtml',
      isFetching: false,
      ref: null,
      refs: null,
      comments: null,
      latestStable: null,
      output: null,
      repo: null,
      version: null
    }, bindState);

    var ref = location.pathname.slice(1);

    if (ref) {
      _this.state.ref = ref;
    }

    _this.state.isFetching = false;

    _this.request = _this.fetch(ref).then(function () {
      if (!ref) {
        _this.state.ref = _this.state.refs[1];
      }
      _this.state.isFetching = false;
    });
    return _this;
  }

  _createClass(ApiBrowser, [{
    key: 'trimCode',
    value: function trimCode(src) {
      var whitespaceRegex = /(\s+).*/;
      var match = whitespaceRegex.exec(src);

      if (match) {
        var length = match[1].length;
        var leading = new RegExp(Array(length).fill('').join(' '), 'g');
        return src.replace(leading, '');
      }

      return src;
    }
  }, {
    key: 'makeArgs',
    value: function makeArgs(params) {
      return params.map(function (param) {
        return param.optional ? '[' + param.name + ']' : param.name;
      }).join(', ');
    }
  }, {
    key: 'switchVersion',
    value: function switchVersion(ev) {
      var option = ev.target.children[ev.target.selectedIndex];
      this.state.ref = option.dataset.ref;
      this.fetch(option.dataset.ref);
      location.href = '/' + option.dataset.ref + '#api';
    }
  }, {
    key: 'getName',
    value: function getName() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return name.split('=')[0];
    }
  }, {
    key: 'getDefault',
    value: function getDefault() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var parts = name.split('=');

      return parts.length > 1 ? parts[1] : 'undefined';
    }
  }, {
    key: 'strip',
    value: function strip(tagName, contents) {
      var tree = (0, _diffhtml.html)(contents);

      var filter = function filter(childNodes) {
        return childNodes.map(function (childNode) {
          if (childNode.nodeName === tagName) {
            return (0, _diffhtml.createElement)('#text', null, ' ');
          }

          childNode.childNodes = filter(childNode.childNodes);

          return childNode;
        });
      };

      if (tree.childNodes) {
        tree.childNodes = filter(tree.childNodes);
      }

      if (Array.isArray(tree)) {
        tree = filter(tree);
      }

      return tree;
    }
  }, {
    key: 'prettyPrint',
    value: function prettyPrint(ref, count) {
      if (ref.indexOf('refs/heads') > -1) {
        return ref.slice('refs/heads/'.length) + ' (unstable) branch';
      } else if (ref.indexOf('refs/tags') > -1) {
        if (count === 1) {
          return 'v' + ref.slice('refs/tags/'.length) + ' (stable) tag';
        } else {
          return 'v' + ref.slice('refs/tags/'.length) + ' (outdated) tag';
        }
      } else if (ref.indexOf('refs/remotes') > -1) {
        return ref.slice('refs/remotes/'.length) + ' remote branch';
      }
    }
  }, {
    key: 'fetch',
    value: function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function (version) {
      var _this3 = this;

      var request = fetch('/api/' + (version ? version : ''));
      var parseJSON = request.then(function (resp) {
        return resp.json();
      });

      return parseJSON.then(function (state) {
        return Object.assign(_this3.state, state);
      });
    })
  }]);

  return ApiBrowser;
}(_component2.default);

var browser = new ApiBrowser();
var sem = 0;

(0, _diffhtml.use)(function () {
  return function () {
    console.log('afterRender');
    sem++;

    if (sem !== 2) {
      return;
    }

    var setTarget = function setTarget(selector) {
      var target = document.querySelector('a[href=\'' + selector + '\']');

      if (target) {
        [].concat(_toConsumableArray(document.querySelectorAll('.target'))).forEach(function (el) {
          return el.classList.remove('target');
        });
        target.classList.add('target');

        var link = document.querySelector(selector);

        if (link) {
          link.scrollIntoView(true);
        }
      }
    };

    var hash = location.hash;

    // This is due to the lack of server-side rendering for API docs. This should
    // be rectified.
    setTimeout(function () {
      return setTarget(hash);
    }, 100);

    var scrollTop = document.body.scrollTop;

    // Set up the anchor monitoring.
    var timeout = null;

    // Get all the headers in `section#content`.
    var nodes = document.querySelectorAll(('' + ['h1', 'h2', 'h3', 'h4', 'h5', 'a[id].header'].map(function (selector) {
      return '\n      section#content ' + selector + '\n    ';
    }).join(', ').trim()).trim());

    // Make up a table full of offsets.
    var headerTable = [].concat(_toConsumableArray(nodes)).map(function (el) {
      var top = el.getBoundingClientRect().top + scrollTop;
      var selector = '#' + el.id;
      var anchor = document.querySelector('nav a[href=\'' + selector + '\']');
      return { el: el, top: top, anchor: anchor };
    }).slice(1).filter(function (meta) {
      return meta.anchor;
    });

    var clearAll = function clearAll() {
      headerTable.forEach(function (meta) {
        return meta.anchor.classList.remove('target');
      });
    };

    var update = function update() {
      // Bring back some of the padding, so we can see the section title...
      scrollTop = document.body.scrollTop + 60;

      headerTable.sort(function (a, b) {
        return b.top - a.top;
      }).some(function (meta) {
        if (scrollTop > meta.top) {
          clearAll();

          if (scrollTop) {
            meta.anchor.classList.add('target');
            history.replaceState('', {}, meta.anchor.href);
          } else {
            history.replaceState('', {}, '/');
          }

          return true;
        }
      });
    };

    var delay = true;

    // Initial page delay.
    setTimeout(function () {
      delay = false;
    }, 100);

    var monitorAnchorTags = function monitorAnchorTags(options) {
      return function (ev) {
        if (delay) {
          return;
        }

        // If the timeout exists, return early.
        if (timeout) {
          return;
        }

        // Set a debounce timeout.
        timeout = setTimeout(function () {
          timeout = null;
          update();
        }, 200);
      };
    };

    document.onscroll = monitorAnchorTags();

    document.querySelector('nav ul').onclick = function (ev) {
      if (ev.target.parentNode.matches('a')) {
        ev.stopPropagation();
        ev.stopImmediatePropagation();

        timeout = true;
        setTarget(ev.target.parentNode.getAttribute('href'), { update: false });
        setTimeout(function () {
          return timeout = false;
        }, 200);
      }
    };

    document.querySelector('.open-menu').onclick = function (ev) {
      ev.stopImmediatePropagation();

      var body = document.querySelector('body');
      var content = document.querySelector('section#content');

      if (body.classList.contains('open')) {
        return body.onclick();
      }

      body.classList.add('open');

      body.onclick = function () {
        body.classList.remove('open');
        body.onclick = null;
      };
    };
  };
});

var mount = document.querySelector('#api-browser');
console.log(mount);
(0, _diffhtml.innerHTML)(mount, (0, _diffhtml.html)(_templateObject11, ApiBrowser));

},{"diffhtml":16,"diffhtml-components/dist/cjs/component":1,"proxy-polyfill/proxy.min":13,"whatwg-fetch":14}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
(function (global){
(function(d){function k(a){return a?"object"==typeof a||"function"==typeof a:!1}if(!d.Proxy){var l=null;d.a=function(a,c){function d(){}if(!k(a)||!k(c))throw new TypeError("Cannot create proxy with a non-object as target or handler");l=function(){d=function(b){throw new TypeError("Cannot perform '"+b+"' on a proxy that has been revoked");}};var f=c;c={get:null,set:null,apply:null,construct:null};for(var g in f){if(!(g in c))throw new TypeError("Proxy polyfill does not support trap '"+g+"'");c[g]=
f[g]}"function"==typeof f&&(c.apply=f.apply.bind(f));var e=this,m=!1,n="function"==typeof a;if(c.apply||c.construct||n)e=function(){var b=this&&this.constructor===e;d(b?"construct":"apply");if(b&&c.construct)return c.construct.call(this,a,arguments);if(!b&&c.apply)return c.apply(a,this,arguments);if(n)return b?(b=Array.prototype.slice.call(arguments),b.unshift(a),new (a.bind.apply(a,b))):a.apply(this,arguments);throw new TypeError(b?"not a constructor":"not a function");},m=!0;var p=c.get?function(b){d("get");
return c.get(this,b,e)}:function(b){d("get");return this[b]},r=c.set?function(b,a){d("set");c.set(this,b,a,e)}:function(a,c){d("set");this[a]=c},q={};Object.getOwnPropertyNames(a).forEach(function(b){m&&b in e||(Object.defineProperty(e,b,{enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:p.bind(a,b),set:r.bind(a,b)}),q[b]=!0)});f=!0;Object.setPrototypeOf?Object.setPrototypeOf(e,Object.getPrototypeOf(a)):e.__proto__?e.__proto__=a.__proto__:f=!1;if(c.get||!f)for(var h in a)q[h]||Object.defineProperty(e,
h,{get:p.bind(a,h)});Object.seal(a);Object.seal(e);return e};d.a.b=function(a,c){return{proxy:new d.a(a,c),revoke:l}};d.a.revocable=d.a.b;d.Proxy=d.a}})("undefined"!==typeof module&&module.exports?global:window);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)

    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var list = this.map[name]
    if (!list) {
      list = []
      this.map[name] = list
    }
    list.push(value)
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    var values = this.map[normalizeName(name)]
    return values ? values[0] : null
  }

  Headers.prototype.getAll = function(name) {
    return this.map[normalizeName(name)] || []
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = [normalizeValue(value)]
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    Object.getOwnPropertyNames(this.map).forEach(function(name) {
      this.map[name].forEach(function(value) {
        callback.call(thisArg, value, name, this)
      }, this)
    }, this)
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (typeof input === 'string') {
      this.url = input
    } else {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split('\r\n').forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = handleTaggedTemplate;

var _create = require('./tree/create');

var _create2 = _interopRequireDefault(_create);

var _parser = require('./util/parser');

var _parser2 = _interopRequireDefault(_parser);

var _escape = require('./util/escape');

var _escape2 = _interopRequireDefault(_escape);

var _decodeEntities = require('./util/decode-entities');

var _decodeEntities2 = _interopRequireDefault(_decodeEntities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isAttributeEx = /(=|"|')[^><]*?$/;
const isTagEx = /(<|\/)/;
const TOKEN = '__DIFFHTML__';

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
const nextValue = values => {
  const value = values.shift();
  return typeof value === 'string' ? (0, _escape2.default)((0, _decodeEntities2.default)(value)) : value;
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
    const childNodes = (0, _parser2.default)(strings[0]).childNodes;
    return childNodes.length > 1 ? (0, _create2.default)(childNodes) : childNodes[0];
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
            supplemental.children[i] = (0, _create2.default)(value);
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
  const childNodes = (0, _parser2.default)(HTML, supplemental).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : (0, _create2.default)(childNodes);
}
},{"./tree/create":30,"./util/decode-entities":34,"./util/escape":35,"./util/parser":38}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = exports.innerHTML = exports.outerHTML = exports.use = exports.createElement = exports.createTree = exports.release = exports.removeTransitionState = exports.addTransitionState = exports.VERSION = undefined;

var _create = require('./tree/create');

var _create2 = _interopRequireDefault(_create);

var _schedule = require('./tasks/schedule');

var _schedule2 = _interopRequireDefault(_schedule);

var _shouldUpdate = require('./tasks/should-update');

var _shouldUpdate2 = _interopRequireDefault(_shouldUpdate);

var _reconcileTrees = require('./tasks/reconcile-trees');

var _reconcileTrees2 = _interopRequireDefault(_reconcileTrees);

var _syncTrees = require('./tasks/sync-trees');

var _syncTrees2 = _interopRequireDefault(_syncTrees);

var _patchNode = require('./tasks/patch-node');

var _patchNode2 = _interopRequireDefault(_patchNode);

var _endAsPromise = require('./tasks/end-as-promise');

var _endAsPromise2 = _interopRequireDefault(_endAsPromise);

var _innerHtml = require('./inner-html');

var _innerHtml2 = _interopRequireDefault(_innerHtml);

var _outerHtml = require('./outer-html');

var _outerHtml2 = _interopRequireDefault(_outerHtml);

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _release = require('./release');

var _release2 = _interopRequireDefault(_release);

var _use = require('./use');

var _use2 = _interopRequireDefault(_use);

var _transition = require('./transition');

var _version = require('./version');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tasks = [_schedule2.default, _shouldUpdate2.default, _reconcileTrees2.default, _syncTrees2.default, _patchNode2.default, _endAsPromise2.default];

const innerHTML = (0, _innerHtml2.default)(tasks);
const outerHTML = (0, _outerHtml2.default)(tasks);

const VERSION = _version.__VERSION__;

// Public API. Passed to subscribed middleware.
const diff = {
  VERSION,
  addTransitionState: _transition.addTransitionState,
  removeTransitionState: _transition.removeTransitionState,
  release: _release2.default,
  createTree: _create2.default,
  use: _use2.default,
  outerHTML,
  innerHTML,
  html: _html2.default
};

// Ensure the `diff` property is nonenumerable so it doesn't show up in logs.
if (!_use2.default.diff) {
  Object.defineProperty(_use2.default, 'diff', { value: diff, enumerable: false });
}

// Automatically hook up to DevTools if they are present.
if (typeof devTools === 'function') {
  (0, _use2.default)(devTools());
  console.info('diffHTML DevTools Found and Activated...');
}

exports.VERSION = VERSION;
exports.addTransitionState = _transition.addTransitionState;
exports.removeTransitionState = _transition.removeTransitionState;
exports.release = _release2.default;
exports.createTree = _create2.default;
exports.createElement = _create2.default;
exports.use = _use2.default;
exports.outerHTML = outerHTML;
exports.innerHTML = innerHTML;
exports.html = _html2.default;
exports.default = diff;
},{"./html":15,"./inner-html":17,"./outer-html":20,"./release":21,"./tasks/end-as-promise":22,"./tasks/patch-node":23,"./tasks/reconcile-trees":24,"./tasks/schedule":25,"./tasks/should-update":26,"./tasks/sync-trees":27,"./transition":29,"./tree/create":30,"./use":32,"./version":42}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transaction = require('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = tasks => function innerHTML(element, markup = '', options = {}) {
  options.inner = true;
  options.tasks = options.tasks || tasks;
  return _transaction2.default.create(element, markup, options).start();
};
},{"./transaction":28}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNode;

var _caches = require('../util/caches');

var _svg = require('../util/svg');

var _process = require('../util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { CreateNodeHookCache } = _caches.MiddlewareCache;

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
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!vTree) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  const existingNode = _caches.NodeCache.get(vTree);

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
      else if (_svg.elements.indexOf(nodeName) > -1) {
          domNode = ownerDocument.createElementNS(_svg.namespace, nodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(nodeName);
          }
  }

  // Add to the domNodes cache.
  _caches.NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (let i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument));
  }

  return domNode;
}
},{"../util/caches":33,"../util/process":40,"../util/svg":41}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patchNode;

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _transition = require('../transition');

var _caches = require('../util/caches');

var _memory = require('../util/memory');

var _decodeEntities = require('../util/decode-entities');

var _decodeEntities2 = _interopRequireDefault(_decodeEntities);

var _escape = require('../util/escape');

var _escape2 = _interopRequireDefault(_escape);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

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
      const value = (0, _decodeEntities2.default)(SET_ATTRIBUTE[i + 2]);

      const domNode = (0, _create2.default)(vTree);
      const attributeChanged = _caches.TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(_name);
      const newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, _name, oldValue, value);

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

      const domNode = _caches.NodeCache.get(vTree);
      const attributeChanged = _caches.TransitionCache.get('attributeChanged');
      const oldValue = domNode.getAttribute(name);
      const newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, name, oldValue, null);

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

        const domNode = _caches.NodeCache.get(vTree);
        const referenceNode = referenceTree && (0, _create2.default)(referenceTree);
        const attached = _caches.TransitionCache.get('attached');

        if (referenceTree) {
          (0, _memory.protectVTree)(referenceTree);
        }

        const newNode = (0, _create2.default)(newTree);
        (0, _memory.protectVTree)(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        domNode.insertBefore(newNode, referenceNode);

        const attachedPromises = (0, _transition.runTransitions)('attached', newNode);

        promises.push(...attachedPromises);
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      for (let i = 0; i < REMOVE_CHILD.length; i++) {
        const vTree = REMOVE_CHILD[i];
        const domNode = _caches.NodeCache.get(vTree);
        const detached = _caches.TransitionCache.get('detached');
        const detachedPromises = (0, _transition.runTransitions)('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(() => {
            domNode.parentNode.removeChild(domNode);
            (0, _memory.unprotectVTree)(vTree);
          });

          promises.push(...detachedPromises);
        } else {
          domNode.parentNode.removeChild(domNode);
          (0, _memory.unprotectVTree)(vTree);
        }
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      for (let i = 0; i < REPLACE_CHILD.length; i += 2) {
        const newTree = REPLACE_CHILD[i];
        const oldTree = REPLACE_CHILD[i + 1];

        const oldDomNode = _caches.NodeCache.get(oldTree);
        const newDomNode = (0, _create2.default)(newTree);
        const attached = _caches.TransitionCache.get('attached');
        const detached = _caches.TransitionCache.get('detached');
        const replaced = _caches.TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        (0, _memory.protectVTree)(newTree);

        const attachedPromises = (0, _transition.runTransitions)('attached', newDomNode);
        const detachedPromises = (0, _transition.runTransitions)('detached', oldDomNode);
        const replacedPromises = (0, _transition.runTransitions)('replaced', oldDomNode, newDomNode);
        const allPromises = [...attachedPromises, ...detachedPromises, ...replacedPromises];

        if (allPromises.length) {
          Promise.all(allPromises).then(() => {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            (0, _memory.unprotectVTree)(oldTree);
          });

          promises.push(...allPromises);
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          (0, _memory.unprotectVTree)(oldTree);
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
      const domNode = _caches.NodeCache.get(vTree);
      const textChanged = _caches.TransitionCache.get('textChanged');
      const textChangedPromises = (0, _transition.runTransitions)('textChanged', domNode, oldValue, nodeValue);

      const { parentNode } = domNode;

      if (nodeValue.includes('&')) {
        domNode.nodeValue = (0, _decodeEntities2.default)(nodeValue);
      } else {
        domNode.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = (0, _escape2.default)((0, _decodeEntities2.default)(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push(...textChangedPromises);
      }
    }
  }

  return promises;
}
},{"../transition":29,"../util/caches":33,"../util/decode-entities":34,"../util/escape":35,"../util/memory":37,"./create":18}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transaction = require('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = tasks => function outerHTML(element, markup = '', options = {}) {
  options.inner = false;
  options.tasks = options.tasks || tasks;
  return _transaction2.default.create(element, markup, options).start();
};
},{"./transaction":28}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _caches = require('./util/caches');

var _memory = require('./util/memory');

function release(domNode) {
  // Try and find a state object for this DOM Node.
  const state = _caches.StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    (0, _memory.unprotectVTree)(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  _caches.StateCache.delete(domNode);

  // Recycle all unprotected objects.
  (0, _memory.cleanMemory)();
}
},{"./util/caches":33,"./util/memory":37}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endAsPromise;
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
},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _patch = require('../node/patch');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  promises.push(...(0, _patch2.default)(patches, state));
  measure('patch node');

  transaction.promises = promises;
}
},{"../node/patch":19}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _caches = require('../util/caches');

var _pool = require('../util/pool');

var _pool2 = _interopRequireDefault(_pool);

var _memory = require('../util/memory');

var _parser = require('../util/parser');

var _parser2 = _interopRequireDefault(_parser);

var _create = require('../tree/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reconcileTrees(transaction) {
  const { state, domNode, markup, options } = transaction;
  const { previousMarkup, measure } = state;
  const { inner } = options;

  measure('reconcile trees');

  // We rebuild the tree whenever the DOM Node changes, including the first
  // time we patch a DOM Node.
  if (previousMarkup !== domNode.outerHTML || !state.oldTree) {
    if (state.oldTree) {
      (0, _memory.unprotectVTree)(state.oldTree);
    }

    state.oldTree = (0, _create2.default)(domNode);
    _caches.NodeCache.set(state.oldTree, domNode);
    (0, _memory.protectVTree)(state.oldTree);
  }

  // Associate the old tree with this brand new transaction.
  transaction.oldTree = state.oldTree;

  // This is HTML Markup, so we need to parse it.
  if (typeof markup === 'string') {
    const { childNodes } = (0, _parser2.default)(markup, null, options);

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.
    transaction.newTree = (0, _create2.default)(inner ? childNodes : childNodes[0] || childNodes);
  }
  // Otherwise the value passed is a Virtual Tree or an Array.
  else {
      const { rawNodeName, nodeName, attributes } = transaction.oldTree;
      const newTree = (0, _create2.default)(markup);
      const isFragment = newTree.nodeType === 11;
      const isUnknown = typeof newTree.rawNodeName !== 'string';

      transaction.newTree = newTree;

      if (inner) {
        const children = isFragment && !isUnknown ? newTree.childNodes : newTree;
        transaction.newTree = (0, _create2.default)(nodeName, attributes, children);
      }
    }

  measure('reconcile trees');
}
},{"../tree/create":30,"../util/caches":33,"../util/memory":37,"../util/parser":38,"../util/pool":39}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = schedule;

var _caches = require('../util/caches');

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
},{"../util/caches":33}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdate;
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
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTrees;

var _sync = require('../tree/sync');

var _sync2 = _interopRequireDefault(_sync);

var _create = require('../node/create');

var _create2 = _interopRequireDefault(_create);

var _caches = require('../util/caches');

var _memory = require('../util/memory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    (0, _memory.unprotectVTree)(transaction.oldTree);
    transaction.oldTree = transaction.state.oldTree = newTree;
    (0, _memory.protectVTree)(transaction.oldTree);

    // Update the StateCache since we are changing the top level element.
    _caches.StateCache.set((0, _create2.default)(newTree), transaction.state);
  }
  // Otherwise only diff the children.
  else {
      transaction.patches = (0, _sync2.default)(oldTree, newTree);
    }

  measure('sync trees');
}
},{"../node/create":18,"../tree/sync":31,"../util/caches":33,"../util/memory":37}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schedule = require('./tasks/schedule');

var _schedule2 = _interopRequireDefault(_schedule);

var _shouldUpdate = require('./tasks/should-update');

var _shouldUpdate2 = _interopRequireDefault(_shouldUpdate);

var _reconcileTrees = require('./tasks/reconcile-trees');

var _reconcileTrees2 = _interopRequireDefault(_reconcileTrees);

var _syncTrees = require('./tasks/sync-trees');

var _syncTrees2 = _interopRequireDefault(_syncTrees);

var _patchNode = require('./tasks/patch-node');

var _patchNode2 = _interopRequireDefault(_patchNode);

var _endAsPromise = require('./tasks/end-as-promise');

var _endAsPromise2 = _interopRequireDefault(_endAsPromise);

var _caches = require('./util/caches');

var _memory = require('./util/memory');

var _makeMeasure = require('./util/make-measure');

var _makeMeasure2 = _interopRequireDefault(_makeMeasure);

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    if (_process2.default.env.NODE_ENV !== 'production') {
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

    _caches.MiddlewareCache.forEach(fn => {
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

    this.state = _caches.StateCache.get(domNode) || {
      measure: (0, _makeMeasure2.default)(domNode, markup)
    };

    this.tasks = options.tasks || [_schedule2.default, _shouldUpdate2.default, _reconcileTrees2.default, _syncTrees2.default, _patchNode2.default, _endAsPromise2.default];

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    _caches.StateCache.set(domNode, this.state);
  }

  start() {
    if (_process2.default.env.NODE_ENV !== 'production') {
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
    (0, _memory.cleanMemory)();

    // Try and render the next transaction if one has been saved.
    Transaction.renderNext(state);

    return this;
  }

  onceEnded(callback) {
    this.endedCallbacks.add(callback);
  }
}
exports.default = Transaction;
},{"./tasks/end-as-promise":22,"./tasks/patch-node":23,"./tasks/reconcile-trees":24,"./tasks/schedule":25,"./tasks/should-update":26,"./tasks/sync-trees":27,"./util/caches":33,"./util/make-measure":36,"./util/memory":37,"./util/process":40}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.runTransitions = runTransitions;

var _caches = require('./util/caches');

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Available transition states.
const stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(stateName => _caches.TransitionCache.set(stateName, new Set()));

function addTransitionState(stateName, callback) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }

    if (!callback) {
      throw new Error('Missing transition state callback');
    }
  }

  _caches.TransitionCache.get(stateName).add(callback);
}

function removeTransitionState(stateName, callback) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    // Only validate the stateName if the caller provides one.
    if (stateName && !stateNames.includes(stateName)) {
      throw new Error(`Invalid state name '${stateName}'`);
    }
  }

  // Remove all transition callbacks from state.
  if (!callback && stateName) {
    _caches.TransitionCache.get(stateName).clear();
  }
  // Remove a specific transition callback.
  else if (stateName && callback) {
      _caches.TransitionCache.get(stateName).delete(callback);
    }
    // Remove all callbacks.
    else {
        for (let i = 0; i < stateNames.length; i++) {
          _caches.TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName, ...args) {
  const set = _caches.TransitionCache.get(setName);
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
},{"./util/caches":33,"./util/process":40}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTree;

var _caches = require('../util/caches');

var _pool = require('../util/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { CreateTreeHookCache } = _caches.MiddlewareCache;
const { assign } = Object;
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
    _caches.NodeCache.set(vTree, input);
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
  const entry = _pool2.default.get();
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
},{"../util/caches":33,"../util/pool":39}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTree;

var _caches = require('../util/caches');

var _process = require('../util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { SyncTreeHookCache } = _caches.MiddlewareCache;
const { assign, keys } = Object;
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

  if (_process2.default.env.NODE_ENV !== 'production') {
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
          if (_process2.default.env.NODE_ENV !== 'production') {
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
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error(`Sync failure, cannot compare ${newNodeName} with ${oldNodeName}`);
    }
  }

  if (isEmpty) {
    return patches;
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
},{"../util/caches":33,"../util/process":40}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _caches = require('./util/caches');

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  CreateTreeHookCache,
  CreateNodeHookCache,
  SyncTreeHookCache
} = _caches.MiddlewareCache;

function use(middleware) {
  if (_process2.default.env.NODE_ENV !== 'production') {
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
  _caches.MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe(use.diff);

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return () => {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    _caches.MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe(use.diff);

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache.delete(createTreeHook);
    CreateNodeHookCache.delete(createNodeHook);
    SyncTreeHookCache.delete(syncTreeHook);
  };
}
},{"./util/caches":33,"./util/process":40}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Associates DOM Nodes with state objects.
const StateCache = exports.StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
const NodeCache = exports.NodeCache = new Map();

// Cache transition functions.
const TransitionCache = exports.TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
const MiddlewareCache = exports.MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();
},{}],34:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = decodeEntities;
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = escape;
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
},{}],36:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const marks = exports.marks = new Map();
const prefix = exports.prefix = 'diffHTML';
const DIFF_PERF = 'diff_perf';

const hasSearch = typeof location !== 'undefined';
const hasArguments = typeof process !== 'undefined' && process.argv;
const nop = () => {};

exports.default = (domNode, vTree) => {
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
};
}).call(this,require('_process'))
},{"_process":12}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.protectVTree = protectVTree;
exports.unprotectVTree = unprotectVTree;
exports.cleanMemory = cleanMemory;

var _pool = require('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _caches = require('./caches');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { memory, protect, unprotect } = _pool2.default;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */
function protectVTree(vTree) {
  protect(vTree);

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
  _caches.StateCache.forEach(state => isBusy = state.isRendering || isBusy);

  if (isBusy) {
    //return;
  }

  memory.allocated.forEach(vTree => memory.free.add(vTree));
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  _caches.NodeCache.forEach((node, descriptor) => {
    if (!memory.protected.has(descriptor)) {
      _caches.NodeCache.delete(descriptor);
    }
  });
}
},{"./caches":33,"./pool":39}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _create = require('../tree/create');

var _create2 = _interopRequireDefault(_create);

var _pool = require('./pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser

const hasNonWhitespaceEx = /\S/;
const doctypeEx = /<!.*>/i;
const attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
const spaceEx = /[^ ]/;
const tokenEx = /__DIFFHTML__([^_]*)__/;
const tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

const { assign } = Object;

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
    return currentParent.childNodes.push((0, _create2.default)('#text', string));
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
      childNodes.push((0, _create2.default)('#text', value));
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

  return (0, _create2.default)(nodeName, attributes, []);
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
  const root = (0, _create2.default)('#document-fragment', null, []);
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
      const headInstance = (0, _create2.default)('head', null, []);
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
      const bodyInstance = (0, _create2.default)('body', null, []);
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
},{"../tree/create":30,"./pool":39}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
exports.default = {
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
},{}],40:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const normalize = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};

exports.default = Object.defineProperty({}, 'env', {
  enumerable: true,
  get: () => normalize.env
});
}).call(this,require('_process'))
},{"_process":12}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Namespace.
const namespace = exports.namespace = 'http://www.w3.org/2000/svg';

// List of SVG elements.
const elements = exports.elements = ['altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor', 'animateMotion', 'animateTransform', 'circle', 'clipPath', 'color-profile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence', 'filter', 'font', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker', 'mask', 'metadata', 'missing-glyph', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'set', 'stop', 'svg', 'switch', 'symbol', 'text', 'textPath', 'tref', 'tspan', 'use', 'view', 'vkern'];
},{}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const __VERSION__ = exports.__VERSION__ = '1.0.0-beta';
},{}]},{},[11]);
