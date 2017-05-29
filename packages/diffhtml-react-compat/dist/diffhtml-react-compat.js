(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('diffhtml'), require('proptypes'), require('diffhtml-components')) :
	typeof define === 'function' && define.amd ? define(['diffhtml', 'proptypes', 'diffhtml-components'], factory) :
	(factory(global.diffhtml,global.PropTypes,global.diffhtmlComponents));
}(this, (function (diffhtml,PropTypes,diffhtmlComponents) {

PropTypes = 'default' in PropTypes ? PropTypes['default'] : PropTypes;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//import syntheticEvents from 'diffhtml-middleware-synthetic-events';

var keys = Object.keys;

//use(syntheticEvents());

exports.createElement = function () {
  var tree = diffhtml.createTree.apply(undefined, arguments);

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

exports.Component = diffhtmlComponents.Component;
exports.PropTypes = PropTypes;
exports.html = diffhtml.html;
exports.render = function (component, mount) {
  return diffhtml.innerHTML(mount, component);
};
exports.isValidElement = function (object) {
  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object !== null && object.$$typeof === Symbol.for('react.element');
};

})));
//# sourceMappingURL=diffhtml-react-compat.js.map
