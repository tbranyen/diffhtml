import {
  createTree,
  innerHTML,
  outerHTML,
  use,
  html,
  addTransitionState,
  removeTransitionState,
  release,
  Internals,
} from 'diffhtml';
import Component from 'diffhtml-components/lib/component';
import PropTypes from 'prop-types';
import Children from './children';
import PureComponent from './pure-component';
import syntheticEvents from 'diffhtml-middleware-synthetic-events';

const { assign, keys } = Object;
const { NodeCache } = Internals;

if (typeof document !== 'undefined') {
  use(syntheticEvents());
}

const REACT_ELEMENT_TYPE = Symbol.for('react.element') || 0xeac7;

const createElement = (...args) => {
  const tree = createTree(...args);

  tree.$$typeof = REACT_ELEMENT_TYPE;

  const attributes = keys(tree.attributes);

  if (attributes.includes('className')) {
    tree.attributes.class = tree.attributes.className;
  }

  if (attributes.includes('htmlFor')) {
    tree.attributes.for = tree.attributes.htmlFor;
  }

  if (attributes.includes('children')) {
    const childNodes = tree.childNodes.length ? tree.childNodes : Children.toArray(tree.attributes.children);
    const newNodes = childNodes.map(createTree);

    tree.childNodes = newNodes;
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

const createFactory = ctor => createTree.bind(null, ctor);

const cloneElement = ({ rawNodeName, attributes }, props, ...children) => {
  return createElement(rawNodeName, assign(attributes, props), ...children);
};

const findDOMNode = vTree => NodeCache.get(vTree) || null;

export {
  cloneElement,
  createFactory,
  createElement,
  Component,
  PureComponent,
  Children,
  createElement as h,
  render,
  isValidElement,
  PropTypes,
  findDOMNode,
  // diffHTML API
  html,
  createTree,
  innerHTML,
  outerHTML,
  use,
  release,
  addTransitionState,
  removeTransitionState,
};

export default {
  cloneElement,
  createFactory,
  createElement,
  Component,
  PureComponent,
  Children,
  h: createElement,
  render,
  isValidElement,
  PropTypes,
  findDOMNode,
  // diffHTML API
  html,
  createTree,
  innerHTML,
  outerHTML,
  use,
  release,
  addTransitionState,
  removeTransitionState,
}
