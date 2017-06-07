import { createTree, innerHTML, outerHTML, use, html } from 'diffhtml';
import Component from 'diffhtml-components/lib/component';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';

const { keys } = Object;

use(syntheticEvents());

const createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = Symbol.for('react.element');

  const attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  if (attribtues.includes('htmlFor')) {
    tree.attributes.for = tree.attributes.htmlFor;
  }

  attributes.forEach(name => {
    if (name.indexOf('on') === 0) {
      tree.attributes[name.toLowerCase()] = tree.attributes[name];
    }
  });

  return tree;
};

const render = (component, mount, opts) => innerHTML(mount, component, opts);
const isValidElement = object => (
  typeof object === 'object' &&
  object !== null &&
  object.$$typeof === Symbol.for('react.element')
);
exports.createElement = createElement;
exports.Component = Component;
exports.html = html;
exports.render = render;
exports.isValidElement = isValidElement;

export default {
  createElement,
  Component,
  html,
  render,
  isValidElement,
}
