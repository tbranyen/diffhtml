(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _templateObject = babelHelpers.taggedTemplateLiteral(['\n      Stable is ', '\n\n      <select onchange=', '>\n        ', '\n      </select>\n\n      <p>\n        All of the following methods are available under the <code>diff</code>\n        namespace and you can alternatively import them individually using\n        CommonJS or ES-2015 modules. The examples shown use the ES-2015 modules\n        format. If you want to use this format as well, you\'ll need a\n        transpiler like <a href="https://babeljs.io/">Babel</a>.\n      </p>\n\n      <hr>\n\n      <ul class="methods">\n        ', '\n      </ul>\n\n      <hr>\n\n      <section class="comments">\n        ', '\n        </section>\n    '], ['\n      Stable is ', '\n\n      <select onchange=', '>\n        ', '\n      </select>\n\n      <p>\n        All of the following methods are available under the <code>diff</code>\n        namespace and you can alternatively import them individually using\n        CommonJS or ES-2015 modules. The examples shown use the ES-2015 modules\n        format. If you want to use this format as well, you\'ll need a\n        transpiler like <a href="https://babeljs.io/">Babel</a>.\n      </p>\n\n      <hr>\n\n      <ul class="methods">\n        ', '\n      </ul>\n\n      <hr>\n\n      <section class="comments">\n        ', '\n        </section>\n    ']),
    _templateObject2 = babelHelpers.taggedTemplateLiteral(['<option\n          data-ref="', '"\n          ', '\n        >\n          ', '\n        </option>'], ['<option\n          data-ref="', '"\n          ', '\n        >\n          ', '\n        </option>']),
    _templateObject3 = babelHelpers.taggedTemplateLiteral(['<li>\n          <a href="#', '">', '<strong class="args">(', ')</strong></a>\n        </li>'], ['<li>\n          <a href="#', '">', '<strong class="args">(', ')</strong></a>\n        </li>']),
    _templateObject4 = babelHelpers.taggedTemplateLiteral(['\n            <div class="comment">\n              <a class="header" id="', '" href="#', '"><h4 class="api-method">', '<strong class="args">(', ')</strong></h4></a>\n\n              <p class="push-left">\n                <a class="methods" href="#api">&nbsp; Back to API</a> |\n                <a class="view-on-github" href="', '">\n                  <i class="fa fa-github" aria-hidden="true"></i> View source on GitHub\n                </a>\n              </p>\n\n              <div>\n                ', '\n              </div>\n\n              <h5>', '</h5>\n\n              ', '\n\n              <h5>Arguments</h5>\n\n              ', '\n\n              <h5>Return value</h5>\n\n              ', '\n\n              <div class="gap"></div>\n              <hr>\n            </div>\n          '], ['\n            <div class="comment">\n              <a class="header" id="', '" href="#', '"><h4 class="api-method">', '<strong class="args">(', ')</strong></h4></a>\n\n              <p class="push-left">\n                <a class="methods" href="#api">&nbsp; Back to API</a> |\n                <a class="view-on-github" href="', '">\n                  <i class="fa fa-github" aria-hidden="true"></i> View source on GitHub\n                </a>\n              </p>\n\n              <div>\n                ', '\n              </div>\n\n              <h5>', '</h5>\n\n              ', '\n\n              <h5>Arguments</h5>\n\n              ', '\n\n              <h5>Return value</h5>\n\n              ', '\n\n              <div class="gap"></div>\n              <hr>\n            </div>\n          ']),
    _templateObject5 = babelHelpers.taggedTemplateLiteral(['\n                <pre><code class="javascript hljs">\n                  ', '\n                </code></pre>\n              '], ['\n                <pre><code class="javascript hljs">\n                  ', '\n                </code></pre>\n              ']),
    _templateObject6 = babelHelpers.taggedTemplateLiteral(['\n                <table class="details">\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Description</th>\n                      <th>Default value</th>\n                      <th>Required</th>\n                    </tr>\n                  </thead>\n\n                  <tbody>\n                    ', '\n                  </tbody>\n                </table>\n              '], ['\n                <table class="details">\n                  <thead>\n                    <tr>\n                      <th>Name</th>\n                      <th>Description</th>\n                      <th>Default value</th>\n                      <th>Required</th>\n                    </tr>\n                  </thead>\n\n                  <tbody>\n                    ', '\n                  </tbody>\n                </table>\n              ']),
    _templateObject7 = babelHelpers.taggedTemplateLiteral(['<tr>\n                      <td class="strong">', '</td>\n                      <td>', '</td>\n                      <td><code>', '</code></td>\n                      <td>', '</td>\n                    </tr>'], ['<tr>\n                      <td class="strong">', '</td>\n                      <td>', '</td>\n                      <td><code>', '</code></td>\n                      <td>', '</td>\n                    </tr>']),
    _templateObject8 = babelHelpers.taggedTemplateLiteral(['\n                No arguments to display\n              '], ['\n                No arguments to display\n              ']),
    _templateObject9 = babelHelpers.taggedTemplateLiteral(['<p>\n                ', '\n              </p>'], ['<p>\n                ', '\n              </p>']),
    _templateObject10 = babelHelpers.taggedTemplateLiteral(['\n      No API data loaded.\n    '], ['\n      No API data loaded.\n    ']),
    _templateObject11 = babelHelpers.taggedTemplateLiteral(['<', ' />'], ['<', ' />']);

var _diffhtml = require('diffhtml');

var _component = require('diffhtml');

var _component2 = babelHelpers.interopRequireDefault(_component);

require('proxy-polyfill/proxy.min');

require('whatwg-fetch');

var _hljs = hljs,
    highlightAuto = _hljs.highlightAuto;

var $$render = Symbol.for('diff.render');

var ApiBrowser = function (_Component) {
  babelHelpers.inherits(ApiBrowser, _Component);
  babelHelpers.createClass(ApiBrowser, [{
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
    babelHelpers.classCallCheck(this, ApiBrowser);

    var _this = babelHelpers.possibleConstructorReturn(this, (ApiBrowser.__proto__ || Object.getPrototypeOf(ApiBrowser)).call(this));

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

  babelHelpers.createClass(ApiBrowser, [{
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
        [].concat(babelHelpers.toConsumableArray(document.querySelectorAll('.target'))).forEach(function (el) {
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
    var headerTable = [].concat(babelHelpers.toConsumableArray(nodes)).map(function (el) {
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

},{"diffhtml":6,"proxy-polyfill/proxy.min":3,"whatwg-fetch":4}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function (process,global){
(function(c){function l(a){return a?"object"==typeof a||"function"==typeof a:!1}if(!c.Proxy){var m=null;c.a=function(a,b){function c(){}if(!l(a)||!l(b))throw new TypeError("Cannot create proxy with a non-object as target or handler");m=function(){c=function(a){throw new TypeError("Cannot perform '"+a+"' on a proxy that has been revoked");}};var e=b;b={get:null,set:null,apply:null,construct:null};for(var h in e){if(!(h in b))throw new TypeError("Proxy polyfill does not support trap '"+h+"'");b[h]=
e[h]}"function"==typeof e&&(b.apply=e.apply.bind(e));var d=this,n=!1,p="function"==typeof a;if(b.apply||b.construct||p)d=function(){var g=this&&this.constructor===d,f=Array.prototype.slice.call(arguments);c(g?"construct":"apply");if(g&&b.construct)return b.construct.call(this,a,f);if(!g&&b.apply)return b.apply(a,this,f);if(p)return g?(f.unshift(a),new (a.bind.apply(a,f))):a.apply(this,f);throw new TypeError(g?"not a constructor":"not a function");},n=!0;var q=b.get?function(a){c("get");return b.get(this,
a,d)}:function(a){c("get");return this[a]},t=b.set?function(a,f){c("set");b.set(this,a,f,d)}:function(a,b){c("set");this[a]=b},r={};Object.getOwnPropertyNames(a).forEach(function(b){n&&b in d||(Object.defineProperty(d,b,{enumerable:!!Object.getOwnPropertyDescriptor(a,b).enumerable,get:q.bind(a,b),set:t.bind(a,b)}),r[b]=!0)});e=!0;Object.setPrototypeOf?Object.setPrototypeOf(d,Object.getPrototypeOf(a)):d.__proto__?d.__proto__=a.__proto__:e=!1;if(b.get||!e)for(var k in a)r[k]||Object.defineProperty(d,
k,{get:q.bind(a,k)});Object.seal(a);Object.seal(d);return d};c.a.b=function(a,b){return{proxy:new c.a(a,b),revoke:m}};c.a.revocable=c.a.b;c.Proxy=c.a}})("undefined"!==typeof process&&"[object process]"=={}.toString.call(process)?global:self);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = handleTaggedTemplate;

var _create = require('./tree/create');

var _create2 = _interopRequireDefault(_create);

var _parse = require('./util/parse');

var _parse2 = _interopRequireDefault(_parse);

var _escape = require('./util/escape');

var _escape2 = _interopRequireDefault(_escape);

var _decodeEntities = require('./util/decode-entities');

var _decodeEntities2 = _interopRequireDefault(_decodeEntities);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isAttributeEx = /(=|"|')[^><]*?$/;
var isTagEx = /(<|\/)/;
var TOKEN = '__DIFFHTML__';

// Get the next value from the list. If the next value is a string, make sure
// it is escaped.
var nextValue = function nextValue(values) {
  var value = values.shift();
  return typeof value === 'string' ? (0, _escape2.default)((0, _decodeEntities2.default)(value)) : value;
};

function handleTaggedTemplate(strings) {
  for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    values[_key - 1] = arguments[_key];
  }

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
    var _childNodes = (0, _parse2.default)(strings[0]).childNodes;
    return _childNodes.length > 1 ? (0, _create2.default)(_childNodes) : _childNodes[0];
  }

  // Used to store markup and tokens.
  var HTML = '';

  // We filter the supplemental values by where they are used. Values are
  // either, children, or tags (for components).
  var supplemental = {
    attributes: {},
    children: {},
    tags: {}
  };

  // Loop over the static strings, each break correlates to an interpolated
  // value. Since these values can be dynamic, we cannot pass them to the
  // diffHTML HTML parser inline. They are passed as an additional argument
  // called supplemental. The following loop instruments the markup with tokens
  // that the parser then uses to assemble the correct tree.
  strings.forEach(function (string, i) {
    // Always add the string, we need it to parse the markup later.
    HTML += string;

    // If there are values, figure out where in the markup they were injected.
    // This is most likely incomplete code, and will need to be improved in the
    // future with robust testing.
    if (values.length) {
      var value = nextValue(values);
      var lastSegment = string.split(' ').pop();
      var lastCharacter = lastSegment.trim().slice(-1);
      var isAttribute = Boolean(HTML.match(isAttributeEx));
      var isTag = Boolean(lastCharacter.match(isTagEx));
      var isString = typeof value === 'string';
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isArray = Array.isArray(value);
      var token = TOKEN + i + '__';

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
  var childNodes = (0, _parse2.default)(HTML, supplemental).childNodes;

  // This makes it easier to work with a single element as a root, opposed to
  // always returning an array.
  return childNodes.length === 1 ? childNodes[0] : (0, _create2.default)(childNodes);
}
module.exports = exports['default'];
},{"./tree/create":21,"./util/decode-entities":25,"./util/escape":26,"./util/parse":30}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Internals = exports.html = exports.innerHTML = exports.outerHTML = exports.use = exports.createTree = exports.release = exports.removeTransitionState = exports.addTransitionState = exports.VERSION = undefined;

var _create = require('./tree/create');

var _create2 = _interopRequireDefault(_create);

var _create3 = require('./node/create');

var _create4 = _interopRequireDefault(_create3);

var _parseNewTree = require('./tasks/parse-new-tree');

var _parseNewTree2 = _interopRequireDefault(_parseNewTree);

var _reconcileTrees = require('./tasks/reconcile-trees');

var _reconcileTrees2 = _interopRequireDefault(_reconcileTrees);

var _internals = require('./util/internals');

var _internals2 = _interopRequireDefault(_internals);

var _parse = require('./util/parse');

var _parse2 = _interopRequireDefault(_parse);

var _innerHtml = require('./inner-html');

var _innerHtml2 = _interopRequireDefault(_innerHtml);

var _outerHtml = require('./outer-html');

var _outerHtml2 = _interopRequireDefault(_outerHtml);

var _transaction = require('./transaction');

var _html = require('./html');

var _html2 = _interopRequireDefault(_html);

var _release = require('./release');

var _release2 = _interopRequireDefault(_release);

var _use = require('./use');

var _use2 = _interopRequireDefault(_use);

var _transition = require('./transition');

var _version = require('./version');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// At startup inject the HTML parser into the default set of tasks.
_transaction.defaultTasks.splice(_transaction.defaultTasks.indexOf(_reconcileTrees2.default), 0, _parseNewTree2.default);

var api = {
  VERSION: _version.__VERSION__,
  addTransitionState: _transition.addTransitionState,
  removeTransitionState: _transition.removeTransitionState,
  release: _release2.default,
  createTree: _create2.default,
  use: _use2.default,
  outerHTML: _outerHtml2.default,
  innerHTML: _innerHtml2.default,
  html: _html2.default
};

// This is an internal API exported purely for middleware and extensions to
// leverage internal APIs that are not part of the public API. There are no
// promises that this will not break in the future. We will attempt to minimize
// changes and will supply fallbacks when APIs change.
//
// Note: The HTML parser is only available in this mode.
var Internals = Object.assign(_internals2.default, api, { parse: _parse2.default, defaultTasks: _transaction.defaultTasks, tasks: _transaction.tasks, createNode: _create4.default });

// Attach a circular reference to `Internals` for ES/CJS builds.
api.Internals = Internals;

// Automatically hook up to DevTools if they are present.
if (typeof devTools !== 'undefined') {
  (0, _use2.default)(devTools(Internals));
  console.info('diffHTML DevTools Found and Activated...');
}

exports.VERSION = _version.__VERSION__;
exports.addTransitionState = _transition.addTransitionState;
exports.removeTransitionState = _transition.removeTransitionState;
exports.release = _release2.default;
exports.createTree = _create2.default;
exports.use = _use2.default;
exports.outerHTML = _outerHtml2.default;
exports.innerHTML = _innerHtml2.default;
exports.html = _html2.default;
exports.Internals = Internals;
exports.default = api;
},{"./html":5,"./inner-html":7,"./node/create":8,"./outer-html":10,"./release":11,"./tasks/parse-new-tree":13,"./tasks/reconcile-trees":15,"./transaction":19,"./transition":20,"./tree/create":21,"./use":23,"./util/internals":27,"./util/parse":30,"./version":33}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = innerHTML;

var _transaction = require('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function innerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = true;
  options.tasks = options.tasks || _transaction.defaultTasks;
  return _transaction2.default.create(element, markup, options).start();
}
module.exports = exports['default'];
},{"./transaction":19}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createNode;

var _caches = require('../util/caches');

var _process = require('../util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CreateNodeHookCache = _caches.MiddlewareCache.CreateNodeHookCache;

var namespace = 'http://www.w3.org/2000/svg';

/**
 * Takes in a Virtual Tree Element (VTree) and creates a DOM Node from it.
 * Sets the node into the Node cache. If this VTree already has an
 * associated node, it will reuse that.
 *
 * @param {Object} - A Virtual Tree Element or VTree-like element
 * @param {Object} - Document to create Nodes in
 * @param {Boolean} - Is their a root SVG element?
 * @return {Object} - A DOM Node matching the vTree
 */
function createNode(vTree) {
  var ownerDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var isSVG = arguments[2];

  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!vTree) {
      throw new Error('Missing VTree when trying to create DOM Node');
    }
  }

  var existingNode = _caches.NodeCache.get(vTree);

  // If the DOM Node was already created, reuse the existing node.
  if (existingNode) {
    return existingNode;
  }

  var nodeName = vTree.nodeName,
      _vTree$rawNodeName = vTree.rawNodeName,
      rawNodeName = _vTree$rawNodeName === undefined ? nodeName : _vTree$rawNodeName,
      _vTree$childNodes = vTree.childNodes,
      childNodes = _vTree$childNodes === undefined ? [] : _vTree$childNodes;

  isSVG = isSVG || nodeName === 'svg';

  // Will vary based on the properties of the VTree.
  var domNode = null;

  CreateNodeHookCache.forEach(function (fn, retVal) {
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
      // Support SVG.
      else if (isSVG) {
          domNode = ownerDocument.createElementNS(namespace, rawNodeName);
        }
        // If not a Text or SVG Node, then create with the standard method.
        else {
            domNode = ownerDocument.createElement(rawNodeName);
          }
  }

  // Add to the domNodes cache.
  _caches.NodeCache.set(vTree, domNode);

  // Append all the children into the domNode, making sure to run them
  // through this `createNode` function as well.
  for (var i = 0; i < childNodes.length; i++) {
    domNode.appendChild(createNode(childNodes[i], ownerDocument, isSVG));
  }

  return domNode;
}
module.exports = exports['default'];
},{"../util/caches":24,"../util/process":32}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var removeAttribute = function removeAttribute(domNode, name) {
  domNode.removeAttribute(name);

  if (name in domNode) {
    domNode[name] = undefined;
  }
};

var blacklist = new Set();

function patchNode(patches) {
  var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var promises = [];
  var TREE_OPS = patches.TREE_OPS,
      NODE_VALUE = patches.NODE_VALUE,
      SET_ATTRIBUTE = patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = patches.REMOVE_ATTRIBUTE;
  var isSVG = state.isSVG,
      ownerDocument = state.ownerDocument;

  // Set attributes.

  if (SET_ATTRIBUTE.length) {
    for (var i = 0; i < SET_ATTRIBUTE.length; i += 3) {
      var vTree = SET_ATTRIBUTE[i];
      var _name = SET_ATTRIBUTE[i + 1];
      var value = (0, _decodeEntities2.default)(SET_ATTRIBUTE[i + 2]);

      var domNode = (0, _create2.default)(vTree, ownerDocument, isSVG);
      var oldValue = domNode.getAttribute(_name);
      var newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, _name, oldValue, value);

      // Triggered either synchronously or asynchronously depending on if a
      // transition was invoked.
      var isObject = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
      var isFunction = typeof value === 'function';

      // Events must be lowercased otherwise they will not be set correctly.
      var name = _name.indexOf('on') === 0 ? _name.toLowerCase() : _name;

      // Normal attribute value.
      if (!isObject && !isFunction && name) {
        var noValue = value === null || value === undefined;
        // Runtime checking if the property can be set.
        var blacklistName = vTree.nodeName + '-' + name;

        // If the property has not been blacklisted then use try/catch to try
        // and set it.
        if (!blacklist.has(blacklistName)) {
          try {
            domNode[name] = value;
          } catch (unhandledException) {
            blacklist.add(blacklistName);
          }
        }

        // Set the actual attribute, this will ensure attributes like
        // `autofocus` aren't reset by the property call above.
        domNode.setAttribute(name, noValue ? '' : value);
      }
      // Support patching an object representation of the style object.
      else if (isObject && name === 'style') {
          var keys = Object.keys(value);

          for (var _i = 0; _i < keys.length; _i++) {
            domNode.style[keys[_i]] = value[keys[_i]];
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
        promises.push.apply(promises, _toConsumableArray(newPromises));
      }
    }
  }

  // Remove attributes.
  if (REMOVE_ATTRIBUTE.length) {
    var _loop = function _loop(_i2) {
      var vTree = REMOVE_ATTRIBUTE[_i2];
      var name = REMOVE_ATTRIBUTE[_i2 + 1];

      var domNode = _caches.NodeCache.get(vTree);
      var attributeChanged = _caches.TransitionCache.get('attributeChanged');
      var oldValue = domNode.getAttribute(name);
      var newPromises = (0, _transition.runTransitions)('attributeChanged', domNode, name, oldValue, null);

      if (newPromises.length) {
        Promise.all(newPromises).then(function () {
          return removeAttribute(domNode, name);
        });
        promises.push.apply(promises, _toConsumableArray(newPromises));
      } else {
        removeAttribute(domNode, name);
      }
    };

    for (var _i2 = 0; _i2 < REMOVE_ATTRIBUTE.length; _i2 += 2) {
      _loop(_i2);
    }
  }

  // Once attributes have been synchronized into the DOM Nodes, assemble the
  // DOM Tree.
  for (var _i3 = 0; _i3 < TREE_OPS.length; _i3++) {
    var _TREE_OPS$_i = TREE_OPS[_i3],
        INSERT_BEFORE = _TREE_OPS$_i.INSERT_BEFORE,
        REMOVE_CHILD = _TREE_OPS$_i.REMOVE_CHILD,
        REPLACE_CHILD = _TREE_OPS$_i.REPLACE_CHILD;

    // Insert/append elements.

    if (INSERT_BEFORE && INSERT_BEFORE.length) {
      for (var _i4 = 0; _i4 < INSERT_BEFORE.length; _i4 += 3) {
        var _vTree = INSERT_BEFORE[_i4];
        var newTree = INSERT_BEFORE[_i4 + 1];
        var refTree = INSERT_BEFORE[_i4 + 2];

        var _domNode = _caches.NodeCache.get(_vTree);
        var refNode = refTree && (0, _create2.default)(refTree, ownerDocument, isSVG);
        var attached = _caches.TransitionCache.get('attached');

        if (refTree) {
          (0, _memory.protectVTree)(refTree);
        }

        var newNode = (0, _create2.default)(newTree, ownerDocument, isSVG);
        (0, _memory.protectVTree)(newTree);

        // If refNode is `null` then it will simply append like `appendChild`.
        _domNode.insertBefore(newNode, refNode);

        var attachedPromises = (0, _transition.runTransitions)('attached', newNode);

        promises.push.apply(promises, _toConsumableArray(attachedPromises));
      }
    }

    // Remove elements.
    if (REMOVE_CHILD && REMOVE_CHILD.length) {
      var _loop2 = function _loop2(_i5) {
        var vTree = REMOVE_CHILD[_i5];
        var domNode = _caches.NodeCache.get(vTree);
        var detached = _caches.TransitionCache.get('detached');
        var detachedPromises = (0, _transition.runTransitions)('detached', domNode);

        if (detachedPromises.length) {
          Promise.all(detachedPromises).then(function () {
            domNode.parentNode.removeChild(domNode);
            (0, _memory.unprotectVTree)(vTree);
          });

          promises.push.apply(promises, _toConsumableArray(detachedPromises));
        } else {
          domNode.parentNode.removeChild(domNode);
          (0, _memory.unprotectVTree)(vTree);
        }
      };

      for (var _i5 = 0; _i5 < REMOVE_CHILD.length; _i5++) {
        _loop2(_i5);
      }
    }

    // Replace elements.
    if (REPLACE_CHILD && REPLACE_CHILD.length) {
      var _loop3 = function _loop3(_i6) {
        var newTree = REPLACE_CHILD[_i6];
        var oldTree = REPLACE_CHILD[_i6 + 1];

        var oldDomNode = _caches.NodeCache.get(oldTree);
        var newDomNode = (0, _create2.default)(newTree, ownerDocument, isSVG);
        var attached = _caches.TransitionCache.get('attached');
        var detached = _caches.TransitionCache.get('detached');
        var replaced = _caches.TransitionCache.get('replaced');

        // Always insert before to allow the element to transition.
        oldDomNode.parentNode.insertBefore(newDomNode, oldDomNode);
        (0, _memory.protectVTree)(newTree);

        var attachedPromises = (0, _transition.runTransitions)('attached', newDomNode);
        var detachedPromises = (0, _transition.runTransitions)('detached', oldDomNode);
        var replacedPromises = (0, _transition.runTransitions)('replaced', oldDomNode, newDomNode);
        var allPromises = [].concat(_toConsumableArray(attachedPromises), _toConsumableArray(detachedPromises), _toConsumableArray(replacedPromises));

        if (allPromises.length) {
          Promise.all(allPromises).then(function () {
            oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
            (0, _memory.unprotectVTree)(oldTree);
          });

          promises.push.apply(promises, _toConsumableArray(allPromises));
        } else {
          oldDomNode.parentNode.replaceChild(newDomNode, oldDomNode);
          (0, _memory.unprotectVTree)(oldTree);
        }
      };

      for (var _i6 = 0; _i6 < REPLACE_CHILD.length; _i6 += 2) {
        _loop3(_i6);
      }
    }
  }

  // Change all nodeValues.
  if (NODE_VALUE.length) {
    for (var _i7 = 0; _i7 < NODE_VALUE.length; _i7 += 3) {
      var _vTree2 = NODE_VALUE[_i7];
      var nodeValue = NODE_VALUE[_i7 + 1];
      var _oldValue = NODE_VALUE[_i7 + 2];
      var _domNode2 = _caches.NodeCache.get(_vTree2);
      var textChanged = _caches.TransitionCache.get('textChanged');
      var textChangedPromises = (0, _transition.runTransitions)('textChanged', _domNode2, _oldValue, nodeValue);

      var parentNode = _domNode2.parentNode;


      if (nodeValue.includes('&')) {
        _domNode2.nodeValue = (0, _decodeEntities2.default)(nodeValue);
      } else {
        _domNode2.nodeValue = nodeValue;
      }

      if (parentNode && blockText.has(parentNode.nodeName.toLowerCase())) {
        parentNode.nodeValue = (0, _escape2.default)((0, _decodeEntities2.default)(nodeValue));
      }

      if (textChangedPromises.length) {
        promises.push.apply(promises, _toConsumableArray(textChangedPromises));
      }
    }
  }

  return promises;
}
module.exports = exports['default'];
},{"../transition":20,"../util/caches":24,"../util/decode-entities":25,"../util/escape":26,"../util/memory":29,"./create":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = outerHTML;

var _transaction = require('./transaction');

var _transaction2 = _interopRequireDefault(_transaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function outerHTML(element) {
  var markup = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  options.inner = false;
  options.tasks = options.tasks || _transaction.defaultTasks;
  return _transaction2.default.create(element, markup, options).start();
}
module.exports = exports['default'];
},{"./transaction":19}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = release;

var _caches = require('./util/caches');

var _memory = require('./util/memory');

function release(domNode) {
  // Try and find a state object for this DOM Node.
  var state = _caches.StateCache.get(domNode);

  // If there is a Virtual Tree element, recycle all objects allocated for it.
  if (state && state.oldTree) {
    (0, _memory.unprotectVTree)(state.oldTree);
  }

  // Remove the DOM Node's state object from the cache.
  _caches.StateCache.delete(domNode);

  // Recycle all unprotected objects.
  (0, _memory.cleanMemory)();
}
module.exports = exports['default'];
},{"./util/caches":24,"./util/memory":29}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = endAsPromise;
// End flow, this terminates the transaction and returns a Promise that
// resolves when completed. If you want to make diffHTML return streams or
// callbacks replace this function.
function endAsPromise(transaction) {
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;

  // Operate synchronously unless opted into a Promise-chain. Doesn't matter
  // if they are actually Promises or not, since they will all resolve
  // eventually with `Promise.all`.

  if (promises.length) {
    return Promise.all(promises).then(function () {
      return transaction.end();
    });
  } else {
    // Pass off the remaining middleware to allow users to dive into the
    // transaction completed lifecycle event.
    return Promise.resolve(transaction.end());
  }
}
module.exports = exports["default"];
},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseNewTree;

var _caches = require('../util/caches');

var _parse2 = require('../util/parse');

var _parse3 = _interopRequireDefault(_parse2);

var _create = require('../tree/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseNewTree(transaction) {
  var state = transaction.state,
      markup = transaction.markup,
      options = transaction.options;
  var measure = state.measure;
  var inner = options.inner;


  if (typeof markup === 'string') {
    measure('parsing markup for new tree');

    var _parse = (0, _parse3.default)(markup, null, options),
        childNodes = _parse.childNodes;

    // If we are dealing with innerHTML, use all the Nodes. If we're dealing
    // with outerHTML, we can only support diffing against a single element,
    // so pick the first one, if there are none, just pass the entire root.


    transaction.newTree = (0, _create2.default)(inner ? childNodes : childNodes[0] || childNodes);

    measure('parsing markup for new tree');
  }
}
module.exports = exports['default'];
},{"../tree/create":21,"../util/caches":24,"../util/parse":30}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = patch;

var _patch = require('../node/patch');

var _patch2 = _interopRequireDefault(_patch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Processes a set of patches onto a tracked DOM Node.
 *
 * @param {Object} node - DOM Node to process patchs on
 * @param {Array} patches - Contains patch objects
 */
function patch(transaction) {
  var domNode = transaction.domNode,
      state = transaction.state,
      measure = transaction.state.measure,
      patches = transaction.patches;
  var _transaction$promises = transaction.promises,
      promises = _transaction$promises === undefined ? [] : _transaction$promises;
  var _domNode$namespaceURI = domNode.namespaceURI,
      namespaceURI = _domNode$namespaceURI === undefined ? '' : _domNode$namespaceURI,
      nodeName = domNode.nodeName;


  state.isSVG = nodeName.toLowerCase() === 'svg' || namespaceURI.includes('svg');
  state.ownerDocument = domNode.ownerDocument || document;

  measure('patch node');
  promises.push.apply(promises, _toConsumableArray((0, _patch2.default)(patches, state)));
  measure('patch node');

  transaction.promises = promises;
}
module.exports = exports['default'];
},{"../node/patch":9}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reconcileTrees;

var _caches = require('../util/caches');

var _memory = require('../util/memory');

var _create = require('../tree/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reconcileTrees(transaction) {
  var state = transaction.state,
      domNode = transaction.domNode,
      markup = transaction.markup,
      options = transaction.options;
  var previousMarkup = state.previousMarkup;
  var inner = options.inner;

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

  // If we are in a render transaction where no markup was previously parsed
  // then reconcile trees will attempt to create a tree based on the incoming
  // markup (JSX/html/etc).
  if (!transaction.newTree) {
    transaction.newTree = (0, _create2.default)(markup);
  }

  // If we are diffing only the parent's childNodes, then adjust the newTree to
  // be a replica of the oldTree except with the childNodes changed.
  if (inner) {
    var oldTree = transaction.oldTree,
        newTree = transaction.newTree;
    var rawNodeName = oldTree.rawNodeName,
        nodeName = oldTree.nodeName,
        attributes = oldTree.attributes;

    var isUnknown = typeof newTree.rawNodeName !== 'string';
    var isFragment = newTree.nodeType === 11;
    var children = isFragment && !isUnknown ? newTree.childNodes : newTree;

    transaction.newTree = (0, _create2.default)(nodeName, attributes, children);
  }
}
module.exports = exports['default'];
},{"../tree/create":21,"../util/caches":24,"../util/memory":29}],16:[function(require,module,exports){
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
  var state = transaction.state;

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

    var deferred = {};
    var resolver = new Promise(function (resolve) {
      return deferred.resolve = resolve;
    });

    resolver.resolve = deferred.resolve;
    transaction.promises = [resolver];

    return transaction.abort();
  }

  // Indicate we are now rendering a transaction for this DOM Node.
  state.isRendering = true;
}
module.exports = exports['default'];
},{"../util/caches":24}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shouldUpdate;
function shouldUpdate(transaction) {
  var markup = transaction.markup,
      state = transaction.state,
      measure = transaction.state.measure;


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
module.exports = exports['default'];
},{}],18:[function(require,module,exports){
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
  var measure = transaction.state.measure,
      oldTree = transaction.oldTree,
      newTree = transaction.newTree,
      domNode = transaction.domNode;


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
module.exports = exports['default'];
},{"../node/create":8,"../tree/sync":22,"../util/caches":24,"../util/memory":29}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tasks = exports.defaultTasks = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _caches = require('./util/caches');

var _memory = require('./util/memory');

var _makeMeasure = require('./util/make-measure');

var _makeMeasure2 = _interopRequireDefault(_makeMeasure);

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultTasks = exports.defaultTasks = [_schedule2.default, _shouldUpdate2.default, _reconcileTrees2.default, _syncTrees2.default, _patchNode2.default, _endAsPromise2.default];

var tasks = exports.tasks = {
  schedule: _schedule2.default, shouldUpdate: _shouldUpdate2.default, reconcileTrees: _reconcileTrees2.default, syncTrees: _syncTrees2.default, patchNode: _patchNode2.default, endAsPromise: _endAsPromise2.default
};

var Transaction = function () {
  _createClass(Transaction, null, [{
    key: 'create',
    value: function create(domNode, markup, options) {
      return new Transaction(domNode, markup, options);
    }
  }, {
    key: 'renderNext',
    value: function renderNext(state) {
      if (!state.nextTransaction) {
        return;
      }

      // Create the next transaction.
      var nextTransaction = state.nextTransaction,
          promises = state.nextTransaction.promises;

      var resolver = promises && promises[0];

      state.nextTransaction = undefined;
      nextTransaction.aborted = false;

      // Remove the last task, this has already been executed (via abort).
      nextTransaction.tasks.pop();

      // Reflow this transaction.
      Transaction.flow(nextTransaction, nextTransaction.tasks);

      // Wait for the promises to complete if they exist, otherwise resolve
      // immediately.
      if (promises && promises.length > 1) {
        Promise.all(promises.slice(1)).then(function () {
          return resolver.resolve();
        });
      } else if (resolver) {
        resolver.resolve();
      }
    }
  }, {
    key: 'flow',
    value: function flow(transaction, tasks) {
      var retVal = transaction;

      // Execute each "task" serially, passing the transaction as a baton that
      // can be used to share state across the tasks.
      for (var i = 0; i < tasks.length; i++) {
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
  }, {
    key: 'assert',
    value: function assert(transaction) {
      if (_process2.default.env.NODE_ENV !== 'production') {
        if (_typeof(transaction.domNode) !== 'object') {
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
  }, {
    key: 'invokeMiddleware',
    value: function invokeMiddleware(transaction) {
      var tasks = transaction.tasks;


      _caches.MiddlewareCache.forEach(function (fn) {
        // Invoke all the middleware passing along this transaction as the only
        // argument. If they return a value (must be a function) it will be added
        // to the transaction task flow.
        var result = fn(transaction);

        if (result) {
          tasks.push(result);
        }
      });
    }
  }]);

  function Transaction(domNode, markup, options) {
    _classCallCheck(this, Transaction);

    this.domNode = domNode;
    this.markup = markup;
    this.options = options;

    this.state = _caches.StateCache.get(domNode) || {
      measure: (0, _makeMeasure2.default)(domNode, markup)
    };

    this.tasks = [].concat(options.tasks);

    // Store calls to trigger after the transaction has ended.
    this.endedCallbacks = new Set();

    _caches.StateCache.set(domNode, this.state);
  }

  _createClass(Transaction, [{
    key: 'start',
    value: function start() {
      if (_process2.default.env.NODE_ENV !== 'production') {
        Transaction.assert(this);
      }

      var domNode = this.domNode,
          measure = this.state.measure,
          tasks = this.tasks;

      var takeLastTask = tasks.pop();

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

  }, {
    key: 'abort',
    value: function abort() {
      var state = this.state;


      this.aborted = true;

      // Grab the last task in the flow and return, this task will be responsible
      // for calling `transaction.end`.
      return this.tasks[this.tasks.length - 1](this);
    }
  }, {
    key: 'end',
    value: function end() {
      var _this = this;

      var state = this.state,
          domNode = this.domNode,
          options = this.options;
      var measure = state.measure;
      var inner = options.inner;


      measure('finalize');

      this.completed = true;

      // Mark the end to rendering.
      measure('finalize');
      measure('render');

      // Trigger all `onceEnded` callbacks, so that middleware can know the
      // transaction has ended.
      this.endedCallbacks.forEach(function (callback) {
        return callback(_this);
      });
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
  }, {
    key: 'onceEnded',
    value: function onceEnded(callback) {
      this.endedCallbacks.add(callback);
    }
  }]);

  return Transaction;
}();

exports.default = Transaction;
},{"./tasks/end-as-promise":12,"./tasks/patch-node":14,"./tasks/reconcile-trees":15,"./tasks/schedule":16,"./tasks/should-update":17,"./tasks/sync-trees":18,"./util/caches":24,"./util/make-measure":28,"./util/memory":29,"./util/process":32}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.addTransitionState = addTransitionState;
exports.removeTransitionState = removeTransitionState;
exports.runTransitions = runTransitions;

var _caches = require('./util/caches');

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Available transition states.
var stateNames = ['attached', 'detached', 'replaced', 'attributeChanged', 'textChanged'];

// Sets up the states up so we can add and remove events from the sets.
stateNames.forEach(function (stateName) {
  return _caches.TransitionCache.set(stateName, new Set());
});

function addTransitionState(stateName, callback) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!stateName || !stateNames.includes(stateName)) {
      throw new Error('Invalid state name \'' + stateName + '\'');
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
      throw new Error('Invalid state name \'' + stateName + '\'');
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
        for (var i = 0; i < stateNames.length; i++) {
          _caches.TransitionCache.get(stateNames[i]).clear();
        }
      }
}

function runTransitions(setName) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var set = _caches.TransitionCache.get(setName);
  var promises = [];

  if (!set.size) {
    return promises;
  }

  // Ignore text nodes.
  if (setName !== 'textChanged' && args[0].nodeType === 3) {
    return promises;
  }

  // Run each transition callback, if on the attached/detached.
  set.forEach(function (callback) {
    var retVal = callback.apply(undefined, args);

    // Is a `thennable` object or Native Promise.
    if ((typeof retVal === 'undefined' ? 'undefined' : _typeof(retVal)) === 'object' && retVal.then) {
      promises.push(retVal);
    }
  });

  if (setName === 'attached' || setName === 'detached') {
    var element = args[0];

    [].concat(_toConsumableArray(element.childNodes)).forEach(function (childNode) {
      promises.push.apply(promises, _toConsumableArray(runTransitions.apply(undefined, [setName, childNode].concat(_toConsumableArray(args.slice(1))))));
    });
  }

  return promises;
}
},{"./util/caches":24,"./util/process":32}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createTree;

var _caches = require('../util/caches');

var _pool = require('../util/pool');

var _pool2 = _interopRequireDefault(_pool);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var CreateTreeHookCache = _caches.MiddlewareCache.CreateTreeHookCache;
var assign = Object.assign;
var isArray = Array.isArray;

var fragmentName = '#document-fragment';

function createTree(input, attributes, childNodes) {
  for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    rest[_key - 3] = arguments[_key];
  }

  // If no input was provided then we return an indication as such.
  if (!input) {
    return null;
  }

  // If the first argument is an array, we assume this is a DOM fragment and
  // the array are the childNodes.
  if (isArray(input)) {
    childNodes = [];

    for (var i = 0; i < input.length; i++) {
      var newTree = createTree(input[i]);
      if (!newTree) {
        continue;
      }
      var isFragment = newTree.nodeType === 11;

      if (typeof newTree.rawNodeName === 'string' && isFragment) {
        var _childNodes;

        (_childNodes = childNodes).push.apply(_childNodes, _toConsumableArray(newTree.childNodes));
      } else {
        childNodes.push(newTree);
      }
    }

    return createTree(fragmentName, null, childNodes);
  }

  var isObject = (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object';

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

        for (var _i = 0; _i < input.attributes.length; _i++) {
          var _input$attributes$_i = input.attributes[_i],
              name = _input$attributes$_i.name,
              value = _input$attributes$_i.value;

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

        for (var _i2 = 0; _i2 < input.childNodes.length; _i2++) {
          childNodes.push(createTree(input.childNodes[_i2]));
        }
      }
    }

    var _vTree = createTree(input.nodeName, attributes, childNodes);
    _caches.NodeCache.set(_vTree, input);
    return _vTree;
  }

  // Assume any object value is a valid VTree object.
  if (isObject) {
    return input;
  }

  // Support JSX-style children being passed.
  if (rest.length) {
    childNodes = [childNodes].concat(rest);
  }

  // Allocate a new VTree from the pool.
  var entry = _pool2.default.get();
  var isTextNode = input === '#text';
  var isString = typeof input === 'string';

  entry.key = '';
  entry.rawNodeName = input;
  entry.nodeName = isString ? input.toLowerCase() : '#document-fragment';
  entry.childNodes.length = 0;
  entry.nodeValue = '';
  entry.attributes = {};

  if (isTextNode) {
    var _nodes = arguments.length === 2 ? attributes : childNodes;
    var nodeValue = isArray(_nodes) ? _nodes.join('') : _nodes;

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

  var useAttributes = isArray(attributes) || (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) !== 'object';
  var nodes = useAttributes ? attributes : childNodes;
  var nodeArray = isArray(nodes) ? nodes : [nodes];

  if (nodes && nodeArray.length) {
    for (var _i3 = 0; _i3 < nodeArray.length; _i3++) {
      var newNode = nodeArray[_i3];
      var _isArray = Array.isArray(newNode);

      // Merge in arrays.
      if (_isArray) {
        for (var _i4 = 0; _i4 < newNode.length; _i4++) {
          entry.childNodes.push(newNode[_i4]);
        }
      }
      // Merge in fragments.
      else if (newNode.nodeType === 11 && typeof newNode.rawNodeName === 'string') {
          for (var _i5 = 0; _i5 < newNode.childNodes.length; _i5++) {
            entry.childNodes.push(newNode.childNodes[_i5]);
          }
        }
        // Assume objects are vTrees.
        else if (newNode && (typeof newNode === 'undefined' ? 'undefined' : _typeof(newNode)) === 'object') {
            entry.childNodes.push(newNode);
          }
          // Cover generate cases where a user has indicated they do not want a
          // node from appearing.
          else if (newNode) {
              entry.childNodes.push(createTree('#text', null, newNode));
            }
    }
  }

  if (attributes && (typeof attributes === 'undefined' ? 'undefined' : _typeof(attributes)) === 'object' && !isArray(attributes)) {
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

  var vTree = entry;

  CreateTreeHookCache.forEach(function (fn, retVal) {
    // Invoke all the `createNodeHook` functions passing along this transaction
    // as the only argument. These functions must return valid vTree values.
    if (retVal = fn(vTree)) {
      vTree = retVal;
    }
  });

  return vTree;
}
module.exports = exports['default'];
},{"../util/caches":24,"../util/pool":31}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = syncTree;

var _caches = require('../util/caches');

var _process = require('../util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SyncTreeHookCache = _caches.MiddlewareCache.SyncTreeHookCache;
var assign = Object.assign,
    keys = Object.keys;

var empty = {};
var keyNames = ['old', 'new'];

// Compares how the new state should look to the old state and mutates it,
// while recording the changes along the way.
function syncTree(oldTree, newTree, patches) {
  if (!oldTree) oldTree = empty;
  if (!newTree) newTree = empty;

  var oldNodeName = oldTree.nodeName;
  var newNodeName = newTree.nodeName;
  var isFragment = newTree.nodeType === 11;
  var isEmpty = oldTree === empty;

  // Reuse these maps, it's more efficient to clear them than to re-create.
  var keysLookup = { old: new Map(), new: new Map() };

  if (_process2.default.env.NODE_ENV !== 'production') {
    if (newTree === empty) {
      throw new Error('Missing new Virtual Tree to sync changes from');
    }

    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error('Sync failure, cannot compare ' + newNodeName + ' with ' + oldNodeName);
    }
  }

  // Reduce duplicate logic by condensing old and new operations in a loop.
  for (var i = 0; i < keyNames.length; i++) {
    var keyName = keyNames[i];
    var map = keysLookup[keyName];
    var vTree = arguments[i];
    var nodes = vTree && vTree.childNodes;

    if (nodes && nodes.length) {
      for (var _i = 0; _i < nodes.length; _i++) {
        var _vTree = nodes[_i];

        if (_vTree.key) {
          map.set(_vTree.key, _vTree);
        }
      }
    }
  }

  // Invoke any middleware hooks, allow the middleware to replace the
  // `newTree`. Pass along the `keysLookup` object so that middleware can make
  // smart decisions when dealing with keys.
  SyncTreeHookCache.forEach(function (fn, retVal) {
    if ((retVal = fn(oldTree, newTree, null)) && retVal !== newTree) {
      newTree = retVal;

      // Find attributes.
      syncTree(null, retVal, patches);
    }

    for (var _i2 = 0; _i2 < newTree.childNodes.length; _i2++) {
      var oldChildNode = isEmpty ? empty : oldTree.childNodes[_i2];
      var newChildNode = newTree.childNodes[_i2];

      if (retVal = fn(oldChildNode, newChildNode, keysLookup)) {
        newTree.childNodes[_i2] = retVal;
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

  var _patches = patches,
      SET_ATTRIBUTE = _patches.SET_ATTRIBUTE,
      REMOVE_ATTRIBUTE = _patches.REMOVE_ATTRIBUTE,
      TREE_OPS = _patches.TREE_OPS,
      NODE_VALUE = _patches.NODE_VALUE;

  // Build up a patchset object to use for tree operations.

  var patchset = {
    INSERT_BEFORE: [],
    REMOVE_CHILD: [],
    REPLACE_CHILD: []
  };

  // USED: INSERT_BEFORE: 3x, REMOVE_CHILD: 2x, REPLACE_CHILD: 3x.
  var INSERT_BEFORE = patchset.INSERT_BEFORE,
      REMOVE_CHILD = patchset.REMOVE_CHILD,
      REPLACE_CHILD = patchset.REPLACE_CHILD;

  var isElement = newTree.nodeType === 1;

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
    var oldAttributes = isEmpty ? empty : oldTree.attributes;
    var newAttributes = newTree.attributes;

    // Search for sets and changes.
    for (var key in newAttributes) {
      var value = newAttributes[key];

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
      for (var _key in oldAttributes) {
        if (_key in newAttributes) {
          continue;
        }
        REMOVE_ATTRIBUTE.push(oldTree, _key);
        delete oldAttributes[_key];
      }
    }
  }

  // If we somehow end up comparing two totally different kinds of elements,
  // we'll want to raise an error to let the user know something is wrong.
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (!isEmpty && oldNodeName !== newNodeName && !isFragment) {
      throw new Error('Sync failure, cannot compare ' + newNodeName + ' with ' + oldNodeName);
    }
  }

  var newChildNodes = newTree.childNodes;

  // Scan all childNodes for attribute changes.
  if (isEmpty) {
    // Do a single pass over the new child nodes.
    for (var _i3 = 0; _i3 < newChildNodes.length; _i3++) {
      syncTree(null, newChildNodes[_i3], patches);
    }

    return patches;
  }

  var oldChildNodes = oldTree.childNodes;

  // If we are working with keys, we can follow an optimized path.
  if (keysLookup.old.size || keysLookup.new.size) {
    var values = keysLookup.old.values();

    // Do a single pass over the new child nodes.
    for (var _i4 = 0; _i4 < newChildNodes.length; _i4++) {
      var oldChildNode = oldChildNodes[_i4];
      var newChildNode = newChildNodes[_i4];
      var newKey = newChildNode.key;

      // If there is no old element to compare to, this is a simple addition.
      if (!oldChildNode) {
        INSERT_BEFORE.push(oldTree, newChildNode, null);
        oldChildNodes.push(newChildNode);
        syncTree(null, newChildNode, patches);
        continue;
      }

      var oldKey = oldChildNode.key;
      var oldInNew = keysLookup.new.has(oldKey);
      var newInOld = keysLookup.old.has(newKey);

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
          _i4 = _i4 - 1;
          continue;
        }

      // If there is a key set for this new element, use that to figure out
      // which element to use.
      if (newKey !== oldKey) {
        var optimalNewNode = newChildNode;

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
        oldChildNodes.splice(_i4, 0, optimalNewNode);
        continue;
      }

      // If the element we're replacing is totally different from the previous
      // replace the entire element, don't bother investigating children.
      if (oldChildNode.nodeName !== newChildNode.nodeName) {
        REPLACE_CHILD.push(newChildNode, oldChildNode);
        oldTree.childNodes[_i4] = newChildNode;
        syncTree(null, newChildNode, patches);
        continue;
      }

      syncTree(oldChildNode, newChildNode, patches);
    }
  }

  // No keys used on this level, so we will do easier transformations.
  else {
      // Do a single pass over the new child nodes.
      for (var _i5 = 0; _i5 < newChildNodes.length; _i5++) {
        var _oldChildNode = oldChildNodes && oldChildNodes[_i5];
        var _newChildNode = newChildNodes[_i5];

        // If there is no old element to compare to, this is a simple addition.
        if (!_oldChildNode) {
          INSERT_BEFORE.push(oldTree, _newChildNode, null);

          if (oldChildNodes) {
            oldChildNodes.push(_newChildNode);
          }

          syncTree(null, _newChildNode, patches);
          continue;
        }

        // If the element we're replacing is totally different from the previous
        // replace the entire element, don't bother investigating children.
        if (_oldChildNode.nodeName !== _newChildNode.nodeName) {
          REPLACE_CHILD.push(_newChildNode, _oldChildNode);
          oldTree.childNodes[_i5] = _newChildNode;
          syncTree(null, _newChildNode, patches);
          continue;
        }

        syncTree(_oldChildNode, _newChildNode, patches);
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
    for (var _i6 = newChildNodes.length; _i6 < oldChildNodes.length; _i6++) {
      REMOVE_CHILD.push(oldChildNodes[_i6]);
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
module.exports = exports['default'];
},{"../util/caches":24,"../util/process":32}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = use;

var _caches = require('./util/caches');

var _process = require('./util/process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CreateTreeHookCache = _caches.MiddlewareCache.CreateTreeHookCache,
    CreateNodeHookCache = _caches.MiddlewareCache.CreateNodeHookCache,
    SyncTreeHookCache = _caches.MiddlewareCache.SyncTreeHookCache;
function use(middleware) {
  if (_process2.default.env.NODE_ENV !== 'production') {
    if (typeof middleware !== 'function') {
      throw new Error('Middleware must be a function');
    }
  }

  var subscribe = middleware.subscribe,
      unsubscribe = middleware.unsubscribe,
      createTreeHook = middleware.createTreeHook,
      createNodeHook = middleware.createNodeHook,
      syncTreeHook = middleware.syncTreeHook;

  // Add the function to the set of middlewares.

  _caches.MiddlewareCache.add(middleware);

  // Call the subscribe method if it was defined, passing in the full public
  // API we have access to at this point.
  subscribe && middleware.subscribe();

  // Add the hyper-specific create hooks.
  createTreeHook && CreateTreeHookCache.add(createTreeHook);
  createNodeHook && CreateNodeHookCache.add(createNodeHook);
  syncTreeHook && SyncTreeHookCache.add(syncTreeHook);

  // The unsubscribe method for the middleware.
  return function () {
    // Remove this middleware from the internal cache. This will prevent it
    // from being invoked in the future.
    _caches.MiddlewareCache.delete(middleware);

    // Call the unsubscribe method if defined in the middleware (allows them
    // to cleanup).
    unsubscribe && unsubscribe();

    // Cleanup the specific fns from their Cache.
    CreateTreeHookCache.delete(createTreeHook);
    CreateNodeHookCache.delete(createNodeHook);
    SyncTreeHookCache.delete(syncTreeHook);
  };
}
module.exports = exports['default'];
},{"./util/caches":24,"./util/process":32}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Associates DOM Nodes with state objects.
var StateCache = exports.StateCache = new Map();

// Associates Virtual Tree Elements with DOM Nodes.
var NodeCache = exports.NodeCache = new Map();

// Cache transition functions.
var TransitionCache = exports.TransitionCache = new Map();

// Caches all middleware. You cannot unset a middleware once it has been added.
var MiddlewareCache = exports.MiddlewareCache = new Set();

// Very specific caches used by middleware.
MiddlewareCache.CreateTreeHookCache = new Set();
MiddlewareCache.CreateNodeHookCache = new Set();
MiddlewareCache.SyncTreeHookCache = new Set();
},{}],25:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = decodeEntities;
// Support loading diffHTML in non-browser environments.
var g = (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' ? global : window;
var element = g.document ? document.createElement('div') : null;

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
module.exports = exports['default'];
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){
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
  return unescaped.replace(/[&<>]/g, function (match) {
    return "&#" + match.charCodeAt(0) + ";";
  });
}
module.exports = exports["default"];
},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _caches = require('./caches');

var caches = _interopRequireWildcard(_caches);

var _decodeEntities = require('./decode-entities');

var _decodeEntities2 = _interopRequireDefault(_decodeEntities);

var _escape = require('./escape');

var _escape2 = _interopRequireDefault(_escape);

var _makeMeasure = require('./make-measure');

var _makeMeasure2 = _interopRequireDefault(_makeMeasure);

var _memory = require('./memory');

var memory = _interopRequireWildcard(_memory);

var _pool = require('./pool');

var _pool2 = _interopRequireDefault(_pool);

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = Object.assign({
  decodeEntities: _decodeEntities2.default,
  escape: _escape2.default,
  makeMeasure: _makeMeasure2.default,
  memory: memory,
  Pool: _pool2.default,
  process: _process2.default
}, caches);
module.exports = exports['default'];
},{"./caches":24,"./decode-entities":25,"./escape":26,"./make-measure":28,"./memory":29,"./pool":31,"./process":32}],28:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var marks = exports.marks = new Map();
var prefix = exports.prefix = 'diffHTML';
var DIFF_PERF = 'diff_perf';

var hasSearch = typeof location !== 'undefined';
var hasArguments = typeof process !== 'undefined' && process.argv;
var nop = function nop() {};

exports.default = function (domNode, vTree) {
  // Check for these changes on every check.
  var wantsSearch = hasSearch && location.search.includes(DIFF_PERF);
  var wantsArguments = hasArguments && process.argv.includes(DIFF_PERF);
  var wantsPerfChecks = wantsSearch || wantsArguments;

  // If the user has not requested they want perf checks, return a nop
  // function.
  if (!wantsPerfChecks) {
    return nop;
  }

  return function (name) {
    // Use the Web Component name if it's available.
    if (domNode && domNode.host) {
      name = domNode.host.constructor.name + ' ' + name;
    } else if (typeof vTree.rawNodeName === 'function') {
      name = vTree.rawNodeName.name + ' ' + name;
    }

    var endName = name + '-end';

    if (!marks.has(name)) {
      marks.set(name, performance.now());
      performance.mark(name);
    } else {
      var totalMs = (performance.now() - marks.get(name)).toFixed(3);

      marks.delete(name);

      performance.mark(endName);
      performance.measure(prefix + ' ' + name + ' (' + totalMs + 'ms)', name, endName);
    }
  };
};
}).call(this,require('_process'))
},{"_process":2}],29:[function(require,module,exports){
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

var memory = _pool2.default.memory,
    protect = _pool2.default.protect,
    unprotect = _pool2.default.unprotect;

/**
 * Ensures that an vTree is not recycled during a render cycle.
 *
 * @param vTree
 * @return vTree
 */

function protectVTree(vTree) {
  protect(vTree);

  for (var i = 0; i < vTree.childNodes.length; i++) {
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

  for (var i = 0; i < vTree.childNodes.length; i++) {
    unprotectVTree(vTree.childNodes[i]);
  }

  return vTree;
}

/**
 * Moves all unprotected allocations back into available pool. This keeps
 * diffHTML in a consistent state after synchronizing.
 */
function cleanMemory() {
  var isBusy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  _caches.StateCache.forEach(function (state) {
    return isBusy = state.isRendering || isBusy;
  });

  // TODO Pause GC in between renders.
  //if (isBusy) {
  //  return;
  //}

  memory.allocated.forEach(function (vTree) {
    return memory.free.add(vTree);
  });
  memory.allocated.clear();

  // Clean out unused elements, if we have any elements cached that no longer
  // have a backing VTree, we can safely remove them from the cache.
  _caches.NodeCache.forEach(function (node, descriptor) {
    if (!memory.protected.has(descriptor)) {
      _caches.NodeCache.delete(descriptor);
    }
  });
}
},{"./caches":24,"./pool":31}],30:[function(require,module,exports){
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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Adapted implementation from:
// https://github.com/ashi009/node-fast-html-parser

var hasNonWhitespaceEx = /\S/;
var doctypeEx = /<!.*>/i;
var attrEx = /\b([_a-z][_a-z0-9\-]*)\s*(=\s*("([^"]+)"|'([^']+)'|(\S+)))?/ig;
var spaceEx = /[^ ]/;
var tokenEx = /__DIFFHTML__([^_]*)__/;
var tagEx = /<!--[^]*?(?=-->)-->|<(\/?)([a-z\-\_][a-z0-9\-\_]*)\s*([^>]*?)(\/?)>/ig;

var assign = Object.assign;


var blockText = new Set(['script', 'noscript', 'style', 'code', 'template']);

var selfClosing = new Set(['meta', 'img', 'link', 'input', 'area', 'br', 'hr', 'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

var kElementsClosedByOpening = {
  li: { li: true },
  p: { p: true, div: true },
  td: { td: true, th: true },
  th: { td: true, th: true }
};

var kElementsClosedByClosing = {
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
var interpolateValues = function interpolateValues(currentParent, string) {
  var _currentParent$childN;

  var supplemental = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // If this is text and not a doctype, add as a text node.
  if (string && !doctypeEx.test(string) && !tokenEx.test(string)) {
    return currentParent.childNodes.push((0, _create2.default)('#text', string));
  }

  var childNodes = [];
  var parts = string.split(tokenEx);
  var length = parts.length;


  for (var i = 0; i < parts.length; i++) {
    var value = parts[i];

    if (!value) {
      continue;
    }

    // When we split on the token expression, the capture group will replace
    // the token's position. So all we do is ensure that we're on an odd
    // index and then we can source the correct value.
    if (i % 2 === 1) {
      var innerTree = supplemental.children[value];
      if (!innerTree) {
        continue;
      }
      var isFragment = innerTree.nodeType === 11;

      if (typeof innerTree.rawNodeName === 'string' && isFragment) {
        childNodes.push.apply(childNodes, _toConsumableArray(innerTree.childNodes));
      } else {
        childNodes.push(innerTree);
      }
    } else if (!doctypeEx.test(value)) {
      childNodes.push((0, _create2.default)('#text', value));
    }
  }

  (_currentParent$childN = currentParent.childNodes).push.apply(_currentParent$childN, childNodes);
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
var HTMLElement = function HTMLElement(nodeName, rawAttrs, supplemental) {
  var match = null;

  // Support dynamic tag names like: `<${MyComponent} />`.
  if (match = tokenEx.exec(nodeName)) {
    return HTMLElement(supplemental.tags[match[1]], rawAttrs, supplemental);
  }

  var attributes = {};

  // Migrate raw attributes into the attributes object used by the VTree.
  for (var _match; _match = attrEx.exec(rawAttrs || '');) {
    var name = _match[1];
    var value = _match[6] || _match[5] || _match[4] || _match[1];
    var tokenMatch = value.match(tokenEx);

    // If we have multiple interpolated values in an attribute, we must
    // flatten to a string. There are no other valid options.
    if (tokenMatch && tokenMatch.length) {
      var parts = value.split(tokenEx);
      var length = parts.length;


      var hasToken = tokenEx.exec(name);
      var newName = hasToken ? supplemental.attributes[hasToken[1]] : name;

      for (var i = 0; i < parts.length; i++) {
        var _value = parts[i];

        if (!_value) {
          continue;
        }

        // When we split on the token expression, the capture group will
        // replace the token's position. So all we do is ensure that we're on
        // an odd index and then we can source the correct value.
        if (i % 2 === 1) {
          if (attributes[newName]) {
            attributes[newName] += supplemental.attributes[_value];
          } else {
            attributes[newName] = supplemental.attributes[_value];
          }
        } else {
          if (attributes[newName]) {
            attributes[newName] += _value;
          } else {
            attributes[newName] = _value;
          }
        }
      }
    } else if (tokenMatch = tokenEx.exec(name)) {
      var nameAndValue = supplemental.attributes[tokenMatch[1]];
      var _hasToken = tokenEx.exec(value);
      var getValue = _hasToken ? supplemental.attributes[_hasToken[1]] : value;

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
function parse(html, supplemental) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var root = (0, _create2.default)('#document-fragment', null, []);
  var stack = [root];
  var currentParent = root;
  var lastTextPos = -1;

  // If there are no HTML elements, treat the passed in html as a single
  // text node.
  if (html.indexOf('<') === -1 && html) {
    interpolateValues(currentParent, html, supplemental);
    return root;
  }

  // Look through the HTML markup for valid tags.
  for (var match, text; match = tagEx.exec(html);) {
    if (lastTextPos > -1) {
      if (lastTextPos + match[0].length < tagEx.lastIndex) {
        text = html.slice(lastTextPos, tagEx.lastIndex - match[0].length);

        if (text) {
          interpolateValues(currentParent, text, supplemental);
        }
      }
    }

    var matchOffset = tagEx.lastIndex - match[0].length;

    if (lastTextPos === -1 && matchOffset > 0) {
      var string = html.slice(0, matchOffset);

      if (string && hasNonWhitespaceEx.test(string) && !doctypeEx.exec(string)) {
        interpolateValues(currentParent, string, supplemental);
      }
    }

    lastTextPos = tagEx.lastIndex;

    // This is a comment (TODO support these).
    if (match[0][1] === '!') {
      continue;
    }

    if (!match[1]) {
      // not </ tags
      var attrs = {};

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
        var closeMarkup = '</' + match[2] + '>';
        var index = html.indexOf(closeMarkup, tagEx.lastIndex);
        var length = match[2].length;


        if (index === -1) {
          lastTextPos = tagEx.lastIndex = html.length + 1;
        } else {
          lastTextPos = index + closeMarkup.length;
          tagEx.lastIndex = lastTextPos;
          match[1] = true;
        }

        var newText = html.slice(match.index + match[0].length, index);
        interpolateValues(currentParent, newText.trim(), supplemental);
      }
    }

    if (match[1] || match[4] || selfClosing.has(match[2])) {
      if (match[2] !== currentParent.rawNodeName && options.strict) {
        var nodeName = currentParent.rawNodeName;

        // Find a subset of the markup passed in to validate.
        var markup = html.slice(tagEx.lastIndex - match[0].length).split('\n').slice(0, 3);

        // Position the caret next to the first non-whitespace character.
        var caret = Array(spaceEx.exec(markup[0]).index).join(' ') + '^';

        // Craft the warning message and inject it into the markup.
        markup.splice(1, 0, caret + '\nPossibly invalid markup. Saw ' + match[2] + ', expected ' + nodeName + '...\n        ');

        // Throw an error message if the markup isn't what we expected.
        throw new Error('\n\n' + markup.join('\n'));
      }

      var tokenMatch = tokenEx.exec(match[2]);

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
            var value = supplemental.tags[tokenMatch[1]];

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
          var tag = kElementsClosedByClosing[currentParent.rawNodeName];

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
  var remainingText = html.slice(lastTextPos === -1 ? 0 : lastTextPos).trim();

  // Ensure that all values are properly interpolated through the remaining
  // markup after parsing.
  if (remainingText) {
    interpolateValues(currentParent, remainingText, supplemental);
  }

  // This is an entire document, so only allow the HTML children to be
  // body or head.
  if (root.childNodes.length && root.childNodes[0].nodeName === 'html') {
    // Store elements from before body end and after body end.
    var head = { before: [], after: [] };
    var body = { after: [] };
    var HTML = root.childNodes[0];

    var beforeHead = true;
    var beforeBody = true;

    // Iterate the children and store elements in the proper array for
    // later concat, replace the current childNodes with this new array.
    HTML.childNodes = HTML.childNodes.filter(function (el) {
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
      var headInstance = (0, _create2.default)('head', null, []);
      var existing = headInstance.childNodes;

      existing.unshift.apply(existing, head.before);
      existing.push.apply(existing, head.after);
      HTML.childNodes.unshift(headInstance);
    } else {
      var _existing = HTML.childNodes[0].childNodes;

      _existing.unshift.apply(_existing, head.before);
      _existing.push.apply(_existing, head.after);
    }

    // Ensure the second element is the body tag.
    if (!HTML.childNodes[1] || HTML.childNodes[1].nodeName !== 'body') {
      var bodyInstance = (0, _create2.default)('body', null, []);
      var _existing2 = bodyInstance.childNodes;

      _existing2.push.apply(_existing2, body.after);
      HTML.childNodes.push(bodyInstance);
    } else {
      var _existing3 = HTML.childNodes[1].childNodes;
      _existing3.push.apply(_existing3, body.after);
    }
  }

  // Reset regular expression positions per parse.
  attrEx.lastIndex = 0;
  tagEx.lastIndex = 0;

  return root;
}
module.exports = exports['default'];
},{"../tree/create":21,"./pool":31}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// A modest size.
var size = 10000;

var free = new Set();
var allocate = new Set();
var _protect = new Set();
var shape = function shape() {
  return {
    rawNodeName: '',
    nodeName: '',
    nodeValue: '',
    nodeType: 1,
    key: '',
    childNodes: [],
    attributes: {}
  };
};

// Creates a pool to query new or reused values from.
var memory = { free: free, allocated: allocate, protected: _protect };

// Prime the free memory pool with VTrees.
for (var i = 0; i < size; i++) {
  free.add(shape());
}

// Cache the values object, we'll refer to this iterator which is faster
// than calling it every single time. It gets replaced once exhausted.
var freeValues = free.values();

// Cache VTree objects in a pool which is used to get
exports.default = {
  size: size,
  memory: memory,

  get: function get() {
    var _freeValues$next = freeValues.next(),
        _freeValues$next$valu = _freeValues$next.value,
        value = _freeValues$next$valu === undefined ? shape() : _freeValues$next$valu,
        done = _freeValues$next.done;

    // This extra bit of work allows us to avoid calling `free.values()` every
    // single time an object is needed.


    if (done) {
      freeValues = free.values();
    }

    free.delete(value);
    allocate.add(value);
    return value;
  },
  protect: function protect(value) {
    allocate.delete(value);
    _protect.add(value);
  },
  unprotect: function unprotect(value) {
    if (_protect.has(value)) {
      _protect.delete(value);
      free.add(value);
    }
  }
};
module.exports = exports['default'];
},{}],32:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = typeof process !== 'undefined' ? process : {
  env: { NODE_ENV: 'development' }
};
module.exports = exports['default'];
}).call(this,require('_process'))
},{"_process":2}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var __VERSION__ = exports.__VERSION__ = '1.0.0-beta';
},{}]},{},[1]);
