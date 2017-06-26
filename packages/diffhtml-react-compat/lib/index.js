import { createTree, innerHTML, outerHTML, use, html } from 'diffhtml';
import Children from './children';
import Component from 'diffhtml-components/lib/component';
import PureComponent from './pure-component';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';

const { keys } = Object;

if (typeof document !== 'undefined') {
  use(syntheticEvents());
}

const createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = Symbol.for('react.element');

  const attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  if (attributes.includes('htmlFor')) {
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

export {
  createElement,
  Component,
  PureComponent,
  Children,
  html,
  html as h,
  render,
  isValidElement,
};

export default {
  createElement,
  Component,
  PureComponent,
  Children,
  html,
  h: html,
  render,
  isValidElement,
}
