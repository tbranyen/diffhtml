import { createTree, innerHTML, use, Internals } from 'diffhtml';
import { Component } from 'diffhtml-components';
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



// Bind the React compat middleware task to take care of things that
// diffhtml-components does not handle.
use({
  displayName: 'reactCompatTask',

  // Whenever a component is removed, delete the $$typeof property.
  releaseHook(vTree) {
    if (vTree.$$typeof) {
      delete vTree.$$typeof;
    }
  },

  createTreeHook(vTree) {
    const attributes = keys(vTree.attributes);

    // Map attributes to props.
    vTree.props = vTree.attributes;

    if (attributes.includes('children')) {
      const childNodes = vTree.childNodes.length
        ? vTree.childNodes
        : Children.toArray(vTree.attributes.children);

      const newNodes = childNodes.map(childNode => {
        if (typeof childNode === 'string') {
          return createTree('#text', childNode);
        }
        else {
          return createTree(childNode);
        }
      });

      vTree.childNodes = newNodes;
    }
    else {
      vTree.attributes.children = vTree.childNodes.map(x => createTree(x));
    }

    // Merge className into class
    if (attributes.includes('className')) {
      vTree.attributes.class = `
        ${vTree.attributes.class || ''}
        ${vTree.attributes.className}
      `.trim();
    }

    if (attributes.includes('htmlFor')) {
      vTree.attributes.for = vTree.attributes.htmlFor;
    }

    if (typeof vTree.rawNodeName === 'function') {
      // Mark this as a React element.
      vTree.$$typeof = REACT_ELEMENT_TYPE;
    }

    // Normalize all the event names.
    attributes.forEach(name => {
      if (name.indexOf('on') === 0) {
        vTree.attributes[name.toLowerCase()] = vTree.attributes[name];
      }
    });
  },
});

const createRef = () => ({ current: null });
const render = (component, mount, opts) => innerHTML(mount, component, opts);

const isValidElement = object => (
  typeof object === 'object' &&
  object !== null &&
  object.$$typeof === REACT_ELEMENT_TYPE
);

const createFactory = ctor => createTree.bind(null, ctor);

const cloneElement = ({ rawNodeName, attributes }, props, ...children) => {
  return createTree(rawNodeName, assign(attributes, props), children);
};

const findDOMNode = vTree => NodeCache.get(vTree) || null;

const internals = {};

Component.prototype.componentWillMount = function(...args) {
  if (this.UNSAFE_componentWillMount) {
    this.UNSAFE_componentWillMount(...args);
  }
};

Component.prototype.componentWillReceiveProps = function(...args) {
  if (this.UNSAFE_componentWillReceiveProps) {
    this.UNSAFE_componentWillReceiveProps(...args);
  }
};

Component.prototype.componentWillUpdate = function(...args) {
  if (this.UNSAFE_componentWillUpdate) {
    this.UNSAFE_componentWillUpdate(...args);
  }
};

export {
  internals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  cloneElement,
  createFactory,
  createTree as createElement,
  createRef,
  Component,
  PureComponent,
  Children,
  createTree as h,
  render,
  isValidElement,
  PropTypes,
  findDOMNode,
};

export default {
  cloneElement,
  createFactory,
  createRef,
  createElement: createTree,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: internals,
  Component,
  PureComponent,
  Children,
  h: createTree,
  render,
  isValidElement,
  PropTypes,
  findDOMNode,
}
